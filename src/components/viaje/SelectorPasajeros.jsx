import { PASAJEROS_MAX, PASAJEROS_MIN } from '../../utils/viaje';

// Contador de pasajeros con botones − / +. Se usan botones en vez de las
// flechas del <input type="number">, que cada navegador dibuja distinto.
export default function SelectorPasajeros({ valor, onCambiar }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span id="rotulo-pasajeros" className="text-sm font-medium">Pasajeros</span>
      <div role="group" aria-labelledby="rotulo-pasajeros" className="inline-flex items-center rounded-lg border border-stone-300 bg-white">
        <button type="button" className="h-10 w-10 text-lg font-bold text-mar-700 disabled:text-stone-300" onClick={() => onCambiar(valor - 1)} disabled={valor <= PASAJEROS_MIN} aria-label="Quitar un pasajero">−</button>
        <output aria-live="polite" className="w-8 text-center font-semibold tabular-nums">{valor}</output>
        <button type="button" className="h-10 w-10 text-lg font-bold text-mar-700 disabled:text-stone-300" onClick={() => onCambiar(valor + 1)} disabled={valor >= PASAJEROS_MAX} aria-label="Agregar un pasajero">+</button>
      </div>
    </div>
  );
}
