import { formatearFechaCorta, formatearPrecio, plural } from '../../utils/formato';
import { hotelCubreVuelo, nochesDelVuelo } from '../../utils/viaje';
import Estrellas from '../ui/Estrellas';
import BotonElegir from './BotonElegir';
import Disponibilidad from './Disponibilidad';

// Hotel del destino (datos de la consulta GraphQL OpcionesDeViaje).
// Si el usuario ya eligió un vuelo, indica si el hotel sirve para esas fechas.
export default function TarjetaHotel({ hotel, vueloElegido, elegido, otroDestino, onElegir, onQuitar }) {
  const compatible = hotelCubreVuelo(hotel, vueloElegido);
  const noches = vueloElegido ? nochesDelVuelo(vueloElegido) : null;

  return (
    <article
      aria-label={`Hotel ${hotel.nombre}`}
      className={`tarjeta grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center ${elegido ? 'ring-2 ring-mar-500' : ''} ${!hotel.disponible ? 'opacity-75' : ''}`}
    >
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Estrellas cantidad={hotel.estrellas} />
          <Disponibilidad cantidad={hotel.habitacionesDisponibles} unidad="habitación" unidades="habitaciones" />
        </div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-sans text-lg font-bold">{hotel.nombre}</h3>
            <p className="text-sm text-stone-500">{hotel.barrio}</p>
          </div>
          <p className="shrink-0 rounded-lg bg-mar-700 px-2 py-1 text-sm font-bold text-white" title="Calificación de los huéspedes">
            <span className="sr-only">Calificación </span>{hotel.calificacion.toFixed(1)}
          </p>
        </div>
        <ul className="flex flex-wrap gap-1.5" aria-label="Servicios">
          {hotel.servicios.map((s) => (
            <li key={s} className="rounded-md bg-arena-100 px-2 py-0.5 text-xs text-stone-700">{s}</li>
          ))}
        </ul>
        <p className="text-sm text-stone-600">
          Recibe huéspedes del <strong>{formatearFechaCorta(hotel.disponibleDesde)}</strong> al <strong>{formatearFechaCorta(hotel.disponibleHasta)}</strong>
        </p>
        {vueloElegido && (
          <p className={`text-sm font-medium ${compatible ? 'text-emerald-700' : 'text-coral-700'}`}>
            {compatible
              ? `✓ Disponible para las fechas de tu vuelo (${plural(noches, 'noche')}).`
              : '✕ No recibe huéspedes en las fechas de tu vuelo.'}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-arena-200 pt-4 sm:flex-row sm:items-center sm:justify-between md:min-w-44 md:flex-col md:items-end md:border-l md:border-t-0 md:pl-5 md:pt-0">
        <p className="md:text-right">
          <span className="block text-2xl font-bold">{formatearPrecio(hotel.precioNoche)}</span>
          <span className="text-xs text-stone-500">por noche, habitación doble</span>
          {noches && compatible && (
            <span className="block text-xs text-stone-500">{formatearPrecio(hotel.precioNoche * noches)} por {plural(noches, 'noche')}</span>
          )}
        </p>
        <BotonElegir
          nombre={`el hotel ${hotel.nombre}`}
          elegido={elegido}
          disponible={hotel.disponible}
          otroDestino={otroDestino}
          onElegir={onElegir}
          onQuitar={onQuitar}
        />
      </div>
    </article>
  );
}
