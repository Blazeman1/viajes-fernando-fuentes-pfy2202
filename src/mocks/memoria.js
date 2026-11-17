// MODO DE RESPALDO: la API simulada sin Service Worker.
// Algunos navegadores no permiten Service Workers (ventanas privadas de
// Firefox, almacenamiento bloqueado, ciertos modos de Safari). En ese caso
// las peticiones de la app se resuelven aquí, en la misma página, con los
// MISMOS handlers de MSW (getResponse). La interfaz funciona igual.
import { getResponse } from 'msw';
import { handlers } from './handlers';

export function crearFetchEnMemoria() {
  return function fetchEnMemoria(entrada, opciones = {}) {
    const url = new URL(typeof entrada === 'string' ? entrada : entrada.url, window.location.href);
    const peticion = new Request(url, opciones);

    return new Promise((resolver, rechazar) => {
      const { signal } = opciones;
      const abortar = () => rechazar(new DOMException('La petición fue cancelada.', 'AbortError'));
      if (signal?.aborted) return abortar();
      signal?.addEventListener('abort', abortar, { once: true });

      getResponse(handlers, peticion)
        .then((respuesta) => {
          // HttpResponse.error() representa una falla de red: fetch la rechaza.
          if (!respuesta || respuesta.type === 'error') {
            rechazar(new TypeError('Failed to fetch'));
          } else {
            resolver(respuesta);
          }
        })
        .catch(rechazar)
        .finally(() => signal?.removeEventListener('abort', abortar));
    });
  };
}
