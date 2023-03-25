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
  .then(resultado => {
    // Modifique la res que se envia al frontend porque me di cuenta que siempre mostraba el mensaje de que se elimino un usuario aunque no se alla eliminado. Esto es porque lo que valida el then catch es que la consulta se ejecuta mas no que elimine algo
    res.json(resultado[0])
  })
  .catch(err => {
    res.status(500)
  })

}