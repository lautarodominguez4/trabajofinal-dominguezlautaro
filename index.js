
const PRODUCTOS = [];
let botonesAgregar = document.querySelectorAll(`.agregar`);
let numerito = document.getElementById(`numerito`);
let botonesEliminar = document.querySelectorAll(`.eliminar`);
let  productoEnCarrito = JSON.parse(localStorage.getItem(`productoEnCarrito`)) || []; 
const TITULO_PRINCIPAL = document.getElementById(`tituloPrincipal`);
const PAGAR_CARRITO = document.getElementById(`pagarCarrito`);
PAGAR_CARRITO.onclick = verificarProductosEnCarrito;


async function cargarProductoEnArray() {
    const PRODUCTOS_JSON = './productos.json';
    try {
        const RESPONSE = await fetch(PRODUCTOS_JSON);
        if (!RESPONSE.ok) {
            throw new Error(`Error de red: ${RESPONSE.status}`);
        }
        const DATOS = await RESPONSE.json();
        PRODUCTOS.length = 0;
        PRODUCTOS.push(...DATOS);
        cargarProductos(PRODUCTOS.reverse()); 
    } catch (error) {
        console.error('Error al cargar productos desde el archivo JSON:', error);
    }
}


document.addEventListener('DOMContentLoaded', function () { 
    cargarProductoEnArray(); 
});


function cargarProductos(productoSeleccionado) {
    const PRODUCTOS_CONTENEDOR = document.getElementById(`productosContenedor`);
    PRODUCTOS_CONTENEDOR.innerHTML = ``; 
    productoSeleccionado.forEach(producto => {
        const ARTICLE = document.createElement(`article`);
        ARTICLE.className = `producto`;
        ARTICLE.innerHTML = `
            <div class="producto__foto">
                <img src="${producto.foto}" alt="pottery,${producto.tipo},${producto.marca},${producto.modelo},${producto.otro1},${producto.otro2}" class="foto">
            </div>
            <div class="producto__texto">
                <h4>Descripción: ${producto.marca}, ${producto.modelo}, ${producto.otro1}, ${producto.otro2}</h4>
                <h4>Precio: $${formatearPrecio(producto.precio)}</h4>
                <h4>Cantidad: ${producto.cantidad}</h4>
                <button class="agregar elemento boton" id="${producto.codigo}">Agregar</button>
            </div>
        `;
        PRODUCTOS_CONTENEDOR.appendChild(ARTICLE);
    }); actualizarBotonesAgregar();
}; cargarProductos(PRODUCTOS.reverse()); 


function formatearPrecio(precio) {
    const PRECIO_STRING = precio.toString(); 
    const LONGITUD = PRECIO_STRING.length;
    if (LONGITUD <= 3) {
        return PRECIO_STRING; 
    } else {
        const PARTE_ENTERA = PRECIO_STRING.slice(0, LONGITUD - 3); 
        const PARTE_DECIMAL = PRECIO_STRING.slice(LONGITUD - 3); 
        return `${PARTE_ENTERA}.${PARTE_DECIMAL}`; 
    }
}


function capitalizarPrimeraLetra(texto) { 
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}


const DROPDOWN = document.querySelectorAll(`.dropdown-item`);
DROPDOWN.forEach(boton => {
    boton.addEventListener(`click`, (e) => {
        if (e.currentTarget.id !== `TODOS`) {
            const PRODUCTO_CATEGORIA = PRODUCTOS.find(producto => producto.tipo === e.currentTarget.id);
            TITULO_PRINCIPAL.innerText = capitalizarPrimeraLetra(PRODUCTO_CATEGORIA.tipo);
            const PRODUCTOS_FILTRADOS = PRODUCTOS.filter(producto => producto.tipo === e.currentTarget.id);
            cargarProductos(PRODUCTOS_FILTRADOS);
        } else {
            TITULO_PRINCIPAL.innerText = `Todos los Productos`;
            cargarProductos(PRODUCTOS);
        }
    })
})


function removerAcentos(texto) {
    return texto.normalize(`NFD`).replace(/[\u0300-\u036f]/g, ``).toLowerCase();
}





const CARRITO = document.querySelector(`.carrito`);
toggleCarrito.addEventListener(`click`, () => {
    CARRITO.classList.toggle(`mostrar-carrito`); 
});


function agregarLocalStorage(nombre, valor) {
    localStorage.setItem(nombre, JSON.stringify(valor));
}


function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(`.agregar`);
    botonesAgregar.forEach(boton => {
        boton.addEventListener(`click`, agregarAlCarrito);
    })
}


function agregarAlCarrito(e) {
    const CODIGO_BOTON = e.currentTarget.id;
    const PRODUCTO_AGREGADO = PRODUCTOS.find(producto => producto.codigo === CODIGO_BOTON);
    const EN_CARRITO = productoEnCarrito.find(producto => producto.codigo === CODIGO_BOTON);
    if (EN_CARRITO) {
        if (EN_CARRITO.cantidad < PRODUCTO_AGREGADO.cantidad) {
            EN_CARRITO.cantidad++;
        } else {
            setTimeout(() => {
                Swal.fire({
                    title: "¡Atención!",
                    text: "No hay suficiente stock disponible",
                    icon: "warning",
                    confirmButtonColor: `darkgoldenrod`
                });
            }, 200);
        }
    } else {
        if (PRODUCTO_AGREGADO.cantidad > 0) {
            const NUEVO_PRODUCTO = { ...PRODUCTO_AGREGADO, cantidad: 1 };
            productoEnCarrito.reverse().push(NUEVO_PRODUCTO);
        } else {
            setTimeout(() => {
                Swal.fire({
                    title: "¡Atención!",
                    text: "No hay suficiente stock disponible",
                    icon: "warning",
                    confirmButtonColor: `darkgoldenrod`
                });
            }, 200);
        }
    }
    actualizarNumerito();
    agregarLocalStorage(`productoEnCarrito`, productoEnCarrito);
    cargarCarrito(productoEnCarrito.reverse());
    mostrarPrecioTotalEnCarrito();
}


function actualizarNumerito() {
    let nuevoNumerito = productoEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
    agregarLocalStorage(`nuevoNumerito`, nuevoNumerito);
}
window.addEventListener(`load`, () => { 
    const numeritoGuardado = localStorage.getItem(`nuevoNumerito`);
    if (numeritoGuardado) {
        numerito.innerText = numeritoGuardado;
    }
});


function cargarCarrito(productoSeleccionado) {
    const CARRITO_CONTENEDOR = document.getElementById(`carritoContenedor`);
    CARRITO_CONTENEDOR.innerHTML = ``; 
    productoSeleccionado.forEach(producto => {
        const ARTICLE = document.createElement(`article`);
        ARTICLE.className = `producto`;
        ARTICLE.innerHTML = `
            <div class="producto__foto">
                <img src="${producto.foto}" alt="potterys, ${producto.tipo}, ${producto.marca}, ${producto.modelo}, ${producto.otro1}, ${producto.otro2}" class="foto">
            </div>
            <div class="producto__texto">
                <h4>Descripción: ${producto.marca} ${producto.modelo} ${producto.otro1} ${producto.otro2}</h4>
                <h4>Precio: $${formatearPrecio(producto.precio)}</h4>
                <h4>Cantidad: ${producto.cantidad}</h4>
                <button class="eliminar elemento boton" id="${producto.codigo}">Eliminar</button>
            </div>
        `;
        CARRITO_CONTENEDOR.appendChild(ARTICLE); 
    }); actualizarBotonesEliminar(); 
}
const PRODUCTOS_GUARDADOS = JSON.parse(localStorage.getItem(`productoEnCarrito`)) || []; 
cargarCarrito(PRODUCTOS_GUARDADOS);


function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(`.eliminar`);
    botonesEliminar.forEach(boton => {
        boton.addEventListener(`click`, eliminarDelCarrito);
    })
}


function eliminarDelCarrito(e) {
    const CODIGO_BOTON = e.currentTarget.id;
    const INDEX = productoEnCarrito.findIndex(producto => producto.codigo === CODIGO_BOTON);
    if (INDEX !== -1) {
        if (productoEnCarrito[INDEX].cantidad > 1) {
            productoEnCarrito[INDEX].cantidad--;
        } else {
            productoEnCarrito.splice(INDEX, 1);
            setTimeout(() => {
                Swal.fire({
                    title: "¡Atención!",
                    text: "Producto eliminado del carrito.",
                    icon: "warning",
                    confirmButtonColor: `darkgoldenrod`
                });
            },300);
        }
    }
    cargarCarrito(productoEnCarrito);
    actualizarNumerito();
    agregarLocalStorage(`productoEnCarrito`, productoEnCarrito);
    mostrarPrecioTotalEnCarrito();
}


function sacarPrecioTotalCarrito() {
    let precioTotal = 0;
    for (const PRODUCTO of productoEnCarrito) { 
        precioTotal += PRODUCTO.precio * PRODUCTO.cantidad;
    }; return precioTotal;
}


function mostrarPrecioTotalEnCarrito() {
    const PRECIO_TOTAL = sacarPrecioTotalCarrito();
    let precioTotalElement = document.getElementById(`carritoTotal`); 
    if (precioTotalElement) {
        precioTotalElement.innerText = `$${formatearPrecio(PRECIO_TOTAL)}`; 
    }
}; mostrarPrecioTotalEnCarrito(); 
function rebajarProductosVendidos(productosVendidos) {
    productosVendidos.forEach(productoVendido => {
        const productoEnStock = PRODUCTOS.find(producto => producto.codigo === productoVendido.codigo);
        if (productoEnStock) {
            productoEnStock.cantidad -= productoVendido.cantidad; 
            if (productoEnStock.cantidad < 0) { 
                productoEnStock.cantidad = 0;
            }
        }
    });
    cargarProductos(PRODUCTOS); 
}


function verificarProductosEnCarrito() {
    if (productoEnCarrito.length > 0) {
        setTimeout(() => {
            Swal.fire({
                title: "¡Compra Realizada!",
                text: "Muchas gracias por confiar en nosotros...",
                icon: "success",
                confirmButtonColor: `green`
            });
        }, 200);
        rebajarProductosVendidos(productoEnCarrito); 
        productoEnCarrito.splice(0, productoEnCarrito.length); 
    }
    cargarCarrito(productoEnCarrito);
    actualizarNumerito();
    agregarLocalStorage(`productoEnCarrito`, productoEnCarrito);
    mostrarPrecioTotalEnCarrito();
}