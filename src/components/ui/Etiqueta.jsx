// Etiqueta de color para el tipo de actividad (Cultura, Playa, ...).
const COLORES = {
  Cultura: 'bg-violet-50 text-violet-800 ring-violet-200',
  Naturaleza: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  Gastronomía: 'bg-amber-50 text-amber-800 ring-amber-200',
  Aventura: 'bg-orange-50 text-orange-800 ring-orange-200',
  Playa: 'bg-sky-50 text-sky-800 ring-sky-200',
  Ciudad: 'bg-slate-100 text-slate-700 ring-slate-200',
};

export default function Etiqueta({ tipo, children }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${COLORES[tipo] ?? COLORES.Ciudad}`}>
      {children ?? tipo}
    </span>
  );
}
