// API GRAPHQL SIMULADA: esquema + resolvers.
// Los handlers de MSW reciben la consulta del frontend y la EJECUTAN contra
// este esquema con graphql-js, igual que lo haría un servidor real:
//   - la respuesta trae solo los campos que la consulta pidió;
//   - una consulta con un campo inexistente o un tipo incorrecto se rechaza
//     con un error de validación;
//   - los errores de negocio (destino inexistente) viajan en "errors".
import { GraphQLError, buildSchema, graphql } from 'graphql';
import { DESTINOS, HOTELES, VUELOS } from './datos';

export const esquema = buildSchema(/* GraphQL */ `
  "Destino tal como lo conoce el servicio de reservas."
  type Destino {
    id: ID!
    nombre: String!
    pais: String!
    aeropuerto: String!
  }

  "Vuelo de ida y vuelta desde Santiago (SCL). Fechas en hora local, formato ISO."
  type Vuelo {
    id: ID!
    destinoId: ID!
    aerolinea: String!
    numero: String!
    origen: String!
    destino: String!
    salida: String!
    llegada: String!
    regreso: String!
    duracionMin: Int!
    escalas: Int!
    clase: String!
    equipaje: String!
    "Precio por persona, ida y vuelta, en pesos chilenos."
    precio: Int!
    asientosDisponibles: Int!
    disponible: Boolean!
  }

  type Hotel {
    id: ID!
    destinoId: ID!
    nombre: String!
    barrio: String!
    estrellas: Int!
    calificacion: Float!
    servicios: [String!]!
    "Precio por noche y por habitación doble, en pesos chilenos."
    precioNoche: Int!
    disponibleDesde: String!
    disponibleHasta: String!
    habitacionesDisponibles: Int!
    disponible: Boolean!
  }

  type Query {
    destino(id: ID!): Destino
    vuelos(destinoId: ID!, soloDisponibles: Boolean = false): [Vuelo!]!
    hoteles(destinoId: ID!, soloDisponibles: Boolean = false, estrellasMin: Int): [Hotel!]!
    vuelo(id: ID!): Vuelo
    hotel(id: ID!): Hotel
  }
`);

const conDisponibilidad = (vuelo) => ({ ...vuelo, disponible: vuelo.asientosDisponibles > 0 });
const hotelConDisponibilidad = (hotel) => ({ ...hotel, disponible: hotel.habitacionesDisponibles > 0 });

function exigirDestino(id) {
  const destino = DESTINOS.find((d) => d.id === id);
  if (!destino) {
    throw new GraphQLError(`No existe el destino "${id}".`, { extensions: { code: 'NOT_FOUND' } });
  }
  return destino;
}

// Resolvers: una función por campo de Query.
const raiz = {
  destino: ({ id }) => {
    const d = DESTINOS.find((x) => x.id === id);
    return d ? { id: d.id, nombre: d.nombre, pais: d.pais, aeropuerto: d.aeropuerto } : null;
  },
  vuelos: ({ destinoId, soloDisponibles }) => {
    exigirDestino(destinoId);
    return VUELOS.filter((v) => v.destinoId === destinoId)
      .map(conDisponibilidad)
      .filter((v) => !soloDisponibles || v.disponible);
  },
  hoteles: ({ destinoId, soloDisponibles, estrellasMin }) => {
    exigirDestino(destinoId);
    return HOTELES.filter((h) => h.destinoId === destinoId)
      .map(hotelConDisponibilidad)
      .filter((h) => !soloDisponibles || h.disponible)
      .filter((h) => estrellasMin == null || h.estrellas >= estrellasMin);
  },
  vuelo: ({ id }) => {
    const v = VUELOS.find((x) => x.id === id);
    return v ? conDisponibilidad(v) : null;
  },
  hotel: ({ id }) => {
    const h = HOTELES.find((x) => x.id === id);
    return h ? hotelConDisponibilidad(h) : null;
  },
};

// Ejecuta una operación GraphQL y devuelve { data, errors } listo para enviar.
export function ejecutarGraphQL(consulta, variables) {
  return graphql({ schema: esquema, source: consulta, rootValue: raiz, variableValues: variables });
}
