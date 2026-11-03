/* =====================================================
   CARRITO DE COMPRAS - Librería Estudiantil JP
   Agrega <script src="carrito.js"></script> al final del
   <body> de index.html, libros.html y utiles.html
===================================================== */

(function () {

    // -------------------------------------------------
    // CONFIGURACIÓN (aquí pones los límites)
    // -------------------------------------------------

    // Límite máximo por producto. Usa el MISMO nombre que el <h3>.
    const LIMITES = {
        "Cuaderno": 10,
        "Libro de Caligrafía": 10,
        "Agenda": 10,
        "Cuento de Pinocho": 10,
        "Historia del Arte": 10
    };

    // Límite para productos que no estén en la lista de arriba
    const LIMITE_DEFECTO = 5;

    // Número de WhatsApp con código de país (Bolivia = 591)
    const TELEFONO_WHATSAPP = "59169231870";

    const CLAVE = "carritoJP";


    // -------------------------------------------------
    // DATOS DEL CARRITO
    // -------------------------------------------------

    let carrito = [];

    try {
        carrito = JSON.parse(localStorage.getItem(CLAVE)) || [];
    } catch (e) {
        carrito = [];
    }

    function guardar() {
        try {
            localStorage.setItem(CLAVE, JSON.stringify(carrito));
        } catch (e) { }
    }

    function limiteDe(nombre) {
        return LIMITES[nombre] !== undefined ? LIMITES[nombre] : LIMITE_DEFECTO;
    }

    function esc(texto) {
        return String(texto).replace(/[&<>"']/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
    }

    function total() {
        return carrito.reduce(function (suma, p) {
            return suma + p.precio * p.cantidad;
        }, 0);
    }

    function cantidadTotal() {
        return carrito.reduce(function (suma, p) {
            return suma + p.cantidad;
        }, 0);
    }


    // -------------------------------------------------
    // ESTILOS
    // -------------------------------------------------

    const estilo = document.createElement("style");

    estilo.textContent = `
    #cartFab {
        position: fixed; left: 25px; bottom: 25px; z-index: 1500;
        width: 58px; height: 58px; border: none; border-radius: 50%;
        background: #22c55e; color: #fff; font-size: 22px; cursor: pointer;
        box-shadow: 0 5px 15px rgba(0,0,0,.25); transition: .3s;
    }
    #cartFab:hover { background: #16a34a; transform: scale(1.08); }
    #cartCount {
        position: absolute; top: -6px; right: -6px; min-width: 24px; height: 24px;
        padding: 0 6px; border-radius: 12px; background: #0f172a; color: #fff;
        font-size: 13px; font-weight: bold; display: flex;
        align-items: center; justify-content: center;
    }
    #cartOverlay {
        position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 1900;
        opacity: 0; pointer-events: none; transition: .3s;
    }
    #cartOverlay.abierto { opacity: 1; pointer-events: auto; }
    #cartPanel {
        position: fixed; top: 0; right: 0; height: 100%; width: 380px; max-width: 100%;
        background: #fff; z-index: 2000; display: flex; flex-direction: column;
        transform: translateX(100%); transition: .35s;
        box-shadow: -8px 0 30px rgba(0,0,0,.2); font-family: Arial, sans-serif;
    }
    #cartPanel.abierto { transform: translateX(0); }
    .cart-head {
        display: flex; justify-content: space-between; align-items: center;
        padding: 18px 20px; background: #0f172a; color: #fff;
    }
    .cart-head h3 { font-size: 20px; }
    .cart-close { background: none; border: none; color: #fff; font-size: 24px; cursor: pointer; }
    .cart-body { flex: 1; overflow-y: auto; padding: 15px 20px; }
    .cart-vacio { text-align: center; color: #64748b; margin-top: 60px; line-height: 1.6; }
    .cart-item {
        display: flex; gap: 12px; align-items: center;
        padding: 12px 0; border-bottom: 1px solid #e5e7eb;
    }
    .cart-item img { width: 60px; height: 60px; object-fit: cover; border-radius: 8px; }
    .cart-info { flex: 1; }
    .cart-info strong { display: block; color: #0f172a; font-size: 15px; }
    .cart-info span { color: #16a34a; font-weight: bold; font-size: 14px; }
    .cart-info small { display: block; color: #94a3b8; margin-top: 2px; }
    .cart-qty { display: flex; align-items: center; gap: 8px; margin-top: 6px; }
    .cart-qty button {
        width: 26px; height: 26px; border: none; border-radius: 6px;
        background: #e5e7eb; cursor: pointer; font-size: 16px; font-weight: bold;
    }
    .cart-qty button:hover { background: #22c55e; color: #fff; }
    .cart-del { background: none; border: none; color: #ef4444; cursor: pointer; font-size: 18px; }
    .cart-foot { padding: 18px 20px; border-top: 1px solid #e5e7eb; background: #f8fafc; }
    .cart-total {
        display: flex; justify-content: space-between;
        font-size: 18px; font-weight: bold; color: #0f172a; margin-bottom: 14px;
    }
    .cart-btn {
        width: 100%; padding: 12px; border: none; border-radius: 8px; cursor: pointer;
        font-weight: bold; font-size: 15px; margin-top: 8px; transition: .3s;
    }
    .cart-btn.verde { background: #22c55e; color: #fff; }
    .cart-btn.verde:hover { background: #16a34a; }
    .cart-btn.gris { background: #e5e7eb; color: #334155; }
    .cart-btn.gris:hover { background: #cbd5e1; }
    #cartToast {
        position: fixed; left: 50%; bottom: 95px; z-index: 2100;
        transform: translateX(-50%) translateY(20px); opacity: 0;
        background: #0f172a; color: #fff; padding: 12px 22px; border-radius: 10px;
        font-family: Arial, sans-serif; font-size: 15px; pointer-events: none;
        transition: .3s; max-width: 90%; text-align: center;
    }
    #cartToast.ver { opacity: 1; transform: translateX(-50%) translateY(0); }
    #cartToast.error { background: #dc2626; }
    `;

    document.head.appendChild(estilo);


    // -------------------------------------------------
    // ELEMENTOS (botón, panel, aviso)
    // -------------------------------------------------

    const fab = document.createElement("button");
    fab.id = "cartFab";
    fab.title = "Ver carrito";
    fab.innerHTML = '🛒<span id="cartCount">0</span>';

    const overlay = document.createElement("div");
    overlay.id = "cartOverlay";

    const panel = document.createElement("aside");
    panel.id = "cartPanel";
    panel.innerHTML = `
        <div class="cart-head">
            <h3>🛒 Tu carrito</h3>
            <button class="cart-close" title="Cerrar">&times;</button>
        </div>
        <div class="cart-body" id="cartBody"></div>
        <div class="cart-foot" id="cartFoot"></div>
    `;

    const toast = document.createElement("div");
    toast.id = "cartToast";

    document.body.appendChild(fab);
    document.body.appendChild(overlay);
    document.body.appendChild(panel);
    document.body.appendChild(toast);

    const cuerpo = panel.querySelector("#cartBody");
    const pie = panel.querySelector("#cartFoot");
    const contador = fab.querySelector("#cartCount");

    let temporizador;

    function aviso(texto, esError) {
        toast.textContent = texto;
        toast.className = "ver" + (esError ? " error" : "");
        clearTimeout(temporizador);
        temporizador = setTimeout(function () {
            toast.className = "";
        }, 2500);
    }

    function abrir() {
        panel.classList.add("abierto");
        overlay.classList.add("abierto");
    }

    function cerrar() {
        panel.classList.remove("abierto");
        overlay.classList.remove("abierto");
    }

    fab.addEventListener("click", abrir);
    overlay.addEventListener("click", cerrar);
    panel.querySelector(".cart-close").addEventListener("click", cerrar);

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") cerrar();
    });


    // -------------------------------------------------
    // DIBUJAR EL CARRITO
    // -------------------------------------------------

    function dibujar() {

        contador.textContent = cantidadTotal();

        if (carrito.length === 0) {
            cuerpo.innerHTML =
                '<div class="cart-vacio">Tu carrito está vacío.<br>Agrega productos para comenzar.</div>';
            pie.style.display = "none";
            return;
        }

        pie.style.display = "block";

        cuerpo.innerHTML = carrito.map(function (p) {
            return `
            <div class="cart-item">
                <img src="${esc(p.img)}" alt="${esc(p.nombre)}">
                <div class="cart-info">
                    <strong>${esc(p.nombre)}</strong>
                    <span>Bs. ${p.precio * p.cantidad}</span>
                    <small>Bs. ${p.precio} c/u · máx. ${limiteDe(p.nombre)}</small>
                    <div class="cart-qty">
                        <button data-accion="menos" data-id="${esc(p.id)}">−</button>
                        <b>${p.cantidad}</b>
                        <button data-accion="mas" data-id="${esc(p.id)}">+</button>
                    </div>
                </div>
                <button class="cart-del" title="Quitar" data-accion="quitar" data-id="${esc(p.id)}">🗑</button>
            </div>`;
        }).join("");

        pie.innerHTML = `
            <div class="cart-total"><span>Total</span><span>Bs. ${total()}</span></div>
            <button class="cart-btn verde" data-accion="pedir">Enviar pedido por WhatsApp</button>
            <button class="cart-btn gris" data-accion="vaciar">Vaciar carrito</button>
        `;
    }


    // -------------------------------------------------
    // ACCIONES
    // -------------------------------------------------

    function agregar(producto) {

        const limite = limiteDe(producto.nombre);
        const existente = carrito.find(function (p) { return p.id === producto.id; });

        if (existente) {
            if (existente.cantidad >= limite) {
                aviso("Límite alcanzado: máximo " + limite + " de «" + producto.nombre + "»", true);
                return;
            }
            existente.cantidad++;
        } else {
            producto.cantidad = 1;
            carrito.push(producto);
        }

        guardar();
        dibujar();
        aviso("✔ " + producto.nombre + " agregado al carrito");
    }

    function cambiarCantidad(id, cambio) {

        const p = carrito.find(function (x) { return x.id === id; });
        if (!p) return;

        if (cambio > 0 && p.cantidad >= limiteDe(p.nombre)) {
            aviso("Límite alcanzado: máximo " + limiteDe(p.nombre) + " de «" + p.nombre + "»", true);
            return;
        }

        p.cantidad += cambio;

        if (p.cantidad <= 0) {
            carrito = carrito.filter(function (x) { return x.id !== id; });
        }

        guardar();
        dibujar();
    }

    function enviarPedido() {

        let mensaje = "Hola, quiero hacer este pedido en Librería Estudiantil JP:\n\n";

        carrito.forEach(function (p) {
            mensaje += "• " + p.cantidad + " x " + p.nombre + " - Bs. " + (p.precio * p.cantidad) + "\n";
        });

        mensaje += "\nTotal: Bs. " + total();

        window.open(
            "https://wa.me/" + TELEFONO_WHATSAPP + "?text=" + encodeURIComponent(mensaje),
            "_blank"
        );
    }

    panel.addEventListener("click", function (e) {

        const boton = e.target.closest("[data-accion]");
        if (!boton) return;

        const accion = boton.dataset.accion;
        const id = boton.dataset.id;

        if (accion === "mas") cambiarCantidad(id, 1);
        if (accion === "menos") cambiarCantidad(id, -1);

        if (accion === "quitar") {
            carrito = carrito.filter(function (p) { return p.id !== id; });
            guardar();
            dibujar();
        }

        if (accion === "vaciar") {
            carrito = [];
            guardar();
            dibujar();
        }

        if (accion === "pedir") enviarPedido();
    });


    // -------------------------------------------------
    // CONECTAR LOS PRODUCTOS DE LA PÁGINA
    // -------------------------------------------------
    // Funciona con cualquier .producto que tenga:
    // <img>, <h3> (nombre) y <strong> (precio: "Precio: Bs. 15")

    document.querySelectorAll(".producto").forEach(function (tarjeta) {

        const nombre = tarjeta.querySelector("h3");
        const precioTexto = tarjeta.querySelector("strong");
        const imagen = tarjeta.querySelector("img");

        if (!nombre || !precioTexto) return;

        const coincidencia = precioTexto.textContent.match(/(\d+(?:[.,]\d+)?)/);
        const precio = coincidencia ? parseFloat(coincidencia[1].replace(",", ".")) : 0;

        let boton = tarjeta.querySelector(".btn-comprar");

        if (!boton) {
            boton = document.createElement("a");
            boton.className = "btn-comprar";
            tarjeta.appendChild(boton);
        }

        boton.textContent = "🛒 Agregar al carrito";
        boton.href = "#";
        boton.removeAttribute("target");

        boton.addEventListener("click", function (e) {
            e.preventDefault();

            agregar({
                id: nombre.textContent.trim().toLowerCase().replace(/\s+/g, "-"),
                nombre: nombre.textContent.trim(),
                precio: precio,
                img: imagen ? imagen.getAttribute("src") : ""
            });
        });
    });

    dibujar();

})();
