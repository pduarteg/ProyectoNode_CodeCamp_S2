const express = require('express');
const my_app = express();
const { poolPromise } = require('./database_handler');
// const usuariosRouter = require('./routers/usuarios');

const port = 3000;

my_app.get('/', (req, res) => {
  res.send('Welcome to my Code Camp server! -　ようこそ');
});

// Conexión con la base de datos
my_app.get('/test-connection', async (req, res) => {
    try {
        const pool = await poolPromise;
        res.send('Conexión a la base de datos exitosa');
    } catch (err) {
        res.status(500).send('Error al conectar a la base de datos');
        //console.error(err);
    }
});


//my_app.use('/usuarios', usuariosRouter);

// ------ Port
// process.env.PORT: si es un puerto definido en el ambiente
// caso contrario será el puerto 3000.
const PORT = process.env.PORT || 3000;
my_app.listen(PORT, () => {
  console.log('Listening on the port: ' + PORT  + "...");
});

