const express = require('express');
const routerCat_Prods = express.Router();
const { sql, poolPromise } = require('../database_handler');
const { verifyToken } = require('../controladores/generador_token')

// Uso del middleware para autenticacion:
const {revisar_autenticacion, autenticar_rol} = require('../middleware/autenticacion');

// Permisos
const permisos_de_roles = require('../dicc_roles');

routerCat_Prods.use(express.json());

routerCat_Prods.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM categoria_productos');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Error al obtener las Categorías de Productos');
        console.error('Error en GET /categoriasProductos:', err);
    }
});

routerCat_Prods.post('/crearCategoria', revisar_autenticacion, autenticar_rol([permisos_de_roles.Clientes]), async (req, res) => {
    const { nombre } = req.body;

    const token = req.headers.authorization.split(' ').pop();
    const tokenData = await verifyToken(token);
    const usuario = tokenData.id_usuario;

    try {
        const token = req.headers.authorization.split(' ').pop();
        const tokenData = await verifyToken(token);
        const usuario = tokenData.id_usuario;

        const pool = await poolPromise;
        const result = await pool.request()
            .input('nombre', sql.VarChar(45), nombre)
            .input('usuario_id_usuario', sql.Int, usuario)
            .execute('SP_crear_categoria_prod');

        res.status(201).json({ message: 'Categoría creada con éxito.' });
    } catch (err) {
        res.status(500).send('Error al crear la categoría.');
        console.error('Error en POST /Cat_Prods/crearCategoria:', err);
    }
});

routerCat_Prods.put('/actualizarCategoria/:id', revisar_autenticacion, autenticar_rol([permisos_de_roles.Clientes]), async (req, res) => {
    const { id } = req.params;
    const { nombre, estado_id_estado } = req.body;

    try {
        const token = req.headers.authorization.split(' ').pop();
        const tokenData = await verifyToken(token);
        const usuario = tokenData.id_usuario;

        const pool = await poolPromise;
        const resultU = await pool.request()
            .input('id_c_producto', sql.Int, id)
            .query('SELECT usuario_id_usuario FROM categoria_productos WHERE id_categoria_productos = @id_c_producto');
        const Id_duenio = resultU.recordset[0].usuario_id_usuario // del dueño del producto
        
        if(Id_duenio == usuario){
            const result = await pool.request()
                .input('id_categoria_producto', sql.Int, id)
                .input('usuario_id_usuario', sql.Int, usuario)
                .input('estado_id_estado', sql.Int, estado_id_estado)
                .input('nombre', sql.VarChar(45), nombre)
                .execute('SP_modificar_categoria_producto');

            res.status(200).json({ message: 'Categoría actualizada con éxito.' });
        } else {
            res.status(409).json({ message: 'No puedes actualizar esta categoria porque no te pertenece.' });
        }
    } catch (err) {
        res.status(500).send('Error al actualizar la categoría');
        console.error('Error en PUT /Cat_Prods/actualizarCategoria:', err);
    }
});


module.exports = routerCat_Prods;