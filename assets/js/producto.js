// Ficha de producto — punto de entrada.
// Lee el id de la URL (producto.html?id=2), busca el producto en datos.js
// y dibuja la ficha completa. Eventos: miniaturas, cantidad, agregar al
// carrito, calculadora de envío y WhatsApp.

import { obtenerProductos } from "./datos.js";
import { URL_PRODUCTOS } from "./config.js";
import { crearTarjetaProducto, formatearPrecio } from "./render.js";
import { agregarAlCarrito, maximoStock } from "./funciones-carrito.js";
import { actualizarContadorHeader, escucharBotonesAgregar } from "./agregar.js";

const BADGE_CLASES = {
  "Sin TACC": "badge--sin-tacc",
  "Vegano": "badge--vegano",
  "Sin azúcar": "badge--sin-azucar",
  "Integral": "badge--integral",
};

const NUMERO_WHATSAPP = "5493510000000";

const detalle = document.getElementById("detalle-producto");
const migaCategoria = document.getElementById("miga-categoria");
const migaProducto = document.getElementById("miga-producto");
const seccionRelacionados = document.getElementById("seccion-relacionados");
const grillaRelacionados = document.getElementById("grilla-relacionados");

function leerIdDeLaUrl() {
  return parseInt(new URLSearchParams(window.location.search).get("id"));
}

function crearFicha(producto, productos) {
  const sinStock = producto.stock.estado === "sin-stock";
  const maximo = maximoStock(producto);

  const badgesHtml = producto.badges
    .map((b) => `<span class="badge ${BADGE_CLASES[b] || ""}">${b}</span>`)
    .join("");

  // miniaturas: la imagen del producto + otras dos del catálogo
  const otras = productos.filter((p) => p.id !== producto.id).slice(0, 2);
  const miniaturasHtml = [producto, ...otras]
    .map(
      (p, i) => `
      <button class="producto__miniatura ${i === 0 ? "producto__miniatura--activa" : ""}" type="button" data-imagen="${p.imagen}" data-alt="${p.nombre}">
        <img src="${p.imagen}" alt="Vista ${i + 1}">
      </button>`
    )
    .join("");

  const compraHtml = sinStock
    ? `<button class="btn btn--deshabilitado btn--bloque" disabled>Sin stock</button>`
    : `
      <div class="cantidad">
        <button class="cantidad__boton" type="button" id="cantidad-restar" aria-label="Restar">−</button>
        <input class="cantidad__input" id="cantidad-input" type="number" value="1" min="1" max="${maximo}" aria-label="Cantidad">
        <button class="cantidad__boton" type="button" id="cantidad-sumar" aria-label="Sumar">+</button>
      </div>
      <button class="btn btn--primario" type="button" id="boton-agregar-ficha"><img class="btn__icono" src="assets/img/iconos/carrito-blanco.svg" alt=""> Agregar al carrito</button>`;

  detalle.innerHTML = `
    <div class="producto__galeria">
      <img class="producto__imagen-principal" id="imagen-principal" src="${producto.imagen}" alt="${producto.nombre}">
      <div class="producto__miniaturas">${miniaturasHtml}</div>
    </div>

    <div class="producto__info">
      <div class="badges">${badgesHtml}</div>
      <h1 class="producto__nombre">${producto.nombre}</h1>
      <span class="stock stock--${producto.stock.estado} stock--grande">${producto.stock.texto}</span>

      <div class="producto__precio-bloque">
        <span class="producto__precio">${formatearPrecio(producto.precio)}</span>
        <p class="producto__cuotas">3 cuotas sin interés de ${formatearPrecio(producto.cuotas)} · hasta 12 cuotas</p>
        <p class="producto__medios">10% OFF pagando con transferencia: <strong>${formatearPrecio(producto.precio * 0.9)}</strong></p>
      </div>

      <div class="producto__compra">${compraHtml}</div>
      <p class="calculadora-envio__mensaje" id="mensaje-agregado" role="status"></p>

      <div class="calculadora-envio">
        <h2 class="calculadora-envio__titulo"><img class="calculadora-envio__icono" src="assets/img/iconos/envio.svg" alt=""> Calculá tu envío</h2>
        <form class="calculadora-envio__form" id="form-envio-producto">
          <label for="cp-producto" class="u-visualmente-oculto">Código postal</label>
          <input class="calculadora-envio__input" id="cp-producto" type="text" inputmode="numeric" placeholder="Tu código postal" value="5000">
          <button class="btn btn--primario btn--chico" type="submit">Calcular</button>
        </form>
        <p class="calculadora-envio__mensaje" id="cp-mensaje-producto" role="status"></p>
        <div class="calculadora-envio__resultados" id="resultados-envio"></div>
      </div>

      <a class="btn btn--whatsapp btn--bloque" id="boton-whatsapp" href="#" target="_blank" rel="noopener"><img class="btn__icono" src="assets/img/iconos/chat-blanco.svg" alt=""> Consultar por WhatsApp</a>

      <div class="acordeon">
        <details class="acordeon__item" open>
          <summary class="acordeon__titulo">Descripción</summary>
          <div class="acordeon__contenido"><p>${producto.descripcion}</p></div>
        </details>
        <details class="acordeon__item">
          <summary class="acordeon__titulo">Ingredientes</summary>
          <div class="acordeon__contenido"><p>${producto.ingredientes}</p></div>
        </details>
      </div>
    </div>
  `;
}

function mostrarOpcionesEnvio(codigoPostal) {
  const esCordoba = codigoPostal.startsWith("5000");
  const opciones = esCordoba
    ? [
        ["Moto — Córdoba Capital", "Llega mañana", "$1.900"],
        ["Retiro en punto Nutrite", "Disponible en 24 h", "Gratis"],
      ]
    : [
        ["Correo a domicilio", "3 a 5 días hábiles", "$3.400"],
        ["Retiro en punto Nutrite", "Disponible en 24 h", "Gratis"],
      ];

  document.getElementById("resultados-envio").innerHTML = opciones
    .map(
      ([nombre, tiempo, precio]) => `
      <div class="opcion-envio"><span><span class="opcion-envio__nombre">${nombre}</span><span class="opcion-envio__tiempo">${tiempo}</span></span><span class="opcion-envio__precio ${precio === "Gratis" ? "opcion-envio__precio--gratis" : ""}">${precio}</span></div>`
    )
    .join("");
}

function inicializarEventos(producto) {
  // Evento: click en miniatura cambia la imagen principal
  detalle.querySelectorAll(".producto__miniatura").forEach((mini) => {
    mini.addEventListener("click", () => {
      const principal = document.getElementById("imagen-principal");
      principal.src = mini.dataset.imagen;
      principal.alt = mini.dataset.alt;
      detalle
        .querySelectorAll(".producto__miniatura")
        .forEach((m) => m.classList.remove("producto__miniatura--activa"));
      mini.classList.add("producto__miniatura--activa");
    });
  });

  // Evento: calculadora de envío por código postal
  const formEnvio = document.getElementById("form-envio-producto");
  const inputCp = document.getElementById("cp-producto");
  const mensajeCp = document.getElementById("cp-mensaje-producto");

  formEnvio.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const cp = inputCp.value.trim();
    if (/^\d{4}$/.test(cp)) {
      mensajeCp.textContent = `Envíos disponibles para el CP ${cp}`;
      mensajeCp.classList.remove("is-error");
      mostrarOpcionesEnvio(cp);
    } else {
      mensajeCp.textContent = "Ingresá un código postal de 4 números";
      mensajeCp.classList.add("is-error");
      document.getElementById("resultados-envio").innerHTML = "";
    }
  });
  mostrarOpcionesEnvio(inputCp.value);

  // Evento: consulta por WhatsApp con el nombre del producto
  const texto = encodeURIComponent(`Hola Nutrite! Quiero consultar por: ${producto.nombre}`);
  document.getElementById("boton-whatsapp").href = `https://wa.me/${NUMERO_WHATSAPP}?text=${texto}`;

  if (producto.stock.estado === "sin-stock") return;

  // Eventos: cantidad y agregar al carrito
  const inputCantidad = document.getElementById("cantidad-input");
  const maximo = maximoStock(producto);

  function fijarCantidad(valor) {
    const numero = isNaN(valor) || valor < 1 ? 1 : Math.min(valor, maximo);
    inputCantidad.value = numero;
  }

  document.getElementById("cantidad-restar").addEventListener("click", () => {
    fijarCantidad(parseInt(inputCantidad.value) - 1);
  });
  document.getElementById("cantidad-sumar").addEventListener("click", () => {
    fijarCantidad(parseInt(inputCantidad.value) + 1);
  });
  inputCantidad.addEventListener("change", () => {
    fijarCantidad(parseInt(inputCantidad.value));
  });

  document.getElementById("boton-agregar-ficha").addEventListener("click", () => {
    const cantidad = parseInt(inputCantidad.value);
    for (let i = 0; i < cantidad; i++) {
      agregarAlCarrito(producto.id);
    }
    actualizarContadorHeader();
    document.getElementById("mensaje-agregado").textContent =
      `Agregaste ${cantidad} × ${producto.nombre} al carrito.`;
  });
}

function mostrarNoEncontrado() {
  detalle.innerHTML = `
    <div class="carrito__vacio">
      <h1>No encontramos ese producto</h1>
      <p>Puede que el enlace sea incorrecto o que el producto ya no esté disponible.</p>
      <a class="btn btn--primario" href="catalogo.html">Volver al catálogo</a>
    </div>`;
  seccionRelacionados.hidden = true;
}

async function iniciar() {
  actualizarContadorHeader();

  try {
    const productos = await obtenerProductos(URL_PRODUCTOS);
    const producto = productos.find((p) => p.id === leerIdDeLaUrl());

    if (!producto) {
      mostrarNoEncontrado();
      return;
    }

    document.title = `${producto.nombre} | Nutrite`;
    migaCategoria.textContent = producto.categoria;
    migaProducto.textContent = producto.nombre;

    crearFicha(producto, productos);
    inicializarEventos(producto);

    // relacionados: misma categoría primero, completando con el resto
    const otros = productos.filter((p) => p.id !== producto.id);
    const relacionados = [
      ...otros.filter((p) => p.categoria === producto.categoria),
      ...otros.filter((p) => p.categoria !== producto.categoria),
    ].slice(0, 3);

    relacionados.forEach((p) => grillaRelacionados.appendChild(crearTarjetaProducto(p)));
    escucharBotonesAgregar(grillaRelacionados);
  } catch (error) {
    detalle.innerHTML = `<p class="catalogo__error">No se pudo cargar el producto. Intentá de nuevo más tarde.</p>`;
    console.error(error);
  }
}

iniciar();
