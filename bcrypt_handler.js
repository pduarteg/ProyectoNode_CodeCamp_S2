const bcrypt = require('bcrypt');

// Para comparar:
const encrypt = async (textPplain) => {
	const numero_rondas = 10;
	const hash = await bcrypt.hash(textPplain, numero_rondas)
	return hash
}

// Para hacer la comparación: 
const compare = async (passwordPlain, hashPassword) => {
	// compara la contraseña con el hash (encriptada)
	return await bcrypt.compare(passwordPlain, hashPassword);
}

module.exports = {encrypt, compare}