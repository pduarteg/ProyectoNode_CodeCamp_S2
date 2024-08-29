const express = require('express');
const routerCat_Prods = express.Router();
const { sql, poolPromise } = require('../database_handler');

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

routerCat_Prods.post('/crearCategoria', async (req, res) => {
    const { nombre, usuario_id_usuario, estado_id_estado } = req.body;

    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('nombre', sql.VarChar(45), nombre)
            .input('usuario_id_usuario', sql.Int, usuario_id_usuario)
            .input('estado_id_estado', sql.Int, estado_id_estado)
            .execute('SP_crear_categoria_prod');

        res.status(201).json({ message: 'Categoría creada con éxito.' });
    } catch (err) {
        res.status(500).send('Error al crear la categoría.');
        console.error('Error en POST /Cat_Prods/crearCategoria:', err);
    }
});

routerCat_Prods.put('/actualizarCategoria/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, usuario_id_usuario, estado_id_estado } = req.body;

    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('id_categoria_producto', sql.Int, id)
            .input('usuario_id_usuario', sql.Int, usuario_id_usuario)
            .input('estado_id_estado', sql.Int, estado_id_estado)
            .input('nombre', sql.VarChar(45), nombre)
            .execute('SP_modificar_categoria_producto');

        res.status(200).json({ message: 'Categoría actualizada con éxito.' });
    } catch (err) {
        res.status(500).send('Error al actualizar la categoría');
        console.error('Error en PUT /Cat_Prods/actualizarCategoria:', err);
    }
});


module.exports = routerCat_Prods;