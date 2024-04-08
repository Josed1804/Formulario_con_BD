const express = require("express");
const mysql = require("mysql");
const app = express();

// Configuración de la conexión a la base de datos
let conexion = mysql.createConnection({
    host: "localhost",
    database: "basededatosejemplo",
    user: "root",
    password: ""
});

app.set("view engine", "ejs");


// Establecer conexión
conexion.connect((error) => {
    if (error) {
        console.error("Error al conectar a la base de datos: " + error.message);
        return;
    }
    console.log("Conexión establecida correctamente.");
});

// Middleware para analizar cuerpos de solicitud codificados en url
app.use(express.urlencoded({ extended: false }));

// Ruta para mostrar el formulario de registro
app.get("/", function (req, res) {
    res.render("registro");
});

// Ruta para manejar la solicitud de registro
app.post("/validar", function (req, res) {
    const datos = req.body;
    console.log(datos);

    let cedula = datos.ced;
    let nombre = datos.nom;
    let apellido = datos.apell;
    let correo = datos.correo;
    let password = datos.password;

    // Consulta SQL para buscar si la cédula ya está registrada
    let buscar = "SELECT * FROM tabla_usuarios WHERE ced = '" + cedula + "'";
    conexion.query(buscar, function (error, row) {
        if (error) {
            throw error;
        } else {
            if (row.length > 0) {
                console.log("No se puede registrar, usuario ya existe.");
                res.redirect("/"); // Redirecciona a la página de inicio
            } else {
                // Si la cédula no está registrada, se inserta el nuevo usuario en la base de datos
                const registrar = `
                INSERT INTO tabla_usuarios (ced, nombre, apellido, correo, password)
                VALUES ('${cedula}', '${nombre}', '${apellido}', '${correo}', '${password}')`;
                conexion.query(registrar, function (error) {
                    if (error) {
                        throw error;
                    } else {
                        console.log("Datos almacenados correctamente.");
                        res.redirect("/"); // Redirecciona a la página de inicio
                    }
                });
            }
        }
    });
});

// Puerto en el que el servidor escuchará
const PORT = 3000;

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
