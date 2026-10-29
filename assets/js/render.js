// Módulo de render: convierte un producto (dato) en un elemento HTML.
// No decide qué productos mostrar ni en qué orden, solo cómo dibujarlos.

const BADGE_CLASES = {
  "Sin TACC": "badge--sin-tacc",
  "Vegano": "badge--vegano",
  "Sin azúcar": "badge--sin-azucar",
  "Integral": "badge--integral",
};

export function formatearPrecio(numero) {
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

export function renderizarProductos(productos, contenedor) {
  contenedor.innerHTML = "";

  if (productos.length === 0) {
    contenedor.innerHTML = `<p class="catalogo__vacio">No hay productos que coincidan con los filtros.</p>`;
    return;
  }

  productos.forEach((producto) => {
    contenedor.appendChild(crearTarjetaProducto(producto));
  });
}

export function mostrarError(contenedor) {
  contenedor.innerHTML = `<p class="catalogo__error">No se pudieron cargar los productos. Intentá de nuevo más tarde.</p>`;
}
