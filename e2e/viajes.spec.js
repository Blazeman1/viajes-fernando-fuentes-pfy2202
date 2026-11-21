// Pruebas de punta a punta: se ejecutan en cada navegador definido en
// playwright.config.js (Chromium, Firefox, WebKit y dos teléfonos).
import { expect, test } from '@playwright/test';

const precio = (texto) => new RegExp(`\\$\\s?${texto.replace('.', '\\.')}`);

// Anota en el reporte cómo respondió la API simulada en este navegador.
test.afterEach(async ({ page }, info) => {
  const modo = await page.evaluate(() => document.documentElement.dataset.modoApi).catch(() => null);
  if (modo) info.annotations.push({ type: 'API simulada', description: modo });
});

// En pantallas angostas nada debe obligar a desplazarse hacia el lado.
async function sinDesbordeHorizontal(page) {
  const { ancho, contenido } = await page.evaluate(() => ({
    ancho: window.innerWidth,
    contenido: document.documentElement.scrollWidth,
  }));
  expect(contenido, 'la página no debe desbordar horizontalmente').toBeLessThanOrEqual(ancho);
}

test.describe('Destinos (API REST)', () => {
  test('lista los destinos con país y actividades populares', async ({ page }) => {
    await page.goto('./');
    await expect(page).toHaveTitle(/Destinos · Rumbo Sur/);
    const tarjetas = page.locator('main article');
    await expect(tarjetas).toHaveCount(10);
    const cusco = tarjetas.filter({ has: page.getByRole('link', { name: 'Cusco, Perú' }) });
    await expect(cusco).toContainText('Machu Picchu');
    await expect(cusco).toContainText('Vuelos desde');
    await sinDesbordeHorizontal(page);
  });

  test('filtra por continente (en la URL), actividad y texto', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Europa' }).click();
    await expect(page).toHaveURL(/continente=Europa/);
    await expect(page.locator('main article')).toHaveCount(2);

    await page.getByRole('button', { name: 'Todos' }).click();
    await page.locator('#actividad').selectOption('Playa');
    await expect(page.locator('main article')).toHaveCount(3);

    await page.locator('#actividad').selectOption('todas');
    await page.getByLabel('Buscar destino o actividad').fill('tango');
    await expect(page.locator('main article')).toHaveCount(1);
    await expect(page.getByRole('link', { name: 'Buenos Aires, Argentina' })).toBeVisible();

    await page.getByLabel('Buscar destino o actividad').fill('xyz');
    await expect(page.getByText('Ningún destino coincide')).toBeVisible();
    await page.getByRole('button', { name: 'Limpiar filtros' }).click();
    await expect(page.locator('main article')).toHaveCount(10);
  });
});

test.describe('Vuelos y hoteles (API GraphQL) y navegación', () => {
  test('al elegir un destino muestra su ficha, sus vuelos y sus hoteles', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('link', { name: 'Roma, Italia' }).click();

    await expect(page).toHaveURL(/\/destinos\/roma\/vuelos$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Roma, Italia' })).toBeVisible();
    await expect(page.getByText('Coliseo y Foro Romano')).toBeVisible();

    const vuelos = page.getByRole('article', { name: /^Vuelo / });
    await expect(vuelos).toHaveCount(5);
    await expect(vuelos.first()).toContainText('FCO');
    await expect(vuelos.first()).toContainText('por persona');

    await page.getByRole('link', { name: /^Hoteles/ }).click();
    await expect(page).toHaveURL(/\/destinos\/roma\/hoteles$/);
    const hoteles = page.getByRole('article', { name: /^Hotel / });
    await expect(hoteles).toHaveCount(4);
    await expect(hoteles.first()).toContainText('por noche');
    await expect(hoteles.first()).toContainText('Recibe huéspedes del');

    // El botón Atrás del navegador vuelve a la pestaña anterior.
    await page.goBack();
    await expect(page).toHaveURL(/\/vuelos$/);
    await expect(vuelos).toHaveCount(5);
    await sinDesbordeHorizontal(page);
  });

  test('ordena y filtra los vuelos sin nuevas peticiones', async ({ page }) => {
    await page.goto('destinos/cusco/vuelos');
    const precios = page.getByRole('article', { name: /^Vuelo / }).locator('.text-2xl.font-bold').filter({ hasText: '$' });
    await expect(precios).toHaveCount(5);
    const valores = (await precios.allTextContents()).map((t) => Number(t.replace(/\D/g, '')));
    expect(valores).toEqual([...valores].sort((a, b) => a - b));

    await page.getByText('Solo con cupos').click();
    await expect(page.getByRole('article', { name: /^Vuelo / })).toHaveCount(4);
    await expect(page.getByText('Mostrando 4 de 5')).toBeVisible();
  });

  test('abrir o recargar una ruta interna funciona (enlace directo)', async ({ page }) => {
    await page.goto('destinos/tokio/hoteles');
    await expect(page.getByRole('heading', { level: 1, name: 'Tokio, Japón' })).toBeVisible();
    await expect(page.getByRole('article', { name: /^Hotel / })).toHaveCount(4);
    await page.reload();
    await expect(page.getByRole('article', { name: /^Hotel / })).toHaveCount(4);
  });

  test('destino inexistente y ruta desconocida muestran mensajes claros', async ({ page }) => {
    await page.goto('destinos/atlantida');
    await expect(page.getByRole('heading', { name: 'No encontramos lo que buscas' })).toBeVisible();
    await expect(page.getByText('No existe el destino "atlantida".')).toBeVisible();

    await page.goto('no-existe');
    await expect(page.getByRole('heading', { name: 'Esta ruta no lleva a ningún destino' })).toBeVisible();
  });
});

test.describe('Mi viaje (estado con useState y useEffect)', () => {
  test('arma un viaje con vuelo y hotel, cotiza y lo recuerda al recargar', async ({ page }) => {
    await page.goto('destinos/cusco/vuelos');
    // El vuelo más barato con cupos (orden por precio).
    await page.getByRole('button', { name: /^Elegir el vuelo/ }).first().click();
    await expect(page.getByRole('status').getByText('Vuelo agregado a tu viaje a Cusco.')).toBeVisible();
    await expect(page.getByRole('link', { name: /Mi viaje/ })).toContainText('1');

    await page.getByRole('link', { name: /^Hoteles/ }).click();
    await page.getByText('Para las fechas de mi vuelo').click();
    await expect(page.getByRole('article', { name: /^Hotel / })).toHaveCount(2);
    await page.getByRole('button', { name: /^Elegir el hotel/ }).first().click();
    await expect(page.getByRole('link', { name: /Mi viaje/ })).toContainText('2');

    await page.getByRole('link', { name: /Mi viaje/ }).click();
    await expect(page).toHaveURL(/\/mi-viaje$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Cusco, Perú' })).toBeVisible();
    // 2 pasajeros: vuelo $246.000 × 2 + hotel $58.000 × 1 habitación × 7 noches
    await expect(page.getByTestId('total-viaje')).toHaveText(precio('898.000'));

    await page.getByRole('button', { name: 'Agregar un pasajero' }).click();
    // 3 pasajeros: $246.000 × 3 + $58.000 × 2 habitaciones × 7 noches
    await expect(page.getByTestId('total-viaje')).toHaveText(precio('1.550.000'));

    await page.reload();
    await expect(page.getByTestId('total-viaje')).toHaveText(precio('1.550.000'));
    await sinDesbordeHorizontal(page);

    await page.getByRole('button', { name: 'Solicitar reserva' }).click();
    await expect(page.getByRole('heading', { name: '¡Recibimos tu solicitud!' })).toBeVisible();
  });

  test('advierte si faltan asientos para los pasajeros', async ({ page }) => {
    await page.goto('destinos/cusco/vuelos');
    await page.locator('#orden-vuelos').selectOption('salida');
    // Segunda salida de Cusco: quedan 3 asientos.
    await page.getByRole('button', { name: /^Elegir el vuelo/ }).nth(1).click();
    await page.getByRole('link', { name: /Mi viaje/ }).click();
    for (let i = 0; i < 2; i++) await page.getByRole('button', { name: 'Agregar un pasajero' }).click();
    await expect(page.getByRole('alert')).toContainText('El vuelo solo tiene 3 asientos disponibles para 4 pasajeros.');
  });
});

test.describe('Robustez', () => {
  test('el servidor con error 500 muestra un mensaje y se recupera al reintentar', async ({ page }) => {
    await page.goto('./');
    await expect(page.locator('main article')).toHaveCount(10);
    const panel = page.locator('details');
    await panel.locator('summary').click();
    await panel.getByRole('button', { name: 'Error 500' }).click();

    await page.getByRole('link', { name: 'Madrid, España' }).click();
    await expect(page.getByRole('heading', { name: 'El servidor tuvo un problema' })).toBeVisible({ timeout: 15_000 });

    // El panel se cerró solo al elegir: se vuelve a abrir para elegir "Normal".
    await panel.locator('summary').click();
    await panel.getByRole('button', { name: 'Normal' }).click();
    await expect(panel).not.toHaveAttribute('open', '');
    await page.getByRole('button', { name: 'Reintentar' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Madrid, España' })).toBeVisible();
  });


  // Reproduce lo que le pasó a Firefox al recargar: la página que se cierra le
  // avisa al Service Worker "me fui" y este deja de atender a la página nueva.
  test('si el Service Worker deja de interceptar, la app pasa sola al modo en memoria', async ({ page }) => {
    await page.goto('./');
    await expect(page.locator('main article')).toHaveCount(10);
    const modo = await page.evaluate(() => document.documentElement.dataset.modoApi);
    test.skip(modo !== 'service-worker', 'Este navegador ya está en modo en memoria');

    await page.evaluate(() => navigator.serviceWorker.controller.postMessage('CLIENT_CLOSED'));
    await page.getByRole('link', { name: 'Tokio, Japón' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Tokio, Japón' })).toBeVisible();
    await expect(page.getByRole('article', { name: /^Vuelo / })).toHaveCount(5);
    await expect(page.locator('html')).toHaveAttribute('data-modo-api', 'memoria');
  });

  // Lo que le pasaba a Firefox: al recargar, MSW avisaba "me fui" y su Service
  // Worker se daba de baja. Ahora el worker debe seguir instalado y en uso.
  test('al recargar, el Service Worker de la API sigue instalado', async ({ page }) => {
    await page.goto('destinos/tokio/hoteles');
    await expect(page.getByRole('article', { name: /^Hotel / })).toHaveCount(4);
    const modo = await page.evaluate(() => document.documentElement.dataset.modoApi);
    test.skip(modo !== 'service-worker', 'Este navegador ya está en modo en memoria');

    await page.reload();
    await expect(page.getByRole('article', { name: /^Hotel / })).toHaveCount(4);
    const estado = await page.evaluate(async () => ({
      modo: document.documentElement.dataset.modoApi,
      registrado: Boolean(await navigator.serviceWorker.getRegistration()),
    }));
    expect(estado).toEqual({ modo: 'service-worker', registrado: true });
  });
});

test.describe('Sin Service Worker', () => {
  // Como una ventana privada de Firefox: el navegador no deja registrar el Service Worker.
  test.use({ serviceWorkers: 'block' });

  test('la app sigue funcionando con la API simulada en memoria', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByText('La app sigue funcionando con la API simulada en memoria')).toBeVisible();
    await expect(page.locator('main article')).toHaveCount(10);
    await page.getByRole('link', { name: 'Río de Janeiro, Brasil' }).click();
    await expect(page.getByRole('article', { name: /^Vuelo / })).toHaveCount(5);
  });
});
