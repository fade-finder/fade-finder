// * * * * * * * * * * * * * * REQUIRES * * * * * * * * * * *
// paquetes
const express = require("express")
const cors = require('cors')
const baseDeDatos = require('./utils/baseDeDatos')
// routes
const clienteRoutes = require('./routes/cliente')
const adminRoutes = require('./routes/admin')
const generalRoutes = require('./routes/general')

// * * * * * * * * * * * * * * USE * * * * * * * * * * *
const app = express()
app.use(cors())
app.use(express.json())   // Analiza las solicitudes JSON entrantes y coloca los datos analizados en formato req.body.
// routes
app.use('/cliente', clienteRoutes)
app.use('/admin', adminRoutes)
app.use(generalRoutes)

app.get('/', (req, res, next) => {
  res.send('Todo funciona')
})

//Funcion para verificar que hay conexion con la base de datos
baseDeDatos.execute('SELECT * FROM barberia')
  .then(resultado => {
    console.log(resultado);
  })
  .catch(err => {
    console.log(err);
  })

app.listen(3000)