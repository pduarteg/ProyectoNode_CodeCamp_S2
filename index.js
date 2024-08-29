const express = require('express');
const my_app = express();
const { poolPromise } = require('./database_handler');

// Routers
const usuariosRouter = require('./routers/usuarios');
const productosRouter = require('./routers/productos');
const estadosRouter = require('./routers/estados');
const categoriasRouter = require('./routers/categoriaProductos');
const ordenesRouter = require('./routers/ordenes_y_detalles');
const loginRouter = require('./controladores/loginC');

const port = 3000;

my_app.get('/', (req, res) => {
  res.send('Welcome to my Code Camp server.');
});

// Prueba de conexión con la base de datos
my_app.get('/test-connection', async (req, res) => {
    try {
        const pool = await poolPromise;
        res.send('Conexión a la base de datos exitosa');
    } catch (err) {
        res.status(500).send('Error al conectar a la base de datos');
        console.error(err);
    }
});

my_app.use(express.json())
my_app.use(express.urlencoded({ extended: true }));

my_app.use('/usuarios', usuariosRouter);
my_app.use('/productos', productosRouter);
my_app.use('/estados', estadosRouter);
my_app.use('/categoriaProductos', categoriasRouter);
my_app.use('/ordenesYDetalles', ordenesRouter);
my_app.use('/login', loginRouter);

// ------ Port
// process.env.PORT: si es un puerto definido en el ambiente
// caso contrario será el puerto 3000.
const PORT = process.env.PORT || 3000;
my_app.listen(PORT, () => {
  console.log('Listening on the port: ' + PORT  + "...");
});

