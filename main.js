
const usuariosJSON = `
[
  { "mail": "lautyn2001@gmail.com", "password": "lautyn2001", "nombre": "Lautaro" },
  { "mail": "anakinskywalker@hotmail.com", "password": "darthvader", "nombre": "Anakin" },
  { "mail": "obiwankenobi@outlook.com", "password": "hellothere", "nombre": "Obi-Wan" }
]`;


const productosJSON = `
[
  { "producto": "Sable láser", "precio": 67000, "imagen": "productos_img/sable laser.jpg" },
  { "producto": "Droide", "precio": 39000, "imagen": "productos_img/droide.jpg" },
  { "producto": "Nave espacial", "precio": 150000, "imagen": "productos_img/nave.jpeg" },
  { "producto": "Bláster", "precio": 20000, "imagen": "productos_img/blaster.jpg" },
  { "producto": "Electrovara dug", "precio": 8000, "imagen": "productos_img/electrovara.jpg" },
  { "producto": "Cañon de protones", "precio": 80000, "imagen": "productos_img/Flak_Proton_Cannon.jpg" },
  { "producto": "Estrella de la muerte", "precio": 500000, "imagen": "productos_img/estrella de la muerte.jpg" }
]`;


const usuarios = JSON.parse(usuariosJSON);
const productos = JSON.parse(productosJSON);


let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productList = document.getElementById("productList");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const loginContainer = document.getElementById("loginContainer");
const welcomeMessage = document.getElementById("welcomeMessage");
const loginError = document.getElementById("loginError");

function renderProducts() {
  productList.innerHTML = "";
  productos.forEach((prod, index) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.producto}">
      <div class="product-info">
        <h3>${prod.producto}</h3>
        <div class="price">$${prod.precio.toLocaleString()}</div>
        Cantidad: <input type="number" id="qty-${index}" value="1" min="1">
        <button onclick="addToCart(${index})">Agregar al carrito</button>
      </div>
    `;
    productList.appendChild(card);
  });
}

function addToCart(index) {
  const qtyInput = document.getElementById(`qty-${index}`);
  let cantidad = parseInt(qtyInput.value);
  if (cantidad < 1) cantidad = 1;

  let existing = cart.find(item => item.producto === productos[index].producto);
  if (existing) {
    existing.cantidad += cantidad;
  } else {
    cart.push({ ...productos[index], cantidad });
  }

  saveCart();
  renderCart();
}

function renderCart() {
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.producto} x${item.cantidad} - $${subtotal.toLocaleString()}</span>
      <button class="remove-btn" onclick="removeFromCart(${index})">X</button>
    `;
    cartItems.appendChild(li);
  });
  cartTotal.textContent = total.toLocaleString();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function finalizarCompra() {
  if (cart.length === 0) {
    document.getElementById("checkoutMessage").textContent = "El carrito está vacío.";
    return;
  }

  cart = [];
  saveCart();
  renderCart();
  document.getElementById("checkoutMessage").textContent = "¡Compra finalizada con éxito! Que la Fuerza te acompañe.";
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const match = usuarios.filter(u => u.mail === email && u.password === password);

  if (match.length > 0) {
    const usuario = match[0];
    loginContainer.style.display = "none";
    loginError.style.display = "none";
    welcomeMessage.textContent = `¡Bienvenido, ${usuario.nombre}!`;
    renderProducts();
  } else {
    loginError.textContent = "Correo o contraseña incorrectos";
    loginError.style.display = "block";
  }
}


renderCart();