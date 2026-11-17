// FORMATO de precios, fechas y duraciones.
//
// Compatibilidad entre navegadores: new Date('2026-12-12') se interpreta en
// UTC, así que en Chile (UTC-3) se muestra como el 11 de diciembre. Por eso
// las fechas "AAAA-MM-DD" se arman a mano con new Date(año, mes, día), que
// usa la hora local en todos los navegadores (Chrome, Firefox, Safari y Edge).

const precio = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
const fechaLarga = new Intl.DateTimeFormat('es-CL', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
const fechaCorta = new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short' });

export const formatearPrecio = (valor) => precio.format(valor);

// "2026-12-12" o "2026-12-12T07:40" → Date en hora local.
export function aFecha(iso) {
  const [fecha, hora = '00:00'] = iso.split('T');
  const [a, m, d] = fecha.split('-').map(Number);
  const [h, min] = hora.split(':').map(Number);
  return new Date(a, m - 1, d, h, min);
}

export const formatearFecha = (iso) => fechaLarga.format(aFecha(iso));
export const formatearFechaCorta = (iso) => fechaCorta.format(aFecha(iso));

// La hora se toma tal cual del texto: es la hora local del aeropuerto.
export const formatearHora = (iso) => iso.slice(11, 16);

export function formatearDuracion(minutos) {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

// Días calendario entre dos fechas "AAAA-MM-DD" (sin efecto de horario de verano).
export function diasEntre(desde, hasta) {
  const utc = (iso) => {
    const [a, m, d] = iso.slice(0, 10).split('-').map(Number);
    return Date.UTC(a, m - 1, d);
  };
  return Math.round((utc(hasta) - utc(desde)) / 86_400_000);
}

export const plural = (n, singular, varios = `${singular}s`) => `${n} ${n === 1 ? singular : varios}`;
