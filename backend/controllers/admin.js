//Modelos
const Usuario = require('../models/usuario');
const baseDeDatos = require('../utils/baseDeDatos');

//Metodo para agregar un barbero a la base de datos
exports.postAgregarBarbero = (req, res, next) => {
  const usuario = new Usuario(req.body.nombre, req.body.ap_paterno, req.body.ap_materno, req.body.email, req.body.password, req.body.telefono, req.body.foto)
  usuario.AgregarBarbero()
  .then(() => { //Si se agrego correctamente retorna un true
    res.end()
  })
  .catch(err => { //Si se agrego incorrectamente retorna un false
    console.log(err)
    res.status(500).json({ error: 'Error al realizar la petición al backend' });
  })

}


exports.putBarbero = (req, res) => {
  var correo = req.body.email
  var password = req.body.password
  var nombre = req.body.nombre
  var ap_paterno = req.body.ap_paterno
  var ap_materno = req.body.ap_materno
  var telefono = req.body.telefono
  var foto = req.body.foto
  var id = req.params.id

  baseDeDatos.execute("UPDATE usuario SET nombre = ? WHERE idUsuario = ?", [nombre, id])
  .then(() => {
    res.end()
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({ error: 'Error al realizar la petición al backend' });
  })

}

exports.deleteBarbero = (req, res) => {
  const id = req.params.id
  // console.log(id);
  Usuario.BorrarBarbero(id)
  .then(() => {
    res.end()
  })
  .catch(err => {
    console.log(err) 
    res.status(500).json({ error: 'Error al realizar la petición al backend' });
  })
    

}