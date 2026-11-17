import { Link } from 'react-router-dom';

// Un mensaje distinto para cada tipo de falla: el usuario entiende QUÉ pasó
// y QUÉ puede hacer, en vez de un genérico "Ocurrió un error".
const MENSAJES = {
  'no-encontrado': { titulo: 'No encontramos lo que buscas', ayuda: 'Puede que el enlace esté mal escrito o que el destino ya no exista.' },
  servidor: { titulo: 'El servidor tuvo un problema', ayuda: 'No es un problema de tu equipo. Suele resolverse en unos segundos.' },
  red: { titulo: 'Sin conexión con el servidor', ayuda: 'Revisa tu conexión a internet y vuelve a intentarlo.' },
  tiempo: { titulo: 'El servidor está tardando demasiado', ayuda: 'Puede estar saturado. Vuelve a intentarlo en un momento.' },
  consulta: { titulo: 'La consulta no es válida', ayuda: 'El servidor rechazó la consulta GraphQL.' },
};
const GENERICO = { titulo: 'Algo salió mal', ayuda: 'Vuelve a intentarlo en un momento.' };

/**
 * error          ApiError (REST o GraphQL)
 * onReintentar   acción para volver a consultar (no se ofrece en un 404)
 * compacto       versión para una sección de la página
 */
export default function EstadoError({ error, onReintentar, compacto = false }) {
  const { titulo, ayuda } = MENSAJES[error.tipo] ?? GENERICO;
  const tecnico = [error.status && `código ${error.status}`, error.intentos > 1 && `${error.intentos} intentos`].filter(Boolean).join(' · ');

  return (
    <section role="alert" className={`tarjeta mx-auto space-y-3 text-center ${compacto ? 'p-6' : 'max-w-xl p-6 sm:p-8'}`}>
      <p aria-hidden="true" className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-coral-50 text-xl font-bold text-coral-600">!</p>
      <h2 className="text-2xl font-bold">{titulo}</h2>
      <p className="text-stone-700">{error.message}</p>
      <p className="text-sm text-stone-500">{ayuda}</p>
      {tecnico && <p className="text-xs text-stone-400">Detalle técnico: {tecnico}</p>}
      <div className="flex flex-wrap justify-center gap-2 pt-2">
        {error.tipo !== 'no-encontrado' && onReintentar && (
          <button type="button" className="btn-oscuro" onClick={onReintentar}>Reintentar</button>
        )}
        <Link to="/" className="btn-secundario">Ver todos los destinos</Link>
      </div>
    </section>
  );
}
