import { formatearPrecio, plural } from '../../utils/formato';

// Desglose del precio del viaje.
export default function Cotizacion({ cotizacion, vuelo, hotel }) {
  const { pasajeros, habitaciones, noches, totalVuelos, totalHotel, total } = cotizacion;
  return (
    <dl className="space-y-2 text-sm">
      {vuelo && (
        <div className="flex justify-between gap-3">
          <dt className="text-stone-600">Vuelos · {formatearPrecio(vuelo.precio)} × {plural(pasajeros, 'pasajero')}</dt>
          <dd className="font-semibold tabular-nums">{formatearPrecio(totalVuelos)}</dd>
        </div>
      )}
      {hotel && (
        <div className="flex justify-between gap-3">
          <dt className="text-stone-600">
            Hotel · {plural(habitaciones, 'habitación', 'habitaciones')} × {noches ? plural(noches, 'noche') : '1 noche (referencia)'}
          </dt>
          <dd className="font-semibold tabular-nums">{formatearPrecio(totalHotel)}</dd>
        </div>
      )}
      <div className="flex items-baseline justify-between gap-3 border-t border-arena-200 pt-3">
        <dt className="font-semibold">Total estimado</dt>
        <dd data-testid="total-viaje" className="text-2xl font-bold tabular-nums">{formatearPrecio(total)}</dd>
      </div>
    </dl>
  );
}
