const Usuario = require('../models/usuario')

exports.getBarberos = (req, res) => {
  const barberos = Usuario.VerBarberos()
  .then(barberos => {
    res.send(barberos[0])
  })
  .catch(err => {
    console.log(err)
  })
}

exports.getClientes = (req, res) => {
  // aqui hacer logica para traer y devolver los clientes
}

exports.postLogin = (req, res) => {
  console.log(req.body.email);
  console.log(req.body.password);
  // Desarrolla la logica para el login
  // res.end()  -- todo bien
  // res.status(500)  -- error
}