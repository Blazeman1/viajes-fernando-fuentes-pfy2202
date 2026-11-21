import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { MOCK_ACTIVO, estadoMock } from './config';
import { configurarRespaldo, usarTransporte } from './api/transporte';
import './index.css';

// Si el Service Worker no responde en este tiempo, se usa el modo en memoria.
const ESPERA_SERVICE_WORKER_MS = 5000;

// FIREFOX AL RECARGAR. Al cerrar o recargar la página, MSW le avisa a su
// Service Worker "me fui" (CLIENT_CLOSED) y el worker, si cree que no quedan
// pestañas, se da de baja. Firefox procesa ese aviso antes de contar la página
// nueva: el worker se desinstala justo cuando la página recargada lo necesita
// y MSW entra en un ciclo de recargas sin mostrar nada.
// Este listener se registra ANTES que el de MSW y detiene el evento, así el
// aviso no se envía y el worker sigue instalado (como cualquier Service Worker).
function evitarBajaAlRecargar() {
  window.addEventListener('beforeunload', (evento) => evento.stopImmediatePropagation());
}

// Activa el backend simulado ANTES de montar React, para que ninguna petición
// salga antes de que alguien pueda responderla. import() dinámico: el código
// del mock se descarga solo si se usa.
async function habilitarMock() {
  if (!MOCK_ACTIVO) return;
  try {
    if (!('serviceWorker' in navigator)) throw new Error('Este navegador no permite Service Workers.');
    evitarBajaAlRecargar();
    const { worker } = await import('./mocks/browser');
    const inicio = worker.start({
      serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
      onUnhandledRequest: 'bypass', // archivos del propio sitio: que pasen sin aviso
      quiet: true,
    });
    const espera = new Promise((_, rechazar) =>
      setTimeout(() => rechazar(new Error('El Service Worker no respondió a tiempo.')), ESPERA_SERVICE_WORKER_MS)
    );
    await Promise.race([inicio, espera]);
    estadoMock.modo = 'service-worker';
    // Si más adelante el Service Worker deja de responder, se pasa al plan B.
    configurarRespaldo(() => activarModoMemoria(new Error('El Service Worker dejó de interceptar las peticiones.')));
  } catch (error) {
    await activarModoMemoria(error);
  }
}

// Plan B: los mismos handlers, respondiendo dentro de la página.
async function activarModoMemoria(motivo) {
  console.warn('API simulada sin Service Worker; se usa el modo en memoria.', motivo);
  const { crearFetchEnMemoria } = await import('./mocks/memoria');
  usarTransporte(crearFetchEnMemoria());
  estadoMock.modo = 'memoria';
  estadoMock.error = motivo;
  document.documentElement.dataset.modoApi = 'memoria';
}

// La aplicación se monta SIEMPRE, pase lo que pase con el mock: nunca una
// página en blanco.
habilitarMock()
  .catch((error) => console.error('No se pudo iniciar la API simulada:', error))
  .finally(() => {
    // Queda a la vista en el HTML (útil para las pruebas en cada navegador).
    document.documentElement.dataset.modoApi = estadoMock.modo;
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  });
