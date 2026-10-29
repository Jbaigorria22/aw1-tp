// Módulo de datos: se encarga únicamente de traer los productos.
// El resto del código (render, filtros) no sabe ni le importa de
// dónde salen los datos; solo le pide a este módulo la lista.

const URL_PRODUCTOS = "assets/data/productos.json";

export async function obtenerProductos() {
  const respuesta = await fetch(URL_PRODUCTOS);

  if (!respuesta.ok) {
    throw new Error(`No se pudieron cargar los productos (HTTP ${respuesta.status})`);
  }

  return respuesta.json();
}
