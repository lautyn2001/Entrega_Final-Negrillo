/*Usuarios*/
const usuariosJSON = `
[
  { "mail": "lautyn2001@gmail.com", "password": "lautyn2001", "nombre": "Lautaro" },
  { "mail": "anakinskywalker@hotmail.com", "password": "darthvader", "nombre": "Anakin" },
  { "mail": "obiwankenobi@outlook.com", "password": "hellothere", "nombre": "Obi-Wan" }
]`;

/*productos*/
const productosJSON = `
[
  { "producto": "Sable láser", "precio": 67000, "stock": 5, "imagen": "productos_img/sable laser.jpg" },
  { "producto": "Droide", "precio": 39000, "stock": 3, "imagen": "productos_img/droide.jpg" },
  { "producto": "Nave espacial", "precio": 150000, "stock": 2, "imagen": "productos_img/nave.jpeg" },
  { "producto": "Bláster", "precio": 20000, "stock": 4, "imagen": "productos_img/blaster.jpg" },
  { "producto": "Electrovara dug", "precio": 8000, "stock": 6, "imagen": "productos_img/electrovara.jpg" },
  { "producto": "Cañon de protones", "precio": 80000, "stock": 1, "imagen": "productos_img/Flak_Proton_Cannon.jpg" },
  { "producto": "Estrella de la muerte", "precio": 500000, "stock": 1, "imagen": "productos_img/estrella de la muerte.jpg" }
]`;

const usuarios = JSON.parse(usuariosJSON);
const productos = JSON.parse(productosJSON);
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let usuarioActual = JSON.parse(localStorage.getItem("usuarioActual")) || null;

/* DOM */
const contenedorProductos = document.getElementById("productList");
const contenedorCarrito = document.getElementById("cart");
const listaCarrito = document.getElementById("cartItems");
const totalCarrito = document.getElementById("cartTotal");
const contenedorLogin = document.getElementById("loginContainer");
const mensajeBienvenida = document.getElementById("welcomeMessage");
const mensajeErrorLogin = document.getElementById("loginError");
const botonFinalizarCompra = document.getElementById("checkoutBtn");
const mensajeFinalizar = document.getElementById("checkoutMessage");
const linkCarrito = document.getElementById("linkCarrito");


/*muetsra productos en pantalla*/
function mostrarProductos() {
  contenedorProductos.innerHTML = "";
  productos.forEach((producto, indice) => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "product-card";
    tarjeta.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.producto}">
      <div class="product-info">
        <h3>${producto.producto}</h3>
        <div class="price">$${producto.precio.toLocaleString()}</div>
        <p class="stock">Stock disponible: ${producto.stock}</p>
        Cantidad: <input type="number" id="cantidad-${indice}" value="1" min="1">
        <button class="btn-agregar" data-index="${indice}">Agregar al carrito</button>
      </div>
    `;
    contenedorProductos.appendChild(tarjeta);
  });

  document.querySelectorAll(".btn-agregar").forEach(btn => {
    btn.addEventListener("click", e => {
      const indice = e.target.getAttribute("data-index");
      agregarAlCarrito(indice);
    });
  });
}

/*agrega prdocutos al carrito*/
function agregarAlCarrito(indice) {
  const producto = productos[indice];
  const inputCantidad = document.getElementById(`cantidad-${indice}`);
  const cantidad = parseInt(inputCantidad.value);

  try {
    if (isNaN(cantidad) || cantidad < 1) throw new Error("Cantidad inválida.");
    if (producto.stock < cantidad) throw new Error(`No hay suficiente stock de ${producto.producto}. Disponible: ${producto.stock}`);

    const existente = carrito.find(item => item.producto === producto.producto);
    if (existente) {
      existente.cantidad += cantidad;
    } else {
      carrito.push({ ...producto, cantidad });
    }

    producto.stock -= cantidad;
    guardarCarrito();
    mostrarCarrito();
    mostrarProductos();

    Swal.fire({
      icon: 'success',
      title: 'Agregado al carrito',
      text: `${producto.producto} x${cantidad}`,
      timer: 1200,
      showConfirmButton: false
    });

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message
    });
  }
}

/*carrito*/
function mostrarCarrito() {
  listaCarrito.innerHTML = "";
  let total = 0;
  carrito.forEach((item, indice) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.producto} x${item.cantidad} - $${subtotal.toLocaleString()}</span>
      <button class="remove-btn" data-index="${indice}">X</button>
    `;
    listaCarrito.appendChild(li);
  });
  totalCarrito.textContent = total.toLocaleString();

  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const indice = e.target.getAttribute("data-index");
      eliminarDelCarrito(indice);
    });
  });
}

/*eliminar productos*/
function eliminarDelCarrito(indice) {
  const item = carrito[indice];
  const producto = productos.find(p => p.producto === item.producto);
  producto.stock += item.cantidad;
  carrito.splice(indice, 1);
  guardarCarrito();
  mostrarCarrito();
  mostrarProductos();
}


function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  if (usuarioActual) localStorage.setItem("usuarioActual", JSON.stringify(usuarioActual));
}

/*boton logout dinamico*/
function mostrarBotonCerrarSesion() {
  let boton = document.getElementById("logoutButton");
  if (!boton) {
    boton = document.createElement("button");
    boton.id = "logoutButton";
    boton.textContent = "Cerrar Sesión";
    document.querySelector("nav ul").appendChild(boton);

    boton.addEventListener("click", () => {
      cerrarSesion();
    });
  }
  boton.style.display = "inline-block";
}

/*login*/
function iniciarSesion() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const usuarioEncontrado = usuarios.find(u => u.mail === email && u.password === password);

  if (usuarioEncontrado) {
    usuarioActual = usuarioEncontrado;
    contenedorLogin.style.display = "none";
    mensajeErrorLogin.style.display = "none";
    mensajeBienvenida.textContent = `¡Bienvenido, ${usuarioActual.nombre}!`;

    mostrarProductos();
    mostrarCarrito();
    guardarCarrito();
    mostrarBotonCerrarSesion();

    Swal.fire({
      icon: 'success',
      title: 'Bienvenido',
      text: `¡Hola, ${usuarioActual.nombre}!`,
      timer: 1500,
      showConfirmButton: false
    });

  } else {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Correo o contraseña incorrectos'
    });
  }
}

/*logout*/
function cerrarSesion() {
  usuarioActual = null;
  carrito = [];
  localStorage.removeItem("usuarioActual");
  localStorage.removeItem("carrito");
  contenedorLogin.style.display = "flex";
  mensajeBienvenida.textContent = "";

  const boton = document.getElementById("logoutButton");
  if (boton) boton.remove();

  mostrarCarrito();

  Swal.fire({
    icon: 'info',
    title: 'Sesión cerrada',
    text: 'Has cerrado sesión correctamente',
    timer: 1500,
    showConfirmButton: false
  });
}

/*finalizar compra*/
function finalizarCompra() {
  if (carrito.length === 0) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'El carrito está vacío'
    });
    return;
  }

  localStorage.setItem("carritoParaPago", JSON.stringify(carrito));

  carrito = [];
  guardarCarrito();
  mostrarCarrito();
  mostrarProductos();

  window.location.href = "./pages/pagina_de_pago.html";
}

/*Abrir/cerrar carrito*/
linkCarrito.addEventListener("click", e => {
  e.preventDefault();
  contenedorCarrito.style.display = contenedorCarrito.style.display === "none" || contenedorCarrito.style.display === "" ? "block" : "none";
});

document.getElementById("cerrarCarrito").addEventListener("click", () => {
  contenedorCarrito.style.display = "none";
});


document.getElementById("loginButton").addEventListener("click", iniciarSesion);
botonFinalizarCompra.addEventListener("click", finalizarCompra);

/*restaura sesion*/
if (usuarioActual) {
  contenedorLogin.style.display = "none";
  mensajeBienvenida.textContent = `¡Bienvenido, ${usuarioActual.nombre}!`;
  mostrarProductos();
  mostrarCarrito();
  mostrarBotonCerrarSesion();
}