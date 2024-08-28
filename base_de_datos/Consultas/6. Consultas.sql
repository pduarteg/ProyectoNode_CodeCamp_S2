/* ----------------------------------------------------------------------------------- CONSULTAS */


	/* Consulta que muestra las órdenes con su cliente, producto, subtotal y su estado de entrega */
SELECT o.id_orden, o.nombre_completo AS Cliente, p.nombre AS Producto, oD.subtotal, e.nombre AS Estado_de_la_orden
FROM orden o
LEFT JOIN
	estados e ON o.estado_id_estado = e.id_estado
LEFT JOIN
	orden_detalles oD ON o.id_orden = oD.orden_id_orden
LEFT JOIN
	productos p ON oD.producto_id_producto = p.id_producto;


/* --------------------------------------------------------------------------------------------------------------------------------- */
/* SOLUCIÓN INCISO 6 - REALIZACIÓN DE CONSULTAS */

/* a) Productos activos (disponibles) con stock mayor a 0:*/

SELECT p.nombre, marca, codigo, stock, e.nombre FROM productos p
LEFT JOIN
	estados e ON p.estado_id_estado = e.id_estado
WHERE p.stock > 0 AND e.nombre = 'Disponible';

/* Total de productos */
SELECT SUM(stock) AS Stock_total FROM productos p
WHERE stock > 0 AND estado_id_estado = 6;



/* b) Total de quetzales en ordenes ingresadas en el mes de Agosto de 2024 */
SELECT SUM(subtotal) as Total_quetzales_en_ordenes_de_Agosto_2024
FROM orden_detalles d
LEFT JOIN
	orden o ON d.orden_id_orden = o.id_orden
WHERE o.fecha_creacion >= '2024-08-01' AND o.fecha_creacion <= '2024-09-01';



/* c) Top 10 clientes con Mayor consumo de todo el histórico */
SELECT TOP 10 u.nombre_completo, SUM(o.total_orden) AS Total_del_Cliente
FROM usuarios u
JOIN orden o ON u.id_usuario = o.usuario_id_usuario
JOIN orden_detalles d ON o.id_orden = d.orden_id_orden
GROUP BY u.id_usuario, u.nombre_completo
ORDER BY Total_del_Cliente DESC;



/* d) TOP 10 DE PRODUCTOS MÁS VENDIDOS EN ORDEN ASCENDENTE */
SELECT TOP 10 p.nombre AS Producto, SUM(d.cantidad) AS Total_productos_vendidos, SUM(d.cantidad*p.precio) AS Venta_total FROM orden_detalles d
LEFT JOIN productos p ON d.producto_id_producto = p.id_producto
GROUP BY p.id_producto, p.nombre
ORDER BY Total_productos_vendidos ASC;