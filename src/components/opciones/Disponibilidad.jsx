// Cupo disponible de un vuelo (asientos) o de un hotel (habitaciones).
export default function Disponibilidad({ cantidad, unidad, unidades }) {
  if (cantidad === 0) {
    return <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-200">Agotado</span>;
  }
  const pocos = cantidad <= 5;
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
        pocos ? 'bg-amber-50 text-amber-800 ring-amber-200' : 'bg-emerald-50 text-emerald-800 ring-emerald-200'
      }`}
    >
      {pocos ? '¡Quedan ' : ''}
      {cantidad} {cantidad === 1 ? unidad : unidades}
      {pocos ? '!' : ' disponibles'}
    </span>
  );
}
