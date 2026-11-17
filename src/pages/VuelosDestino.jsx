import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useViaje } from '../context/ViajeContext';
import TarjetaVuelo from '../components/opciones/TarjetaVuelo';
import BarraLista from '../components/opciones/BarraLista';
import { EsqueletoLista } from '../components/ui/Esqueletos';
import EstadoError from '../components/ui/EstadoError';
import EstadoVacio from '../components/ui/EstadoVacio';

const ORDENES = [
  { valor: 'precio', texto: 'Menor precio', comparar: (a, b) => a.precio - b.precio },
  { valor: 'salida', texto: 'Fecha de salida', comparar: (a, b) => a.salida.localeCompare(b.salida) },
  { valor: 'duracion', texto: 'Menor duración', comparar: (a, b) => a.duracionMin - b.duracionMin },
];

// /destinos/:id/vuelos
export default function VuelosDestino() {
  const { destino, vuelos, cargando, error, reintentar } = useOutletContext();
  const { viaje, elegirVuelo, quitarVuelo } = useViaje();
  const [orden, setOrden] = useState('precio');
  const [soloDisponibles, setSoloDisponibles] = useState(false);

  const visibles = useMemo(() => {
    if (!vuelos) return [];
    const { comparar } = ORDENES.find((o) => o.valor === orden);
    return vuelos.filter((v) => !soloDisponibles || v.disponible).slice().sort(comparar);
  }, [vuelos, orden, soloDisponibles]);

  if (cargando && !vuelos) return <EsqueletoLista etiqueta="Cargando vuelos" />;
  if (error) return <EstadoError error={error} onReintentar={reintentar} compacto />;

  const otroDestino = viaje.destinoId && viaje.destinoId !== destino.id;

  return (
    <div className="space-y-4">
      <BarraLista
        id="orden-vuelos"
        orden={orden}
        opcionesOrden={ORDENES}
        onOrden={setOrden}
        soloDisponibles={soloDisponibles}
        onSoloDisponibles={setSoloDisponibles}
        mostrando={visibles.length}
        total={vuelos.length}
      />
      {otroDestino && (
        <p className="rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-800">
          Tu viaje actual es a {viaje.destinoNombre}. Si eliges un vuelo aquí, empezarás un viaje nuevo a {destino.nombre}.
        </p>
      )}
      {visibles.length ? (
        <ul className="space-y-3">
          {visibles.map((v) => (
            <li key={v.id}>
              <TarjetaVuelo
                vuelo={v}
                elegido={viaje.vueloId === v.id}
                otroDestino={otroDestino}
                onElegir={() => elegirVuelo(v, destino.nombre)}
                onQuitar={quitarVuelo}
              />
            </li>
          ))}
        </ul>
      ) : (
        <EstadoVacio titulo="No hay vuelos con cupos">Desactiva el filtro para ver también los vuelos agotados.</EstadoVacio>
      )}
    </div>
  );
}
