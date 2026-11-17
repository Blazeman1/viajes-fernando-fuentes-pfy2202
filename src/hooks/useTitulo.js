import { useEffect } from 'react';

// Actualiza el título de la pestaña del navegador.
export function useTitulo(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} · Rumbo Sur` : 'Rumbo Sur · Agencia de viajes';
  }, [titulo]);
}
