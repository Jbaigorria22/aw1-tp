// Módulo de render del blog: convierte un artículo (dato) en HTML.
// No decide qué artículos mostrar, solo cómo dibujarlos.

export function formatearFecha(texto) {
  const [anio, mes, dia] = texto.split("-").map(Number);
  return new Date(anio, mes - 1, dia).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function crearTarjetaArticulo(articulo) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "articulo-card";

  tarjeta.innerHTML = `
    <a class="articulo-card__imagen-link" href="blog-articulo.html?id=${articulo.id}">
      <img class="articulo-card__imagen" src="${articulo.imagen}" alt="" loading="lazy">
    </a>
    <div class="articulo-card__cuerpo">
      <span class="articulo-card__categoria">${articulo.categoria}</span>
      <h3 class="articulo-card__titulo"><a href="blog-articulo.html?id=${articulo.id}">${articulo.titulo}</a></h3>
      <p class="articulo-card__resumen">${articulo.resumen}</p>
      <span class="articulo-card__meta">${formatearFecha(articulo.fecha)} · ${articulo.lectura} de lectura</span>
    </div>
  `;

  return tarjeta;
}

export function renderizarArticulos(articulos, contenedor) {
  contenedor.innerHTML = "";

  if (articulos.length === 0) {
    contenedor.innerHTML = `<p class="catalogo__vacio">No hay artículos que coincidan con tu búsqueda.</p>`;
    return;
  }

  articulos.forEach((articulo) => contenedor.appendChild(crearTarjetaArticulo(articulo)));
}

export function renderizarDetalleArticulo(articulo, contenedor) {
  const parrafos = articulo.contenido.map((p) => `<p>${p}</p>`).join("");

  contenedor.innerHTML = `
    <span class="articulo-card__categoria">${articulo.categoria}</span>
    <h1 class="articulo__titulo">${articulo.titulo}</h1>
    <p class="articulo__meta">${formatearFecha(articulo.fecha)} · ${articulo.lectura} de lectura</p>
    <img class="articulo__imagen" src="${articulo.imagen}" alt="">
    <div class="articulo__texto">${parrafos}</div>
    <a class="btn btn--secundario" href="blog.html">← Volver al blog</a>
  `;
}

export function mostrarError(contenedor) {
  contenedor.innerHTML = `<p class="catalogo__error">No se pudieron cargar los artículos. Intentá de nuevo más tarde.</p>`;
}
