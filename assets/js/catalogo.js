// Catálogo — carga de productos vía fetch (Actividad 4.2 / 4.3)
// En vez de tener las 8 tarjetas de producto escritas a mano en el HTML,
// las traemos desde assets/data/productos.json y las armamos con JS.

const BADGE_CLASES = {
  "Sin TACC": "badge--sin-tacc",
  "Vegano": "badge--vegano",
  "Sin azúcar": "badge--sin-azucar",
  "Integral": "badge--integral",
};

function formatearPrecio(numero) {
  return "$" + numero.toLocaleString("es-AR");
}

function crearTarjetaProducto(producto) {
  const sinStock = producto.stock.estado === "sin-stock";

  const badgesHtml = producto.badges
    .map((b) => `<span class="badge ${BADGE_CLASES[b] || ""}">${b}</span>`)
    .join("");

  const botonHtml = sinStock
    ? `<button class="btn btn--deshabilitado btn--chico btn--bloque" disabled>Sin stock</button>`
    : `<button class="btn btn--primario btn--chico btn--bloque">Agregar al carrito</button>`;

  const articulo = document.createElement("article");
  articulo.className = "producto-card" + (sinStock ? " producto-card--sin-stock" : "");

  articulo.innerHTML = `
    <a class="producto-card__imagen-link" href="producto.html">
      <img class="producto-card__imagen" src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
    </a>
    <div class="producto-card__cuerpo">
      <span class="producto-card__categoria">${producto.categoria}</span>
      <h3 class="producto-card__nombre"><a href="producto.html">${producto.nombre}</a></h3>
      <div class="badges">${badgesHtml}</div>
      <div class="producto-card__pie">
        <span class="stock stock--${producto.stock.estado}">${producto.stock.texto}</span>
        <span class="producto-card__precio">${formatearPrecio(producto.precio)}</span>
        <span class="producto-card__cuotas">3 cuotas sin interés de ${formatearPrecio(producto.cuotas)}</span>
        ${botonHtml}
      </div>
    </div>
  `;

  return articulo;
}

async function cargarProductos() {
  const grilla = document.querySelector(".l-grilla");
  if (!grilla) return;

  try {
    const respuesta = await fetch("assets/data/productos.json");

    if (!respuesta.ok) {
      throw new Error(`Error al cargar productos: ${respuesta.status}`);
    }

    const productos = await respuesta.json();

    grilla.innerHTML = "";
    productos.forEach((producto) => {
      grilla.appendChild(crearTarjetaProducto(producto));
    });

    const contador = document.querySelector(".catalogo__resultados strong");
    if (contador) contador.textContent = productos.length;
  } catch (error) {
    grilla.innerHTML = `<p class="catalogo__error">No se pudieron cargar los productos. Intentá de nuevo más tarde.</p>`;
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", cargarProductos);
