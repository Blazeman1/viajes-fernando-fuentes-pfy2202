// EL VIAJE DEL USUARIO: destino, vuelo, hotel y pasajeros.
// Estado global con useState (Context) y persistencia en localStorage con useEffect.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { PASAJEROS_MAX, PASAJEROS_MIN } from '../utils/viaje';

const CLAVE = 'rumbo-sur-viaje';
const VACIO = { destinoId: null, destinoNombre: null, vueloId: null, hotelId: null, pasajeros: 2 };

// localStorage puede no existir o lanzar error (Safari con cookies bloqueadas,
// modos privados): todo acceso va dentro de try/catch.
function leerGuardado() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE));
    return guardado && typeof guardado === 'object' ? { ...VACIO, ...guardado } : VACIO;
  } catch {
    return VACIO;
  }
}

const ViajeContext = createContext(null);

export function ViajeProvider({ children }) {
  const [viaje, setViaje] = useState(leerGuardado);
  const [aviso, setAviso] = useState(null); // { id, texto }

  // Cada cambio del viaje se guarda para no perderlo al recargar.
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(viaje));
    } catch {
      /* sin almacenamiento: el viaje dura mientras la pestaña esté abierta */
    }
  }, [viaje]);

  // El aviso flotante se cierra solo a los 4 segundos.
  useEffect(() => {
    if (!aviso) return undefined;
    const temporizador = setTimeout(() => setAviso(null), 4000);
    return () => clearTimeout(temporizador);
  }, [aviso]);

  const avisar = useCallback((texto) => setAviso({ id: Date.now(), texto }), []);

  // Elegir un vuelo u hotel de OTRO destino empieza un viaje nuevo.
  const elegir = useCallback(
    (campo, opcion, destinoNombre) => {
      setViaje((actual) => {
        const mismoDestino = actual.destinoId === opcion.destinoId;
        const base = mismoDestino ? actual : { ...VACIO, pasajeros: actual.pasajeros };
        return { ...base, destinoId: opcion.destinoId, destinoNombre, [campo]: opcion.id };
      });
      avisar(`${campo === 'vueloId' ? 'Vuelo' : 'Hotel'} agregado a tu viaje a ${destinoNombre}.`);
    },
    [avisar]
  );

  const valor = useMemo(() => {
    const quitar = (campo) =>
      setViaje((actual) => {
        const siguiente = { ...actual, [campo]: null };
        // Sin vuelo ni hotel, el viaje queda vacío.
        return siguiente.vueloId || siguiente.hotelId ? siguiente : { ...VACIO, pasajeros: actual.pasajeros };
      });

    return {
      viaje,
      aviso,
      cerrarAviso: () => setAviso(null),
      elementos: Number(Boolean(viaje.vueloId)) + Number(Boolean(viaje.hotelId)),
      elegirVuelo: (vuelo, destinoNombre) => elegir('vueloId', vuelo, destinoNombre),
      elegirHotel: (hotel, destinoNombre) => elegir('hotelId', hotel, destinoNombre),
      quitarVuelo: () => quitar('vueloId'),
      quitarHotel: () => quitar('hotelId'),
      vaciar: () => setViaje((actual) => ({ ...VACIO, pasajeros: actual.pasajeros })),
      cambiarPasajeros: (n) =>
        setViaje((actual) => ({ ...actual, pasajeros: Math.min(PASAJEROS_MAX, Math.max(PASAJEROS_MIN, n)) })),
    };
  }, [viaje, aviso, elegir]);

  return <ViajeContext.Provider value={valor}>{children}</ViajeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useViaje() {
  const contexto = useContext(ViajeContext);
  if (!contexto) throw new Error('useViaje debe usarse dentro de <ViajeProvider>.');
  return contexto;
}
