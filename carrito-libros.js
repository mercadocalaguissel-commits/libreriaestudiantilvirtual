
// =====================================
// CARRITO DE LIBROS - LIBRERÍA JP
// =====================================

const WHATSAPP_NUMERO = "59169231870";
const CLAVE_CARRITO = "carritoLibrosJP";
const LIMITE_UNIDADES = 10;


// =====================================
// PRECIOS FIJOS DE LOS LIBROS
// =====================================

const preciosProductos = {
    "Libro de Matemáticas": 45,
    "Libro de Ciencias Naturales": 40,
    "Libro de Historia": 35,
    "Diccionario": 30
};


// =====================================
// CARGAR CARRITO
// =====================================

let carrito = [];

try {
    carrito = JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
} catch (error) {
    carrito = [];
}

// Actualizar los precios guardados con los precios correctos
carrito = carrito.filter(producto =>
    preciosProductos[producto.nombre] !== undefined
);

carrito.forEach(producto => {
    producto.precio = preciosProductos[producto.nombre];
});

function guardarCarrito() {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function formatoPrecio(precio) {
    return "Bs. " + Number(precio).toLocaleString("es-BO", {
        maximumFractionDigits: 0
    });
}


// =====================================
// ESTILOS DEL CARRITO
// =====================================

const estilos = document.createElement("style");

estilos.textContent = `
#abrir-carrito {
    position: fixed;
    right: 25px;
    bottom: 25px;
    z-index: 2000;
    background: #22c55e;
    color: white;
    border: none;
    border-radius: 50px;
    padding: 15px 22px;
    font-size: 17px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 5px 20px rgba(0,0,0,.2);
}

#contador-carrito {
    background: white;
    color: #16a34a;
    border-radius: 50%;
    padding: 3px 8px;
    margin-left: 5px;
}

#fondo-carrito {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.55);
    z-index: 2001;
}

#panel-carrito {
    position: fixed;
    top: 0;
    right: -450px;
    width: 100%;
    max-width: 420px;
    height: 100vh;
    overflow-y: auto;
    background: white;
    padding: 25px;
    z-index: 2002;
    transition: right .3s ease;
    box-shadow: -5px 0 20px rgba(0,0,0,.2);
}

#panel-carrito.abierto {
    right: 0;
}

#panel-carrito h2 {
    color: #0f172a;
    margin-bottom: 20px;
}

#cerrar-carrito {
    float: right;
    border: none;
    background: none;
    font-size: 28px;
    cursor: pointer;
}

.item-carrito {
    border-bottom: 1px solid #ddd;
    padding: 15px 0;
}

.item-carrito h3 {
    font-size: 17px;
    margin-bottom: 8px;
}

.controles-cantidad {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 10px;
}

.controles-cantidad button {
    background: #22c55e;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 6px 12px;
    cursor: pointer;
    font-size: 16px;
}

#total-carrito {
    font-size: 23px;
    font-weight: bold;
    color: #16a34a;
    margin: 20px 0;
}

#panel-carrito input {
    width: 100%;
    padding: 12px;
    margin: 7px 0;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 15px;
}

.botones-carrito {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 15px;
}

.botones-carrito button {
    width: 100%;
    padding: 13px;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    font-size: 15px;
    cursor: pointer;
}

#vaciar-carrito {
    background: #e5e7eb;
    color: #1f2937;
}

#finalizar-pedido {
    background: #22c55e;
    color: white;
}

@media (max-width: 480px) {
    #panel-carrito {
        max-width: 100%;
    }

    #abrir-carrito {
        right: 15px;
        bottom: 15px;
    }
}
`;

document.head.appendChild(estilos);


// =====================================
// CREAR BOTÓN PARA ABRIR EL CARRITO
// =====================================

const botonAbrir = document.createElement("button");

botonAbrir.id = "abrir-carrito";

botonAbrir.innerHTML = `
    <i class="fa-solid fa-cart-shopping"></i>
    Mi carrito
    <span id="contador-carrito">0</span>
`;

document.body.appendChild(botonAbrir);


// =====================================
// CREAR FONDO Y PANEL
// =====================================

const fondo = document.createElement("div");

fondo.id = "fondo-carrito";

document.body.appendChild(fondo);


const panel = document.createElement("div");

panel.id = "panel-carrito";

panel.innerHTML = `
    <button id="cerrar-carrito">×</button>

    <h2>🛒 Mi carrito de libros</h2>

    <div id="lista-carrito"></div>

    <div id="total-carrito">Total: Bs. 0</div>

    <h3>Datos del cliente</h3>

    <input
        type="text"
        id="nombre-cliente"
        placeholder="Tu nombre"
    >

    <input
        type="text"
        id="ubicacion-cliente"
        placeholder="Tu ubicación"
    >

    <div class="botones-carrito">

        <button id="vaciar-carrito">
            Vaciar carrito
        </button>

        <button id="finalizar-pedido">
            <i class="fa-brands fa-whatsapp"></i>
            Enviar pedido por WhatsApp
        </button>

    </div>
`;

document.body.appendChild(panel);


// =====================================
// ABRIR Y CERRAR CARRITO
// =====================================

function abrirCarrito() {
    fondo.style.display = "block";
    panel.classList.add("abierto");
}

function cerrarCarrito() {
    fondo.style.display = "none";
    panel.classList.remove("abierto");
}

botonAbrir.addEventListener("click", abrirCarrito);

fondo.addEventListener("click", cerrarCarrito);

document.getElementById("cerrar-carrito")
    .addEventListener("click", cerrarCarrito);


// =====================================
// AGREGAR LIBROS AL CARRITO
// =====================================

document.querySelectorAll(".producto-card").forEach(tarjeta => {

    const boton = tarjeta.querySelector(".btn-carrito");

    if (!boton) return;

    boton.addEventListener("click", () => {

        const nombre = tarjeta.querySelector("h3").textContent.trim();

        const precio = preciosProductos[nombre];

        if (precio === undefined) {
            alert("No se encontró el precio de este libro: " + nombre);
            return;
        }

        const productoExistente = carrito.find(
            producto => producto.nombre === nombre
        );

        if (productoExistente) {

            if (productoExistente.cantidad >= LIMITE_UNIDADES) {
                alert("Solo puedes agregar hasta 10 unidades de este libro.");
                return;
            }

            productoExistente.cantidad++;
            productoExistente.precio = precio;

        } else {

            carrito.push({
                nombre: nombre,
                precio: precio,
                cantidad: 1
            });

        }

        guardarCarrito();
        actualizarCarrito();
        abrirCarrito();

    });

});


// =====================================
// ACTUALIZAR CARRITO
// =====================================

function actualizarCarrito() {

    const lista = document.getElementById("lista-carrito");
    const totalElemento = document.getElementById("total-carrito");
    const contador = document.getElementById("contador-carrito");

    lista.innerHTML = "";

    let total = 0;
    let cantidadTotal = 0;

    carrito.forEach((producto, indice) => {

        const subtotal = producto.precio * producto.cantidad;

        total += subtotal;
        cantidadTotal += producto.cantidad;

        const item = document.createElement("div");
        item.className = "item-carrito";

        const titulo = document.createElement("h3");
        titulo.textContent = producto.nombre;

        const precio = document.createElement("p");
        precio.textContent = "Precio: " + formatoPrecio(producto.precio);

        const subtotalTexto = document.createElement("p");
        subtotalTexto.textContent = "Subtotal: " + formatoPrecio(subtotal);

        const controles = document.createElement("div");
        controles.className = "controles-cantidad";

        const menos = document.createElement("button");
        menos.textContent = "−";

        menos.addEventListener("click", () => {
            cambiarCantidad(indice, -1);
        });

        const cantidad = document.createElement("span");
        cantidad.textContent = producto.cantidad;

        const mas = document.createElement("button");
        mas.textContent = "+";

        mas.addEventListener("click", () => {
            cambiarCantidad(indice, 1);
        });

        controles.append(menos, cantidad, mas);

        item.append(titulo, precio, subtotalTexto, controles);

        lista.appendChild(item);

    });

    contador.textContent = cantidadTotal;

    totalElemento.textContent = "Total: " + formatoPrecio(total);

    if (carrito.length === 0) {
        lista.innerHTML = "<p>Tu carrito está vacío.</p>";
    }

}


// =====================================
// CAMBIAR CANTIDAD
// =====================================

function cambiarCantidad(indice, cambio) {

    if (!carrito[indice]) return;

    const nuevaCantidad = carrito[indice].cantidad + cambio;

    if (nuevaCantidad > LIMITE_UNIDADES) {
        alert("El límite es de 10 unidades por libro.");
        return;
    }

    if (nuevaCantidad <= 0) {
        carrito.splice(indice, 1);
    } else {
        carrito[indice].cantidad = nuevaCantidad;
    }

    guardarCarrito();
    actualizarCarrito();

}


// =====================================
// VACIAR CARRITO
// =====================================

document.getElementById("vaciar-carrito")
    .addEventListener("click", () => {

        if (carrito.length === 0) {
            alert("El carrito ya está vacío.");
            return;
        }

        if (confirm("¿Deseas vaciar todo el carrito?")) {

            carrito = [];

            guardarCarrito();
            actualizarCarrito();

        }

    });


// =====================================
// ENVIAR PEDIDO POR WHATSAPP
// =====================================

document.getElementById("finalizar-pedido")
    .addEventListener("click", () => {

        if (carrito.length === 0) {
            alert("Agrega libros antes de realizar tu pedido.");
            return;
        }

        const nombre = document.getElementById("nombre-cliente")
            .value.trim();

        const ubicacion = document.getElementById("ubicacion-cliente")
            .value.trim();

        if (!nombre || !ubicacion) {
            alert("Por favor, completa tu nombre y ubicación.");
            return;
        }

        let mensaje =
            "📚 PEDIDO DE LIBROS - LIBRERÍA ESTUDIANTIL JP\n\n";

        mensaje += "Cliente: " + nombre + "\n";
        mensaje += "Ubicación: " + ubicacion + "\n\n";

        mensaje += "DETALLE DEL PEDIDO:\n";

        let total = 0;

        carrito.forEach(producto => {

            const subtotal = producto.precio * producto.cantidad;

            total += subtotal;

            mensaje +=
                "- " + producto.nombre +
                " x" + producto.cantidad +
                " = " + formatoPrecio(subtotal) + "\n";

        });

        mensaje += "\nTOTAL: " + formatoPrecio(total);
        mensaje += "\n\n¡Gracias por tu compra!";

        const enlace = "https://wa.me/" +
            WHATSAPP_NUMERO +
            "?text=" +
            encodeURIComponent(mensaje);

        window.open(enlace, "_blank");

    });


// =====================================
// INICIAR CARRITO
// =====================================

guardarCarrito();
actualizarCarrito();
