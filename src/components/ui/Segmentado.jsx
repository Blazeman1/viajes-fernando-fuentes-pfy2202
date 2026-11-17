// Control segmentado: un grupo de botones donde se elige una opción.
// Se usa para filtros (continente) y para el orden de las listas.
export default function Segmentado({ etiqueta, opciones, valor, onCambiar }) {
  return (
    <div role="group" aria-label={etiqueta} className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <div className="inline-flex gap-1.5 whitespace-nowrap">
        {opciones.map((opcion) => {
          const activo = opcion.valor === valor;
          return (
            <button
              key={opcion.valor}
              type="button"
              aria-pressed={activo}
              onClick={() => onCambiar(opcion.valor)}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                activo ? 'border-mar-700 bg-mar-700 font-semibold text-white' : 'border-stone-300 bg-white text-stone-700 hover:border-mar-500'
              }`}
            >
              {opcion.texto}
            </button>
          );
        })}
      </div>
    </div>
  );
}
