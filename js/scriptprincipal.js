document.addEventListener("DOMContentLoaded",function(){
    document.getElementById('btn_SPrincipal').addEventListener('click', function() {
        // Mostrar la pantalla flotante
        document.getElementById('floatingWindow').style.display = 'block';
        // Mostrar el fondo oscuro
        document.body.insertAdjacentHTML('beforeend', '<div class="overlay" id="overlay"></div>');
        document.getElementById('overlay').style.display = 'block';
    });

    // Cerrar la pantalla flotante al hacer clic fuera de ella
    document.addEventListener('click', function(event) {
        if (event.target.id === 'overlay') {
            document.getElementById('floatingWindow').style.display = 'none';
            document.getElementById('overlay').style.display = 'none';
        }
    });

    

})