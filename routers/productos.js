const express = require('express');
const routerProductos = express.Router();
const { sql, poolPromise } = require('../database_handler');
const { verifyToken } = require('../controladores/generador_token')

// Uso del middleware para autenticacion:
const {revisar_autenticacion, autenticar_rol} = require('../middleware/autenticacion');

// Permisos
const permisos_de_roles = require('../dicc_roles');



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

routerProductos.post('/crearProducto', revisar_autenticacion, autenticar_rol([permisos_de_roles.Clientes]), async (req, res) => {
    const { categ, nombre, marca, codigo, stock, precio } = req.body;

    try {
        const token = req.headers.authorization.split(' ').pop();
        const tokenData = await verifyToken(token);
        const usuario = tokenData.id_usuario;

        const pool = await poolPromise;
        const result = await pool.request()
            .input('categ_id_categoria', sql.Int, categ)
            .input('usuario_id_usuario', sql.Int, usuario)
            .input('nombre', sql.VarChar(45), nombre)
            .input('marca', sql.VarChar(45), marca)
            .input('codigo', sql.VarChar(45), codigo)
            .input('stock', sql.Int, stock)
            .input('precio', sql.Float, precio)
            .execute('SP_crear_producto');

        res.status(201).json({ message: 'Producto creado con éxito.' });
    } catch (err) {
        res.status(500).send('Error al crear el producto');
        console.error('Error en POST /productos/crearProducto:', err);
    }
});

routerProductos.put('/actualizarProducto/:id', async (req, res) => {
    const { id } = req.params; // id del producto
    const { categ, nombre, marca, codigo, stock, estado_id, precio, foto, foto_url} = req.body;

    try {
        const token = req.headers.authorization.split(' ').pop();
        const tokenData = await verifyToken(token);
        const usuario = tokenData.id_usuario; // id del usuario

        const pool = await poolPromise;
        const resultU = await pool.request()
            .input('id_producto', sql.Int, id)
            .query('SELECT usuario_id_usuario FROM productos WHERE id_producto = @id_producto');
        const Id_duenio = resultU.recordset[0].usuario_id_usuario // del dueño del producto
        console.log('ID DEL DUEÑO: ', Id_duenio);

        if(Id_duenio == usuario){
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
                .input('foto_url', sql.VarChar(255), foto_url)
                .execute('SP_modificar_producto');

            res.status(200).json({ message: 'Producto actualizado con éxito.' });
        } else {
            res.status(409).json({ message: 'No puedes actualizar este producto porque no te pertenece.' });
        }
        
    } catch (err) {
        res.status(500).send('Error al actualizar el producto');
        console.error('Error en PUT /productos/actualizarUsuario:', err);
    }
});

module.exports = routerProductos;