const express = require('express');
const routerEstados = express.Router();
const { sql, poolPromise } = require('../database_handler');
const { verifyToken } = require('../controladores/generador_token')

routerEstados.use(express.json());

// Uso del middleware para autenticacion:
const {revisar_autenticacion, autenticar_rol} = require('../middleware/autenticacion');

// Permisos
const permisos_de_roles = require('../dicc_roles');

routerEstados.get('/', revisar_autenticacion, autenticar_rol([permisos_de_roles.Operadores]), async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM estados');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Error al obtener los Estados');
        console.error('Error en GET /Estados:', err);
    }
});

routerEstados.post('/crearEstado', revisar_autenticacion, autenticar_rol([permisos_de_roles.Operadores]), async (req, res) => {
    const { nombre } = req.body;

    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('nombre', sql.VarChar(45), nombre)
            .execute('SP_crear_estado');

        res.status(201).json({ message: 'Estado creado con éxito.' });
    } catch (err) {
        res.status(500).send('Error al crear el Estado');
        console.error('Error en POST /Estados/crearEstado:', err);
    }
});

routerEstados.put('/actualizarEstado/:id', revisar_autenticacion, autenticar_rol([permisos_de_roles.Operadores]), async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;

    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('id_Estado', sql.Int, id)
            .input('nombre', sql.VarChar(45), nombre)
            .execute('SP_modificar_estado');

        res.status(200).json({ message: 'Estado actualizado con éxito.' });
    } catch (err) {
        res.status(500).send('Error al actualizar el Estado');
        console.error('Error en PUT /Estados/actualizarUsuario:', err);
    }
});


module.exports = routerEstados;