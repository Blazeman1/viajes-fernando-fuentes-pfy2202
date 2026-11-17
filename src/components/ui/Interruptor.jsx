// Casilla con apariencia de interruptor. Es un <input type="checkbox"> real:
// funciona con teclado y lector de pantalla en todos los navegadores.
export default function Interruptor({ etiqueta, activo, onCambiar }) {
  return (
    <label className="inline-flex cursor-pointer select-none items-center gap-2.5 text-sm text-stone-700">
      <input type="checkbox" className="peer sr-only" checked={activo} onChange={(e) => onCambiar(e.target.checked)} />
      <span
        aria-hidden="true"
        className="relative h-6 w-10 rounded-full bg-stone-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-mar-600 peer-checked:after:translate-x-4 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-coral-500"
      />
      {etiqueta}
    </label>
  );
}
