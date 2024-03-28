//Delaracion de variables de usuario y contraseña para el login
let usuarioIngresado = "",
    nombre = "",
    apellido = "",
    email = "",
    usuario = "",
    contraseña,
    intentos = 3,
    log = false,
    todosLosProductos = [],
    aPagar = 0,
    nombreIn,
    cantidad,
    prod,
    stockrestar = 0,
    carrito = [],
    carritoLs = localStorage.getItem('carrito');
if (carritoLs) {
    carrito = JSON.parse(carritoLs);
}



//TRAE LOS VALORES DE LOS INPUT Y EJECUTA LA FUNCION LOGIN
const inUsuario = document.getElementById('user'),
    formu = document.getElementById('form-login'),
    inPass = document.getElementById('pass');
formu.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!log) {
        login(inUsuario.value, inPass.value);
    }
});
//FUNCION PARA LOGIN
function login(inusuario, inPass) {
    //Me traigo datos del sessionStorage generado en el html formulario
    const datosUsuarioJSON = sessionStorage.getItem('nuevoRegistro'),
        datosUsuario = JSON.parse(datosUsuarioJSON);
    if (!datosUsuario) {
        Swal.fire('Debe crear un usuario primero');
        return;
    }
    nombre = datosUsuario.nombre,
        apellido = datosUsuario.apellido,
        email = datosUsuario.email,
        usuario = datosUsuario.user,
        contraseña = datosUsuario.contraseña;
    if (usuario === inusuario && contraseña === inPass) {//verificacion de usuario y pass
        log = true;
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });
        Toast.fire({
            icon: "success",
            title: "LOGIN CORRECTO. AHORA TIENES ACCESO AL Script"
        });
        creadorDeBotonLogOut();
        const recordar = document.getElementById('check').checked;
        if (recordar) {
            const datosUsuarioRe = { user: usuario, nombre: nombre, apellido: apellido, email: email, contraseña: contraseña, log: log };
            sessionStorage.setItem('nuevoRegistro', JSON.stringify(datosUsuarioRe));
        }
    } else {
        intentos -= 1;
        Swal.fire("Usuario o Contraseña incorrecta!\nIngrese nuevamente. Le quedan: " + intentos + " intentos.");
    }
    if (!log && intentos === 0) {
        Swal.fire("Se agotaron los intentos. Intente nuevamente más tarde.");
        return;
    }
}
//Traigo del seccion si el log fue correcto, por si el usuario deea seguir 
//comprando tenga guardado el acceso correcto
datosUsuarioJSON = sessionStorage.getItem('nuevoRegistro'),
    datosUsuario = JSON.parse(datosUsuarioJSON);
if (datosUsuario) {
    const { log: logJSON } = datosUsuario //destructuring con alias 
    log = logJSON;
}

//Condicional para poder ejecutar los botones
if (!log) {
    Swal.fire("Debe Logearse correctamente para poder ejecutar los botones del HTML");
} else {
    creadorDeBotonLogOut();
}

function creadorDeBotonLogOut() {
    const contenedorLog = document.querySelector('#form-login'),
        contenedorBtLog = document.createElement('button');
    contenedorBtLog.innerText = ('Cerrar Sesión');
    contenedorBtLog.classList.add('logoutBtn');
    contenedorLog.append(contenedorBtLog);
    logoutBtn = document.querySelector('.logoutBtn');
    logoutBtn.addEventListener('click', () => {
        log = false;
        sessionStorage.removeItem('nuevoRegistro');
        contenedorBtLog.remove();
    });
    logoutBtn.addEventListener('mouseover', () => {
        logoutBtn.style.transform = "scale(1.1)";
        logoutBtn.style.transition = "transform 0.2s ease-in-out";
    });
    logoutBtn.addEventListener('mouseout', () => {
        logoutBtn.style.transform = "scale(1)";
        logoutBtn.style.transition = "transform 0.2s ease-in-out";
    });
}
//-----------------------------------------------------------------------------------
//Trae productos de la Base de datos
//-----------------------------------------------------------------------------------
fetch("../db/db.json")
    .then((response) => response.json())
    .then((data) => {
        const { Productos } = data;
        todosLosProductos = Productos;
        crearProductosAlHTML(Productos)
    });

//devuelve un objeto con el primer producto encontrado
function obtenerProducto(nombre) {
    return todosLosProductos.find(producto => producto.nombre.toLowerCase() === nombre.toLowerCase());
}

//Funcion que genera los valores del selector de stock
function generarOpciones(stock) {
    let option = "";
    for (let i = 1; i <= stock; i++) {
        option += `<option value="${i}"> ${i} </option>`;
    }
    return option
}
//funcion que modifica el stock si se ingresa nuevamente el mismo producto y modifica el html actualizado
function modificarStockYHtml(producto, stock, nombreP) {
    const canti = document.getElementById(`${nombreP}-cantidad`),
        stockDispo = document.getElementById(`${nombreP}-stockDispo`);
    stockDispo.innerText = `Stock disponible: ${producto.stock}`;
    canti.innerHTML = generarOpciones(producto.stock);
}

//Funcion que genera el bloque de html con los datos e ids especificos
function bloqueHtml(Producto) {
    return `<div class="card" id="card-${Producto.nombre}">
                <h3>${Producto.nombre.charAt(0).toUpperCase() + Producto.nombre.slice(1)}</h3>
                <p>Precio:$${Producto.precio}</p>
                <p id='${Producto.nombre.toLowerCase()}-stockDispo'>Stock disponible: ${Producto.stock}</p>
                <div id="${Producto.nombre.toLowerCase()}-selector">
                    <label for="${Producto.nombre.toLowerCase()}-cantidad"> Seleccina unidades</label>
                    <select name="" id="${Producto.nombre.toLowerCase()}-cantidad">
                    ${generarOpciones(Producto.stock)}
                    </select>
                    <button id="btnComprar-${Producto.nombre.toLowerCase()}" class="btnComprar">Agregar al carrito</button>
                </div>
            </div>`;
}

//inserta etiquetas listas al html con los productos
function crearProductosAlHTML(array) {
    const contenedor = document.getElementById('ProductosDisponibles');
    cargarCarritoDesdeLocal();
    array.forEach(Producto => {
        const nuevosPro = document.createElement('li');
        nuevosPro.innerHTML = bloqueHtml(Producto);
        contenedor.append(nuevosPro);
        escucharAgregar(Producto);
        mouseover(Producto)
    })
    return
}

function mouseover(Producto) {
    const card = document.querySelector(`#card-${Producto.nombre}`);
    card.addEventListener('mouseover', () => {
        card.style.boxShadow = "0.3125rem 0.5rem 0.625rem 0.0625rem rgba(77, 255, 0, 0.552)";
        card.style.transform = "scale(1.1)";
        card.style.transition = "transform 0.2s ease";
    });
    card.addEventListener('mouseout', () => {
        card.style.transform = "scale(1)";
        card.style.transition = "transform 0.2s ease";
        card.style.boxShadow = "0.3125rem 0.5rem 0.625rem 0.0625rem rgba(183, 15, 255, 0.552)";
    });
}

//filtrar producto
function buscarProductos(arr, filtro) {
    if (log) {
        const encontrado = arr.find((producto) => {
            return producto.nombre.includes(filtro);
        });
        return encontrado;
    } else {
        Swal.fire("Debe logearse primero");
    }
}
//elementos del DOM para realizar el filtrado y luego imprimir el html de cada elemento encontrado
const input = document.getElementById('ingreso');
const btnBuscar = document.getElementById('buscar');
const contenedor = document.getElementById('filtrar');
if (log) {
    btnBuscar.addEventListener('click', (e) => {
        e.preventDefault();
        const encontrado = buscarProductos(todosLosProductos, input.value.toLowerCase());
        if (!encontrado) {
            Swal.fire('Producto no encontrado');
        } else {
            const liEncontrado = document.createElement('li');
            liEncontrado.innerHTML = bloqueHtml(encontrado);
            contenedor.append(liEncontrado);
            escucharAgregar(encontrado);
            mouseover(encontrado)
            const limpiar = document.getElementById('limpiar');
            limpiar.addEventListener('click', () => {
                liEncontrado.remove()
            })
        }
    });
}
//-----------------------------------------------------------------------------------
//comprar productos
//-----------------------------------------------------------------------------------

function escucharAgregar(Producto) {
    const btnComprar = document.getElementById(`btnComprar-${Producto.nombre.toLowerCase()}`),
        slcStock = document.getElementById(`${Producto.nombre}-cantidad`);
    btnComprar.addEventListener('click', (e) => {
        e.preventDefault()
        cantidad = slcStock.value;
        if (log) {
            agregarAlCarrito(Producto, cantidad, Producto.precio);
        } else {
            Swal.fire("Debe logearse primero");
        }
    });
}

//funcion que agrega productos al carrito y resta el stock de todosLosProductos
function agregarAlCarrito(Producto, cantidad, precio) {
    if (validarStock(Producto)) {
        prod = carrito.find(item => item.Producto.toLowerCase() === Producto.nombre.toLowerCase());
        if (!prod) {
            carrito.push({ Producto: Producto.nombre, Precio: precio, Unidades: parseInt(cantidad) });
            restarStock(cantidad, Producto.nombre);
            imprimeCarrito(carrito);
            modificarStockYHtml(Producto, Producto.stock, Producto.nombre);
        } else if (validarStock(Producto)) {
            prod.Unidades += parseInt(cantidad);
            restarStock(cantidad, Producto.nombre);
            modificarStockYHtml(Producto, Producto.stock, Producto.nombre);
            const contUnidades = document.getElementById(`${prod.Producto}-unidades`);
            let nuevasUnidades = innerHTML = `<p>Unidades seleccionadas: ${prod.Unidades}</p>`;
            contUnidades.innerHTML = nuevasUnidades;
        }
        totalAPagar(carrito);
        carritoALocal(carrito)
        return carrito
    }
}
//funciones para cargar los elementos del carrito al localStorage
function carritoALocal(carrito) {
    const prodEnJson = JSON.stringify(carrito);
    localStorage.setItem('carrito', prodEnJson);
}

//funciones para cargar los elementos del localStorage al Html
function cargarCarritoDesdeLocal() {
    const carritoDesdeLocal = localStorage.getItem('carrito');
    if (carritoDesdeLocal) {
        let carritoLocal = JSON.parse(carritoDesdeLocal);
        carritoLocal.forEach(producto => {
            const contCarrito = document.getElementById('carrito'),
                listaCreada = document.createElement('li');
            listaCreada.classList.add(`${producto.Producto}-li`)
            listaCreada.innerHTML = crearCarritoHtml(producto)
            contCarrito.append(listaCreada)
            totalAPagar(carritoLocal);
            restarStock(producto.Unidades, producto.Producto);
            eliminarProducto(producto);
        });
    }
}

//funcion para validar si hay stock sufiente antes de realizar la compra
function validarStock(producto) {
    return (producto.stock <= 0) ? ( //utilizacion de operador ternario
        Swal.fire(`Lo lamentamos, no tenemos más unidades de ${producto.nombre}`), false
    ) : true;
}

function restarStock(cantidad, Producto) {
    let productoEncontrado = obtenerProducto(Producto);
    if (productoEncontrado) {
        if (productoEncontrado.stock >= parseInt(cantidad)) {
            productoEncontrado.stock -= parseInt(cantidad);
        }
    }
}

function imprimeCarrito() {
    let ultimo = carrito[carrito.length - 1];
    const contCarrito = document.getElementById('carrito'),
        listaCreada = document.createElement('li');
    listaCreada.classList.add(`${ultimo.Producto}-li`)
    listaCreada.innerHTML = crearCarritoHtml(ultimo)
    contCarrito.append(listaCreada)
    eliminarProducto(ultimo)
}
//funcion que suma el valor de la cantidad de unidades por el precio de  cada item del carrito
function totalAPagar(carrito) {
    aPagar = carrito.reduce((total, producto) => total += (producto.Unidades * producto.Precio), 0)
    const parrafo = document.getElementById('total');
    parrafo.innerText = `Total a pagar: $${aPagar}`;
    return aPagar
}
// llama a la funcion que crea los productos que estan en el array todosLosProductos.

function crearCarritoHtml(Producto) {
    return `<div id="${Producto.Producto}-cardCarrito" class="cardCarrito">
    <h3>${Producto.Producto.charAt(0).toUpperCase() + Producto.Producto.slice(1)}</h3>
    <p>Precio unitario: $${Producto.Precio}</p>
    <p id="${Producto.Producto.toLowerCase()}-unidades">Unidades seleccionadas: ${Producto.Unidades}</p>
    <div id="${Producto.Producto.toLowerCase()}-contBoton">
        <button id="btnBorrar-${Producto.Producto.toLowerCase()}" class="btnComprar">Borrar Producto</button>
    </div>
</div>`;
}

//funcion que borra elementos del carrito y del html
function eliminarProducto(Producto) {
    const btnBorrar = document.getElementById(`btnBorrar-${Producto.Producto.toLowerCase()}`);
    btnBorrar.addEventListener('click', () => {
        const cardCarrito = document.querySelector(`.${Producto.Producto}-li`);
        cardCarrito.remove();
        let eliminado = obtenerProducto(Producto.Producto);
        eliminado.stock += Producto.Unidades;
        carrito.pop(eliminado);
        modificarStockYHtml(eliminado, eliminado.stock, Producto.Producto);
        aPagar -= (Producto.Unidades * Producto.Precio);
        const parrafo = document.getElementById('total');
        parrafo.innerText = `Total a pagar: $${aPagar}`;
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Producto eliminado",
            showConfirmButton: false,
            timer: 1000
        });
        carritoALocal(carrito);
    });
}
//funcion que elimina todos los productos agregados al carrito, devuelve el stock a todos los productos y modifica el html
function limpiarCarrito(carrito) {
    const btnlimpiar = document.getElementById('btnlim');
    btnlimpiar.addEventListener('click', () => {
        Swal.fire({
            title: "Estas seguro de lipiar el carrito?",
            text: "Se borraran todos los productos seleccionados!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, vaciar carrito!"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Eliminado!",
                    text: "Los Productos fueron eliminados.",
                    icon: "success"
                });
                carrito.forEach((producto) => {
                    const cardCarrito = document.querySelector(`.${producto.Producto}-li`);
                    cardCarrito.remove();
                    const productoEncontrado = obtenerProducto(producto.Producto);
                    productoEncontrado.stock += producto.Unidades;
                    modificarStockYHtml(productoEncontrado, productoEncontrado.stock, producto.Producto);
                });
                const contCarrito = document.getElementById('carrito')
                while (contCarrito.firstChild) {
                    contCarrito.removeChild(contCarrito.firstChild);
                }
                aPagar = 0;
                const parrafo = document.getElementById("total");
                parrafo.innerText = `Total a pagar: $${aPagar}`;
                localStorage.removeItem("carrito");
                carrito.length = 0;
            }
        });
    });
}

limpiarCarrito(carrito);


const btnFinalizarCompra = document.querySelector('#btnFl');
btnFinalizarCompra.addEventListener('click', () => {
    if (carrito.length === 0) {
        Swal.fire({
            position: "center",
            icon: "warning",
            title: "Su carrito está vacio",
            showConfirmButton: false,
            timer: 1000
        });
    } else {
        window.location.href = "../pages/Pagar.html";
    }
})