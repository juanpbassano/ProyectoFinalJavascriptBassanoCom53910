function registrarUsuario() {
    const formulario = document.getElementById('register');
    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('usrR'),
        nombre = document.getElementById('nombreR'),
            apellido = document.getElementById('apellidoR'),
            email = document.getElementById('emailR'),
            contraseña = document.getElementById('passR1'),
            repetirContraseña = document.getElementById('passR2');
        if (nombre.value == '' || apellido.value == '' || email.value == '' || contraseña.value == '' || repetirContraseña.value == '') {
            Swal.fire('Por favor, completa todos los campos del formulario.');
            return;
        }
        if (contraseña.value !== repetirContraseña.value) {
            Swal.fire('Las contraseñas no coinciden.');
            return;
        }
        datosUsuario = { user: (user.value), nombre: (nombre.value), apellido: (apellido.value), email: (email.value), contraseña: (contraseña.value) };
        sessionStorage.setItem('nuevoRegistro', JSON.stringify(datosUsuario));
        Swal.fire('¡Registro exitoso!');
        setTimeout(() => {
            window.location.href = './pages/principal.html';
        }, 1500);
        
    });
}
registrarUsuario();

