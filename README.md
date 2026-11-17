# Rumbo Sur — Agencia de viajes con API REST y GraphQL

Actividad sumativa · **Desarrollo Frontend II (PFY2202)** · Experiencia 2, Semana 5
"Integrando API REST y GraphQL en aplicaciones frontend": agencia de viajes

**Autor:** Fernando Fuentes Allende, Duoc UC

**Sitio publicado:** https://blazeman1.github.io/viajes-fernando-fuentes-pfy2202/

Aplicación en **React** donde el usuario explora destinos de viaje, elige uno y compara sus **vuelos y hoteles** con precios, fechas y disponibilidad. Puede armar su viaje (vuelo + hotel + pasajeros) y ver la cotización.

- **Destinos:** API **REST** simulada con **MSW**.
- **Vuelos y hoteles:** API **GraphQL** simulada con MSW y consultada con **Apollo Client**.
- **Navegación:** **React Router v7**.
- **Estilos:** **Tailwind CSS**.

## Requisitos de la actividad

| Requisito | Implementación |
|---|---|
| Agencia de viajes con HTML, JS, CSS y React | Proyecto React (Vite) con Tailwind CSS |
| API REST mock que lista destinos con país y actividades populares | `GET /api/destinos` y `GET /api/destinos/:id` (`src/mocks/handlers.js`) |
| API GraphQL mock para vuelos y hoteles con precios, fechas y disponibilidad | Esquema GraphQL real (`src/mocks/esquema.js`) consultado con Apollo Client (`src/api/graphql.js`) |
| Seleccionar un destino y luego ver sus vuelos y hoteles | Inicio → `/destinos/:id` → pestañas `vuelos` y `hoteles` |
| React Router | `BrowserRouter`, rutas anidadas con `<Outlet>`, parámetros, filtros en la URL y 404 (`src/App.jsx`) |
| Repositorio `viajes-nombre-apellido-siglaCurso` | `viajes-fernando-fuentes-pfy2202` |

## Rúbrica y cómo se cumple

| # | Criterio | Implementación |
|---|---|---|
| 1 | **Interfaz responsiva e intuitiva** | Diseño *mobile-first*: 1, 2 o 3 columnas según el ancho, menús y filtros que se desplazan horizontalmente en el teléfono y tarjetas de vuelo que se reorganizan. Cada pantalla muestra **esqueletos** mientras carga, **mensajes claros** ante errores o listas vacías, y un **aviso** al agregar algo al viaje. Accesible con teclado y lector de pantalla (enlace "Saltar al contenido", foco al cambiar de página, `aria-live`). Las pruebas verifican en 5 navegadores que ninguna página desborda horizontalmente. |
| 2 | **API REST mock sin errores** | MSW responde `GET /api/destinos` (resumen con país, continente, actividades populares y precio desde) y `GET /api/destinos/:id` (ficha completa), con 404 para destinos inexistentes. El cliente (`src/api/rest.js`) revisa `response.ok`, aplica tiempo máximo (8 s) y **reintenta** las fallas transitorias. |
| 3 | **API GraphQL mock sin errores** | Los handlers `graphql.query(...)` **ejecutan cada consulta contra un esquema real** con `graphql-js`. La respuesta trae solo los campos pedidos, las consultas inválidas se rechazan y los errores de negocio viajan en `errors`. La app usa la consulta `OpcionesDeViaje` (vuelos y hoteles en **una sola petición**, con fragmentos) y la consulta `SeleccionViaje` (con `@include` para no pedir lo que no se eligió). Apollo **reintenta** fallas de red (RetryLink) y guarda los resultados en su **caché normalizada**: "Mi viaje" lee de la caché el vuelo y el hotel ya cargados. |
| 4 | **React Router con navegación fluida** | Rutas anidadas `/destinos/:id/vuelos` y `/destinos/:id/hoteles` dentro de la ficha (`<Outlet context>`), con `NavLink` para la pestaña activa. Filtros de continente y actividad en la URL (`useSearchParams`). Redirecciones con `<Navigate>`, página 404, títulos de pestaña por página, y botón Atrás y enlaces directos funcionando, también en GitHub Pages. |
| 5 | **Componentes modulares y reutilizables** | `components/ui` (Etiqueta, Estrellas, Segmentado, Interruptor, Esqueletos, EstadoError, EstadoVacio), `components/destinos`, `components/opciones` y `components/viaje`. Por ejemplo, `TarjetaVuelo` y `TarjetaHotel` se usan en la lista **y** en "Mi viaje", y `BotonElegir`, `Disponibilidad` y `BarraLista` las comparten. La lógica de negocio (cotizar, validar fechas y cupos) está en funciones puras en `src/utils/` con sus propias pruebas. |
| 6 | **Estado con useState y useEffect** | `useApi` (`src/hooks/useApi.js`) consulta la API REST con `useState` (datos, error, cargando) y `useEffect` (lanza la petición al cambiar el destino e ignora respuestas obsoletas). `ViajeContext` guarda el viaje con `useState` y lo persiste en `localStorage` con `useEffect`. El aviso se cierra solo con un temporizador en `useEffect`, y los filtros y el orden de cada lista viven en `useState`. Al cambiar un filtro o la cantidad de pasajeros, la interfaz se actualiza al instante y sin nuevas peticiones. |
| 7 | **GitHub organizado, documentado y publicado en gh-pages** | Estructura por responsabilidad (abajo), commits por etapa, este README y el sitio publicado con `npm run deploy` en la rama `gh-pages`. |
| 8 | **Pruebas en distintos navegadores** | **Playwright** ejecuta 10 escenarios en **Chromium (Chrome/Edge), Firefox, WebKit (Safari), Android y iPhone**, que suman 50 pruebas. Un **workflow de GitHub Actions** las corre en cada push. Además hay **21 pruebas de Vitest** de las dos APIs y de la lógica del viaje. Los problemas de compatibilidad detectados y corregidos están en la sección [Compatibilidad entre navegadores](#compatibilidad-entre-navegadores). |

## Contrato de las APIs simuladas

### REST

| Método y ruta | Respuesta exitosa | Errores |
|---|---|---|
| `GET /api/destinos` | `200` `[{ id, nombre, pais, continente, aeropuerto, resumen, actividadesPopulares: [{ nombre, tipo }], precioDesde }]` | — |
| `GET /api/destinos/:id` | `200` `{ ...resumen, descripcion, idioma, moneda, clima, mejorEpoca, actividadesPopulares: [{ nombre, tipo, detalle }] }` | `404 { mensaje }` |

### GraphQL (`POST /graphql`)

```graphql
type Query {
  destino(id: ID!): Destino
  vuelos(destinoId: ID!, soloDisponibles: Boolean = false): [Vuelo!]!
  hoteles(destinoId: ID!, soloDisponibles: Boolean = false, estrellasMin: Int): [Hotel!]!
  vuelo(id: ID!): Vuelo
  hotel(id: ID!): Hotel
}
# Vuelo: aerolinea, numero, origen, destino, salida, llegada, regreso, duracionMin,
#        escalas, clase, equipaje, precio, asientosDisponibles, disponible
# Hotel: nombre, barrio, estrellas, calificacion, servicios, precioNoche,
#        disponibleDesde, disponibleHasta, habitacionesDisponibles, disponible
```

`vuelos` y `hoteles` con un destino inexistente responden con un error de código `NOT_FOUND`. El esquema completo, con sus descripciones, está en `src/mocks/esquema.js`.

## Simulador de fallas

El panel de la esquina inferior derecha cambia el comportamiento de **las dos APIs** sin tocar el código:

| Escenario | Qué hace el servidor | Qué hace la interfaz |
|---|---|---|
| Normal | Responde en ~0,6 s | Esqueletos y luego los datos |
| Servidor lento | Responde en 2,5 s | Los esqueletos acompañan toda la espera |
| Intermitente | El primer intento de cada petición responde 503 | El reintento automático lo resuelve sin que el usuario lo note |
| Error 500 | Siempre responde 500 | "El servidor tuvo un problema", con el código y un botón *Reintentar* |
| Sin conexión | La red falla | "Sin conexión con el servidor" y *Reintentar* |

## Pruebas

```bash
npm test                    # 21 pruebas de Vitest: API REST, API GraphQL y lógica del viaje
npm run test:e2e            # Playwright en los 5 navegadores (requiere: npx playwright install)
npm run test:e2e:chromium   # solo Chromium de escritorio y Android
```

Playwright compila el sitio igual que para GitHub Pages (`build:pages`), lo sirve con `vite preview` y recorre los escenarios en cada navegador:

| Escenario (`e2e/viajes.spec.js`) | Qué verifica |
|---|---|
| Lista de destinos | 10 destinos con país, actividades y precio; sin desborde horizontal |
| Filtros | Continente (en la URL), actividad, búsqueda sin tildes, "Limpiar filtros" |
| Destino → vuelos → hoteles | Ficha REST, 5 vuelos y 4 hoteles GraphQL, pestañas y botón Atrás |
| Orden y filtro de vuelos | Orden por precio y "Solo con cupos" |
| Enlace directo y recarga | `/destinos/tokio/hoteles` abre y recarga bien |
| Errores de ruta | Destino inexistente (404 de la API) y ruta desconocida (404 del router) |
| Armar un viaje | Vuelo + hotel compatible, total correcto, cambio de pasajeros y viaje recordado al recargar |
| Validación de cupos | Aviso cuando hay más pasajeros que asientos |
| Error 500 | Mensaje claro y recuperación con *Reintentar* |
| Sin Service Worker | La app funciona con la API en memoria (como en una ventana privada) |

**Dónde se ejecutaron:**

- **GitHub Actions** (`.github/workflows/pruebas.yml`): en cada push a `main` corren lint, Vitest y la suite de Playwright en los 5 navegadores. El reporte HTML queda como artefacto en la pestaña *Actions* del repositorio.
- **Chrome, Edge y Firefox de escritorio en Windows**: revisión manual con la lista de abajo.

### Lista de revisión manual

Para cada navegador (Chrome, Edge, Firefox; y Safari en iPhone si hay uno disponible), con el sitio publicado:

1. El inicio muestra los 10 destinos y los filtros funcionan.
2. Al entrar a un destino se ven la ficha, los vuelos y, en la otra pestaña, los hoteles.
3. Las fechas coinciden con las de las pruebas (por ejemplo, Cusco: primera salida el *sáb, 12 dic 2026*).
4. Se puede elegir un vuelo y un hotel, y "Mi viaje" muestra el total. Al recargar, el viaje sigue ahí.
5. Recargar en `/destinos/roma/hoteles` muestra la página, no un error de GitHub.
6. Con la ventana angosta (o el modo de diseño adaptable de las herramientas de desarrollo, F12) todo se lee sin desplazarse hacia el lado.
7. En una ventana privada, la app funciona y muestra el aviso de "API simulada en memoria" si el navegador bloquea el Service Worker.

## Compatibilidad entre navegadores

Problemas típicos detectados al probar en varios motores, y cómo se resolvieron:

| Problema | Dónde aparece | Solución |
|---|---|---|
| `new Date('2026-12-12')` se interpreta en UTC: en Chile se muestra **un día antes** | Todos, según la zona horaria | Las fechas `AAAA-MM-DD` se arman con `new Date(año, mes, día)` (`src/utils/formato.js`) y las horas se leen del texto. Hay una prueba unitaria para esto. |
| Ventanas privadas o almacenamiento bloqueado impiden el **Service Worker**, y la API simulada no responde | Firefox (privado), Safari | Si MSW no arranca en 5 s, los mismos handlers responden dentro de la página con `getResponse` de MSW (`src/mocks/memoria.js`) y se muestra un aviso. La app nunca queda en blanco. Hay una prueba E2E con Service Workers bloqueados. |
| `localStorage` lanza una excepción con las cookies bloqueadas | Safari, modos privados | Todo acceso va en `try/catch`. El viaje dura mientras la pestaña esté abierta. |
| `AbortSignal.any()` y `AbortSignal.timeout()` no existen | Safari < 17.4, Firefox < 124 | El tiempo máximo y la cancelación se combinan a mano con `AbortController` (`src/api/transporte.js`). |
| Emojis de banderas | Windows (Chrome, Edge, Firefox) muestra solo dos letras | Las "postales" de destino se dibujan con CSS y SVG, sin emojis ni imágenes externas. |
| Flechas del `<input type="number">` y marcador del `<details>` distintos en cada motor | Firefox / Safari | Contador de pasajeros con botones propios y estilos que ocultan las flechas y el marcador en los tres motores. |
| Sintaxis moderna de JavaScript y prefijos de CSS | Navegadores antiguos | `build.target` de Vite (Chrome/Edge 87+, Firefox 78+, Safari 14+) y Autoprefixer con `browserslist`. |
| Recargar una ruta interna en GitHub Pages devuelve 404 | Todos | El build copia `index.html` como `404.html` y React Router resuelve la ruta. |

## Arquitectura

```
Páginas (Inicio, Destino → Vuelos/Hoteles, MiViaje)
   │                                   │
   │ useDestinos / useDestino          │ useQuery(OPCIONES_DE_VIAJE / SELECCION_VIAJE)
   ▼                                   ▼
useApi (useState + useEffect,        Apollo Client (RetryLink + HttpLink,
caché 5 min, deduplicación)          caché normalizada)
   │  src/api/rest.js                  │  src/api/graphql.js
   └──────────────► fetchConTiempo (8 s) ◄──────────────┘     src/api/transporte.js
                          │
                          ▼
            Service Worker de MSW  (o modo en memoria)
                          │
                          ▼
   handlers REST + graphql.query → esquema GraphQL + datos     src/mocks/
```

Los errores de ambas APIs se traducen a un mismo `ApiError` con tipo (`no-encontrado`, `servidor`, `red`, `tiempo`, `consulta`), que `EstadoError` explica al usuario (`src/api/errores.js`).

## Estructura

```
.github/workflows/pruebas.yml    # CI: lint + Vitest + Playwright en 5 navegadores
e2e/viajes.spec.js               # pruebas de punta a punta
playwright.config.js
public/mockServiceWorker.js      # generado por `npx msw init public`
src/
├── main.jsx                     # activa MSW (o el modo en memoria) y monta React
├── App.jsx                      # ApolloProvider, ViajeProvider y rutas
├── config.js                    # MOCK_ACTIVO, URLs de las APIs, modo del mock
├── api/
│   ├── rest.js                  # cliente REST + reintentos
│   ├── graphql.js               # Apollo Client, fragmentos y consultas
│   ├── transporte.js            # fetch con tiempo máximo (compartido)
│   ├── errores.js               # ApiError y traducción de errores de Apollo
│   └── api.test.js              # 15 pruebas de las dos APIs
├── hooks/                       # useApi, useDestinos, useTitulo
├── context/ViajeContext.jsx     # viaje del usuario (useState + useEffect + localStorage)
├── utils/                       # formato (precios, fechas) y lógica del viaje + pruebas
├── mocks/
│   ├── datos.js                 # destinos, vuelos y hoteles
│   ├── esquema.js               # esquema GraphQL y resolvers
│   ├── handlers.js              # endpoints REST y operaciones GraphQL
│   ├── simulador.js             # escenarios de falla
│   ├── browser.js               # setupWorker
│   └── memoria.js               # respaldo sin Service Worker
├── components/
│   ├── layout/                  # Layout, Aviso, PanelSimulador
│   ├── ui/                      # piezas genéricas reutilizables
│   ├── destinos/                # PostalDestino, TarjetaDestino, ListaActividades
│   ├── opciones/                # TarjetaVuelo, TarjetaHotel, BarraLista, BotonElegir, Disponibilidad
│   └── viaje/                   # SelectorPasajeros, Cotizacion
└── pages/                       # Inicio, Destino, VuelosDestino, HotelesDestino, MiViaje, NoEncontrado
```

## Ejecución

Requiere Node.js 18 o superior.

```bash
npm install
npm start          # o npm run dev → http://localhost:5173
npm test
npm run lint
```

> El proyecto usa **Vite** en lugar de Create React App, que está descontinuado. Apollo Client 4 se importa igual que en el ejemplo del curso: `ApolloClient`, `InMemoryCache`, `HttpLink` y `gql` desde `@apollo/client`, y `ApolloProvider` y `useQuery` desde `@apollo/client/react`.
>
> **Dependencias:** `npm audit` informa un aviso sobre `picomatch` (ReDoS) que todavía no tiene una versión corregida. Afecta solo a herramientas de desarrollo (Vite, Tailwind y Vitest lo usan para buscar archivos) y no forma parte del sitio publicado.

## Publicación en GitHub Pages

```bash
npm run deploy     # compila en modo "ghpages" y publica dist/ en la rama gh-pages
```

Configuración, una sola vez: **Settings → Pages → Source: Deploy from a branch → Branch `gh-pages` / `(root)`**.

GitHub Pages sirve solo archivos estáticos, y aquí no hay un backend real:

- **El mock viaja con el sitio.** `.env.ghpages` activa `VITE_USAR_MOCK=true`, así que MSW, su `mockServiceWorker.js` y el simulador quedan incluidos y ambas APIs responden igual que en desarrollo.
- **Prefijo del repositorio.** Vite compila con `base: '/viajes-fernando-fuentes-pfy2202/'`, `BrowserRouter` recibe ese prefijo como `basename` y las URLs de las APIs se arman con `BASE_URL`.
- **Recargar en una ruta interna.** `404.html` es una copia de `index.html`, así que la aplicación arranca y React Router muestra la página pedida.
