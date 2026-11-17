// LÓGICA DEL VIAJE: funciones puras (sin React) para cotizar y validar la
// combinación de vuelo y hotel. Se prueban por separado en viaje.test.js.
import { diasEntre, formatearFecha, plural } from './formato';

export const PASAJEROS_MIN = 1;
export const PASAJEROS_MAX = 6;

// Habitaciones dobles necesarias.
export const habitacionesPara = (pasajeros) => Math.ceil(pasajeros / 2);

// Noches de hotel: desde el día en que llega el vuelo hasta el día del regreso.
export const nochesDelVuelo = (vuelo) => diasEntre(vuelo.llegada, vuelo.regreso);

export function cotizar({ vuelo, hotel, pasajeros }) {
  const habitaciones = habitacionesPara(pasajeros);
  const noches = vuelo ? nochesDelVuelo(vuelo) : null;
  const totalVuelos = vuelo ? vuelo.precio * pasajeros : 0;
  // Sin vuelo no hay fechas: se cotiza una noche como referencia.
  const totalHotel = hotel ? hotel.precioNoche * habitaciones * (noches ?? 1) : 0;
  return { pasajeros, habitaciones, noches, totalVuelos, totalHotel, total: totalVuelos + totalHotel };
}

// Problemas que impiden reservar la combinación elegida (lista vacía = todo bien).
export function revisarViaje({ vuelo, hotel, pasajeros }) {
  const problemas = [];
  if (vuelo && vuelo.asientosDisponibles < pasajeros) {
    problemas.push(
      vuelo.asientosDisponibles === 0
        ? 'El vuelo elegido ya no tiene asientos disponibles.'
        : `El vuelo solo tiene ${plural(vuelo.asientosDisponibles, 'asiento disponible', 'asientos disponibles')} para ${plural(pasajeros, 'pasajero')}.`
    );
  }
  const habitaciones = habitacionesPara(pasajeros);
  if (hotel && hotel.habitacionesDisponibles < habitaciones) {
    problemas.push(
      hotel.habitacionesDisponibles === 0
        ? 'El hotel elegido no tiene habitaciones disponibles.'
        : `El hotel solo tiene ${plural(hotel.habitacionesDisponibles, 'habitación disponible', 'habitaciones disponibles')} y necesitas ${habitaciones}.`
    );
  }
  if (vuelo && hotel) {
    const llegada = vuelo.llegada.slice(0, 10);
    if (llegada < hotel.disponibleDesde || vuelo.regreso > hotel.disponibleHasta) {
      problemas.push(
        `El hotel recibe huéspedes del ${formatearFecha(hotel.disponibleDesde)} al ${formatearFecha(hotel.disponibleHasta)}, y tu estadía va del ${formatearFecha(llegada)} al ${formatearFecha(vuelo.regreso)}.`
      );
    }
  }
  return problemas;
}

// ¿El hotel sirve para las fechas del vuelo? (para marcarlo en la lista)
export function hotelCubreVuelo(hotel, vuelo) {
  if (!vuelo) return true;
  return vuelo.llegada.slice(0, 10) >= hotel.disponibleDesde && vuelo.regreso <= hotel.disponibleHasta;
}
