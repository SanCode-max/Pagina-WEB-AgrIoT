

document.addEventListener("DOMContentLoaded",function(){

    var contener_datos= document.querySelector(".contenedor__datos")
    var datos_login = document.querySelector(".datos__login");
    var datos_registro = document.querySelector(".datos__registro");
    var caja_login = document.querySelector(".caja-login");
    var caja_registro = document.querySelector(".caja-registro");

    document.getElementById("btn_registro").addEventListener('click', registrar);
    document.getElementById("btn_sesion").addEventListener('click',inicioSesion);
    window.addEventListener("resize", anchorPagina);


    //FUNCIONALIDAD CAJAS REGISTRO
    function anchorPagina(){
        if(window.innerWidth>850){
            caja_login.style.display = "block";
            caja_registro.style.display= "block";
        }else{
            caja_registro.style.display="block";
            caja_registro.style.opacity="1";
            caja_login.style.display="none";
            datos_login.style.display="block"
            datos_registro.style.display="none";
        }
    }

    anchorPagina();

    function inicioSesion(){
        if(window.innerWidth>850){
        datos_registro.style.display = "none";
        contener_datos.style.left = "10px"
        datos_login.style.display = "block";
        caja_registro.style.opacity = "1";
        caja_login.style.opacity = "0";
        }else{
            datos_registro.style.display = "none";
            contener_datos.style.left = "0px"
            datos_login.style.display = "block";
            caja_registro.style.display = "block";
            caja_login.style.display = "none";

        }
    }

    function registrar(){
        if(window.innerWidth>850){
        datos_registro.style.display = "block";
        contener_datos.style.left = "410px"
        datos_login.style.display = "none";
        caja_registro.style.opacity = "0";
        caja_login.style.opacity = "1";
        }else{
            datos_registro.style.display = "block";
            contener_datos.style.left = "0px"
            datos_login.style.display = "none";
            caja_registro.style.display = "none";
            caja_login.style.display = "block";
            caja_login.style.opacity = "1";
        }
    }

    //Rutas para la captura y autenticacion de los datos
    
    document.getElementById("registroform").addEventListener("submit",async function(event) {
        event.preventDefault(); // Evita la recarga de la página
    
        const nombre = document.getElementById("nombre").value;
        const correo = document.getElementById("correo").value;
        const contraseña = document.getElementById("contraseña").value;

        const datos = { nombre, correo, contraseña };

        try {
            const respuesta = await fetch("http://localhost:5001/registrar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });

            const resultado = await respuesta.json();

            if (!respuesta.ok) {
                // Mostrar error del servidor
                alert(resultado.error);
                return;
            }

            alert("Registro exitoso");
        } catch (error) {
            console.error("Error al enviar los datos:", error);
            alert("Error de conexión con el servidor.");
        }
    });



    // Autenticación de datos para el inicio de sesión
    document.getElementById("valregistro").addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita que el formulario se envíe de forma tradicional

        const correo = document.getElementById("valcorreo").value;
        const contraseña = document.getElementById("valcontraseña").value;

        // Validación en el frontend
        if (!correo || !contraseña) {
            alert("Correo y contraseña son obligatorios");
            return;
        }

        try {
            const response = await fetch("http://localhost:5001/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo, contraseña }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error en la solicitud");
            }

            const data = await response.json();
            alert(data.message); // Mensaje de éxito
            document.getElementById("valregistro").reset(); // Vacía el formulario

            // Redirigir a la página de usuario
            window.location.href = 'usuario.html';
        } catch (error) {
            alert(error.message); // Mensaje de error
        }
    });

    


})



