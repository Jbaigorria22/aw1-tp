import { obtenerProductos } from './datos.js'
import {
    envios,
    envioGratisDesde,
    formatearPrecio,
    leerCarrito,
    guardarCarrito,
    leerEnvio,
    guardarEnvio,
    buscarProducto,
    maximoStock,
    calcularSubtotal,
    calcularEnvio,
    contarProductos,
    renderizadoCarrito
} from './funciones-carrito.js'

const productos = await obtenerProductos()
let carrito = leerCarrito()

const contenedorCarrito = document.getElementById('lista-carrito')
const contadorProductos = document.getElementById('contador')
const cantidadProductos = document.getElementById('cantidad-productos')
const subtotalTexto = document.getElementById('resumen-subtotal')
const envioNombre = document.getElementById('resumen-envio-nombre')
const envioTexto = document.getElementById('resumen-envio')
const totalTexto = document.getElementById('resumen-total')
const cuotasTexto = document.getElementById('resumen-cuotas')
const notaEnvio = document.getElementById('resumen-nota')
const formularioEnvio = document.getElementById('form-envio')
const inputCodigoPostal = document.getElementById('cp-carrito')
const mensajeCodigoPostal = document.getElementById('cp-mensaje')
const botonIniciarCompra = document.getElementById('btn-iniciar-compra')
const opcionesEnvio = document.querySelectorAll('input[name="envio"]')

function actualizarCarrito() {
    guardarCarrito(carrito)
    renderizadoCarrito(contenedorCarrito, carrito, productos)
    mostrarResumen()
    escucharBotones()
}

function mostrarResumen() {
    const tipoEnvio = leerEnvio()
    const subtotal = calcularSubtotal(carrito, productos)
    let envio = calcularEnvio(subtotal, tipoEnvio)
    if (carrito.length == 0) {
        envio = 0
    }
    const total = subtotal + envio

    contadorProductos.textContent = contarProductos(carrito)
    cantidadProductos.textContent = '(' + contarProductos(carrito) + ' productos)'
    subtotalTexto.textContent = formatearPrecio(subtotal)
    envioNombre.textContent = 'Envío (' + envios[tipoEnvio].nombre + ')'
    totalTexto.textContent = formatearPrecio(total)
    cuotasTexto.textContent = 'o 3 cuotas sin interés de ' + formatearPrecio(total / 3)

    if (envio == 0) {
        envioTexto.textContent = 'Gratis'
    } else {
        envioTexto.textContent = formatearPrecio(envio)
    }

    if (carrito.length == 0) {
        notaEnvio.textContent = ''
    } else if (subtotal >= envioGratisDesde) {
        notaEnvio.textContent = '¡Tenés envío gratis!'
    } else {
        notaEnvio.textContent = 'Te faltan ' + formatearPrecio(envioGratisDesde - subtotal) + ' para el envío gratis.'
    }
}

function escucharBotones() {
    const botonesSumar = contenedorCarrito.querySelectorAll('.boton-sumar')
    const botonesRestar = contenedorCarrito.querySelectorAll('.boton-restar')
    const botonesEliminar = contenedorCarrito.querySelectorAll('.boton-eliminar')
    const inputsCantidad = contenedorCarrito.querySelectorAll('.cantidad__input')

    botonesSumar.forEach((boton) => {
        boton.addEventListener('click', (evento) => {
            const idProducto = parseInt(boton.dataset.id)
            const producto = buscarProducto(productos, idProducto)
            const item = carrito.find((item) => {
                return item.id == idProducto
            })
            if (item.cantidad < maximoStock(producto)) {
                item.cantidad++
                actualizarCarrito()
            } else {
                alert('No hay más stock de este producto')
            }
        })
    })

    botonesRestar.forEach((boton) => {
        boton.addEventListener('click', (evento) => {
            const idProducto = parseInt(boton.dataset.id)
            const item = carrito.find((item) => {
                return item.id == idProducto
            })
            if (item.cantidad > 1) {
                item.cantidad--
                actualizarCarrito()
            }
        })
    })

    botonesEliminar.forEach((boton) => {
        boton.addEventListener('click', (evento) => {
            const idProducto = parseInt(boton.dataset.id)
            const producto = buscarProducto(productos, idProducto)
            if (confirm('¿Eliminar ' + producto.nombre + ' del carrito?')) {
                carrito = carrito.filter((item) => {
                    return item.id != idProducto
                })
                actualizarCarrito()
            }
        })
    })

    inputsCantidad.forEach((input) => {
        input.addEventListener('change', (evento) => {
            const idProducto = parseInt(input.dataset.id)
            const producto = buscarProducto(productos, idProducto)
            const item = carrito.find((item) => {
                return item.id == idProducto
            })
            let cantidad = parseInt(input.value)
            if (isNaN(cantidad) || cantidad < 1) {
                cantidad = 1
            }
            if (cantidad > maximoStock(producto)) {
                cantidad = maximoStock(producto)
            }
            item.cantidad = cantidad
            actualizarCarrito()
        })
    })
}

opcionesEnvio.forEach((opcion) => {
    if (opcion.value == leerEnvio()) {
        opcion.checked = true
    }
    opcion.addEventListener('change', (evento) => {
        guardarEnvio(opcion.value)
        mostrarResumen()
    })
})

formularioEnvio.addEventListener('submit', (evento) => {
    evento.preventDefault()
    const codigoPostal = inputCodigoPostal.value
    if (codigoPostal.length == 4 && !isNaN(codigoPostal)) {
        mensajeCodigoPostal.textContent = 'Envíos disponibles para el CP ' + codigoPostal
        mensajeCodigoPostal.classList.remove('is-error')
    } else {
        mensajeCodigoPostal.textContent = 'Ingresá un código postal de 4 números'
        mensajeCodigoPostal.classList.add('is-error')
    }
})

botonIniciarCompra.addEventListener('click', (evento) => {
    if (carrito.length == 0) {
        evento.preventDefault()
        alert('Tu carrito está vacío')
    }
})

actualizarCarrito()
