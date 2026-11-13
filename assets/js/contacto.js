// Contacto — validación del formulario y confirmación de envío.
// No hay backend: el mensaje se valida y se muestra una confirmación.

import { actualizarContadorHeader } from "./agregar.js";

const form = document.getElementById("form-contacto");
const mensajeEstado = document.getElementById("contacto-estado");

function marcarCampo(input, mensajeError) {
  const campo = input.closest(".campo");
  const ayuda = campo.querySelector(".campo__ayuda");

  if (mensajeError) {
    campo.classList.add("campo--error");
    ayuda.textContent = mensajeError;
    return false;
  }

  campo.classList.remove("campo--error");
  ayuda.textContent = ayuda.dataset.textoOriginal || "";
  return true;
}

function validar() {
  const f = form.elements;
  const resultados = [
    marcarCampo(f.nombre, f.nombre.value.trim().length < 3 ? "Ingresá tu nombre" : ""),
    marcarCampo(
      f.email,
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim()) ? "Ingresá un email válido" : ""
    ),
    marcarCampo(f.mensaje, f.mensaje.value.trim().length < 10 ? "Contanos un poco más (mínimo 10 caracteres)" : ""),
  ];
  return !resultados.includes(false);
}

function inicializarEventos() {
  // guardo el texto de ayuda original para restaurarlo cuando el campo es válido
  form.querySelectorAll(".campo__ayuda").forEach((ayuda) => {
    ayuda.dataset.textoOriginal = ayuda.textContent;
  });

  // Evento: enviar el formulario
  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    mensajeEstado.textContent = "";

    if (!validar()) {
      mensajeEstado.textContent = "Revisá los campos marcados.";
      mensajeEstado.classList.add("is-error");
      return;
    }

    const nombre = form.elements.nombre.value.trim().split(" ")[0];
    mensajeEstado.textContent = `¡Gracias, ${nombre}! Recibimos tu mensaje y te respondemos a la brevedad.`;
    mensajeEstado.classList.remove("is-error");
    form.reset();
  });

  // Evento: limpiar el error de un campo apenas el usuario lo corrige
  form.addEventListener("input", (evento) => {
    const campo = evento.target.closest(".campo");
    if (campo && campo.classList.contains("campo--error")) {
      marcarCampo(evento.target, "");
    }
  });
}

function iniciar() {
  actualizarContadorHeader();
  inicializarEventos();
}

iniciar();
