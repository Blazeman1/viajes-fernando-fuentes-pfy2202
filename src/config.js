// El backend simulado (MSW) se activa en desarrollo, o al compilar con
// VITE_USAR_MOCK=true (modo "ghpages", para publicar el sitio).
export const MOCK_ACTIVO = import.meta.env.DEV || import.meta.env.VITE_USAR_MOCK === 'true';

// URLs de las dos APIs, relativas a la base del sitio
// ("/" en desarrollo, "/viajes-fernando-fuentes-pfy2202/" en GitHub Pages).
export const URL_REST = `${import.meta.env.BASE_URL}api`;
export const URL_GRAPHQL = `${import.meta.env.BASE_URL}graphql`;

// Cabecera que llevan TODAS las respuestas de la API simulada. Si una respuesta
// llega sin ella, el Service Worker dejó de interceptar (ver api/transporte.js).
export const CABECERA_MOCK = 'x-api-simulada';

// Cómo se está sirviendo la API simulada. main.jsx lo completa al arrancar:
//   'service-worker'  MSW intercepta las peticiones (lo normal)
//   'memoria'         el navegador no permitió el Service Worker y los mismos
//                     handlers responden dentro de la página
//   'desactivado'     compilación sin mock
export const estadoMock = { modo: MOCK_ACTIVO ? 'service-worker' : 'desactivado', error: null };
