import { Link } from 'react-router-dom';
import { useViaje } from '../../context/ViajeContext';

// Aviso flotante al agregar algo al viaje. role="status": los lectores de
// pantalla lo anuncian sin interrumpir.
export default function Aviso() {
  const { aviso, cerrarAviso } = useViaje();
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 top-20 z-50 flex justify-center px-4">
      {aviso && (
        <div key={aviso.id} className="pointer-events-auto flex items-center gap-4 rounded-xl bg-mar-900 px-4 py-3 text-sm text-white shadow-xl">
          <span>{aviso.texto}</span>
          <Link to="/mi-viaje" onClick={cerrarAviso} className="font-semibold text-coral-100 underline underline-offset-2">Ver mi viaje</Link>
          <button type="button" onClick={cerrarAviso} aria-label="Cerrar aviso" className="text-lg leading-none text-white/70 hover:text-white">×</button>
        </div>
      )}
    </div>
  );
}
