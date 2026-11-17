import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// En GitHub Pages el sitio vive en https://<usuario>.github.io/<REPO>/
const REPO = 'viajes-fernando-fuentes-pfy2202';

// GitHub Pages no conoce las rutas de React Router: al recargar
// /destinos/cusco/hoteles busca ese archivo, no lo encuentra y entrega 404.html.
// Copiamos index.html como 404.html para que esa respuesta cargue la app
// y el router muestre la página correcta.
const fallbackSpa = () => ({
  name: 'fallback-spa-github-pages',
  apply: 'build',
  closeBundle() {
    const dist = resolve(import.meta.dirname, 'dist');
    copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'));
  },
});

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  // Desarrollo: http://localhost:5173/ · Compilado y vista previa: /REPO/
  base: command === 'build' || isPreview ? `/${REPO}/` : '/',
  plugins: [react(), fallbackSpa()],
  build: {
    // JavaScript que entienden Chrome/Edge 87+, Firefox 78+ y Safari 14+.
    target: ['es2020', 'chrome87', 'edge88', 'firefox78', 'safari14'],
    // Librerías en archivos aparte: cambian poco, así el navegador las
    // mantiene en caché aunque cambie el código de la aplicación.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (/[\\/](@apollo|graphql|rxjs|@wry|optimism|zen-observable|tslib)[\\/]/.test(id)) return 'apollo';
          if (/[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) return 'react';
          return undefined;
        },
      },
    },
  },
  test: {
    // Las pruebas de Vitest viven en src/; e2e/ es de Playwright.
    include: ['src/**/*.test.{js,jsx}'],
  },
}));
