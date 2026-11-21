import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { MOCK_ACTIVO, estadoMock } from './config';
import { configurarRespaldo, usarTransporte } from './api/transporte';
import './index.css';

// Si el Service Worker no responde en este tiempo, se usa el modo en memoria.
const ESPERA_SERVICE_WORKER_MS = 5000;

// CICLO DE RECARGAS (Firefox). Si la página carga SIN el control del Service
// Worker pero el registro ya existe, MSW llama a location.reload() para tomar
// el control. En Firefox, al recargar, la página nueva volvía a quedar sin
// control y MSW recargaba una y otra vez sin mostrar nada.
// Se marca en sessionStorage que MSW está arrancando; si la página se vuelve a
// cargar con la marca puesta, es que MSW recargó en pleno arranque: esta vez no
// se inicia y se usa el modo en memoria. Como mucho, una recarga extra.
const MARCA_ARRANQUE = 'rumbo-sur-msw-arrancando';

function leerMarca() {
  try {
    return sessionStorage.getItem(MARCA_ARRANQUE) !== null;
  } catch {
    return false;
  }
}

function escribirMarca(activa) {
  try {
    if (activa) sessionStorage.setItem(MARCA_ARRANQUE, '1');
    else sessionStorage.removeItem(MARCA_ARRANQUE);
  } catch {
    /* sin sessionStorage no hay ciclo que cortar con esta marca */
  }
}

// Activa el backend simulado ANTES de montar React, para que ninguna petición
// salga antes de que alguien pueda responderla. import() dinámico: el código
// del mock se descarga solo si se usa.
async function habilitarMock() {
  if (!MOCK_ACTIVO) return;
  try {
    if (!('serviceWorker' in navigator)) throw new Error('Este navegador no permite Service Workers.');
    if (leerMarca()) {
      escribirMarca(false);
      throw new Error('MSW recargó la página durante su arranque; se evita el ciclo de recargas.');
    }
    escribirMarca(true);
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
    escribirMarca(false);
    estadoMock.modo = 'service-worker';
    // Si más adelante el Service Worker deja de responder, se pasa al plan B.
    configurarRespaldo(() => activarModoMemoria(new Error('El Service Worker dejó de interceptar las peticiones.')));
  } catch (error) {
    // La marca NO se borra aquí: cuando MSW recarga la página, su arranque
    // también falla justo antes de que la página se descargue.
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
