
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const app = express();

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'n0m3l0',
    database: 'La_Desesperanza'
});

con.connect((err) => {
    if (err) {
        console.error("Error al conectar", err);
        return;
    }
    console.log("Conectado a la base de datos");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/agregarUsuario', (req, res) => {
    let nombre = req.body.nombre;
    let correo = req.body.email;
    let password = req.body.password;
    con.query('INSERT INTO Cliente (nombre, email, contraseña) VALUES (?,?,?)', [nombre,correo,password], (err, respuesta) => {
        if (err) {
            console.log("Error al insertar usuario", err);
            return res.status(500).send("Error al insertar usuario");
        }

        return res.send(`<h1>Nombre:</h1> ${nombre}`);
    });
});

app.get('/obtenerUsuario', (req, res) => {
    con.query('SELECT * FROM Cliente', (err, respuesta) => {
        if (err) {
            console.log("Error al obtener usuarios", err);
            return res.status(500).send("Error al obtener usuarios");
        }

        let userHTML = '';
        let i = 1;
        respuesta.forEach(user => {
            userHTML += `<tr><td>${i}</td><td>${user.nombre}</td></tr>`;
            i++;
        });

        return res.send(`<html>
        <head>
        <title>Lista de Usuarios</title>
        </head>
        <body>
        <table>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
            </tr>
            ${userHTML}
        </table>
        </body>
        </html>`);
    });
});

app.post('/borrarUsuario', (req, res) => {
    let nombre = req.body.nombre // El ID del usuario a eliminar viene en el cuerpo de la solicitud
    console.log("hola")
    con.query('DELETE FROM Cliente WHERE nombre = ?', [nombre], (err, resultado, fields) => {

        if (err) {
            console.error('Error al borrar el usuario:', err);
            return res.status(500).send("Error al borrar el usuario");
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).send("Usuario no encontrado");
        }
        return res.send(`Usuario con ID ${id} borrado correctamente`);
    });
});

app.post('/actualizarUsuario', (req, res) => {
    const nom = req.body.nom;
    const newnom = req.body.newnom;
    con.query('UPDATE usuario SET nombre = ? WHERE nombre = ?', [newnom, nom], (err, resultado, fields) => {
        if (err) {
            console.error('Error al actualizar el usuario:', err);
            return res.status(500).send("Error al actualizar el usuario");
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).send("Usuario no encontrado");
        }
        return res.send(`Usuario con nombre ${nom} actualizado correctamente`);
    });
});

// Agregar producto
app.post('/agregarProducto', (req, res) => {
    let nombre = req.body.nombre;
    let precio = req.body.precio;
    let stock = req.body.stock;
    let descripcion = req.body.descripcion;

    con.query('INSERT INTO Producto (nombre, precio, stock, descripcion) VALUES (?,?,?,?)', 
        [nombre, precio, stock, descripcion], (err, respuesta) => {
        if (err) {
            console.log("Error al insertar producto", err);
            return res.status(500).send("Error al insertar producto");
        }
        return res.send("Producto agregado correctamente");
    });
});

// Obtener productos
app.get('/obtenerProductos', (req, res) => {
    con.query('SELECT * FROM Producto', (err, respuesta) => {
        if (err) {
            console.log("Error al obtener productos", err);
            return res.status(500).send("Error al obtener productos");
        }

        let productHTML = '';
        let i = 1;
        respuesta.forEach(product => {
            productHTML += `<tr><td>${i}</td><td>${product.nombre}</td><td>${product.precio}</td><td>${product.stock}</td><td>${product.descripcion}</td></tr>`;
            i++;
        });

        return res.send(`<html>
        <head>
        <title>Lista de Productos</title>
        <link rel="stylesheet" type="text/css" href="style.css">
        </head>
        <body>
        <table>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Descripción</th>
            </tr>
            ${productHTML}
        </table>
        </body>
        </html>`);
    });
});

// Borrar producto
app.post('/borrarProducto', (req, res) => {
    let id_producto = req.body.id_producto;

    con.query('DELETE FROM Producto WHERE id_producto = ?', [id_producto], (err, resultado) => {
        if (err) {
            console.error('Error al borrar el producto:', err);
            return res.status(500).send("Error al borrar el producto");
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).send("Producto no encontrado");
        }
        return res.send(`Producto con ID ${id_producto} borrado correctamente`);
    });
});

// Actualizar producto
app.post('/actualizarProducto', (req, res) => {
    const id_producto = req.body.id_producto;
    const nuevo_nombre = req.body.nuevo_nombre;
    const nuevo_precio = req.body.nuevo_precio;
    const nuevo_stock = req.body.nuevo_stock;
    const nueva_descripcion = req.body.nueva_descripcion;

    con.query('UPDATE Producto SET nombre = ?, precio = ?, stock = ?, descripcion = ? WHERE id_producto = ?', 
        [nuevo_nombre, nuevo_precio, nuevo_stock, nueva_descripcion, id_producto], (err, resultado) => {
        if (err) {
            console.error('Error al actualizar el producto:', err);
            return res.status(500).send("Error al actualizar el producto");
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).send("Producto no encontrado");
        }
        return res.send(`Producto con ID ${id_producto} actualizado correctamente`);
    });
});

app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});
