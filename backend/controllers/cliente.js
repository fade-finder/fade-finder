// Models
// const Cliente = require('../models/cliente')

exports.postRegister = (req, res) => {
  console.log(req.body);

  // De esta forma extraes cada dato
  console.log(req.body.nombre);
  console.log(req.body.ap_paterno);
  // res.send()

  // Aqui va la logica para crear una cuenta de cliente
}