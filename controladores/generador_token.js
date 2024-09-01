const jwt = require('jsonwebtoken');

// Para las variables de entorno:
require('dotenv').config();

// user es un objeto JSON
const tokenSign = async(user) => {
	// validación de la clave (no se debe compartir):
	// console.log("JWT_SECRET:", process.env.JWT_SECRET);
	return jwt.sign(
		{
			id_usuario:user.id_usuario,
			rol_id_rol: user.rol_id_rol
		},
		process.env.JWT_SECRET, // Llave maestra
		{
			expiresIn: "24h",
		}
	);
}

const verifyToken = async (token) => {
	try{
		// El sistema verifica que ese toquen fue creado por nosotros con
		// nuestra clave secreta.
		return jwt.verify(token, process.env.JWT_SECRET);
	} catch(e) {
		return null;
	}
}

module.exports = {tokenSign, verifyToken}