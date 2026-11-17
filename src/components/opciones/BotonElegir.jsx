// Botón de elegir / quitar una opción del viaje. Se usa en vuelos y hoteles.
export default function BotonElegir({ elegido, disponible, otroDestino, onElegir, onQuitar, nombre }) {
  if (elegido) {
    return (
      <div className="flex flex-col items-stretch gap-1.5 sm:items-end">
        <span className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-mar-50 px-3 py-2 text-sm font-semibold text-mar-700">
          <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 fill-current"><path d="M8 13.2 4.8 10l-1.3 1.3L8 15.8l8.5-8.5-1.3-1.3z" /></svg>
          En tu viaje
        </span>
        <button type="button" onClick={onQuitar} className="btn-texto py-1 text-xs" aria-label={`Quitar ${nombre} de mi viaje`}>Quitar</button>
      </div>
    );
  }
  return (
    <button type="button" className="btn-primario w-full sm:w-auto" disabled={!disponible} onClick={onElegir} aria-label={disponible ? `Elegir ${nombre}` : `Sin cupos en ${nombre}`}>
      {!disponible ? 'Sin cupos' : otroDestino ? 'Cambiar mi viaje a este' : 'Elegir'}
    </button>
  );
}
