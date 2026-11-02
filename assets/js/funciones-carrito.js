const envios = {
    moto: { nombre: 'Moto', precio: 1900 },
    correo: { nombre: 'Correo a domicilio', precio: 3400 },
    retiro: { nombre: 'Retiro en punto Nutrite', precio: 0 }
}

const planesCuotas = [
    { cuotas: 1, interes: 0 },
    { cuotas: 3, interes: 0 },
    { cuotas: 6, interes: 0.12 },
    { cuotas: 12, interes: 0.28 }
]

const envioGratisDesde = 40000

function formatearPrecio(numero) {
    return '$' + Math.round(numero).toLocaleString('es-AR')
}

function leerCarrito() {
    const carritoGuardado = localStorage.getItem('carrito')
    if (carritoGuardado == null) {
        const carritoEjemplo = [
            { id: 2, cantidad: 2 },
            { id: 8, cantidad: 1 },
            { id: 4, cantidad: 1 }
        ]
        guardarCarrito(carritoEjemplo)
        return carritoEjemplo
    }
    return JSON.parse(carritoGuardado)
}

function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

function agregarAlCarrito(idProducto) {
    const carrito = leerCarrito()
    const item = carrito.find((item) => {
        return item.id == idProducto
    })
    if (item) {
        item.cantidad++
    } else {
        carrito.push({ id: idProducto, cantidad: 1 })
    }
    guardarCarrito(carrito)
}

function leerEnvio() {
    const envio = localStorage.getItem('envio')
    if (envio == null) {
        return 'moto'
    }
    return envio
}

function guardarEnvio(envio) {
    localStorage.setItem('envio', envio)
}

function buscarProducto(productos, idProducto) {
    return productos.find((producto) => {
        return producto.id == idProducto
    })
}

function maximoStock(producto) {
    if (producto.stock.estado == 'ultimas') {
        return parseInt(producto.stock.texto.split(' ')[1])
    }
    return 10
}

function calcularSubtotal(carrito, productos) {
    let subtotal = 0
    carrito.forEach((item) => {
        const producto = buscarProducto(productos, item.id)
        subtotal += producto.precio * item.cantidad
    })
    return subtotal
}

function calcularEnvio(subtotal, tipoEnvio) {
    if (subtotal >= envioGratisDesde) {
        return 0
    }
    return envios[tipoEnvio].precio
}

function contarProductos(carrito) {
    let cantidad = 0
    carrito.forEach((item) => {
        cantidad += item.cantidad
    })
    return cantidad
}

function renderizadoCarrito(contenedor, carrito, productos) {

    let carritoHTML = ''

    if (carrito.length == 0) {
        carritoHTML = `
        <li class="carrito__vacio">
            <p>Tu carrito está vacío.</p>
            <a class="btn btn--primario btn--chico" href="catalogo.html">Ver productos</a>
        </li>
        `
    }

    carrito.forEach((item) => {
        const producto = buscarProducto(productos, item.id)
        carritoHTML += `
        <li class="item-carrito">
            <img class="item-carrito__imagen" src="${producto.imagen}" alt="${producto.nombre}">
            <div class="item-carrito__info">
                <h3 class="item-carrito__nombre">${producto.nombre}</h3>
                <span class="item-carrito__unitario">${formatearPrecio(producto.precio)} c/u</span>
                <span class="stock stock--${producto.stock.estado}">${producto.stock.texto}</span>
            </div>
            <div class="item-carrito__acciones">
                <div class="cantidad">
                    <button class="cantidad__boton boton-restar" data-id="${producto.id}">−</button>
                    <input class="cantidad__input" type="number" value="${item.cantidad}" data-id="${producto.id}">
                    <button class="cantidad__boton boton-sumar" data-id="${producto.id}">+</button>
                </div>
                <span class="item-carrito__subtotal">${formatearPrecio(producto.precio * item.cantidad)}</span>
                <button class="item-carrito__eliminar boton-eliminar" data-id="${producto.id}">Eliminar</button>
            </div>
        </li>
        `
    })

    contenedor.innerHTML = carritoHTML
}

function renderizadoCuotas(contenedor, total, cuotasElegidas) {

    let cuotasHTML = ''

    planesCuotas.forEach((plan) => {
        const totalConInteres = total * (1 + plan.interes)

        let textoInteres = '<span class="cuotas__sin-interes">Sin interés</span>'
        if (plan.interes > 0) {
            textoInteres = (plan.interes * 100).toFixed(0) + '% interés'
        }

        let claseFila = 'cuotas__fila'
        if (plan.cuotas == cuotasElegidas) {
            claseFila = 'cuotas__fila cuotas__fila--destacada'
        }

        cuotasHTML += `
        <tr class="${claseFila}" data-cuotas="${plan.cuotas}">
            <td>${plan.cuotas} cuotas</td>
            <td>${formatearPrecio(totalConInteres / plan.cuotas)}</td>
            <td>${formatearPrecio(totalConInteres)}</td>
            <td>${textoInteres}</td>
        </tr>
        `
    })

    contenedor.innerHTML = cuotasHTML
}

export {
    envios,
    planesCuotas,
    envioGratisDesde,
    formatearPrecio,
    leerCarrito,
    guardarCarrito,
    agregarAlCarrito,
    leerEnvio,
    guardarEnvio,
    buscarProducto,
    maximoStock,
    calcularSubtotal,
    calcularEnvio,
    contarProductos,
    renderizadoCarrito,
    renderizadoCuotas
}
