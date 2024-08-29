const express = require('express');
const routerUsuarios = express.Router();
const { sql, poolPromise } = require('../database_handler');

// Para encriptar contraseñas
const bcrypt = require('bcrypt');
//Middleware
routerUsuarios.use(express.json());
// Middleware: Esto se ejecuta después de recibir una solicitud
// y antes de dar una respuesta.

// Uso del autenticador:
const {encrypt, compare} = require('../bcrypt_handler')
// --------------------------------------------

routerUsuarios.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM usuarios');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Error al obtener los usuarios');
        console.error('Error en GET /usuarios:', err);
    }
});

routerUsuarios.post('/crearUsuario', async (req, res) => {
    const { rol, estado, correo, nombre_completo, u_pass, tel, fecha_nacimiento } = req.body;

    try {
        const pool = await poolPromise;

        // Para el encriptado de la contrasenia (antiguo método)
        // const numero_rondas = 10;
        // Contrasenia hash
        // const contrasenia_encriptada = await bcrypt.hash(u_pass, numero_rondas);
        // console.log("Contraseña dada:")
        // console.log(u_pass)
        // console.log("Contraseña encriptada:")
        // console.log(contrasenia_encriptada)

        // Uso del 'bcrypt_handler.js' (nuevo método)
        const contrasenia_encriptada = await encrypt(u_pass)

        const result = await pool.request()
            .input('rol', sql.Int, rol)
            .input('estado', sql.Int, estado)
            .input('correo', sql.VarChar(45), correo)
            .input('nombre_completo', sql.VarChar(60), nombre_completo)
            .input('u_pass', sql.VarChar(255), contrasenia_encriptada)
            .input('tel', sql.VarChar(45), tel)
            .input('fecha_nacimiento', sql.Date, fecha_nacimiento)
            .execute('SP_crear_usuario');

        res.status(201).json({ message: 'Usuario creado con éxito.' });
    } catch (err) {
        res.status(500).send('Error al crear el usuario');
        console.error('Error en POST /usuarios/crearUsuario:', err);
    }
});

routerUsuarios.put('/actualizarUsuario/:id', async (req, res) => {
    const { id } = req.params;
    const { rol, estado, correo, nombre_completo, u_pass, tel, fecha_nacimiento } = req.body;

    try {
        const pool = await poolPromise;

        const numero_rondas = 10;
        const contrasenia_encriptada = await bcrypt.hash(u_pass, numero_rondas);
        
        const result = await pool.request()
            .input('id_usuario', sql.Int, id)
            .input('rol_id_rol', sql.Int, rol)
            .input('estado_id_estados', sql.Int, estado)
            .input('correo_electronico', sql.VarChar(45), correo)
            .input('nombre_completo', sql.VarChar(60), nombre_completo)
            .input('user_password', sql.VarChar(255), contrasenia_encriptada)
            .input('telefono', sql.VarChar(45), tel)
            .input('fecha_nacimiento', sql.Date, fecha_nacimiento)
            .execute('SP_modificar_usuario');

        res.status(200).json({ message: 'Usuario actualizado con éxito.' });
    } catch (err) {
        res.status(500).send('Error al actualizar el usuario');
        console.error('Error en PUT /usuarios/actualizarUsuario:', err);
    }
});


module.exports = routerUsuarios;