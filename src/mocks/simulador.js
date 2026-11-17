// SIMULADOR DE FALLAS del backend mock.
// Permite forzar desde la interfaz situaciones que un backend real produce
// de vez en cuando, para demostrar cómo responde el frontend. Los handlers de
// MSW (REST y GraphQL) leen este estado en cada petición.

export const ESCENARIOS = {
  normal: { nombre: 'Normal', detalle: 'Respuestas correctas con una latencia de ~0,6 s.' },
  lento: { nombre: 'Servidor lento', detalle: 'Cada respuesta tarda 2,5 s.' },
  intermitente: { nombre: 'Intermitente', detalle: 'El primer intento de cada petición falla con 503; el reintento automático lo resuelve.' },
  error500: { nombre: 'Error 500', detalle: 'Ambas APIs responden siempre con un error interno.' },
  red: { nombre: 'Sin conexión', detalle: 'La red falla antes de llegar al servidor.' },
};

const CLAVE = 'rumbo-sur-simulador';

// Latencias en milisegundos. Las pruebas de Vitest las ponen en 0.
export const latencias = { normal: 600, lenta: 2500 };

let escenario = 'normal';
try {
  const guardado = sessionStorage.getItem(CLAVE);
  if (guardado && ESCENARIOS[guardado]) escenario = guardado;
} catch {
  /* sessionStorage no disponible (pruebas en Node, almacenamiento bloqueado) */
}

const suscriptores = new Set();
const fallaronUnaVez = new Set();

export const obtenerEscenario = () => escenario;

export function cambiarEscenario(nuevo) {
  if (!ESCENARIOS[nuevo]) return;
  escenario = nuevo;
  fallaronUnaVez.clear();
  try {
    sessionStorage.setItem(CLAVE, nuevo);
  } catch {
    /* sin persistencia: el escenario dura hasta recargar */
  }
  suscriptores.forEach((fn) => fn());
}

export function suscribirEscenario(fn) {
  suscriptores.add(fn);
  return () => suscriptores.delete(fn);
}

// Modo intermitente: devuelve true solo la primera vez que se pide algo.
export function debeFallarUnaVez(clave) {
  if (fallaronUnaVez.has(clave)) {
    fallaronUnaVez.delete(clave);
    return false;
  }
  fallaronUnaVez.add(clave);
  return true;
}
