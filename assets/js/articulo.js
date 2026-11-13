// Artículo del blog — punto de entrada.
// Lee el id de la URL (blog-articulo.html?id=2), dibuja la nota y
// muestra los productos del catálogo relacionados con "Agregar al carrito".

import { obtenerArticulos, obtenerProductos } from "./datos.js";
import { URL_ARTICULOS, URL_PRODUCTOS } from "./config.js";
import { renderizarDetalleArticulo } from "./render-blog.js";
import { crearTarjetaProducto } from "./render.js";
import { actualizarContadorHeader, escucharBotonesAgregar } from "./agregar.js";

const detalle = document.getElementById("detalle-articulo");
const migaArticulo = document.getElementById("miga-articulo");
const seccionProductos = document.getElementById("seccion-productos");
const grillaProductos = document.getElementById("grilla-productos-nota");

function leerIdDeLaUrl() {
  return parseInt(new URLSearchParams(window.location.search).get("id"));
}

async function iniciar() {
  actualizarContadorHeader();
  escucharBotonesAgregar(grillaProductos);

  try {
    const [articulos, productos] = await Promise.all([obtenerArticulos(URL_ARTICULOS), obtenerProductos(URL_PRODUCTOS)]);
    const articulo = articulos.find((a) => a.id === leerIdDeLaUrl());

    if (!articulo) {
      detalle.innerHTML = `
        <div class="carrito__vacio">
          <h1>No encontramos ese artículo</h1>
          <a class="btn btn--primario" href="blog.html">Volver al blog</a>
        </div>`;
      seccionProductos.hidden = true;
      return;
    }

    document.title = `${articulo.titulo} | Nutrite`;
    migaArticulo.textContent = articulo.titulo;
    renderizarDetalleArticulo(articulo, detalle);

    articulo.productos
      .map((id) => productos.find((p) => p.id === id))
      .filter(Boolean)
      .forEach((p) => grillaProductos.appendChild(crearTarjetaProducto(p)));
  } catch (error) {
    detalle.innerHTML = `<p class="catalogo__error">No se pudo cargar el artículo. Intentá de nuevo más tarde.</p>`;
    console.error(error);
  }
}

iniciar();
