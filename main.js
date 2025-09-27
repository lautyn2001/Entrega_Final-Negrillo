const usuarios = [
  { mail: "lautyn2001@gmail.com", password: "lautyn2001", nombre: "Lautaro" },
  { mail: "anakinskywalker@hotmail.com", password: "darthvader", nombre: "Anakin" },
  { mail: "obiwankenobi@outlook.com", password: "hellothere", nombre: "Obi-Wan" }
];

const productos = [
  { producto: "Sable láser", precio: 67000 },
  { producto: "Droide", precio: 39000 },
  { producto: "Nave espacial", precio: 150000 },
  { producto: "Bláster", precio: 20000 },
  { producto: "Electrovara dug", precio: 8000 },
  { producto: "Cañon de protones", precio: 80000 },
  { producto: "Estrella de la muerte", precio: 500000 }
];

let cart = [];
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
  const product = {...productos[index], cantidad};
  cart.push(product);
  renderCart();
}

function renderCart() {
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    const li = document.createElement("li");
    li.innerHTML = `<span>${item.producto} x${item.cantidad} - $${subtotal.toLocaleString()}</span> <button onclick="removeFromCart(${index})">X</button>`;
    cartItems.appendChild(li);
  });
  cartTotal.textContent = total.toLocaleString();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const usuario = usuarios.find(u => u.mail === email && u.password === password);
  if (usuario) {
    loginContainer.style.display = "none";
    loginError.style.display = "none";
    welcomeMessage.textContent = `¡Bienvenido, ${usuario.nombre}!`;
    renderProducts();
  } else {
    loginError.textContent = "Correo o contraseña incorrectos";
    loginError.style.display = "block";
  }
}

// Inicializar sin mostrar productos hasta login
productList.innerHTML = "";