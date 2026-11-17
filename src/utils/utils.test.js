import { describe, expect, it } from 'vitest';
import { aFecha, diasEntre, formatearDuracion, formatearHora, formatearPrecio } from './formato';
import { cotizar, habitacionesPara, hotelCubreVuelo, revisarViaje } from './viaje';

const vuelo = { precio: 300000, llegada: '2026-12-12T12:25', regreso: '2026-12-20', asientosDisponibles: 3 };
const hotel = { precioNoche: 50000, disponibleDesde: '2026-12-01', disponibleHasta: '2027-03-15', habitacionesDisponibles: 2 };

describe('formato', () => {
  it('lee "AAAA-MM-DD" como fecha local, sin correrse un día', () => {
    const fecha = aFecha('2026-12-12');
    expect([fecha.getFullYear(), fecha.getMonth(), fecha.getDate()]).toEqual([2026, 11, 12]);
  });
  it('formatea precio, hora y duración', () => {
    expect(formatearPrecio(1490000).replace(/\s/g, '')).toBe('$1.490.000');
    expect(formatearHora('2027-01-09T22:30')).toBe('22:30');
    expect(formatearDuracion(285)).toBe('4 h 45 min');
    expect(formatearDuracion(120)).toBe('2 h');
  });
  it('cuenta días entre fechas, también cruzando de año', () => {
    expect(diasEntre('2026-12-28', '2027-01-04')).toBe(7);
    expect(diasEntre('2026-12-12T12:25', '2026-12-20')).toBe(8);
  });
});

describe('cotización y validación del viaje', () => {
  it('calcula noches, habitaciones y total', () => {
    expect(habitacionesPara(3)).toBe(2);
    expect(cotizar({ vuelo, hotel, pasajeros: 3 })).toEqual({
      pasajeros: 3, habitaciones: 2, noches: 8,
      totalVuelos: 900000, totalHotel: 800000, total: 1700000,
    });
  });
  it('sin problemas cuando hay cupos y fechas compatibles', () => {
    expect(revisarViaje({ vuelo, hotel, pasajeros: 3 })).toEqual([]);
  });
  it('detecta falta de asientos, de habitaciones y fechas incompatibles', () => {
    const problemas = revisarViaje({ vuelo, hotel: { ...hotel, disponibleHasta: '2026-12-15' }, pasajeros: 6 });
    expect(problemas).toHaveLength(3);
    expect(problemas[0]).toContain('3 asientos');
    expect(problemas[1]).toContain('necesitas 3');
    expect(hotelCubreVuelo({ ...hotel, disponibleHasta: '2026-12-15' }, vuelo)).toBe(false);
  });
});
