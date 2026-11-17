import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Service Worker de MSW: intercepta en el navegador las peticiones que
// coinciden con los handlers y responde con los datos simulados.
export const worker = setupWorker(...handlers);
