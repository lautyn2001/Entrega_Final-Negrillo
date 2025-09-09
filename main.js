/*Usuarios*/
const usuarios = [
  { mail: "lautyn2001@gmail.com", password: "lautyn2001", nombre: "Lautaro" },
  { mail: "anakinskywalker@hotmail.com", password: "darthvader", nombre: "Anakin" },
  { mail: "obiwankenobi@outlook.com", password: "hellothere", nombre: "Obi-Wan" }
];

/*Productos*/
const productos = [
  { producto: "Sable láser", precio: 67000 },
  { producto: "Droide", precio: 39000 },
  { producto: "Nave espacial", precio: 150000 },
  { producto: "Bláster", precio: 20000 },
  { producto: "Electrovara dug", precio: 8000 },
  { producto: "Cañon de protones", precio: 80000 },
  { producto: "Estrella de la muerte", precio: 500000 }
];

let carrito = [];



/*Registrar usuario*/
function registrarUsuario() {
  const nombre = prompt("Ingrese su nombre:");
  if (!nombre) { alert("Nombre inválido"); return null; }

  const mail = prompt("Ingrese su correo electrónico:");
  if (!mail || !mail.includes("@")) { alert("Correo inválido"); return null; }

  if (usuarios.find(u => u.mail === mail)) {
    alert("Este correo ya está registrado."); 
    return null;
  }

  const password = prompt("Ingrese su contraseña:");
  if (!password) { alert("Contraseña inválida"); return null; }

  const nuevoUsuario = {mail, password, nombre};
  usuarios.push(nuevoUsuario);
  alert(`Usuario registrado correctamente. ¡Bienvenido, ${nombre}!`);
  return nuevoUsuario;
}

/*login*/
function login() {
  alert("Bienvenido a la tienda galáctica");
  const opcion = prompt("Ingrese 1 para iniciar sesión o 2 para registrarse:");
  let usuarioActual = null;

  if (opcion === "2") {
    usuarioActual = registrarUsuario();
    if (!usuarioActual) return null;
  }

  let intentos = 3;
  while (intentos > 0 && !usuarioActual) {
    const mailInput = prompt("Ingrese su correo electrónico:");
    if (!mailInput || !mailInput.includes("@")) { alert("Correo inválido"); continue; }

    const passwordInput = prompt("Ingrese su contraseña:");
    const encontrado = usuarios.find(u => usuarios.mail === mailInput && usuarios.password === passwordInput);

    if (encontrado) usuarioActual = encontrado;
    else { intentos--; alert(`Correo o contraseña incorrectos. Te quedan ${intentos} intentos.`); }
  }

  if (usuarioActual) alert(`¡Bienvenido, ${usuarioActual.nombre}!`);
  return usuarioActual;
}

/*catalogo*/
function mostrarCatalogoPrompt() {
  let lista = "Catálogo de productos:\n";
  productos.forEach((p, i) => {
    lista += `${i + 1}. ${p.producto} - $${p.precio}\n`;
  });
  lista += "\n0. Ver carrito\n-1. Eliminar producto del carrito";
  return lista;
}

function agregarAlCarrito(indice) {
  const producto = productos[indice - 1];
  if (!producto) { alert("Producto no encontrado"); return; }

  let item = { ...producto };
  if (producto.producto === "Sable láser") {
    let color = prompt("Elige el color del sable láser (rojo, azul, verde):");
    item.color = color || "sin color";
  }

  carrito.push(item);
  alert(`${item.producto}${item.color ? ` (${item.color})` : ""} agregado al carrito`);
}

/*ver carrito*/
function verCarrito() {
  if (carrito.length === 0) { alert("El carrito está vacío"); return; }

  const resumen = {};
  carrito.forEach(p => {
    const clave = p.color ? `${p.producto} (${p.color})` : p.producto;
    if (resumen[clave]) resumen[clave].cantidad++;
    else resumen[clave] = { precio: p.precio, cantidad: 1 };
  });

  let texto = "Detalle del carrito:\n\n";
  let total = 0;
  let i = 1;
  for (let clave in resumen) {
    const item = resumen[clave];
    const subtotal = item.precio * item.cantidad;
    texto += `${i}. ${clave} - Cantidad: ${item.cantidad} - Precio unitario: $${item.precio} - Subtotal: $${subtotal}\n`;
    total += subtotal;
    i++;
  }
  texto += `\nTotal: $${total}`;
  alert(texto);
}

/*Eliminar producto*/
function eliminarDelCarrito() {
  if (carrito.length === 0) { alert("El carrito está vacío"); return; }

  let opciones = "Seleccione el número del producto a eliminar:\n";
  carrito.forEach((p, i) => {
    opciones += `${i + 1}. ${p.producto}${p.color ? ` (${p.color})` : ""} - $${p.precio}\n`;
  });

  const eleccion = Number(prompt(opciones));
  if (!eleccion || eleccion < 1 || eleccion > carrito.length) { alert("Opción inválida"); return; }

  const eliminado = carrito.splice(eleccion - 1, 1)[0];
  alert(`${eliminado.producto}${eliminado.color ? ` (${eliminado.color})` : ""} eliminado del carrito`);
}

/*iniciar tienda*/
function iniciarTienda() {
  const usuario = login();
  if (!usuario) { alert("No se pudo iniciar sesión."); return; }

  let seguir = true;
  while (seguir) {
    let eleccion = Number(prompt(mostrarCatalogoPrompt()));
    if (eleccion === null) break;

    if (eleccion === 0) verCarrito();
    else if (eleccion === -1) eliminarDelCarrito();
    else agregarAlCarrito(eleccion);

    seguir = confirm("¿Desea seguir comprando?");
  }

  verCarrito();
  alert(`Gracias por su compra, ${usuario.nombre}`);
}

iniciarTienda();
