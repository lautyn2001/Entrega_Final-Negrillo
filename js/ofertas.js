/*Recupera carrito y usuario desde localStorage*/
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let usuarioActual = JSON.parse(localStorage.getItem("usuarioActual")) || null;

/*DOM*/
const ofertasContainer = document.getElementById("ofertasContainer");
const contenedorCarrito = document.getElementById("cart");
const listaCarrito = document.getElementById("cartItems");
const totalCarrito = document.getElementById("cartTotal");
const botonFinalizarCompra = document.getElementById("checkoutBtn");
const mensajeFinalizar = document.getElementById("checkoutMessage");
const linkCarrito = document.getElementById("linkCarrito");

/*productos en oferta*/
const ofertas = [
    { producto: "Sable láser", precioOriginal: 67000, precioOferta: 54000, stock: 5, imagen: "../productos_img/sable laser.jpg" },
    { producto: "Droide", precioOriginal: 39000, precioOferta: 30000, stock: 3, imagen: "../productos_img/droide.jpg" },
    { producto: "Bláster", precioOriginal: 20000, precioOferta: 15000, stock: 4, imagen: "../productos_img/blaster.jpg" },
];

function mostrarOfertas() {
    ofertasContainer.innerHTML = "";

    ofertas.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "product-card"; // Reutilizamos el estilo de index.html

        card.innerHTML = `
      <img src="${item.imagen}" alt="${item.producto}">
      <div class="product-info">
        <h3>${item.producto}</h3>
        <div class="precio-original">Antes: $${item.precioOriginal.toLocaleString()}</div>
        <div class="price">Oferta: $${item.precioOferta.toLocaleString()}</div>
        <p class="stock">Stock disponible: ${item.stock}</p>
        Cantidad: <input type="number" id="cantidad-${index}" value="1" min="1">
        <button class="btn-agregar" data-index="${index}">Agregar al carrito</button>
      </div>
    `;
        ofertasContainer.appendChild(card);
    });

    document.querySelectorAll(".btn-agregar").forEach(btn => {
        btn.addEventListener("click", e => {
            const index = e.target.getAttribute("data-index");
            agregarAlCarritoOferta(index);
        });
    });
}

/*agregar productos*/
function agregarAlCarritoOferta(index) {
    const producto = ofertas[index];
    const cantidadInput = document.getElementById(`cantidad-${index}`);
    const cantidad = parseInt(cantidadInput.value);

    if (isNaN(cantidad) || cantidad < 1) {
        alert("Cantidad inválida");
        return;
    }

    if (producto.stock < cantidad) {
        alert(`No hay suficiente stock de ${producto.producto}. Disponible: ${producto.stock}`);
        return;
    }

    const existente = carrito.find(item => item.producto === producto.producto);
    if (existente) {
        existente.cantidad += cantidad;
    } else {
        carrito.push({ ...producto, cantidad });
    }

    producto.stock -= cantidad;
    guardarCarrito();
    mostrarCarrito();
    mostrarOfertas();
}

/*carrito*/
function mostrarCarrito() {
    listaCarrito.innerHTML = "";
    let total = 0;
    carrito.forEach((item, indice) => {
        const subtotal = item.precioOferta * item.cantidad;
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

/*eliminar producto*/
function eliminarDelCarrito(indice) {
    const item = carrito[indice];
    const producto = ofertas.find(p => p.producto === item.producto);
    producto.stock += item.cantidad;
    carrito.splice(indice, 1);
    guardarCarrito();
    mostrarCarrito();
    mostrarOfertas();
}


function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

linkCarrito.addEventListener("click", e => {
    e.preventDefault();
    contenedorCarrito.style.display = contenedorCarrito.style.display === "none" || contenedorCarrito.style.display === "" ? "block" : "none";
});

document.getElementById("cerrarCarrito").addEventListener("click", () => {
    contenedorCarrito.style.display = "none";
});

mostrarOfertas();
mostrarCarrito();