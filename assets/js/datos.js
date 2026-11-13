// Módulo de datos: se encarga únicamente de traer datos desde una URL.
// No conoce las rutas: cada módulo le pasa la que necesita (ver config.js).

async function obtenerDatos(url, nombre) {
  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error(`No se pudieron cargar los ${nombre} (HTTP ${respuesta.status})`);
  }

  return respuesta.json();
}

export function obtenerProductos(url) {
  return obtenerDatos(url, "productos");
}

export function obtenerArticulos(url) {
  return obtenerDatos(url, "artículos");
}
