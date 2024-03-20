function cargarCarritoDesdeLocal() {
    const carritoDesdeLocal = localStorage.getItem('carrito');
    if (carritoDesdeLocal) {
        let carritoLocal = JSON.parse(carritoDesdeLocal);
        totalAPagar(carritoLocal);
    }
}

cargarCarritoDesdeLocal()

function totalAPagar(carrito) {
    aPagar = carrito.reduce((total, producto) => total += (producto.Unidades * producto.Precio), 0)
    const pagarTotal = document.getElementById('pagarTotal');
    pagarTotal.innerText = `Total a pagar: $${aPagar}`;
    return
}

const btnpagar = document.querySelector('#register');
btnpagar.addEventListener('submit', (e) => {
    e.preventDefault();
    Swal.fire({
        position: "center",
        icon: "success",
        title: "Pago exitoso",
        showConfirmButton: false,
        timer: 1500
    });
})