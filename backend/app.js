const express = require("express")
const app = express()

// Routers
const clienteRoutes = require('./routes/cliente')

app.use(clienteRoutes)

app.get('/', (req, res, next) => {
  res.send('Todo funciona')
})

app.listen(3000)