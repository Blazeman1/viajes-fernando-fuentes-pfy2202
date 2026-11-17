// "Postal" ilustrada del destino, dibujada con CSS y SVG: no depende de
// imágenes externas y se ve igual en todos los navegadores. (Se evitan los
// emojis de banderas: Windows no los dibuja y muestra solo dos letras.)
const PALETAS = {
  'América del Sur': ['#124e5c', '#2a9d8f'],
  'América del Norte': ['#9c3f27', '#e76f51'],
  Europa: ['#3d405b', '#7d6b9e'],
  Asia: ['#7a2e3a', '#d1495b'],
  Oceanía: ['#0d3b46', '#1f7a8c'],
};

// Posición del sol distinta para cada destino, siempre la misma.
const semilla = (texto) => [...texto].reduce((acc, c) => acc + c.charCodeAt(0), 0);

export default function PostalDestino({ destino, grande = false }) {
  const [desde, hasta] = PALETAS[destino.continente] ?? PALETAS['América del Sur'];
  const n = semilla(destino.id);
  const sol = { right: `${8 + (n % 30)}%`, top: `${10 + (n % 14)}%` };

  return (
    <div
      className={`relative isolate overflow-hidden text-white ${grande ? 'h-56 rounded-2xl sm:h-72' : 'h-36'}`}
      style={{ backgroundImage: `linear-gradient(135deg, ${desde}, ${hasta})` }}
    >
      <span
        aria-hidden="true"
        className={`absolute -z-10 rounded-full bg-[#fcd9a8]/50 ${grande ? 'h-24 w-24 sm:h-32 sm:w-32' : 'h-12 w-12'}`}
        style={sol}
      />
      <svg aria-hidden="true" viewBox="0 0 100 60" preserveAspectRatio="none" className="absolute inset-0 -z-10 h-full w-full">
        <path d="M0 46 Q 25 38 50 45 T 100 42 V60 H0Z" fill="#000" opacity="0.12" />
        <path d="M0 52 Q 30 46 60 52 T 100 50 V60 H0Z" fill="#000" opacity="0.14" />
      </svg>
      <span
        aria-hidden="true"
        className={`absolute -right-2 font-display font-black leading-none tracking-tight text-white/15 ${grande ? '-bottom-6 text-[9rem] sm:text-[11rem]' : '-bottom-3 text-7xl'}`}
      >
        {destino.aeropuerto}
      </span>
      <div className={`absolute ${grande ? 'bottom-6 left-6 sm:bottom-8 sm:left-8' : 'bottom-4 left-5'}`}>
        <p className={`font-semibold uppercase tracking-widest text-white/80 ${grande ? 'text-sm' : 'text-xs'}`}>{destino.pais}</p>
        <p className={`font-display font-bold leading-tight drop-shadow-sm ${grande ? 'text-4xl sm:text-5xl' : 'text-2xl'}`}>{destino.nombre}</p>
      </div>
    </div>
  );
}
