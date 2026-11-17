// useApi: consulta REST con useState + useEffect.
//
//   const { datos, error, cargando, reintentar } = useApi('destinos', obtenerDestinos);
//
// - useState guarda el resultado y la clave a la que pertenece.
// - useEffect lanza la petición cada vez que cambia la clave (o al reintentar)
//   e ignora la respuesta si el usuario ya se fue a otra página.
// - Una caché en memoria (5 min) evita repetir peticiones al volver atrás, y
//   las peticiones iguales que están en camino se comparten (StrictMode, menú
//   y página pidiendo lo mismo a la vez).
import { useEffect, useRef, useState } from 'react';

const TTL_MS = 5 * 60 * 1000;
const cache = new Map(); //   clave → { datos, guardado }
const enCurso = new Map(); // clave → Promise

function leerCache(clave) {
  const entrada = cache.get(clave);
  return entrada && Date.now() - entrada.guardado < TTL_MS ? entrada.datos : undefined;
}

function pedir(clave, buscador) {
  if (!enCurso.has(clave)) {
    const promesa = buscador()
      .then((datos) => {
        cache.set(clave, { datos, guardado: Date.now() });
        return datos;
      })
      .finally(() => enCurso.delete(clave));
    enCurso.set(clave, promesa);
  }
  return enCurso.get(clave);
}

export function limpiarCacheREST() {
  cache.clear();
}

const estadoInicial = (clave) => {
  const datos = leerCache(clave);
  return { clave, datos: datos ?? null, error: null, cargando: datos === undefined };
};

export function useApi(clave, buscador) {
  const [estado, setEstado] = useState(() => estadoInicial(clave));
  const [intento, setIntento] = useState(0);

  // El buscador puede ser una función nueva en cada render: se guarda en una
  // ref para no relanzar la petición por eso.
  const buscadorRef = useRef(buscador);
  useEffect(() => {
    buscadorRef.current = buscador;
  });

  useEffect(() => {
    // Datos frescos en caché: no hace falta ir al servidor.
    if (intento === 0 && leerCache(clave) !== undefined) {
      setEstado(estadoInicial(clave));
      return undefined;
    }

    let vigente = true; // false cuando el componente cambia de clave o se desmonta
    setEstado({ clave, datos: null, error: null, cargando: true });

    pedir(clave, () => buscadorRef.current())
      .then((datos) => vigente && setEstado({ clave, datos, error: null, cargando: false }))
      .catch((error) => vigente && setEstado({ clave, datos: null, error, cargando: false }));

    return () => {
      vigente = false;
    };
  }, [clave, intento]);

  // Durante el render en que cambió la clave, el estado aún es de la anterior:
  // se muestra el estado inicial de la nueva clave para no mezclar datos.
  const actual = estado.clave === clave ? estado : estadoInicial(clave);
  return { ...actual, reintentar: () => setIntento((n) => n + 1) };
}
