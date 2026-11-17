// ERRORES DE LA API: toda falla, venga de REST o de GraphQL, termina como un
// ApiError con un "tipo" que la interfaz sabe explicar al usuario.
import { CombinedGraphQLErrors, ServerError, ServerParseError } from '@apollo/client';

export class ApiError extends Error {
  /**
   * @param {'no-encontrado'|'servidor'|'red'|'tiempo'|'cliente'|'formato'|'consulta'} tipo
   */
  constructor(tipo, mensaje, { status = null, intentos = 1 } = {}) {
    super(mensaje);
    this.name = 'ApiError';
    this.tipo = tipo;
    this.status = status;
    this.intentos = intentos;
  }

  // Solo vale la pena reintentar fallas transitorias: un 404 seguirá siendo 404.
  get reintentable() {
    return this.tipo === 'servidor' || this.tipo === 'red';
  }
}

// Traduce los errores de Apollo Client (v4) a ApiError.
export function errorDesdeGraphQL(error) {
  if (!error) return null;
  if (error instanceof ApiError) return error;

  // Errores de negocio o de validación que vienen en "errors" de la respuesta.
  if (CombinedGraphQLErrors.is(error)) {
    const [primero] = error.errors;
    const codigo = primero?.extensions?.code;
    return new ApiError(codigo === 'NOT_FOUND' ? 'no-encontrado' : 'consulta', primero?.message ?? 'La consulta GraphQL no es válida.');
  }
  // El servidor respondió con un código HTTP de error (4xx / 5xx). Si el cuerpo
  // ni siquiera era JSON, Apollo lo informa como ServerParseError: manda el código.
  if (ServerError.is(error) || (ServerParseError.is(error) && error.statusCode >= 400)) {
    const status = error.statusCode;
    return new ApiError(status >= 500 ? 'servidor' : 'cliente', `El servidor respondió con el código ${status}.`, { status });
  }
  if (ServerParseError.is(error)) {
    return new ApiError('formato', 'La respuesta del servidor no tiene un formato válido.');
  }
  // Cualquier otra cosa es una falla de red (fetch rechazado).
  return new ApiError('red', 'No pudimos conectarnos con el servidor.');
}
