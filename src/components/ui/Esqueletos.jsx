// Esqueletos de carga: la forma del contenido mientras llega la respuesta.
export function EsqueletoTarjetas({ cantidad = 6 }) {
  return (
    <div role="status" aria-label="Cargando destinos" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: cantidad }, (_, i) => (
        <div key={i} className="tarjeta overflow-hidden">
          <div className="hueso h-36 rounded-none" />
          <div className="space-y-3 p-5">
            <div className="hueso h-5 w-2/3" />
            <div className="hueso h-4 w-full" />
            <div className="hueso h-4 w-5/6" />
            <div className="flex gap-2 pt-1"><div className="hueso h-5 w-16 rounded-full" /><div className="hueso h-5 w-20 rounded-full" /></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function EsqueletoLista({ cantidad = 3, etiqueta = 'Cargando' }) {
  return (
    <div role="status" aria-label={etiqueta} className="space-y-3">
      {Array.from({ length: cantidad }, (_, i) => (
        <div key={i} className="tarjeta flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <div className="flex-1 space-y-3">
            <div className="hueso h-4 w-32" />
            <div className="hueso h-6 w-3/4" />
            <div className="hueso h-4 w-1/2" />
          </div>
          <div className="hueso h-10 w-full sm:w-36" />
        </div>
      ))}
    </div>
  );
}

export function EsqueletoFicha() {
  return (
    <div role="status" aria-label="Cargando destino" className="space-y-6">
      <div className="hueso h-56 rounded-2xl sm:h-64" />
      <div className="grid gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => <div key={i} className="hueso h-16" />)}
      </div>
    </div>
  );
}
