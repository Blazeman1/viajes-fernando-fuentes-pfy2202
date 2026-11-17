// TRANSPORTE: la única función que hace las peticiones de las dos APIs.
// Normalmente es el fetch del navegador (y el Service Worker de MSW las
// intercepta). Si el navegador no permite Service Workers, main.jsx la
// cambia por el fetch "en memoria" de src/mocks/memoria.js.
import { ApiError } from './errores';

export const TIEMPO_MAXIMO_MS = 8000;

let fetchActual = (...argumentos) => fetch(...argumentos);

export function usarTransporte(nuevoFetch) {
  fetchActual = nuevoFetch;
}

// fetch con tiempo máximo. Respeta además la señal de cancelación de quien
// llama (Apollo cancela al desmontar un componente).
// Nota de compatibilidad: no se usa AbortSignal.any() ni AbortSignal.timeout()
// porque Safari < 17.4 y Firefox < 124 no los tienen; se combinan a mano.
export function fetchConTiempo(url, opciones = {}, tiempoMaximoMs = TIEMPO_MAXIMO_MS) {
  const control = new AbortController();
  const externa = opciones.signal;
  const reenviar = () => control.abort();
  if (externa?.aborted) control.abort();
  externa?.addEventListener('abort', reenviar, { once: true });

  let agotado = false;
  const temporizador = setTimeout(() => {
    agotado = true;
    control.abort();
  }, tiempoMaximoMs);

  return fetchActual(url, { ...opciones, signal: control.signal })
    .catch((error) => {
      if (agotado) throw new ApiError('tiempo', `El servidor no respondió en ${tiempoMaximoMs / 1000} segundos.`);
      throw error;
    })
    .finally(() => {
      clearTimeout(temporizador);
      externa?.removeEventListener('abort', reenviar);
    });
}
