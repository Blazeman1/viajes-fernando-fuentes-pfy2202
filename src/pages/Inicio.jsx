import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDestinos } from '../hooks/useDestinos';
import { useTitulo } from '../hooks/useTitulo';
import TarjetaDestino from '../components/destinos/TarjetaDestino';
import { EsqueletoTarjetas } from '../components/ui/Esqueletos';
import EstadoError from '../components/ui/EstadoError';
import EstadoVacio from '../components/ui/EstadoVacio';
import Segmentado from '../components/ui/Segmentado';

const ORDENES = {
  sugeridos: { texto: 'Sugeridos', comparar: () => 0 },
  precio: { texto: 'Menor precio', comparar: (a, b) => (a.precioDesde ?? Infinity) - (b.precioDesde ?? Infinity) },
  nombre: { texto: 'Nombre (A-Z)', comparar: (a, b) => a.nombre.localeCompare(b.nombre, 'es') },
};

// Normaliza para buscar sin importar tildes ni mayúsculas ("rio" encuentra "Río").
const normalizar = (texto) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default function Inicio() {
  useTitulo('Destinos');
  const { datos: destinos, error, cargando, reintentar } = useDestinos();

  // Filtros "compartibles" en la URL (?continente=Europa&actividad=Playa):
  // se pueden guardar en favoritos y sobreviven al botón Atrás.
  const [params, setParams] = useSearchParams();
  const continente = params.get('continente') ?? 'todos';
  const actividad = params.get('actividad') ?? 'todas';
  // El texto y el orden viven en el estado del componente (useState).
  const [texto, setTexto] = useState('');
  const [orden, setOrden] = useState('sugeridos');

  const cambiarParam = (clave, valor, porDefecto) =>
    setParams(
      (actuales) => {
        const nuevos = new URLSearchParams(actuales);
        if (valor === porDefecto) nuevos.delete(clave);
        else nuevos.set(clave, valor);
        return nuevos;
      },
      { replace: true }
    );

  const continentes = useMemo(() => [...new Set((destinos ?? []).map((d) => d.continente))].sort(), [destinos]);
  const tipos = useMemo(
    () => [...new Set((destinos ?? []).flatMap((d) => d.actividadesPopulares.map((a) => a.tipo)))].sort(),
    [destinos]
  );

  // Filtrar y ordenar en el cliente: instantáneo y sin nuevas peticiones.
  const visibles = useMemo(() => {
    if (!destinos) return [];
    const busqueda = normalizar(texto.trim());
    return destinos
      .filter((d) => continente === 'todos' || d.continente === continente)
      .filter((d) => actividad === 'todas' || d.actividadesPopulares.some((a) => a.tipo === actividad))
      .filter((d) => !busqueda || normalizar(`${d.nombre} ${d.pais} ${d.actividadesPopulares.map((a) => a.nombre).join(' ')}`).includes(busqueda))
      .slice()
      .sort(ORDENES[orden].comparar);
  }, [destinos, texto, continente, actividad, orden]);

  const limpiar = () => {
    setTexto('');
    setParams({}, { replace: true });
  };

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-mar-800 px-6 py-10 text-white sm:px-10 sm:py-14">
        <svg aria-hidden="true" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full opacity-40">
          <circle cx="330" cy="62" r="24" fill="#e76f51" />
          <path d="M0 150 Q 100 120 200 145 T 400 135 V200 H0Z" fill="#0d3b46" />
          <path d="M0 170 Q 120 150 240 172 T 400 165 V200 H0Z" fill="#082830" />
        </svg>
        <div className="relative max-w-2xl space-y-4">
          <p className="rotulo text-mar-100">Viajes desde Santiago · Verano 2026-2027</p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">¿A dónde quieres ir?</h1>
          <p className="text-mar-50 sm:text-lg">Elige un destino, compara vuelos y hoteles con precios y cupos reales, y arma tu viaje.</p>
          <label htmlFor="buscar" className="sr-only">Buscar destino o actividad</label>
          <input
            id="buscar"
            type="search"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Destino, país o actividad (ej.: playa)"
            className="campo max-w-xl border-transparent py-3 text-stone-900"
            autoComplete="off"
          />
        </div>
      </section>

      <section aria-labelledby="titulo-destinos" className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="titulo-destinos" className="text-3xl font-bold">Destinos</h2>
          {destinos && (
            <div className="flex flex-wrap items-center gap-3">
              <label htmlFor="actividad" className="flex items-center gap-2 text-sm text-stone-700">
                Actividad
                <select id="actividad" value={actividad} onChange={(e) => cambiarParam('actividad', e.target.value, 'todas')} className="campo w-auto py-1.5">
                  <option value="todas">Todas</option>
                  {tipos.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
              <label htmlFor="orden" className="flex items-center gap-2 text-sm text-stone-700">
                Orden
                <select id="orden" value={orden} onChange={(e) => setOrden(e.target.value)} className="campo w-auto py-1.5">
                  {Object.entries(ORDENES).map(([valor, { texto: t }]) => <option key={valor} value={valor}>{t}</option>)}
                </select>
              </label>
            </div>
          )}
        </div>

        {destinos && (
          <Segmentado
            etiqueta="Filtrar por continente"
            valor={continente}
            onCambiar={(v) => cambiarParam('continente', v, 'todos')}
            opciones={[{ valor: 'todos', texto: 'Todos' }, ...continentes.map((c) => ({ valor: c, texto: c }))]}
          />
        )}

        {cargando && <EsqueletoTarjetas />}
        {error && <EstadoError error={error} onReintentar={reintentar} />}
        {destinos && (
          <>
            <p className="text-sm text-stone-500" aria-live="polite">
              {visibles.length === destinos.length ? `${destinos.length} destinos` : `${visibles.length} de ${destinos.length} destinos`}
            </p>
            {visibles.length > 0 ? (
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {visibles.map((d) => (
                  <li key={d.id} className="flex"><TarjetaDestino destino={d} /></li>
                ))}
              </ul>
            ) : (
              <EstadoVacio
                titulo="Ningún destino coincide"
                accion={<button type="button" className="btn-oscuro" onClick={limpiar}>Limpiar filtros</button>}
              >
                Prueba con otra palabra o quita alguno de los filtros.
              </EstadoVacio>
            )}
          </>
        )}
      </section>
    </div>
  );
}
