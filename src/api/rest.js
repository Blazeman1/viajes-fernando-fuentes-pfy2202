// CLIENTE REST: destinos de la agencia.
import { URL_REST } from '../config';
import { ApiError } from './errores';
import { fetchConTiempo } from './transporte';

let urlBase = URL_REST;

// Permite apuntar el cliente a otro servidor (en las pruebas: http://localhost/api).
export function configurarREST({ baseUrl }) {
  urlBase = baseUrl;
}

export async function obtenerJSON(ruta) {
  let respuesta;
  try {
    respuesta = await fetchConTiempo(`${urlBase}${ruta}`, { headers: { Accept: 'application/json' } });
  } catch (error) {
    if (error instanceof ApiError) throw error; // tiempo agotado
    // fetch rechaza (TypeError) cuando no hay red o el servidor está caído.
    throw new ApiError('red', 'No pudimos conectarnos con el servidor.');
  }

  // fetch NO rechaza ante un 404 o un 500: hay que revisar response.ok.
  if (!respuesta.ok) {
    let cuerpo = null;
    try {
      cuerpo = await respuesta.json();
    } catch {
      /* respuesta de error sin JSON */
    }
    const tipo = respuesta.status === 404 ? 'no-encontrado' : respuesta.status >= 500 ? 'servidor' : 'cliente';
    throw new ApiError(tipo, cuerpo?.mensaje ?? `El servidor respondió con el código ${respuesta.status}.`, { status: respuesta.status });
  }

  try {
    return await respuesta.json();
  } catch {
    throw new ApiError('formato', 'La respuesta del servidor no tiene un formato válido.', { status: respuesta.status });
  }
}

// Reintenta fallas transitorias con espera creciente (400 ms, 800 ms).
export async function conReintentos(tarea, { reintentos = 2, esperaBaseMs = 400 } = {}) {
  for (let intento = 1; ; intento++) {
    try {
      return await tarea();
    } catch (error) {
      if (!(error instanceof ApiError) || !error.reintentable || intento > reintentos) {
        if (error instanceof ApiError) error.intentos = intento;
        throw error;
      }
      await new Promise((r) => setTimeout(r, esperaBaseMs * 2 ** (intento - 1)));
    }
  }
}

// Endpoints de la API REST.
export const obtenerDestinos = () => conReintentos(() => obtenerJSON('/destinos'));
export const obtenerDestino = (id) => conReintentos(() => obtenerJSON(`/destinos/${encodeURIComponent(id)}`));
