const express = require('express');
const routerOrdenes = express.Router();
const { sql, poolPromise } = require('../database_handler');

routerOrdenes.use(express.json());

routerOrdenes.get('/', async (req, res) => {
    const query = `
        SELECT d.id_orden_detalles AS ID_Detalles, o.id_orden AS ID_Orden,
            o.usuario_id_usuario, o.estado_id_estado,
            p.id_producto, o.fecha_creacion, o.nombre_completo AS Cliente,
            o.direccion, o.telefono, o.correo_electronico, o.fecha_entrega,
            p.nombre AS Producto, d.precio, d.cantidad,
            d.subtotal, ROUND(o.total_orden, 2) AS Total
        FROM orden o
        JOIN orden_detalles d ON d.orden_id_orden = o.id_orden
        JOIN productos p ON d.producto_id_producto = p.id_producto;
        `;

    try {
        const pool = await poolPromise;
        const result = await pool.request().query(query);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Error al obtener las Ordenes y Detalles');
        console.error('Error en GET /Ordenes:', err);
    }
});

routerOrdenes.post('/crearOrdenesYDetalles', async (req, res) => {
    const { prod_id, cant, user_id, dir, fecha_e } = req.body;

    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('producto_id_producto', sql.Int, prod_id)
            .input('cantidad', sql.Int, cant)
            .input('usuario_id_usuario', sql.Int, user_id)
            .input('direccion', sql.VarChar(545), dir)
            .input('fecha_entrega', sql.Date, fecha_e)
            .execute('SP_crear_orden_y_detalles');

        res.status(201).json({ message: 'Ordenes y Detalles creados con éxito.' });
    } catch (err) {
        res.status(500).send('Error al crear el Ordenes y Detalles');
        console.error('Error en POST /Ordenes/crearOrdenesYDetalles:', err);
    }
});


// Se pasa el ID de los detalles y no de la orden.
routerOrdenes.put('/actualizarOrdenesYDetalles/:id', async (req, res) => {
    const { id } = req.params;
    const { dir, tel, correo_electronico, fecha_entrega } = req.body;

    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('id_orden_detalles', sql.Int, id)
            .input('dir', sql.VarChar(545), dir)
            .input('tel', sql.VarChar(45), tel)
            .input('correo_electronico', sql.VarChar(45), correo_electronico)
            .input('fecha_entrega', sql.Date, fecha_entrega)
            .execute('SP_modificar_orden_detalles_enc'); // modifica solo datos de encabezado

        res.status(200).json({ message: 'OrdenesYDetalles actualizado con éxito.' });
    } catch (err) {
        res.status(500).send('Error al actualizar el OrdenesYDetalles');
        console.error('Error en PUT /Ordenes/actualizarUsuario:', err);
    }
});


module.exports = routerOrdenes;