import { Link } from 'react-router-dom';
import { useTitulo } from '../hooks/useTitulo';

export default function NoEncontrado() {
  useTitulo('Página no encontrada');
  return (
    <section className="mx-auto max-w-lg space-y-4 py-12 text-center">
      <p className="font-display text-7xl font-black text-coral-500">404</p>
      <h1 className="text-3xl font-bold">Esta ruta no lleva a ningún destino</h1>
      <p className="text-stone-600">La página que buscas no existe o cambió de dirección.</p>
      <Link to="/" className="btn-primario">Ver destinos</Link>
    </section>
  );
}
