import { formatearDuracion, formatearFecha, formatearHora, formatearPrecio, plural } from '../../utils/formato';
import { nochesDelVuelo } from '../../utils/viaje';
import BotonElegir from './BotonElegir';
import Disponibilidad from './Disponibilidad';

// Vuelo de ida y vuelta (datos de la consulta GraphQL OpcionesDeViaje).
export default function TarjetaVuelo({ vuelo, elegido, otroDestino, onElegir, onQuitar }) {
  const diasDespues = vuelo.llegada.slice(0, 10) !== vuelo.salida.slice(0, 10);
  const noches = nochesDelVuelo(vuelo);

  return (
    <article
      aria-label={`Vuelo ${vuelo.aerolinea} ${vuelo.numero}`}
      className={`tarjeta grid gap-4 p-5 transition-shadow md:grid-cols-[1fr_auto] md:items-center ${elegido ? 'ring-2 ring-mar-500' : ''} ${!vuelo.disponible ? 'opacity-75' : ''}`}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className="font-sans text-base font-bold">{vuelo.aerolinea}</h3>
          <span className="text-sm text-stone-500">{vuelo.numero} · {vuelo.clase}</span>
          <Disponibilidad cantidad={vuelo.asientosDisponibles} unidad="asiento" unidades="asientos" />
        </div>

        {/* Itinerario de ida: salida — duración — llegada */}
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
          <div>
            <p className="text-2xl font-bold tabular-nums">{formatearHora(vuelo.salida)}</p>
            <p className="text-sm font-semibold text-stone-500">{vuelo.origen}</p>
          </div>
          <div className="text-center text-xs text-stone-500">
            <p>{formatearDuracion(vuelo.duracionMin)}</p>
            <div aria-hidden="true" className="relative my-1 h-px bg-stone-300">
              {Array.from({ length: vuelo.escalas }, (_, i) => (
                <span key={i} className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border-2 border-white bg-coral-500" style={{ left: `${((i + 1) * 100) / (vuelo.escalas + 1)}%` }} />
              ))}
            </div>
            <p className={vuelo.escalas ? 'text-coral-700' : 'text-emerald-700'}>{vuelo.escalas ? plural(vuelo.escalas, 'escala') : 'Directo'}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold tabular-nums">
              {formatearHora(vuelo.llegada)}
              {diasDespues && <sup className="ml-0.5 text-xs text-coral-600" title="Llega al día siguiente">+1</sup>}
            </p>
            <p className="text-sm font-semibold text-stone-500">{vuelo.destino}</p>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-3">
          <div><dt className="rotulo">Ida</dt><dd>{formatearFecha(vuelo.salida)}</dd></div>
          <div><dt className="rotulo">Regreso</dt><dd>{formatearFecha(vuelo.regreso)}</dd></div>
          <div className="col-span-2 sm:col-span-1"><dt className="rotulo">Estadía · equipaje</dt><dd>{plural(noches, 'noche')} · {vuelo.equipaje}</dd></div>
        </dl>
      </div>

      <div className="flex flex-col gap-3 border-t border-arena-200 pt-4 sm:flex-row sm:items-center sm:justify-between md:min-w-44 md:flex-col md:items-end md:border-l md:border-t-0 md:pl-5 md:pt-0">
        <p className="md:text-right">
          <span className="block text-2xl font-bold">{formatearPrecio(vuelo.precio)}</span>
          <span className="text-xs text-stone-500">por persona, ida y vuelta</span>
        </p>
        <BotonElegir
          nombre={`el vuelo ${vuelo.numero}`}
          elegido={elegido}
          disponible={vuelo.disponible}
          otroDestino={otroDestino}
          onElegir={onElegir}
          onQuitar={onQuitar}
        />
      </div>
    </article>
  );
}
