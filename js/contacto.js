const form = document.getElementById("contacto");
const mensajeExito = document.getElementById("mensajeExito");

/*Recupera mensajes previos del localStorage*/
let mensajes = JSON.parse(localStorage.getItem("mensajesContacto")) || [];

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();


  if (nombre === "" || email === "" || mensaje === "") {
    mensajeExito.textContent = "Por favor, completá todos los campos.";
    mensajeExito.style.color = "red";
    return;
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    mensajeExito.textContent = "Ingresá un correo válido.";
    mensajeExito.style.color = "red";
    return;
  }

  const nuevoMensaje = {
    nombre,
    email,
    mensaje,
    fecha: new Date().toLocaleString()
  };
  mensajes.push(nuevoMensaje);
  localStorage.setItem("mensajesContacto", JSON.stringify(mensajes));

  mensajeExito.textContent = "Mensaje enviado con éxito. ¡Gracias por contactarnos!";
  mensajeExito.style.color = "green";

  /*limpia formulario*/
  form.reset();
});