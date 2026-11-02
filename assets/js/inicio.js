// Inicio — punto de entrada.
// Dibuja los productos destacados reutilizando la tarjeta de render.js.

import { obtenerProductos } from "./datos.js";
import { crearTarjetaProducto } from "./render.js";
import { actualizarContadorHeader, escucharBotonesAgregar } from "./agregar.js";

const grilla = document.getElementById("grilla-destacados");
const CANTIDAD_DESTACADOS = 4;

async function iniciar() {
  actualizarContadorHeader();
  escucharBotonesAgregar(grilla);

  try {
    const productos = await obtenerProductos();
    productos
      .filter((p) => p.stock.estado !== "sin-stock")
      .slice(0, CANTIDAD_DESTACADOS)
      .forEach((p) => grilla.appendChild(crearTarjetaProducto(p)));
  } catch (error) {
    grilla.innerHTML = `<p class="catalogo__error">No se pudieron cargar los productos. Intentá de nuevo más tarde.</p>`;
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", iniciar);
