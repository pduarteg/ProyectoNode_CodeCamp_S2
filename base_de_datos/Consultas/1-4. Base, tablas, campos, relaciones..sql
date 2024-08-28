
/* ----------------------------------------------------------------------------------- CREACIÓN Y SELECCIÓN DE LA BASE DE DATOS */
CREATE DATABASE Base_OT;
USE Base_OT;

/* ----------------------------------------------------------------------------------- CREACIÓN DE LAS TABLAS */
CREATE TABLE estados (
	id_estado INT IDENTITY(1,1) PRIMARY KEY,
	nombre VARCHAR(45)
);

CREATE TABLE rol (
	id_rol INT IDENTITY(1,1) PRIMARY KEY,
	nombre VARCHAR(45)
);

CREATE TABLE usuarios (
	id_usuario INT IDENTITY(1,1) PRIMARY KEY,
	rol_id_rol INT,
	CONSTRAINT fk_rol FOREIGN KEY (rol_id_rol) REFERENCES rol(id_rol),
	estado_id_estados INT,
	constraint fk_estado FOREIGN KEY (estado_id_estados) REFERENCES estados(id_estado),
	correo_electronico VARCHAR(45),
	nombre_completo VARCHAR(60),
	user_password VARCHAR(45),
	telefono VARCHAR(45),
	fecha_nacimiento DATE,
	fecha_creacion DATETIME DEFAULT GETDATE()
);

CREATE TABLE categoria_productos (
	id_categoria_productos INT IDENTITY(1,1) PRIMARY KEY,
	usuario_id_usuario INT,
	CONSTRAINT fk_usr FOREIGN KEY (usuario_id_usuario) REFERENCES usuarios(id_usuario),
	nombre VARCHAR(45),
	estado_id_estado INT,
	CONSTRAINT fk_estado_categoria_producto FOREIGN KEY (estado_id_estado) REFERENCES estados(id_estado),
	fecha_creacion DATETIME DEFAULT GETDATE()
);

CREATE TABLE productos(
	id_producto INT IDENTITY(1,1) PRIMARY KEY,
	categoriaProducto_id_categoriaProducto INT,
	CONSTRAINT fk_catprod_prod FOREIGN KEY (categoriaProducto_id_categoriaProducto) REFERENCES categoria_productos(id_categoria_productos),
	usuario_id_usuario INT,
	CONSTRAINT fk_usuario_prod FOREIGN KEY (usuario_id_usuario) REFERENCES usuarios(id_usuario),
	nombre VARCHAR(45),
	marca VARCHAR(45),
	codigo VARCHAR(45),
	stock INT,
	estado_id_estado INT,
	CONSTRAINT fk_estado_prod FOREIGN KEY (estado_id_estado) REFERENCES estados(id_estado),
	precio FLOAT,
	fecha_creacion DATETIME DEFAULT GETDATE(),
	foto BINARY
);

CREATE TABLE orden(
	id_orden INT IDENTITY(1,1) PRIMARY KEY,
	usuario_id_usuario INT,
	CONSTRAINT fk_usr_ord FOREIGN KEY (usuario_id_usuario) REFERENCES usuarios(id_usuario),
	estado_id_estado INT DEFAULT 4,
	CONSTRAINT fk_est_ord FOREIGN KEY (estado_id_estado) REFERENCES estados(id_estado),
	fecha_creacion DATETIME DEFAULT GETDATE(),
	nombre_completo VARCHAR(60),
	direccion VARCHAR(545),
	telefono VARCHAR(45),
	correo_electronico VARCHAR(45),
	fecha_entrega DATE,
	total_orden FLOAT
);

CREATE TABLE orden_detalles(
	id_orden_detalles INT IDENTITY(1,1) PRIMARY KEY,
	orden_id_orden INT,
	CONSTRAINT fk_ord_detalles FOREIGN KEY (orden_id_orden) REFERENCES orden(id_orden),
	producto_id_producto INT,
	CONSTRAINT fk_prod_detalles FOREIGN KEY (producto_id_producto) REFERENCES productos(id_producto),
	cantidad INT,
	precio FLOAT,
	subtotal FLOAT
);


/* ----------------------------------------------------------------------------------- AGREGANDO DATOS */

INSERT INTO rol (nombre)
VALUES ('Cliente'), ('Operador Administrativo');

INSERT INTO estados (nombre) /* Estados por ID: 1 y 2 para usuarios, 3, 4 y 5 para ordenes, 6 y 7 para productos*/
VALUES ('Activo'), ('Inactivo'), ('Entregada'), ('Pendiente'), ('Cancelada'), ('Disponible'), ('No disponible');

INSERT INTO usuarios (rol_id_rol, estado_id_estados, correo_electronico, nombre_completo, user_password, telefono, fecha_nacimiento)
VALUES
	(2, 1, 'sofi_gomez@mail.com', 'Sofía Martínez Gómez', '1234', '1234-5678', '1990-01-01'),
	(1, 1, 'luis_fer_p@gmail.com', 'Luis Fernando Rodríguez Pérez', '2345', '3234-5689', '2003-02-11'),
	(1, 1, 'maria_66@hotmail.com', 'Ana María González Fernández', '3456', '4234-5601', '2000-03-21'),
	(1, 1, 'carlos_lop@mail.com', 'Carlos Alberto Ramírez López', '4567', '5234-5612', '1999-04-14'),
	(1, 2, 'juan.perez@gmail.com', 'Laura García Sánchez', 'A7r3xP9q', '1234-5678', '2014-08-15'),
	(1, 1, 'ana.martinez@yahoo.com', 'Carlos Díaz Mendoza', 'B5t2zJ4k', '8765-4321', '2003-12-01'),
	(1, 1, 'mario.lopez@hotmail.com', 'Elena Ruiz Morales', 'C9u8vL3x', '2345-6789', '2004-06-22'),
	(1, 2, 'lucia.smith@mail.com', 'Andrés Gómez Arias', 'D4w1yQ7r', '9876-5432', '1999-11-30');


INSERT INTO categoria_productos (nombre, usuario_id_usuario, estado_id_estado)
VALUES
	('Electrodomésticos', 4, 6),
	('Ropa y accesorios', 8, 6),
	('Libros', 7, 6),
	('Salud', 2, 6),
	('Juguetes', 3, 6),
	('Computadoras', 7, 6),
	('Tecnología', 5, 6);

INSERT INTO productos (categoriaProducto_id_categoriaProducto, usuario_id_usuario, nombre, marca, codigo, stock, estado_id_estado, precio)
VALUES
	(1, 1, 'Televisión', 'LG', 'tl01', 5, 6, 2000.00),
	(2, 2, 'Abrigo de Lana', 'V-T', 'av02', 1, 6, 300.00),
	(3, 3, 'Los Árboles Mueren de Pie', 'SeaG', 'bl03', 20, 6, 90.00),
	(4, 3, 'Silla de Ruedas', 'Gaar', 'gb04', 1, 6, 470.00),
	(1, 1, 'Estufa', 'LF', 'tl02', 0, 6, 2400.00),
	(2, 2, 'Gorra de cuero', 'DG', 'ab09', 0, 6, 78.00),
	(3, 3, 'Las Damas', 'SeaG', 'bl08', 0, 7, 140.00),
	(4, 3, 'Muletas', 'Gaar', 'gb06', 30, 6, 89.00),
	(7, 5, 'Auriculares Bluetooth', 'SoundTech', 'ST12345X', 8, 7, 89.99),
	(7, 3, 'Smartphone 5G', 'TechWave', 'TW67890Z', 6, 6, 499.95),
	(7, 7, 'Cámara Digital', 'PixelPro', 'PP23456Y', 4, 7, 349.50),
	(6, 2, 'Laptop Gaming', 'GameMaster', 'GM98765W', 10, 6, 1299.99);

INSERT INTO orden (usuario_id_usuario, estado_id_estado, nombre_completo, direccion, telefono, correo_electronico, fecha_entrega)
VALUES
	(1, 3, (SELECT nombre_completo FROM usuarios WHERE id_usuario = 1), 'dir 1', (SELECT telefono FROM usuarios WHERE id_usuario = 1), (SELECT correo_electronico FROM usuarios WHERE id_usuario = 1), '2024-01-13'),
	(2, 3, (SELECT nombre_completo FROM usuarios WHERE id_usuario = 2), 'dir 2', (SELECT telefono FROM usuarios WHERE id_usuario = 1), (SELECT correo_electronico FROM usuarios WHERE id_usuario = 2), '2024-01-23'),
	(2, 3, (SELECT nombre_completo FROM usuarios WHERE id_usuario = 2), 'dir 2', (SELECT telefono FROM usuarios WHERE id_usuario = 1), (SELECT correo_electronico FROM usuarios WHERE id_usuario = 2), '2024-01-14'),
	(2, 4, (SELECT nombre_completo FROM usuarios WHERE id_usuario = 2), 'dir 2', (SELECT telefono FROM usuarios WHERE id_usuario = 1), (SELECT correo_electronico FROM usuarios WHERE id_usuario = 2), '2024-01-15'),
	(2, 5, (SELECT nombre_completo FROM usuarios WHERE id_usuario = 2), 'dir 2', (SELECT telefono FROM usuarios WHERE id_usuario = 1), (SELECT correo_electronico FROM usuarios WHERE id_usuario = 2), '2024-01-16'),
	(3, 3, (SELECT nombre_completo FROM usuarios WHERE id_usuario = 1), 'dir 1', (SELECT telefono FROM usuarios WHERE id_usuario = 1), (SELECT correo_electronico FROM usuarios WHERE id_usuario = 1), '2024-01-17');

INSERT INTO orden_detalles (orden_id_orden, producto_id_producto, cantidad, precio, subtotal)
VALUES
	(1, 5, 1, (SELECT precio FROM productos WHERE id_producto = 5), 1*(SELECT precio FROM productos WHERE id_producto = 5)),
	(2, 6, 3, (SELECT precio FROM productos WHERE id_producto = 6), 3*(SELECT precio FROM productos WHERE id_producto = 6)),
	(3, 7, 2, (SELECT precio FROM productos WHERE id_producto = 7), 2*(SELECT precio FROM productos WHERE id_producto = 7)),
	(4, 4, 1, (SELECT precio FROM productos WHERE id_producto = 4), 1*(SELECT precio FROM productos WHERE id_producto = 4)),
	(5, 1, 2, (SELECT precio FROM productos WHERE id_producto = 1), 2*(SELECT precio FROM productos WHERE id_producto = 1)),
	(6, 8, 4, (SELECT precio FROM productos WHERE id_producto = 8), 4*(SELECT precio FROM productos WHERE id_producto = 8));

UPDATE orden
SET total_orden = 1.12*(SELECT subtotal FROM orden_detalles WHERE id_orden_detalles = 1)
WHERE orden.id_orden = 1;
UPDATE orden
SET total_orden = 1.12*(SELECT subtotal FROM orden_detalles WHERE id_orden_detalles = 2)
WHERE orden.id_orden = 2;
UPDATE orden
SET total_orden = 1.12*(SELECT subtotal FROM orden_detalles WHERE id_orden_detalles = 3)
WHERE orden.id_orden = 3;
UPDATE orden
SET total_orden = 1.12*(SELECT subtotal FROM orden_detalles WHERE id_orden_detalles = 4)
WHERE orden.id_orden = 4;
UPDATE orden
SET total_orden = 1.12*(SELECT subtotal FROM orden_detalles WHERE id_orden_detalles = 5)
WHERE orden.id_orden = 5;
UPDATE orden
SET total_orden = 1.12*(SELECT subtotal FROM orden_detalles WHERE id_orden_detalles = 6)
WHERE orden.id_orden = 6;



