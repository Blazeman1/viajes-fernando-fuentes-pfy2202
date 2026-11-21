import { useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useViaje } from '../../context/ViajeContext';
import { MOCK_ACTIVO, estadoMock } from '../../config';
import Aviso from './Aviso';
import PanelSimulador from './PanelSimulador';

const claseEnlace = ({ isActive }) =>
  `relative inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
    isActive ? 'bg-white text-mar-800' : 'text-mar-50 hover:bg-mar-700'
  }`;

export default function Layout() {
  const { pathname } = useLocation();
  const { elementos } = useViaje();
  const mainRef = useRef(null);
  const rutaAnterior = useRef(pathname);

  // Al cambiar de página: arriba y foco en el contenido nuevo (accesibilidad).
  // Cambiar solo de pestaña (vuelos ↔ hoteles) no mueve el scroll.
  useEffect(() => {
    const seccion = (ruta) => ruta.split('/').slice(0, 3).join('/');
    if (seccion(rutaAnterior.current) !== seccion(pathname)) {
      window.scrollTo(0, 0);
      mainRef.current?.focus({ preventScroll: true });
    }
    rutaAnterior.current = pathname;
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#contenido" className="absolute -left-[999px] top-2 z-50 rounded bg-mar-800 px-4 py-2 text-white focus:left-4">
        Saltar al contenido
      </a>

      <header className="sticky top-0 z-30 bg-mar-800 text-white shadow">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="inline-flex items-center gap-3">
            <svg aria-hidden="true" viewBox="0 0 32 32" className="h-9 w-9 shrink-0">
              <rect width="32" height="32" rx="8" fill="#0d3b46" />
              <circle cx="16" cy="19" r="6" fill="#e76f51" />
              <path d="M5 22h22" stroke="#fcfaf6" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M8 26h16" stroke="#fcfaf6" strokeWidth="2" strokeLinecap="round" opacity=".7" />
            </svg>
            <span className="leading-tight">
              <strong className="block font-display text-xl">Rumbo Sur</strong>
              <small className="hidden text-mar-100 sm:block">Agencia de viajes</small>
            </span>
          </Link>
          <nav aria-label="Principal">
            <ul className="flex items-center gap-1">
              <li><NavLink to="/" end className={claseEnlace}>Destinos</NavLink></li>
              <li>
                <NavLink to="/mi-viaje" className={claseEnlace}>
                  Mi viaje
                  {elementos > 0 && (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-coral-500 px-1 text-xs font-bold text-white">
                      <span className="sr-only">(</span>{elementos}<span className="sr-only"> elegidos)</span>
                    </span>
                  )}
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {estadoMock.modo === 'memoria' && (
        <p className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs text-amber-800">
          El Service Worker de la API simulada no está disponible en esta carga (pasa en ventanas privadas y, en Firefox, a veces al recargar). La app sigue funcionando con la API simulada en memoria.
        </p>
      )}

      <Aviso />

      <main id="contenido" ref={mainRef} tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-6 focus:outline-none sm:pt-8">
        <Outlet />
      </main>

      <footer className="border-t border-arena-200 px-4 py-6 text-center text-sm text-stone-500">
        © {new Date().getFullYear()} Rumbo Sur · Proyecto académico PFY2202 · Destinos por API REST y vuelos y hoteles por API GraphQL, simuladas con MSW
      </footer>

      {MOCK_ACTIVO && <PanelSimulador />}
    </div>
  );
}
