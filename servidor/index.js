const express = require('express');
const conectarDB = require('./config/db')
const cors= require('cors');

//Crear el servidor
const app = express();

//Conectar a la base de dataos
conectarDB();

//Habilitar CORs

app.use(cors());

//habilitar express.json permite lelre usuarios que el usuario coloque
app.use( express.json({extend: true}) )

// puerto de la app
const PORT = process.env.PORT ||4000

//importar rutas

app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/proyectos', require('./routes/proyectos'))
app.use('/api/tareas', require('./routes/tareas'))



//arrancar la app
app.listen(PORT, () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`)
})