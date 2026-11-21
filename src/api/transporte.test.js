// Respaldo automático: si el Service Worker deja de interceptar (le pasó a
// Firefox al recargar), la petición se repite con la API simulada en memoria.
import { describe, expect, it, vi } from 'vitest';
import { CABECERA_MOCK } from '../config';
import { configurarRespaldo, fetchConTiempo, usarTransporte } from './transporte';

const simulada = (cuerpo) => new Response(JSON.stringify(cuerpo), { headers: { [CABECERA_MOCK]: '1' } });
// Lo que entrega GitHub Pages cuando la petición no pasa por el mock: una página HTML.
const paginaHTML = () => new Response('<!doctype html><title>404</title>', { status: 404, headers: { 'Content-Type': 'text/html' } });

describe('transporte con respaldo', () => {
  it('usa la respuesta simulada tal cual cuando el Service Worker responde', async () => {
    const respaldo = vi.fn();
    usarTransporte(async () => simulada({ ok: true }));
    configurarRespaldo(respaldo);
    const respuesta = await fetchConTiempo('/api/destinos');
    expect(await respuesta.json()).toEqual({ ok: true });
    expect(respaldo).not.toHaveBeenCalled();
  });

  it('pasa al modo en memoria UNA vez y repite las peticiones que no fueron simuladas', async () => {
    usarTransporte(async () => paginaHTML());
    const respaldo = vi.fn(async () => usarTransporte(async () => simulada({ desde: 'memoria' })));
    configurarRespaldo(respaldo);

    const [a, b] = await Promise.all([fetchConTiempo('/api/destinos'), fetchConTiempo('/graphql', { method: 'POST', body: '{}' })]);
    expect(await a.json()).toEqual({ desde: 'memoria' });
    expect(await b.json()).toEqual({ desde: 'memoria' });
    expect(respaldo).toHaveBeenCalledTimes(1);
  });
});
