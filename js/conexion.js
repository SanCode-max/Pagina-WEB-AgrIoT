const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt"); // Asegúrate de importar bcrypt

const app = express();
app.use(cors()); 
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
const session = require("express-session");
require('dotenv').config();


let connection = mysql.createConnection({
    host: "localhost",
    database: "registroweb",
    user: "root",
    password: "s4nt1ag0",
});

connection.connect(function (err) {
    if (err) {
        console.error("Error de conexión:", err);
        throw err;
    }
    console.log("Conexión exitosa con la base de datos");
});

app.post("/registrar", (req, res) => {
    const { nombre, correo, contraseña } = req.body;

    if (!nombre || !correo || !contraseña) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Verificar si el correo ya existe
    const verificarCorreoSQL = "SELECT * FROM usuarios WHERE correo = ?";
    connection.query(verificarCorreoSQL, [correo], (err, resultados) => {
        if (err) {
            console.error("Error al verificar correo:", err);
            return res.status(500).json({ error: "Error al verificar el correo" });
        }

        if (resultados.length > 0) {
            return res.status(400).json({ error: "El correo ya está registrado" });
        }

        // Si no existe, encriptamos y registramos
        bcrypt.hash(contraseña, 10, (err, hash) => {
            if (err) {
                console.error("Error al encriptar la contraseña:", err);
                return res.status(500).json({ error: "Error al procesar la contraseña" });
            }

            const sql = "INSERT INTO usuarios (nombre, correo, contraseña) VALUES (?, ?, ?)";
            connection.query(sql, [nombre, correo, hash], (err, result) => {
                if (err) {
                    console.error("Error al registrar datos:", err);
                    return res.status(500).json({ error: "Error al registrar los datos" });
                }
                res.status(200).json({ message: "Registro exitoso" });
            });
        });
    });
});

// Autenticación de usuario
app.post("/login", (req, res) => {
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
        return res.status(400).json({ error: "Correo y contraseña son obligatorios" });
    }

    const sql = "SELECT * FROM usuarios WHERE correo = ?";
    connection.query(sql, [correo], (err, results) => {
        if (err) {
            console.error("Error al buscar usuario:", err);
            return res.status(500).json({ error: "Error en el servidor" });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: "Correo o contraseña incorrectos" });
        }

        const usuario = results[0];

        // Comparar la contraseña con el hash almacenado
        bcrypt.compare(contraseña, usuario.contraseña, (err, resultado) => {
            if (err) {
                console.error("Error al comparar contraseñas:", err);
                return res.status(500).json({ error: "Error en el servidor" });
            }

            if (!resultado) {
                return res.status(401).json({ error: "Correo o contraseña incorrectos" });
            }

            res.status(200).json({ message: "Inicio de sesión exitoso", usuario });
        });
    });
});

const session = require("express-session");

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));


// Configuración de encabezados de seguridad
app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    next();
});

// Configuración de caché para recursos estáticos
app.use(express.static("public", {
    maxAge: "31536000", // 1 año en segundos
    immutable: true, // Indica que el recurso no cambiará
}));

// Servir recursos estáticos
app.use(express.static("public"));

app.listen(5001, () => {
    console.log("Servidor corriendo en http://localhost:5001");
});
