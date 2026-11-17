import { obtenerDestino, obtenerDestinos } from '../api/rest';
import { useApi } from './useApi';

// GET /api/destinos
export const useDestinos = () => useApi('destinos', obtenerDestinos);

// GET /api/destinos/:id
export const useDestino = (id) => useApi(`destinos/${id}`, () => obtenerDestino(id));
