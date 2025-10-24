/*Recupera carrito y usuario desde localStorage*/
const carritoParaPago = JSON.parse(localStorage.getItem("carritoParaPago")) || [];
const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual")) || null;

/*DOM*/
const listaCarrito = document.getElementById("itemsCarrito");
const totalPagar = document.getElementById("totalPagar");
const formPago = document.getElementById("formPago");
const mensajeBienvenidaPago = document.getElementById("welcomeMessagePago");


if (usuarioActual && mensajeBienvenidaPago) {
  mensajeBienvenidaPago.textContent = `¡Hola, ${usuarioActual.nombre}! Revisa tu carrito antes de pagar.`;
}

/*resumen carrito*/
function mostrarResumenCarrito() {
  listaCarrito.innerHTML = "";
  let total = 0;

  carritoParaPago.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const li = document.createElement("li");
    li.textContent = `${item.producto} x${item.cantidad} - $${subtotal.toLocaleString()}`;
    listaCarrito.appendChild(li);
  });

  totalPagar.textContent = total.toLocaleString();
}

/*SweetAlert*/
formPago.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (carritoParaPago.length === 0) {
    Swal.fire({
      icon: 'error',
      title: 'Carrito vacío',
      text: 'No se puede procesar el pago porque tu carrito está vacío.'
    });
    return;
  }

  const numeroTarjeta = document.getElementById("tarjeta").value.trim();
  const cvv = document.getElementById("cvv").value.trim();

  // Validar tarjeta
  if (!/^\d{16}$/.test(numeroTarjeta)) {
    Swal.fire({
      icon: 'error',
      title: 'Número de tarjeta inválido',
      text: 'Debe tener 16 dígitos.'
    });
    return;
  }

  /*se controla codigo de seguridad*/
  if (!/^\d{3}$/.test(cvv)) {
    Swal.fire({
      icon: 'error',
      title: 'CVV inválido',
      text: 'Debe tener 3 dígitos.'
    });
    return;
  }

  /*pago ok*/
  const result = await Swal.fire({
    title: 'Confirmar pago',
    text: `¿Deseas realizar el pago de $${totalPagar.textContent}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, pagar',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    Swal.fire({
      icon: 'success',
      title: 'Pago realizado',
      text: '¡Gracias por tu compra!',
      timer: 2000,
      showConfirmButton: false
    });

    /*vacia carrito*/
    localStorage.removeItem("carritoParaPago");
    listaCarrito.innerHTML = "";
    totalPagar.textContent = "0.00";

    setTimeout(() => {
      window.location.href = "../index.html";
    }, 2000);
  }
});

mostrarResumenCarrito();