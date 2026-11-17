import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { SELECCION_VIAJE } from '../api/graphql';
import { errorDesdeGraphQL } from '../api/errores';
import { useViaje } from '../context/ViajeContext';
import { useTitulo } from '../hooks/useTitulo';
import { cotizar, revisarViaje } from '../utils/viaje';
import TarjetaVuelo from '../components/opciones/TarjetaVuelo';
import TarjetaHotel from '../components/opciones/TarjetaHotel';
import Cotizacion from '../components/viaje/Cotizacion';
import SelectorPasajeros from '../components/viaje/SelectorPasajeros';
import { EsqueletoLista } from '../components/ui/Esqueletos';
import EstadoError from '../components/ui/EstadoError';
import EstadoVacio from '../components/ui/EstadoVacio';

function FaltaElegir({ que, destinoId }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-arena-300 p-5 text-center">
      <p className="text-stone-600">Aún no eliges {que === 'vuelos' ? 'un vuelo' : 'un hotel'}.</p>
      <Link to={`/destinos/${destinoId}/${que}`} className="btn-secundario mt-3">Ver {que}</Link>
    </div>
  );
}

// /mi-viaje → lo elegido, consultado por GraphQL (SeleccionViaje), con la
// cotización y la revisión de cupos y fechas.
export default function MiViaje() {
  useTitulo('Mi viaje');
  const { viaje, quitarVuelo, quitarHotel, vaciar, cambiarPasajeros } = useViaje();
  const [solicitud, setSolicitud] = useState(null);
  const vacio = !viaje.vueloId && !viaje.hotelId;

  const { data, loading, error, refetch } = useQuery(SELECCION_VIAJE, {
    variables: {
      destinoId: viaje.destinoId ?? '',
      vueloId: viaje.vueloId ?? '',
      hotelId: viaje.hotelId ?? '',
      conVuelo: Boolean(viaje.vueloId),
      conHotel: Boolean(viaje.hotelId),
    },
    skip: vacio, // sin nada elegido no hay nada que consultar
  });

  if (solicitud) {
    return (
      <section role="status" className="tarjeta mx-auto max-w-xl space-y-3 p-8 text-center">
        <p className="rotulo">Solicitud {solicitud.codigo}</p>
        <h1 className="text-3xl font-bold">¡Recibimos tu solicitud!</h1>
        <p className="text-stone-600">Una ejecutiva te contactará para confirmar tu viaje a {solicitud.destino}. (Proyecto académico: no se realiza ninguna reserva real.)</p>
        <Link to="/" className="btn-oscuro mt-2" onClick={() => setSolicitud(null)}>Explorar más destinos</Link>
      </section>
    );
  }

  if (vacio) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Mi viaje</h1>
        <EstadoVacio titulo="Tu viaje está vacío" accion={<Link to="/" className="btn-primario">Explorar destinos</Link>}>
          Elige un destino y agrega un vuelo y un hotel para ver aquí el total de tu viaje.
        </EstadoVacio>
      </div>
    );
  }

  if (loading && !data) return <EsqueletoLista cantidad={2} etiqueta="Cargando tu viaje" />;
  if (error) return <EstadoError error={errorDesdeGraphQL(error)} onReintentar={() => refetch().catch(() => {})} />;

  const destino = data.destino;
  const vuelo = data.vuelo ?? null;
  const hotel = data.hotel ?? null;
  const cotizacion = cotizar({ vuelo, hotel, pasajeros: viaje.pasajeros });
  const problemas = revisarViaje({ vuelo, hotel, pasajeros: viaje.pasajeros });
  const completo = Boolean(vuelo && hotel);

  const solicitar = () =>
    setSolicitud({ codigo: `RS-${Date.now().toString(36).toUpperCase().slice(-6)}`, destino: destino.nombre });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="rotulo">Mi viaje</p>
          <h1 className="text-3xl font-bold">{destino ? `${destino.nombre}, ${destino.pais}` : 'Tu viaje'}</h1>
        </div>
        <div className="flex gap-2">
          {destino && <Link to={`/destinos/${destino.id}`} className="btn-secundario">Ver más opciones</Link>}
          <button type="button" className="btn-texto" onClick={vaciar}>Vaciar viaje</button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
        <div className="space-y-6">
          <section aria-labelledby="titulo-vuelo" className="space-y-3">
            <h2 id="titulo-vuelo" className="text-xl font-bold">Vuelo</h2>
            {vuelo ? (
              <TarjetaVuelo vuelo={vuelo} elegido onQuitar={quitarVuelo} />
            ) : viaje.vueloId ? (
              <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">El vuelo que habías elegido ya no existe. <button type="button" className="enlace" onClick={quitarVuelo}>Quitarlo</button></p>
            ) : (
              <FaltaElegir que="vuelos" destinoId={viaje.destinoId} />
            )}
          </section>
          <section aria-labelledby="titulo-hotel" className="space-y-3">
            <h2 id="titulo-hotel" className="text-xl font-bold">Hotel</h2>
            {hotel ? (
              <TarjetaHotel hotel={hotel} vueloElegido={vuelo} elegido onQuitar={quitarHotel} />
            ) : viaje.hotelId ? (
              <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">El hotel que habías elegido ya no existe. <button type="button" className="enlace" onClick={quitarHotel}>Quitarlo</button></p>
            ) : (
              <FaltaElegir que="hoteles" destinoId={viaje.destinoId} />
            )}
          </section>
        </div>

        <aside aria-labelledby="titulo-resumen" className="tarjeta space-y-5 p-5 lg:sticky lg:top-24">
          <h2 id="titulo-resumen" className="text-xl font-bold">Resumen</h2>
          <SelectorPasajeros valor={viaje.pasajeros} onCambiar={cambiarPasajeros} />
          <Cotizacion cotizacion={cotizacion} vuelo={vuelo} hotel={hotel} />
          {problemas.length > 0 && (
            <ul role="alert" className="space-y-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
              {problemas.map((p) => <li key={p}>⚠ {p}</li>)}
            </ul>
          )}
          <button type="button" className="btn-primario w-full" disabled={!completo || problemas.length > 0} onClick={solicitar}>
            Solicitar reserva
          </button>
          {!completo && <p className="text-center text-xs text-stone-500">Elige un vuelo y un hotel para solicitar la reserva.</p>}
        </aside>
      </div>
    </div>
  );
}
