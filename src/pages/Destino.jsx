import { NavLink, Outlet, useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { OPCIONES_DE_VIAJE } from '../api/graphql';
import { errorDesdeGraphQL } from '../api/errores';
import { useDestino } from '../hooks/useDestinos';
import { useTitulo } from '../hooks/useTitulo';
import PostalDestino from '../components/destinos/PostalDestino';
import ListaActividades from '../components/destinos/ListaActividades';
import { EsqueletoFicha } from '../components/ui/Esqueletos';
import EstadoError from '../components/ui/EstadoError';

const claseTab = ({ isActive }) =>
  `inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors sm:text-base ${
    isActive ? 'border-coral-500 text-mar-800' : 'border-transparent text-stone-500 hover:border-arena-300 hover:text-stone-800'
  }`;

function Contador({ valor }) {
  if (valor == null) return null;
  return <span className="rounded-full bg-arena-100 px-2 py-0.5 text-xs font-semibold text-stone-600">{valor}</span>;
}

// /destinos/:id → ficha del destino (REST) + vuelos y hoteles (GraphQL).
// Las dos peticiones salen EN PARALELO: no hace falta esperar la ficha para
// pedir las opciones de viaje.
export default function Destino() {
  const { id } = useParams();
  const ficha = useDestino(id); //                                    GET /api/destinos/:id
  const opciones = useQuery(OPCIONES_DE_VIAJE, { variables: { destinoId: id } }); // POST /graphql
  const destino = ficha.datos;
  useTitulo(destino ? `${destino.nombre}, ${destino.pais}` : 'Destino');

  if (ficha.cargando) return <EsqueletoFicha />;
  if (ficha.error) return <EstadoError error={ficha.error} onReintentar={ficha.reintentar} />;

  // Lo que necesitan las pestañas hijas (vuelos / hoteles), vía <Outlet context>.
  const contexto = {
    destino,
    vuelos: opciones.data?.vuelos ?? null,
    hoteles: opciones.data?.hoteles ?? null,
    cargando: opciones.loading,
    error: errorDesdeGraphQL(opciones.error),
    reintentar: () => opciones.refetch().catch(() => {}),
  };

  return (
    <article className="space-y-10">
      <div className="space-y-4">
        <nav aria-label="Ruta de navegación" className="text-sm text-stone-500">
          <Link to="/" className="enlace">Destinos</Link> <span aria-hidden="true">/</span> {destino.nombre}
        </nav>
        <PostalDestino destino={destino} grande />
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-4">
          <h1 className="text-3xl font-bold">{destino.nombre}, {destino.pais}</h1>
          <p className="text-lg text-stone-700">{destino.descripcion}</p>
        </section>
        <dl className="tarjeta grid grid-cols-2 gap-4 p-5 text-sm lg:grid-cols-1">
          <div><dt className="rotulo">Idioma</dt><dd>{destino.idioma}</dd></div>
          <div><dt className="rotulo">Moneda</dt><dd>{destino.moneda}</dd></div>
          <div className="col-span-2 lg:col-span-1"><dt className="rotulo">Clima</dt><dd>{destino.clima}</dd></div>
          <div className="col-span-2 lg:col-span-1"><dt className="rotulo">Mejor época</dt><dd>{destino.mejorEpoca}</dd></div>
        </dl>
      </div>

      <section aria-labelledby="titulo-actividades" className="space-y-4">
        <h2 id="titulo-actividades" className="text-2xl font-bold">Actividades populares</h2>
        <ListaActividades actividades={destino.actividadesPopulares} />
      </section>

      <section aria-labelledby="titulo-opciones" className="space-y-5">
        <div>
          <h2 id="titulo-opciones" className="text-2xl font-bold">Opciones de viaje</h2>
          <p className="text-stone-600">Vuelos ida y vuelta desde Santiago y hoteles en {destino.nombre}.</p>
        </div>
        <nav aria-label="Opciones de viaje" className="-mx-4 overflow-x-auto border-b border-arena-200 px-4 sm:mx-0 sm:px-0">
          <div className="flex whitespace-nowrap">
            <NavLink to="vuelos" className={claseTab}>Vuelos <Contador valor={contexto.vuelos?.length} /></NavLink>
            <NavLink to="hoteles" className={claseTab}>Hoteles <Contador valor={contexto.hoteles?.length} /></NavLink>
          </div>
        </nav>
        <Outlet context={contexto} />
      </section>
    </article>
  );
}
