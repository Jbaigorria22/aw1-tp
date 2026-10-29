// Módulo de filtros: funciones puras que reciben la lista completa
// de productos + los criterios elegidos, y devuelven una lista nueva.
// No tocan el DOM ni saben que existen checkboxes: eso lo maneja catalogo.js.

export function filtrarProductos(productos, { atributos, categorias, soloConStock, busqueda }) {
  return productos.filter((producto) => {
    const cumpleAtributos = atributos.every((attr) => producto.badges.includes(attr));
    const cumpleCategoria = categorias.length === 0 || categorias.includes(producto.categoria);
    const cumpleStock = !soloConStock || producto.stock.estado !== "sin-stock";
    const cumpleBusqueda =
      !busqueda || producto.nombre.toLowerCase().includes(busqueda.toLowerCase());

    return cumpleAtributos && cumpleCategoria && cumpleStock && cumpleBusqueda;
  });
}

export function ordenarProductos(productos, criterio) {
  const copia = [...productos];

  switch (criterio) {
    case "Menor precio":
      return copia.sort((a, b) => a.precio - b.precio);
    case "Mayor precio":
      return copia.sort((a, b) => b.precio - a.precio);
    case "Nombre A-Z":
      return copia.sort((a, b) => a.nombre.localeCompare(b.nombre));
    default:
      return copia; // "Más vendidos" = orden original del JSON
  }
}
