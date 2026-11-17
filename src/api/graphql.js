// CLIENTE GRAPHQL (Apollo Client): vuelos y hoteles.
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, gql } from '@apollo/client';
import { RetryLink } from '@apollo/client/link/retry';
import { URL_GRAPHQL } from '../config';
import { ApiError } from './errores';
import { fetchConTiempo } from './transporte';

// Campos que muestran las tarjetas. Los fragmentos evitan repetirlos en cada consulta.
const CAMPOS_VUELO = gql`
  fragment CamposVuelo on Vuelo {
    id
    destinoId
    aerolinea
    numero
    origen
    destino
    salida
    llegada
    regreso
    duracionMin
    escalas
    clase
    equipaje
    precio
    asientosDisponibles
    disponible
  }
`;

const CAMPOS_HOTEL = gql`
  fragment CamposHotel on Hotel {
    id
    destinoId
    nombre
    barrio
    estrellas
    calificacion
    servicios
    precioNoche
    disponibleDesde
    disponibleHasta
    habitacionesDisponibles
    disponible
  }
`;

// Una sola consulta trae vuelos Y hoteles del destino: una petición en vez de dos.
export const OPCIONES_DE_VIAJE = gql`
  query OpcionesDeViaje($destinoId: ID!) {
    vuelos(destinoId: $destinoId) {
      ...CamposVuelo
    }
    hoteles(destinoId: $destinoId) {
      ...CamposHotel
    }
  }
  ${CAMPOS_VUELO}
  ${CAMPOS_HOTEL}
`;

// Lo que el usuario eligió. @include evita pedir lo que todavía no eligió.
export const SELECCION_VIAJE = gql`
  query SeleccionViaje($destinoId: ID!, $vueloId: ID!, $hotelId: ID!, $conVuelo: Boolean!, $conHotel: Boolean!) {
    destino(id: $destinoId) {
      id
      nombre
      pais
      aeropuerto
    }
    vuelo(id: $vueloId) @include(if: $conVuelo) {
      ...CamposVuelo
    }
    hotel(id: $hotelId) @include(if: $conHotel) {
      ...CamposHotel
    }
  }
  ${CAMPOS_VUELO}
  ${CAMPOS_HOTEL}
`;

// "Redirección de caché": usa la entidad ya guardada (Vuelo:cusco-v1) si existe;
// si no, devuelve lo que haya (undefined → Apollo consulta al servidor).
function leerDeCache(existente, { args, toReference, canRead }, tipo) {
  const referencia = toReference({ __typename: tipo, id: args.id });
  return canRead(referencia) ? referencia : existente;
}

export function crearClienteGraphQL({ uri = URL_GRAPHQL } = {}) {
  return new ApolloClient({
    link: ApolloLink.from([
      // Reintenta fallas de red y respuestas 5xx (no los errores de la consulta
      // ni el tiempo agotado: eso haría esperar otros 8 s sin aviso).
      new RetryLink({
        delay: { initial: 400, max: 1600, jitter: false },
        attempts: { max: 3, retryIf: (error) => !!error && !(error instanceof ApiError && error.tipo === 'tiempo') },
      }),
      new HttpLink({ uri, fetch: (url, opciones) => fetchConTiempo(url, opciones) }),
    ]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            // Si un vuelo u hotel ya llegó en OpcionesDeViaje, "Mi viaje" lo lee
            // de la caché normalizada sin volver a preguntarle al servidor.
            vuelo: { read: (existente, ayuda) => leerDeCache(existente, ayuda, 'Vuelo') },
            hotel: { read: (existente, ayuda) => leerDeCache(existente, ayuda, 'Hotel') },
          },
        },
      },
    }),
  });
}
