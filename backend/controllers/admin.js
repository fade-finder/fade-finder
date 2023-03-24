//Modelos
const Usuario = require('../models/usuario');
const baseDeDatos = require('../utils/baseDeDatos');

//Metodo para agregar un barbero a la base de datos
exports.postAgregarBarbero = (req, res, next) => {
  const usuario = new Usuario(req.body.nombre, req.body.ap_paterno, req.body.ap_materno, req.body.email, req.body.password, req.body.telefono, req.body.foto)
  usuario.AgregarBarbero()
  .then(() => {
    res.end()
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({ error: 'Error al realizar la petición al backend' });
  })

}


exports.putBarbero = (req, res) => {
  const usuario = new Usuario(req.body.nombre, req.body.ap_paterno, req.body.ap_materno, req.body.email, req.body.password, req.body.telefono, req.body.foto)
  usuario.ActualizarBarbero(req.params.id)
  .then(() => {
    res.end()
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({ error: 'No puede haber correos iguales' });
  })

}

exports.deleteBarbero = (req, res) => {
  Usuario.BorrarBarbero(req.params.id)
  .then(() => {
    res.end()
  })
  .catch(err => {
    console.log(err) 
    res.status(500).json({ error: 'Error al realizar la petición al backend' });
  })
    

}