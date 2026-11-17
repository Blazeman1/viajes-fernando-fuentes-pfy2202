import Interruptor from '../ui/Interruptor';

// Barra superior de las listas de vuelos y hoteles: orden, filtro de
// disponibilidad y cuántos resultados se están mostrando.
export default function BarraLista({ id, orden, opcionesOrden, onOrden, soloDisponibles, onSoloDisponibles, mostrando, total, children }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-arena-100 p-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <label htmlFor={id} className="flex items-center gap-2 text-sm text-stone-700">
          Ordenar por
          <select id={id} value={orden} onChange={(e) => onOrden(e.target.value)} className="campo w-auto py-1.5">
            {opcionesOrden.map((o) => <option key={o.valor} value={o.valor}>{o.texto}</option>)}
          </select>
        </label>
        <Interruptor etiqueta="Solo con cupos" activo={soloDisponibles} onCambiar={onSoloDisponibles} />
        {children}
      </div>
      <p className="text-sm text-stone-500" aria-live="polite">Mostrando {mostrando} de {total}</p>
    </div>
  );
}
