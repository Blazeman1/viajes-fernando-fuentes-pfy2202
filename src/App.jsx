import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';
import { crearClienteGraphQL } from './api/graphql';
import { ViajeProvider } from './context/ViajeContext';
import Layout from './components/layout/Layout';
import Inicio from './pages/Inicio';
import Destino from './pages/Destino';
import VuelosDestino from './pages/VuelosDestino';
import HotelesDestino from './pages/HotelesDestino';
import MiViaje from './pages/MiViaje';
import NoEncontrado from './pages/NoEncontrado';

// Rutas del sitio:
//   /                          Destinos (API REST: GET /api/destinos)
//   /destinos/:id              Ficha del destino (GET /api/destinos/:id) ...
//   /destinos/:id/vuelos         ... con sus vuelos   (GraphQL: OpcionesDeViaje)
//   /destinos/:id/hoteles        ... y sus hoteles    (misma consulta, en caché)
//   /mi-viaje                  Vuelo + hotel elegidos y cotización (GraphQL: SeleccionViaje)
//   *                          404
//
// basename: en GitHub Pages las rutas viven bajo /viajes-fernando-fuentes-pfy2202/.
// Vite entrega ese prefijo en BASE_URL ("/" en desarrollo).
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

export default function App() {
  // Un cliente de Apollo por aplicación (useState: se crea una sola vez).
  const [clienteGraphQL] = useState(crearClienteGraphQL);

  return (
    <ApolloProvider client={clienteGraphQL}>
      <ViajeProvider>
        <BrowserRouter basename={basename}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Inicio />} />
              <Route path="destinos" element={<Navigate to="/" replace />} />
              <Route path="destinos/:id" element={<Destino />}>
                <Route index element={<Navigate to="vuelos" replace />} />
                <Route path="vuelos" element={<VuelosDestino />} />
                <Route path="hoteles" element={<HotelesDestino />} />
              </Route>
              <Route path="mi-viaje" element={<MiViaje />} />
              <Route path="*" element={<NoEncontrado />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ViajeProvider>
    </ApolloProvider>
  );
}
