import { Link } from 'react-router-dom';
import { formatearPrecio } from '../../utils/formato';
import Etiqueta from '../ui/Etiqueta';
import PostalDestino from './PostalDestino';

// Tarjeta del listado de destinos (datos de GET /api/destinos).
export default function TarjetaDestino({ destino }) {
  const tipos = [...new Set(destino.actividadesPopulares.map((a) => a.tipo))];

  return (
    <article className="tarjeta group relative flex w-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <PostalDestino destino={destino} />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="rotulo">{destino.continente}</p>
        <h3 className="text-xl font-bold">
          {/* El enlace cubre toda la tarjeta (::after), pero el texto sigue siendo un único enlace accesible. */}
          <Link to={`/destinos/${destino.id}`} className="after:absolute after:inset-0 focus:outline-none">
            {destino.nombre}, {destino.pais}
          </Link>
        </h3>
        <p className="text-sm text-stone-600">{destino.resumen}</p>

        <div>
          <p className="sr-only">Actividades populares:</p>
          <ul className="space-y-1 text-sm text-stone-700">
            {destino.actividadesPopulares.slice(0, 3).map((a) => (
              <li key={a.nombre} className="flex items-center gap-2">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-coral-500" />
                {a.nombre}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {tipos.map((t) => <Etiqueta key={t} tipo={t} />)}
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-arena-200 pt-3">
          <p className="text-sm text-stone-500">
            {destino.precioDesde ? (
              <>Vuelos desde <strong className="block text-lg text-stone-900">{formatearPrecio(destino.precioDesde)}</strong></>
            ) : (
              'Sin vuelos disponibles'
            )}
          </p>
          <span aria-hidden="true" className="text-sm font-semibold text-mar-700 transition-transform group-hover:translate-x-1">Ver viaje →</span>
        </div>
      </div>
    </article>
  );
}
