import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useViaje } from '../context/ViajeContext';
import { hotelCubreVuelo } from '../utils/viaje';
import TarjetaHotel from '../components/opciones/TarjetaHotel';
import BarraLista from '../components/opciones/BarraLista';
import Interruptor from '../components/ui/Interruptor';
import { EsqueletoLista } from '../components/ui/Esqueletos';
import EstadoError from '../components/ui/EstadoError';
import EstadoVacio from '../components/ui/EstadoVacio';

const ORDENES = [
  { valor: 'precio', texto: 'Menor precio', comparar: (a, b) => a.precioNoche - b.precioNoche },
  { valor: 'calificacion', texto: 'Mejor calificación', comparar: (a, b) => b.calificacion - a.calificacion },
  { valor: 'estrellas', texto: 'Más estrellas', comparar: (a, b) => b.estrellas - a.estrellas },
];

// /destinos/:id/hoteles
export default function HotelesDestino() {
  const { destino, vuelos, hoteles, cargando, error, reintentar } = useOutletContext();
  const { viaje, elegirHotel, quitarHotel } = useViaje();
  const [orden, setOrden] = useState('precio');
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const [soloCompatibles, setSoloCompatibles] = useState(false);

  // El vuelo elegido (si es de este destino) sirve para revisar fechas.
  const vueloElegido = viaje.destinoId === destino.id ? vuelos?.find((v) => v.id === viaje.vueloId) ?? null : null;

  const visibles = useMemo(() => {
    if (!hoteles) return [];
    const { comparar } = ORDENES.find((o) => o.valor === orden);
    return hoteles
      .filter((h) => !soloDisponibles || h.disponible)
      .filter((h) => !soloCompatibles || hotelCubreVuelo(h, vueloElegido))
      .slice()
      .sort(comparar);
  }, [hoteles, orden, soloDisponibles, soloCompatibles, vueloElegido]);

  if (cargando && !hoteles) return <EsqueletoLista etiqueta="Cargando hoteles" />;
  if (error) return <EstadoError error={error} onReintentar={reintentar} compacto />;

  const otroDestino = viaje.destinoId && viaje.destinoId !== destino.id;

  return (
    <div className="space-y-4">
      <BarraLista
        id="orden-hoteles"
        orden={orden}
        opcionesOrden={ORDENES}
        onOrden={setOrden}
        soloDisponibles={soloDisponibles}
        onSoloDisponibles={setSoloDisponibles}
        mostrando={visibles.length}
        total={hoteles.length}
      >
        {vueloElegido && <Interruptor etiqueta="Para las fechas de mi vuelo" activo={soloCompatibles} onCambiar={setSoloCompatibles} />}
      </BarraLista>
      {otroDestino && (
        <p className="rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-800">
          Tu viaje actual es a {viaje.destinoNombre}. Si eliges un hotel aquí, empezarás un viaje nuevo a {destino.nombre}.
        </p>
      )}
      {visibles.length ? (
        <ul className="space-y-3">
          {visibles.map((h) => (
            <li key={h.id}>
              <TarjetaHotel
                hotel={h}
                vueloElegido={vueloElegido}
                elegido={viaje.hotelId === h.id}
                otroDestino={otroDestino}
                onElegir={() => elegirHotel(h, destino.nombre)}
                onQuitar={quitarHotel}
              />
            </li>
          ))}
        </ul>
      ) : (
        <EstadoVacio titulo="No hay hoteles con esos filtros">Desactiva algún filtro para ver más opciones.</EstadoVacio>
      )}
    </div>
  );
}
