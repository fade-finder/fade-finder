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

exports.deleteCliente = (req, res) => {
  const id = req.params.idCliente;
  console.log(`El id del cliente a eliminar es ${id}`);
  res.end()
}