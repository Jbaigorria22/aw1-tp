// Módulo compartido por las páginas con tarjetas/fichas de producto:
// mantiene el contador del header y maneja los botones "Agregar al carrito".

import { agregarAlCarrito, leerCarrito, contarProductos } from "./funciones-carrito.js";

export function actualizarContadorHeader() {
  const total = contarProductos(leerCarrito());
  const contador = document.querySelector(".carrito-icono__contador");
  const icono = document.querySelector(".carrito-icono");

  if (contador) contador.textContent = total;
  if (icono) icono.setAttribute("aria-label", `Ver carrito (${total} productos)`);
}

function avisarAgregado(boton) {
  const textoOriginal = boton.dataset.textoOriginal || boton.textContent;
  boton.dataset.textoOriginal = textoOriginal;
  boton.textContent = "¡Agregado!";
  setTimeout(() => {
    boton.textContent = textoOriginal;
  }, 1200);
}

// Delegación de eventos: un solo listener sirve para todas las tarjetas,
// incluso las que se dibujan después (filtros, orden, búsqueda).
export function escucharBotonesAgregar(contenedor) {
  contenedor.addEventListener("click", (evento) => {
    const boton = evento.target.closest(".boton-agregar");
    if (!boton) return;

    agregarAlCarrito(parseInt(boton.dataset.id));
    actualizarContadorHeader();
    avisarAgregado(boton);
  });
}
