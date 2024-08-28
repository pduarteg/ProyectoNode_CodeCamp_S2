/* PROCEDIMIENTOS ALMACENADOS */

CREATE PROCEDURE SP_crear_rol
@nombre VARCHAR(45)
AS
	INSERT INTO rol (nombre)
	VALUES (@nombre);
	
	
CREATE PROCEDURE SP_crear_estado
@nombre VARCHAR(45)
AS
	INSERT INTO estados (nombre)
	VALUES (@nombre);


CREATE PROCEDURE SP_crear_usuario
@rol INT, @estado INT, @correo VARCHAR(45), @nombre_completo VARCHAR(60), @u_pass VARCHAR(45), @tel VARCHAR(45), @fecha_nacimiento DATE
AS
	BEGIN TRY
	INSERT INTO usuarios (rol_id_rol, estado_id_estados, correo_electronico, nombre_completo, user_password, telefono, fecha_nacimiento)
	VALUES
		(@rol, @estado, @correo, @nombre_completo, @u_pass, @tel, @fecha_nacimiento);
		PRINT ('Usuario creado.')
	END TRY
	BEGIN CATCH
		PRINT ('Error al crear el usuario.')
	END CATCH;


CREATE PROCEDURE SP_crear_categoria_prod
@nombre VARCHAR(45), @usuario_id_usuario INT, @estado_id_estado INT
AS
	INSERT INTO categoria_productos (nombre, usuario_id_usuario, estado_id_estado)
	VALUES (@nombre, @usuario_id_usuario, @estado_id_estado);


CREATE PROCEDURE SP_crear_producto
@categ_id_categoria INT, @usuario_id_usuario INT, @nombre VARCHAR(45), @marca VARCHAR(45), @codigo VARCHAR(45), @stock INT, @estado_id_estado INT, @precio FLOAT
AS
	INSERT INTO productos (categoriaProducto_id_categoriaProducto, usuario_id_usuario, nombre, marca, codigo, stock, estado_id_estado, precio)
	VALUES
		(@categ_id_categoria,  @usuario_id_usuario, @nombre, @marca, @codigo, @stock, @estado_id_estado, @precio);


CREATE PROCEDURE SP_crear_orden_y_detalles
@producto_id_producto INT, @cantidad INT,
@usuario_id_usuario INT, @direccion VARCHAR(545), @fecha_entrega DATE
AS
	DECLARE @nombre_completo VARCHAR(60)
	SET @nombre_completo = (SELECT nombre_completo FROM  usuarios WHERE id_usuario = @usuario_id_usuario);

	DECLARE @telefono VARCHAR(45)
	SET @telefono = (SELECT telefono FROM  usuarios WHERE id_usuario = @usuario_id_usuario);

	DECLARE @correo_electronico VARCHAR(60)
	SET @correo_electronico = (SELECT correo_electronico FROM  usuarios WHERE id_usuario = @usuario_id_usuario);

	INSERT INTO orden (usuario_id_usuario, nombre_completo, direccion, telefono, correo_electronico, fecha_entrega)
	VALUES (@usuario_id_usuario, @nombre_completo, @direccion, @telefono, @correo_electronico, @fecha_entrega);

	/* Se guarda el id de la orden creada y se calcula el subtotal */
	DECLARE @ultimo_id_orden INT;
	SET @ultimo_id_orden = SCOPE_IDENTITY();

	DECLARE @subtotal_calculado FLOAT;
	SET @subtotal_calculado = @cantidad*(SELECT precio FROM productos WHERE id_producto = @producto_id_producto)

	INSERT INTO orden_detalles (orden_id_orden, producto_id_producto, cantidad, precio, subtotal)
	VALUES
	(@ultimo_id_orden, @producto_id_producto, @cantidad, (SELECT precio FROM productos WHERE id_producto = @producto_id_producto), @subtotal_calculado);

	/* Se agrega el total (subtotal+IVA) */
	UPDATE orden
	SET total_orden = 1.12*@subtotal_calculado
	WHERE orden.id_orden = @ultimo_id_orden;




/* Procedimientos de modificación: */

CREATE PROCEDURE SP_modificar_usuario
    @id_usuario INT,
    @rol_id_rol INT,
    @estado_id_estados INT,
    @correo_electronico VARCHAR(45),
    @nombre_completo VARCHAR(60),
    @user_password VARCHAR(45),
    @telefono VARCHAR(45),
    @fecha_nacimiento DATE
AS
    UPDATE usuarios
    SET
        rol_id_rol = @rol_id_rol,
        estado_id_estados = @estado_id_estados,
        correo_electronico = @correo_electronico,
        nombre_completo = @nombre_completo,
        user_password = @user_password,
        telefono = @telefono,
        fecha_nacimiento = @fecha_nacimiento
    WHERE
        id_usuario = @id_usuario;


CREATE PROCEDURE SP_modificar_estado
    @id_estado INT,
    @nombre VARCHAR(45)
AS
    UPDATE estados
    SET
        nombre = @nombre
    WHERE
        id_estado = @id_estado;

CREATE PROCEDURE SP_modificar_rol
    @id_rol INT,
    @nombre VARCHAR(45)
AS
    UPDATE rol
    SET
        nombre = @nombre
    WHERE
        id_rol = @id_rol;

CREATE PROCEDURE SP_modificar_categoria_producto
	@id_categoria_producto INT,
	@usuario_id_usuario INT,
	@estado_id_estado INT,
	@nombre VARCHAR(45)
AS
	UPDATE categoria_productos
	SET
		usuario_id_usuario = @usuario_id_usuario,
		estado_id_estado = @estado_id_estado
	WHERE
		id_categoria_productos = @id_categoria_producto;


CREATE PROCEDURE SP_modificar_producto
	@id_producto INT,
	@id_categoria_producto INT,
	@usuario_id_usuario INT,
	@estado_id_estado INT,
	@nombre VARCHAR(45),
	@marca VARCHAR(45),
	@codigo VARCHAR(45),
	@stock INT,
	@precio FLOAT,
	@foto BINARY
AS
	UPDATE productos
	SET
		categoriaProducto_id_categoriaProducto = @id_categoria_producto,
		usuario_id_usuario = @usuario_id_usuario,
		estado_id_estado = @estado_id_estado,
		nombre = @nombre,
		marca = @marca,
		stock = @stock,
		precio = @precio,
		foto = @foto
	WHERE
		id_producto = @id_categoria_producto;


CREATE PROCEDURE SP_modificar_orden
	@id_orden INT,
	@usuario_id_usuario INT,
	@estado_id_estado INT,
	@nombre_completo VARCHAR(45),
	@direccion VARCHAR(545),
	@telefono VARCHAR(45),
	@correo_electronico VARCHAR(45),
	@fecha_entrega DATE,
	@total_orden FLOAT
AS
	UPDATE orden
	SET
		usuario_id_usuario = @usuario_id_usuario,
		estado_id_estado = @estado_id_estado,
		nombre_completo = @nombre_completo,
		direccion = @direccion,
		telefono = @telefono,
		correo_electronico = @correo_electronico,
		fecha_entrega = @fecha_entrega,
		total_orden = @total_orden
	WHERE
		id_orden = @id_orden;


CREATE PROCEDURE SP_modificar_orden_detalles
	@id_orden_detalles INT,
	@orden_id_orden INT,
	@producto_id_producto INT,
	@cantidad INT,
	@precio FLOAT,
	@subtotal FLOAT
AS
	UPDATE orden_detalles
	SET
		orden_id_orden = @orden_id_orden,
		producto_id_producto = @producto_id_producto,
		cantidad = @cantidad,
		precio = @precio,
		subtotal = @subtotal
	WHERE
		id_orden_detalles = @id_orden_detalles;