import { useSyncExternalStore } from 'react';
import { ESCENARIOS, cambiarEscenario, obtenerEscenario, suscribirEscenario } from '../../mocks/simulador';
import { estadoMock } from '../../config';

// Panel de demostración: cambia el comportamiento del backend simulado
// (REST y GraphQL a la vez) para ver cómo responde la interfaz.
export default function PanelSimulador() {
  const escenario = useSyncExternalStore(suscribirEscenario, obtenerEscenario);
  const modo = estadoMock.modo === 'memoria' ? 'en memoria (sin Service Worker)' : 'Service Worker de MSW';

  return (
    <details className="tarjeta group fixed bottom-4 right-4 z-40 w-[calc(100%-2rem)] max-w-sm open:shadow-xl sm:w-80">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${escenario === 'normal' ? 'bg-emerald-500' : 'bg-coral-500'}`} />
          Simulador de API · {ESCENARIOS[escenario].nombre}
        </span>
        <span aria-hidden="true" className="text-stone-400 transition-transform group-open:rotate-180">▾</span>
      </summary>
      <div className="space-y-3 border-t border-arena-200 px-4 pb-4 pt-3">
        <fieldset>
          <legend className="rotulo mb-2">Comportamiento del servidor</legend>
          <div className="grid grid-cols-2 gap-1.5">
            {Object.entries(ESCENARIOS).map(([clave, { nombre }]) => (
              <button
                key={clave}
                type="button"
                aria-pressed={escenario === clave}
                onClick={() => cambiarEscenario(clave)}
                className={`rounded-md border px-2 py-1.5 text-xs font-medium transition-colors ${
                  escenario === clave ? 'border-mar-700 bg-mar-700 text-white' : 'border-stone-300 bg-white hover:border-mar-500'
                }`}
              >
                {nombre}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-stone-500">{ESCENARIOS[escenario].detalle}</p>
        </fieldset>
        <p className="text-xs text-stone-500">API simulada: {modo}.</p>
        <button type="button" onClick={() => window.location.reload()} className="btn-secundario w-full py-2 text-xs">
          Recargar sin caché
        </button>
      </div>
    </details>
  );
}
