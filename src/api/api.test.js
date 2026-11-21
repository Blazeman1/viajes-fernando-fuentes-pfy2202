// Pruebas de integración de las dos APIs simuladas (Vitest + MSW en Node).
// Usan los MISMOS handlers que el navegador.
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from '../mocks/handlers';
import { cambiarEscenario, latencias } from '../mocks/simulador';
import { configurarREST, obtenerDestino, obtenerDestinos } from './rest';
import { OPCIONES_DE_VIAJE, SELECCION_VIAJE, crearClienteGraphQL } from './graphql';
import { ApiError, errorDesdeGraphQL } from './errores';
import { gql } from '@apollo/client';
import { CABECERA_MOCK } from '../config';

const servidor = setupServer(...handlers);
let peticiones = 0;
servidor.events.on('request:start', () => peticiones++);

beforeAll(() => {
  latencias.normal = 0;
  latencias.lenta = 0;
  configurarREST({ baseUrl: 'http://localhost/api' });
  servidor.listen({ onUnhandledRequest: 'error' });
});
afterEach(() => {
  cambiarEscenario('normal');
  peticiones = 0;
});
afterAll(() => servidor.close());

const nuevoCliente = () => crearClienteGraphQL({ uri: 'http://localhost/graphql' });
const opciones = (destinoId) => nuevoCliente().query({ query: OPCIONES_DE_VIAJE, variables: { destinoId } });

describe('API REST de destinos', () => {
  it('lista los destinos con país y actividades populares', async () => {
    const destinos = await obtenerDestinos();
    expect(destinos).toHaveLength(10);
    for (const d of destinos) {
      expect(d).toMatchObject({ id: expect.any(String), nombre: expect.any(String), pais: expect.any(String) });
      expect(d.actividadesPopulares.length).toBeGreaterThan(0);
    }
    expect(destinos.find((d) => d.id === 'cusco').pais).toBe('Perú');
  });

  it('marca cada respuesta simulada con su cabecera (también los errores)', async () => {
    const ok = await fetch('http://localhost/api/destinos');
    const noExiste = await fetch('http://localhost/api/destinos/atlantida');
    expect(ok.headers.get(CABECERA_MOCK)).toBe('1');
    expect(noExiste.status).toBe(404);
    expect(noExiste.headers.get(CABECERA_MOCK)).toBe('1');
  });

  it('entrega la ficha completa de un destino', async () => {
    const roma = await obtenerDestino('roma');
    expect(roma).toMatchObject({ nombre: 'Roma', pais: 'Italia', idioma: 'Italiano' });
    expect(roma.actividadesPopulares[0]).toHaveProperty('detalle');
  });

  it('responde 404 con un ApiError "no-encontrado" y no reintenta', async () => {
    const error = await obtenerDestino('atlantida').catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ tipo: 'no-encontrado', status: 404, intentos: 1 });
    expect(peticiones).toBe(1);
  });

  it('reintenta automáticamente cuando el servidor es intermitente', async () => {
    cambiarEscenario('intermitente');
    const destinos = await obtenerDestinos();
    expect(destinos).toHaveLength(10);
    expect(peticiones).toBe(2); // 503 + reintento exitoso
  });

  it('informa un error de servidor tras agotar los reintentos', async () => {
    cambiarEscenario('error500');
    const error = await obtenerDestinos().catch((e) => e);
    expect(error).toMatchObject({ tipo: 'servidor', status: 500, intentos: 3 });
  });

  it('informa la falta de conexión', async () => {
    cambiarEscenario('red');
    const error = await obtenerDestinos().catch((e) => e);
    expect(error).toMatchObject({ tipo: 'red' });
  });
});

describe('API GraphQL de vuelos y hoteles', () => {
  it('entrega vuelos y hoteles del destino con precios, fechas y disponibilidad', async () => {
    const { data } = await opciones('cusco');
    expect(data.vuelos).toHaveLength(5);
    expect(data.hoteles).toHaveLength(4);
    for (const v of data.vuelos) {
      expect(v).toMatchObject({ destinoId: 'cusco', origen: 'SCL', destino: 'CUZ', precio: expect.any(Number) });
      expect(v.salida).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
      expect(v.disponible).toBe(v.asientosDisponibles > 0);
    }
    for (const h of data.hoteles) {
      expect(h.precioNoche).toBeGreaterThan(0);
      expect(h.disponibleDesde < h.disponibleHasta).toBe(true);
    }
  });

  it('devuelve solo los campos que la consulta pide', async () => {
    const { data } = await nuevoCliente().query({
      query: gql`query SoloPrecios($id: ID!) { vuelos(destinoId: $id) { id precio } }`,
      variables: { id: 'roma' },
    });
    expect(Object.keys(data.vuelos[0]).sort()).toEqual(['__typename', 'id', 'precio']);
  });

  it('aplica filtros por argumentos (solo disponibles, estrellas mínimas)', async () => {
    const { data } = await nuevoCliente().query({
      query: gql`query Filtros($id: ID!) {
        vuelos(destinoId: $id, soloDisponibles: true) { id disponible }
        hoteles(destinoId: $id, estrellasMin: 4) { id estrellas }
      }`,
      variables: { id: 'cusco' },
    });
    expect(data.vuelos.length).toBeLessThan(5);
    expect(data.vuelos.every((v) => v.disponible)).toBe(true);
    expect(data.hoteles.every((h) => h.estrellas >= 4)).toBe(true);
  });

  it('informa un destino inexistente como error "no-encontrado"', async () => {
    const error = await opciones('atlantida').catch((e) => e);
    const apiError = errorDesdeGraphQL(error);
    expect(apiError).toMatchObject({ tipo: 'no-encontrado' });
    expect(apiError.message).toContain('atlantida');
  });

  it('rechaza una consulta con un campo que no existe en el esquema', async () => {
    const error = await nuevoCliente()
      .query({ query: gql`query Mala { vuelos(destinoId: "roma") { id piloto } }` })
      .catch((e) => e);
    expect(errorDesdeGraphQL(error)).toMatchObject({ tipo: 'consulta' });
    expect(error.message).toContain('piloto');
  });

  it('con @include pide solo lo que el usuario eligió', async () => {
    const { data } = await nuevoCliente().query({
      query: SELECCION_VIAJE,
      variables: { destinoId: 'tokio', vueloId: 'tokio-v1', hotelId: '', conVuelo: true, conHotel: false },
    });
    expect(data.destino.nombre).toBe('Tokio');
    expect(data.vuelo.id).toBe('tokio-v1');
    expect(data).not.toHaveProperty('hotel');
  });

  it('reintenta con RetryLink ante un 503 y responde bien', async () => {
    cambiarEscenario('intermitente');
    const { data } = await opciones('madrid');
    expect(data.vuelos).toHaveLength(5);
    expect(peticiones).toBe(2);
  });

  it('traduce un error 500 persistente a "servidor"', async () => {
    cambiarEscenario('error500');
    const error = await opciones('madrid').catch((e) => e);
    expect(errorDesdeGraphQL(error)).toMatchObject({ tipo: 'servidor', status: 500 });
    expect(peticiones).toBe(3);
  });

  it('la caché de Apollo evita repetir una consulta ya hecha', async () => {
    const cliente = nuevoCliente();
    await cliente.query({ query: OPCIONES_DE_VIAJE, variables: { destinoId: 'roma' } });
    await cliente.query({ query: OPCIONES_DE_VIAJE, variables: { destinoId: 'roma' } });
    // SeleccionViaje pide destino(id), que no está en caché: una petición más.
    // El vuelo, en cambio, se lee de la caché gracias a la redirección.
    await cliente.query({
      query: SELECCION_VIAJE,
      variables: { destinoId: 'roma', vueloId: 'roma-v2', hotelId: 'roma-h1', conVuelo: true, conHotel: true },
    });
    expect(peticiones).toBe(2);
  });
});
