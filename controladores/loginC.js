const express = require('express');
const routerLogin = express.Router();
const { sql, poolPromise } = require('../database_handler');

const {encrypt, compare} = require('../bcrypt_handler')


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
		
		if(!user){
			res.status(404);
			res.send({error: 'User not found'});
		} else {
			console.log('user found pass:', user.recordset[0].user_password);
			const passValue = await compare(password, user.recordset[0].user_password);
			
			// const tokenSession = await tokenSign(user.recordset[0]);
			
			if(passValue){
				console.log('Inicio de sesión exitosa:', user.recordset[0]);
			} else {
				console.log('Error de inicio de sesión.');
			}
		}

		res.status(200).json(user.recordset[0]);
    } catch (err) {
        res.status(500).send('Error al iniciar sesión.');
        console.error('Error en PUT /login/user_login', err);
    }
});

module.exports = routerLogin;