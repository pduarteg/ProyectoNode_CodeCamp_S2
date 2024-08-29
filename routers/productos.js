const express = require('express');
const routerProductos = express.Router();
const { sql, poolPromise } = require('../database_handler');

routerProductos.use(express.json());

routerProductos.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM productos');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Error al obtener los productos');
        console.error('Error en GET /productos:', err);
    }
});

routerProductos.post('/crearProducto', async (req, res) => {
    const { categ, usuario, nombre, marca, codigo, stock, estado_id, precio } = req.body;

    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('categ_id_categoria', sql.Int, categ)
            .input('usuario_id_usuario', sql.Int, usuario)
            .input('nombre', sql.VarChar(45), nombre)
            .input('marca', sql.VarChar(45), marca)
            .input('codigo', sql.VarChar(45), codigo)
            .input('stock', sql.Int, stock)
            .input('estado_id_estado', sql.Int, estado_id)
            .input('precio', sql.Float, precio)
            .execute('SP_crear_producto');

        res.status(201).json({ message: 'Producto creado con éxito.' });
    } catch (err) {
        res.status(500).send('Error al crear el producto');
        console.error('Error en POST /productos/crearProducto:', err);
    }
});

routerProductos.put('/actualizarProducto/:id', async (req, res) => {
    const { id } = req.params;
    const { categ, usuario, nombre, marca, codigo, stock, estado_id, precio, foto} = req.body;

    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('id_producto', sql.Int, id)
            .input('id_categoria_producto', sql.Int, categ)
            .input('usuario_id_usuario', sql.Int, usuario)
            .input('estado_id_estado', sql.Int, estado_id)
            .input('nombre', sql.VarChar(45), nombre)
            .input('marca', sql.VarChar(45), marca)
            .input('codigo', sql.VarChar(45), codigo)
            .input('stock', sql.Int, stock)
            .input('precio', sql.Float, precio)
            .input('foto', sql.Binary, foto)
            .execute('SP_modificar_producto');

        res.status(200).json({ message: 'Producto actualizado con éxito.' });
    } catch (err) {
        res.status(500).send('Error al actualizar el producto');
        console.error('Error en PUT /productos/actualizarUsuario:', err);
    }
});


module.exports = routerProductos;