const express = require('express');
const routerUsuarios = express.Router();
const { sql, poolPromise } = require('../database_handler');

// Para encriptar contraseñas
const bcrypt = require('bcrypt');
//Middleware
routerUsuarios.use(express.json());
// Middleware: Esto se ejecuta después de recibir una solicitud
// y antes de dar una respuesta.

// Uso del bcrypt_handler (cifrado de contraseñas):
const {encrypt, compare} = require('../bcrypt_handler');

// Uso del middleware para autenticacion:
const {revisar_autenticacion, autenticar_rol} = require('../middleware/autenticacion');

// Permisos
const permisos_de_roles = require('../dicc_roles');

// -----------------------------------------------------------------------------------------------------


// El identificador 2 para rol es un OPerador Administrativo
routerUsuarios.get('/', revisar_autenticacion, autenticar_rol([permisos_de_roles.Operadores]), async (req, res) => {
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
    const { rol, correo, nombre_completo, u_pass, tel, fecha_nacimiento } = req.body;

    try {
        const pool = await poolPromise;

        const contrasenia_encriptada = await encrypt(u_pass);
        console.log("can I see this?");

        const result = await pool.request()
            .input('rol', sql.Int, rol)
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

routerUsuarios.put('/actualizarUsuario/:id', revisar_autenticacion, async (req, res) => {
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