import { obtenerProductos } from './datos.js'
import {
    envios,
    planesCuotas,
    formatearPrecio,
    leerCarrito,
    guardarCarrito,
    leerEnvio,
    buscarProducto,
    calcularSubtotal,
    calcularEnvio,
    contarProductos,
    renderizadoCuotas
} from './funciones-carrito.js'

const productos = await obtenerProductos()
const carrito = leerCarrito()
let medioPago = 'credito'
let cuotasElegidas = 3

const subtotal = calcularSubtotal(carrito, productos)
const envio = calcularEnvio(subtotal, leerEnvio())
const totalCompra = subtotal + envio

const panelPago = document.getElementById('panel-pago')
const tablaCuotas = document.getElementById('tabla-cuotas')
const cuerpoCuotas = document.getElementById('cuerpo-cuotas')
const resumenPedido = document.getElementById('resumen-pedido')
const contadorProductos = document.getElementById('contador')
const botonConfirmar = document.getElementById('btn-continuar')
const mediosPago = document.querySelectorAll('input[name="pago"]')
const pasos = document.querySelectorAll('.stepper__paso')

contadorProductos.textContent = contarProductos(carrito)

function calcularTotalFinal() {
    if (medioPago == 'transferencia') {
        return totalCompra * 0.9
    }
    if (medioPago == 'credito') {
        const plan = planesCuotas.find((plan) => {
            return plan.cuotas == cuotasElegidas
        })
        return totalCompra * (1 + plan.interes)
    }
    return totalCompra
}

function mostrarResumen() {

    let resumenHTML = '<h2 class="resumen__titulo">Tu pedido</h2>'

    carrito.forEach((item) => {
        const producto = buscarProducto(productos, item.id)
        resumenHTML += `
        <div class="resumen__linea">
            <span>${producto.nombre} ×${item.cantidad}</span>
            <span>${formatearPrecio(producto.precio * item.cantidad)}</span>
        </div>
        `
    })

    let textoEnvio = formatearPrecio(envio)
    if (envio == 0) {
        textoEnvio = 'Gratis'
    }
    resumenHTML += `
    <div class="resumen__linea">
        <span>Envío (${envios[leerEnvio()].nombre})</span>
        <span>${textoEnvio}</span>
    </div>
    `

    if (medioPago == 'transferencia') {
        resumenHTML += `
        <div class="resumen__linea resumen__linea--descuento">
            <span>Descuento transferencia (10%)</span>
            <span>−${formatearPrecio(totalCompra * 0.1)}</span>
        </div>
        `
    }

    resumenHTML += `
    <div class="resumen__linea resumen__linea--total">
        <span>Total</span>
        <span>${formatearPrecio(calcularTotalFinal())}</span>
    </div>
    `

    resumenPedido.innerHTML = resumenHTML
}

function mostrarCuotas() {
    if (medioPago == 'credito') {
        tablaCuotas.style.display = ''
    } else {
        tablaCuotas.style.display = 'none'
    }

    renderizadoCuotas(cuerpoCuotas, totalCompra, cuotasElegidas)

    const filasCuotas = cuerpoCuotas.querySelectorAll('.cuotas__fila')
    filasCuotas.forEach((fila) => {
        fila.addEventListener('click', (evento) => {
            cuotasElegidas = parseInt(fila.dataset.cuotas)
            mostrarCuotas()
            mostrarResumen()
        })
    })
}

mediosPago.forEach((medio) => {
    medio.addEventListener('change', (evento) => {
        medioPago = medio.value
        mostrarCuotas()
        mostrarResumen()
    })
})

botonConfirmar.addEventListener('click', (evento) => {
    const totalFinal = calcularTotalFinal()

    pasos[2].classList.remove('stepper__paso--activo')
    pasos[2].classList.add('stepper__paso--completo')
    pasos[3].classList.add('stepper__paso--activo')

    panelPago.innerHTML = `
    <h1 class="checkout__titulo">¡Gracias por tu compra!</h1>
    <p>Total pagado: <strong>${formatearPrecio(totalFinal)}</strong></p>
    <a class="btn btn--primario" href="catalogo.html">Seguir comprando</a>
    `

    guardarCarrito([])
    contadorProductos.textContent = 0
})

if (carrito.length == 0) {
    panelPago.innerHTML = `
    <h1 class="checkout__titulo">Tu carrito está vacío</h1>
    <a class="btn btn--primario" href="catalogo.html">Ver productos</a>
    `
    resumenPedido.style.display = 'none'
} else {
    mostrarCuotas()
    mostrarResumen()
}
