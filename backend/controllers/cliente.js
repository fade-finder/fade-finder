const Usuario = require('../models/usuario')

exports.postRegister = (req, res) => {
  console.log(req.body);

  const usuario = new Usuario(req.body.nombre, req.body.ap_paterno, req.body.ap_materno, req.body.email, req.body.password, req.body.telefono, req.body.foto)
  usuario.AgregarCliente()
  .then(() => {
    res.end();
  })
  .catch(err => {
    res.status(500);
  })

}

exports.deleteCliente = (req, res) => {
  Usuario.BorrarPerfilCliente(req.params.idCliente)
  .then(() => {
    res.end()
  })
  .catch(err => {
    res.status(500)
  })

}