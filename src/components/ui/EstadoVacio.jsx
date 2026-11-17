// Mensaje cuando una lista no tiene resultados, con una acción para salir de ahí.
export default function EstadoVacio({ titulo, children, accion }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-arena-300 px-6 py-12 text-center">
      <p className="font-display text-xl font-bold">{titulo}</p>
      {children && <p className="mx-auto mt-2 max-w-md text-stone-600">{children}</p>}
      {accion && <div className="mt-5">{accion}</div>}
    </div>
  );
}
