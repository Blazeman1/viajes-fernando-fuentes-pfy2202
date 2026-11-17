// PRUEBAS EN DISTINTOS NAVEGADORES (Playwright).
// La misma suite corre en los motores de los navegadores principales:
//   chromium → Chrome y Edge · firefox → Firefox · webkit → Safari
// y en dos teléfonos emulados (Android con Chrome, iPhone con Safari).
// Se prueba el sitio COMPILADO para GitHub Pages (con la API simulada incluida).
import { defineConfig, devices } from '@playwright/test';

const PUERTO = 4173;
const BASE = `http://localhost:${PUERTO}/viajes-fernando-fuentes-pfy2202/`;

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: BASE,
    locale: 'es-CL',
    timezoneId: 'America/Santiago',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'movil-chrome', use: { ...devices['Pixel 7'] } },
    { name: 'movil-safari', use: { ...devices['iPhone 14'] } },
  ],
  webServer: {
    command: `npm run build:pages && npx vite preview --mode ghpages --port ${PUERTO} --strictPort`,
    url: BASE,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
