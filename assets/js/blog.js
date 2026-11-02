// Blog — punto de entrada del listado.
// Trae los artículos (datos.js) y los dibuja (render-blog.js).
// Eventos: chips de categoría y buscador por título.

import { obtenerArticulos } from "./datos.js";
import { renderizarArticulos, mostrarError } from "./render-blog.js";
import { actualizarContadorHeader } from "./agregar.js";

const grilla = document.getElementById("grilla-blog");
const contenedorChips = document.getElementById("blog-categorias");
const formBuscador = document.getElementById("form-blog");
const inputBuscar = document.getElementById("blog-buscar");
const contador = document.getElementById("blog-contador");

let articulos = [];
let categoriaActual = "Todos";

function filtrarArticulos() {
  const texto = inputBuscar.value.trim().toLowerCase();

  return articulos.filter((a) => {
    const cumpleCategoria = categoriaActual === "Todos" || a.categoria === categoriaActual;
    const cumpleTexto = !texto || a.titulo.toLowerCase().includes(texto);
    return cumpleCategoria && cumpleTexto;
  });
}

function actualizarVista() {
  const filtrados = filtrarArticulos();
  renderizarArticulos(filtrados, grilla);
  contador.textContent = `${filtrados.length} de ${articulos.length} artículos`;
}

function crearChips() {
  const categorias = ["Todos", ...new Set(articulos.map((a) => a.categoria))];

  contenedorChips.innerHTML = categorias
    .map(
      (c) =>
        `<button class="chip ${c === categoriaActual ? "chip--activo" : ""}" type="button" data-categoria="${c}" aria-pressed="${c === categoriaActual}">${c}</button>`
    )
    .join("");
}

function inicializarEventos() {
  // Evento: click en una categoría
  contenedorChips.addEventListener("click", (evento) => {
    const chip = evento.target.closest(".chip");
    if (!chip) return;

    categoriaActual = chip.dataset.categoria;
    crearChips();
    actualizarVista();
  });

  // Evento: escribir en el buscador filtra al instante
  inputBuscar.addEventListener("input", actualizarVista);

  // Evento: Enter en el buscador no recarga la página
  formBuscador.addEventListener("submit", (evento) => evento.preventDefault());
}

async function iniciar() {
  actualizarContadorHeader();

  try {
    articulos = await obtenerArticulos();
    crearChips();
    inicializarEventos();
    actualizarVista();
  } catch (error) {
    mostrarError(grilla);
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", iniciar);
