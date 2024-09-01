// LOGIN - SESIONES DE USUARIO

const express = require('express');
const routerLogin = express.Router();
const { sql, poolPromise } = require('../database_handler');

const {encrypt, compare} = require('../bcrypt_handler');
const {tokenSign} = require('../controladores/generador_token');

routerLogin.post('/user_login', async (req, res) => {
    const { correo, password } = req.body;

    try {
    	console.log('Correo recibido:', correo);
        const pool = await poolPromise;
        const user = await pool.request()
			.input('correo', sql.VarChar(45), correo)
			.query('SELECT * FROM usuarios WHERE correo_electronico = @correo');

		console.log("Resultado de la consulta:");
		console.log(user.recordset);
		
		// Método previo de inicio de sesión:
		if(!user){
			res.status(404);
			res.send({error: 'User not found'});
		} else {
			//console.log('user found pass:', user.recordset[0].user_password);
			const passValue = await compare(password, user.recordset[0].user_password);
			
			const tokenSession = await tokenSign(user.recordset[0]);
			// console.log("Token obtenido:", tokenSession);
			
			if(passValue){
				console.log('Inicio de sesión exitosa, bienvenido:', user.recordset[0].nombre_completo);
				res.send({
					data: user.recordset[0],
					tokenSession
				})
			} else {
				// console.log('Error de inicio de sesión.');
				res.status(409)
				res.send({
					error: 'Contraseña no válida por el usuario.'
				})
			}
		}

		// res.status(200).json(user.recordset[0]);
    } catch (err) {
        res.status(500).send('Error al iniciar sesión.');
        console.error('Error en PUT /login/user_login', err);
    }
});

routerLogin.post('/user_logout', async (req, res) => {
	const token = req.headers.authorization.split(' ').pop()
	const tokenData = await verifyToken(token)
	
	await invalidarToken(tokenData);
	console.log("INTENTANDO CERRAR SESIÓN...");
    res.send({ message: 'Sesión cerrada con éxito' });

});

const invalidarToken = async (token) => {
	try {
		console.log("Token a eliminar:", token);
		const pool = await poolPromise;
		await pool.request()
			.input('token', sql.NVarChar, token)
			.query('INSERT INTO blacklist_tokens (token) VALUES (@token)')
	} catch(e) {
		console.error(e);
		throw error;
	}
}

module.exports = routerLogin;