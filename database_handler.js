const sql = require('mssql');

const config = {
    server: 'localhost',
    database: 'Base_OT',
    options: {
        encrypt: true,             
        trustServerCertificate: true 
    },
    authentication: {
        type: 'default', // Usa autenticación SQL Server
        options: {
            userName: 'sqlUserP',
            password: 'mynewpassword' 
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