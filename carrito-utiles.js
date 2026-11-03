// ========================================
// LIBRERÍA ESTUDIANTIL JP
// CARRITO DE ÚTILES ESCOLARES
// ========================================

// CONFIGURACIÓN

const WHATSAPP_NUMERO = "59169231870";
const CLAVE_CARRITO = "carritoUtilesJP";
const LIMITE_UNIDADES = 10;


// PRECIOS OFICIALES

const preciosProductos = {
    "Lapiceros": 5,
    "Cartulina": 3,
    "Cuaderno": 15,
    "Marcadores": 10,
    "Crayones": 12,
    "Pegatinas": 8,
    "Lápices": 4,
    "Engrapadora": 20
};


// RECUPERAR CARRITO GUARDADO

let carrito = [];

try {
    carrito = JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
} catch (error) {
    carrito = [];
}


// CREAR ESTRUCTURA DEL CARRITO

document.body.insertAdjacentHTML("beforeend", `

    <button type="button" id="abrir-carrito" class="carrito-flotante">
        🛒 Mi carrito
        <span id="contador-carrito">0</span>
    </button>

    <div id="fondo-carrito" class="fondo-carrito"></div>

    <section id="panel-carrito" class="panel-carrito">

        <div class="carrito-encabezado">
            <h2>🛒 Mi carrito</h2>

            <button type="button" id="cerrar-carrito" class="cerrar-carrito">
                ✕
            </button>
        </div>

        <div id="lista-carrito"></div>

        <div class="carrito-total">
            Total: <span id="total-carrito">Bs. 0</span>
        </div>

        <div class="datos-cliente">

            <h3>Datos del cliente</h3>

            <input
                type="text"
                id="nombre-cliente"
                placeholder="Tu nombre">

            <input
                type="text"
                id="ubicacion-cliente"
                placeholder="Tu ubicación o dirección">

        </div>

        <button type="button" id="vaciar-carrito" class="btn-vaciar">
            Vaciar carrito
        </button>

        <button type="button" id="finalizar-pedido" class="btn-whatsapp">
            Enviar pedido por WhatsApp
        </button>

    </section>

`);


// ELEMENTOS DEL CARRITO

const botonCarrito = document.getElementById("abrir-carrito");

const panelCarrito = document.getElementById("panel-carrito");

const fondoCarrito = document.getElementById("fondo-carrito");

const listaCarrito = document.getElementById("lista-carrito");


// GUARDAR CARRITO

function guardarCarrito() {

    localStorage.setItem(
        CLAVE_CARRITO,
        JSON.stringify(carrito)
    );

    actualizarCarrito();

}


// ========================================
// AGREGAR PRODUCTOS
// ========================================

// IMPORTANTE:
// Solo los botones con la clase .btn-carrito agregan productos.
// Los enlaces "Pedir por formulario" funcionan normalmente.

document.querySelectorAll(".producto-card .btn-carrito").forEach(boton => {

    boton.addEventListener("click", function () {

        const tarjeta = this.closest(".producto-card");

        const nombre = tarjeta.querySelector("h3").textContent.trim();

        const precio = preciosProductos[nombre];

        if (precio === undefined) {

            alert("No se encontró el precio de este producto: " + nombre);

            return;

        }

        const imagen =
            tarjeta.querySelector("img")?.getAttribute("src") || "";

        const productoExistente = carrito.find(
            producto => producto.nombre === nombre
        );


        if (productoExistente) {

            if (productoExistente.cantidad >= LIMITE_UNIDADES) {

                alert(
                    "¡Límite alcanzado! Solo puedes comprar 10 unidades de este producto."
                );

                return;

            }

            productoExistente.cantidad++;

            productoExistente.precio = precio;

        } else {

            carrito.push({

                nombre: nombre,
                precio: precio,
                imagen: imagen,
                cantidad: 1

            });

        }

        guardarCarrito();

        abrirPanelCarrito();

    });

});


// ========================================
// MOSTRAR PRODUCTOS DEL CARRITO
// ========================================

function actualizarCarrito() {

    const contador = carrito.reduce(
        (suma, producto) => suma + producto.cantidad,
        0
    );

    document.getElementById("contador-carrito").textContent = contador;


    if (carrito.length === 0) {

        listaCarrito.innerHTML = `

            <p class="carrito-vacio">
                Tu carrito está vacío.
                ¡Agrega algunos útiles escolares!
            </p>

        `;

    } else {

        listaCarrito.innerHTML = carrito.map((producto, indice) => `

            <div class="item-carrito">

                <div class="item-info">

                    <h3>${escaparHTML(producto.nombre)}</h3>

                    <p>Bs. ${producto.precio.toFixed(0)}</p>

                </div>

                <div class="cantidad-carrito">

                    <button
                        type="button"
                        data-accion="restar"
                        data-indice="${indice}">
                        −
                    </button>

                    <span>${producto.cantidad}</span>

                    <button
                        type="button"
                        data-accion="sumar"
                        data-indice="${indice}">
                        +
                    </button>

                    <button
                        type="button"
                        class="eliminar-producto"
                        data-accion="eliminar"
                        data-indice="${indice}">
                        🗑
                    </button>

                </div>

            </div>

        `).join("");

    }


    // CALCULAR TOTAL

    const total = carrito.reduce(
        (suma, producto) =>
            suma + producto.precio * producto.cantidad,
        0
    );

    document.getElementById("total-carrito").textContent =
        "Bs. " + total.toFixed(0);

}


// ========================================
// PROTEGER TEXTO HTML
// ========================================

function escaparHTML(texto) {

    return String(texto).replace(/[&<>"']/g, caracter => ({

        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"

    })[caracter]);

}


// ========================================
// AUMENTAR, DISMINUIR Y ELIMINAR
// ========================================

listaCarrito.addEventListener("click", function(event) {

    const boton = event.target.closest("button[data-accion]");

    if (!boton) return;

    const indice = Number(boton.dataset.indice);

    const accion = boton.dataset.accion;

    if (!carrito[indice]) return;


    // AUMENTAR CANTIDAD

    if (accion === "sumar") {

        if (carrito[indice].cantidad >= LIMITE_UNIDADES) {

            alert(
                "No puedes superar las 10 unidades de este producto."
            );

            return;

        }

        carrito[indice].cantidad++;

    }


    // DISMINUIR CANTIDAD

    if (accion === "restar") {

        carrito[indice].cantidad--;

        if (carrito[indice].cantidad <= 0) {

            carrito.splice(indice, 1);

        }

    }


    // ELIMINAR PRODUCTO

    if (accion === "eliminar") {

        carrito.splice(indice, 1);

    }

    guardarCarrito();

});


// ========================================
// ABRIR CARRITO
// ========================================

function abrirPanelCarrito() {

    panelCarrito.classList.add("activo");

    fondoCarrito.classList.add("activo");

}


// ========================================
// CERRAR CARRITO
// ========================================

function cerrarPanelCarrito() {

    panelCarrito.classList.remove("activo");

    fondoCarrito.classList.remove("activo");

}


botonCarrito.addEventListener("click", abrirPanelCarrito);

document.getElementById("cerrar-carrito")
    .addEventListener("click", cerrarPanelCarrito);

fondoCarrito.addEventListener("click", cerrarPanelCarrito);


// ========================================
// VACIAR CARRITO
// ========================================

document.getElementById("vaciar-carrito")
    .addEventListener("click", function() {

        carrito = [];

        guardarCarrito();

    });


// ========================================
// FINALIZAR PEDIDO POR WHATSAPP
// ========================================

document.getElementById("finalizar-pedido")
    .addEventListener("click", function() {

        // COMPROBAR SI HAY PRODUCTOS

        if (carrito.length === 0) {

            alert("Primero agrega productos al carrito.");

            return;

        }


        // OBTENER DATOS DEL CLIENTE

        const nombre = document.getElementById("nombre-cliente").value.trim();

        const ubicacion = document.getElementById("ubicacion-cliente").value.trim();


        if (!nombre || !ubicacion) {

            alert("Por favor, escribe tu nombre y tu ubicación.");

            return;

        }


        // CALCULAR TOTAL

        const total = carrito.reduce(
            (suma, producto) =>
                suma + producto.precio * producto.cantidad,
            0
        );


        // CREAR MENSAJE

        let mensaje = "¡Hola! Quiero realizar un pedido de Librería Estudiantil JP:\n\n";

        mensaje += "Nombre: " + nombre + "\n";

        mensaje += "Ubicación: " + ubicacion + "\n\n";

        mensaje += "PRODUCTOS:\n";


        carrito.forEach(producto => {

            mensaje += "• " + producto.nombre +
                " x" + producto.cantidad +
                " - Bs. " + (producto.precio * producto.cantidad).toFixed(0) + "\n";

        });


        mensaje += "\nTOTAL: Bs. " + total.toFixed(0);


        // ABRIR WHATSAPP

        const enlace = "https://wa.me/" + WHATSAPP_NUMERO +
            "?text=" + encodeURIComponent(mensaje);

        window.open(enlace, "_blank");

    });


// ========================================
// INICIAR CARRITO
// ========================================

actualizarCarrito();