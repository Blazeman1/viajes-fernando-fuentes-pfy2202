import Etiqueta from '../ui/Etiqueta';

// Actividades populares de la ficha del destino (GET /api/destinos/:id).
export default function ListaActividades({ actividades }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {actividades.map((a) => (
        <li key={a.nombre} className="tarjeta space-y-2 p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-sans text-base font-semibold">{a.nombre}</h3>
            <Etiqueta tipo={a.tipo} />
          </div>
          {a.detalle && <p className="text-sm text-stone-600">{a.detalle}</p>}
        </li>
      ))}
    </ul>
  );
}
