const sql = require('mssql');

// const config = {
//     server: 'localhost',           
//     database: 'Base_OT', 
//     options: {
//         encrypt: true,             // Para conexiones cifradas
//         trustServerCertificate: true // Confiar en certificados para desarrollo local
//     },
//     authentication: {
//         type: 'ntlm',
//         options: {
//             domain: 'PERCYD',
//             userName: 'PERCYD',
//             password: '', // VACÍO POR AUTENTICACIÓN DE WINDOWS
//         }
//     }
// };

const config = {
    server: 'localhost',           // El nombre del servidor o IP
    database: 'Base_OT',           // Nombre de la base de datos
    options: {
        encrypt: true,             // Para conexiones cifradas
        trustServerCertificate: true // Confiar en certificados para desarrollo local
    },
    authentication: {
        type: 'default',           // Usa autenticación SQL Server
        options: {
            userName: 'sqlUserP',   // El nombre del usuario creado
            password: 'mynewpassword' // La contraseña que configuraste
        }
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Conectado a la base de datos SQL Server');
        return pool;
    })
    .catch(err => {
        console.log('Error al conectar a la base de datos:', err);
        throw err;
    });

module.exports = {
    sql, poolPromise
};