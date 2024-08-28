const express = require('express');
const routerUsuarios = express.Router();
const { sql, poolPromise } = require('../database_handler');

//Middleware
routerUsuarios.use(express.json());
// Middleware: Esto se ejecuta después de recibir una solicitud
// y antes de dar una respuesta.


routerUsuarios.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Usuarios'); // Reemplaza 'Usuarios' con tu tabla de usuarios
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Error al obtener los usuarios');
        console.error('Error en GET /usuarios:', err);
    }
});


module.exports = routerUsuarios;