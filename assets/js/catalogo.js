// Catálogo — punto de entrada.
// Trae los productos (datos.js), aplica filtros/orden (filtros.js)
// y los dibuja en pantalla (render.js). Acá viven los eventos JS:
// buscador, checkboxes de filtro, select de orden y botón limpiar.

import { obtenerProductos } from "./datos.js";
import { renderizarProductos, mostrarError } from "./render.js";
import { filtrarProductos, ordenarProductos } from "./filtros.js";

let productos = [];

const grilla = document.getElementById("grilla-productos");
const formFiltros = document.getElementById("form-filtros");
const formBuscador = document.getElementById("form-buscador");
const inputBuscar = document.getElementById("buscar");
const selectOrden = document.getElementById("orden-select");
const contadorResultados = document.getElementById("contador-resultados");
const contadorTotal = document.getElementById("contador-total");

let busquedaActual = "";

function leerFiltrosSeleccionados() {
  const atributos = [...formFiltros.querySelectorAll('input[name="attr"]:checked')].map(
    (el) => el.value
  );
  const categorias = [...formFiltros.querySelectorAll('input[name="cat"]:checked')].map(
    (el) => el.value
  );
  const soloConStock = formFiltros.querySelector('input[name="stock"]').checked;

  return { atributos, categorias, soloConStock, busqueda: busquedaActual };
}

function actualizarVista() {
  const filtrados = filtrarProductos(productos, leerFiltrosSeleccionados());
  const ordenados = ordenarProductos(filtrados, selectOrden.value);

  renderizarProductos(ordenados, grilla);
  contadorResultados.textContent = ordenados.length;
  contadorTotal.textContent = productos.length;
}

function inicializarEventos() {
  // Evento: tildar/destildar cualquier checkbox de filtro re-renderiza
  formFiltros.addEventListener("change", actualizarVista);

  // Evento: "Limpiar filtros" resetea el form y vuelve a renderizar
  formFiltros.addEventListener("reset", () => {
    busquedaActual = "";
    inputBuscar.value = "";
    // el reset nativo todavía no terminó de aplicarse cuando se dispara
    // este evento, por eso esperamos al siguiente ciclo
    setTimeout(actualizarVista, 0);
  });

  // Evento: buscar por nombre sin recargar la página
  formBuscador.addEventListener("submit", (evento) => {
    evento.preventDefault();
    busquedaActual = inputBuscar.value.trim();
    actualizarVista();
  });

  // Evento: cambiar el criterio de orden
  selectOrden.addEventListener("change", actualizarVista);
}

async function iniciar() {
  try {
    productos = await obtenerProductos();
    inicializarEventos();
    actualizarVista();
  } catch (error) {
    mostrarError(grilla);
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", iniciar);
