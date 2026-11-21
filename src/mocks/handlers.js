// HANDLERS DE MSW: el "backend" de la agencia.
//   API REST     → destinos (listado y detalle)
//   API GraphQL  → vuelos y hoteles de cada destino
// Los mismos handlers se usan en el navegador (Service Worker), en el modo
// de respaldo en memoria y en las pruebas de Vitest (Node).
import { HttpResponse, delay, graphql, http } from 'msw';
import { CABECERA_MOCK } from '../config';
import { DESTINOS, VUELOS } from './datos';
import { ejecutarGraphQL } from './esquema';
import { debeFallarUnaVez, latencias, obtenerEscenario } from './simulador';

// Aplica el escenario del simulador. Devuelve una respuesta de error cuando
// el escenario lo exige, o null para seguir con la respuesta normal.
async function aplicarEscenario(clave, formatoError) {
  const escenario = obtenerEscenario();
  await delay(escenario === 'lento' ? latencias.lenta : latencias.normal);

  if (escenario === 'red') return HttpResponse.error();
  if (escenario === 'error500') return formatoError('Error interno del servidor.', 500);
  if (escenario === 'intermitente' && debeFallarUnaVez(clave)) {
    return formatoError('Servicio temporalmente no disponible.', 503);
  }
  return null;
}

// Marca la respuesta como simulada. (HttpResponse.error() no lleva cabeceras:
// representa una falla de red.)
const marcar = (resolver) => async (info) => {
  const respuesta = await resolver(info);
  if (respuesta && respuesta.type !== 'error') respuesta.headers.set(CABECERA_MOCK, '1');
  return respuesta;
};

const errorREST = (mensaje, status) => HttpResponse.json({ mensaje }, { status });
// Una caída del servidor GraphQL no alcanza a producir una respuesta GraphQL:
// llega como texto plano con el código HTTP (como lo haría un proxy o gateway).
const errorGraphQL = (mensaje, status) => HttpResponse.text(mensaje, { status });

// Precio del vuelo disponible más barato: el "desde $..." de cada tarjeta.
function precioDesde(destinoId) {
  const precios = VUELOS.filter((v) => v.destinoId === destinoId && v.asientosDisponibles > 0).map((v) => v.precio);
  return precios.length ? Math.min(...precios) : null;
}

// El listado entrega un resumen; el detalle, la ficha completa.
function resumen(d) {
  return {
    id: d.id,
    nombre: d.nombre,
    pais: d.pais,
    continente: d.continente,
    aeropuerto: d.aeropuerto,
    resumen: d.resumen,
    actividadesPopulares: d.actividades.map(({ nombre, tipo }) => ({ nombre, tipo })),
    precioDesde: precioDesde(d.id),
  };
}

function ficha(d) {
  return {
    ...resumen(d),
    descripcion: d.descripcion,
    idioma: d.idioma,
    moneda: d.moneda,
    clima: d.clima,
    mejorEpoca: d.mejorEpoca,
    actividadesPopulares: d.actividades,
  };
}

// Ejecuta cualquier consulta GraphQL contra el esquema simulado.
async function resolverGraphQL({ query, variables, operationName }) {
  const falla = await aplicarEscenario(`gql:${operationName}:${JSON.stringify(variables)}`, errorGraphQL);
  if (falla) return falla;
  // Como en un servidor GraphQL real: siempre 200, con "data" y/o "errors".
  return HttpResponse.json(await ejecutarGraphQL(query, variables));
}

export const handlers = [
  // ---------------- API REST ----------------
  http.get('*/api/destinos', marcar(async ({ request }) => {
    const falla = await aplicarEscenario(request.url, errorREST);
    if (falla) return falla;
    return HttpResponse.json(DESTINOS.map(resumen));
  })),

  http.get('*/api/destinos/:id', marcar(async ({ request, params }) => {
    const falla = await aplicarEscenario(request.url, errorREST);
    if (falla) return falla;
    const destino = DESTINOS.find((d) => d.id === params.id);
    if (!destino) return errorREST(`No existe el destino "${params.id}".`, 404);
    return HttpResponse.json(ficha(destino));
  })),

  // ---------------- API GraphQL ----------------
  // Las operaciones que usa la aplicación, por nombre (como en la guía)...
  graphql.query('OpcionesDeViaje', marcar(resolverGraphQL)),
  graphql.query('SeleccionViaje', marcar(resolverGraphQL)),
  // ...y cualquier otra consulta válida contra el mismo esquema.
  graphql.operation(marcar(resolverGraphQL)),
];
