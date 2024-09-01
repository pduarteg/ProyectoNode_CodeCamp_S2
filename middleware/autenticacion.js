const { sql, poolPromise } = require('../database_handler');
const { verifyToken } = require('../controladores/generador_token')

const revisar_autenticacion = async (req, res, next) => {
	try {
		// split para separar 'bearer' y el 'valor del token'
		// pop para extraer el último elemento (es decir el token)
		const token = req.headers.authorization.split(' ').pop()
		const tokenData = await verifyToken(token)

		console.log(" ","Token autenticado:", tokenData);

		if(tokenData.id_usuario){
			next();
		} else {
			res.status(409);
			res.send({ error: 'Se necesita sesión iniciada. Token no válido.'});
		}
	} catch(e) {
		console.log(e);
		res.status(409);
		res.send({ error: 'Se necesita iniciar sesión.'})
	}
}

const autenticar_rol = (roles) => async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ').pop()
		const tokenData = await verifyToken(token)

		console.log("From autenticar_rol::: tokenData:", tokenData);
		console.log(tokenData.id_usuario,"...");

		const pool = await poolPromise;
		var user = await pool.request()
			.input('id_from_tokenData', sql.Int, tokenData.id_usuario)
			.query('SELECT * FROM usuarios WHERE id_usuario = @id_from_tokenData');
		user = user.recordset[0];
		console.log("Usuario para autenticar su rol: ", user);

		// Se verifica el array de roles pasado que contenga al del token
		if([].concat(roles).includes(user.rol_id_rol)){
			next();
		} else {
			res.status(409);
			res.send({ error: 'Tu rol de usuario no tiene los permisos para este sitio.'});
		}
	} catch (e) {
		console.log(e);
		res.status(409);
		res.send({ error: 'Se necesitan permisos.'})
	}
}

module.exports = {revisar_autenticacion, autenticar_rol}