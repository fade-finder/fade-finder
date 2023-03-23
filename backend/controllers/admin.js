//Modelos
const Barbero = require('../models/barbero');
const baseDeDatos = require('../utils/baseDeDatos');

//Metodo para agregar un barbero a la base de datos
exports.postAgregarBarbero = (req, res, next) => {
  //variables que vienen desde el frontend
  var nombre = req.body.nombre
  var ap_paterno = req.body.ap_paterno
  var ap_materno = req.body.ap_materno
  var correo = req.body.email
  var password = req.body.password
  var genero = req.body.genero
  var telefono = req.body.telefono
  var foto = req.body.foto
  var direccion = req.body.calle+','+req.body.numero+','+req.body.colonia+','+req.body.ciudad
  var fecha_nacimiento = req.body.fecha_nacimiento
  
  //Se declara un objeto del modelo barbero y se le pasan sus parametros
  const barbero = new Barbero(nombre, ap_paterno, ap_materno, correo, password, genero, telefono, foto, direccion, fecha_nacimiento, 1)

  //Se llama la funcion AgregarBarbero que esta en el modelo barbero
  barbero.AgregarBarbero()

  .then(() => { //Si se agrego correctamente retorna un true
    res.json({status: true})
  })
  .catch(err => { //Si se agrego incorrectamente retorna un false
    console.log(err)
    // res.json({status: false})
    res.status(500).json({ error: 'Error al realizar la petición al backend' });
  })

}


exports.putBarbero = (req, res) => {
  var nombre = req.body.nombre
  var ap_paterno = req.body.ap_paterno
  var ap_materno = req.body.ap_materno
  var correo = req.body.email
  var password = req.body.password
  var genero = req.body.genero
  var telefono = req.body.telefono
  var foto = req.body.foto
  var direccion = req.body.calle+','+req.body.numero+','+req.body.colonia+','+req.body.ciudad
  var fecha_nacimiento = req.body.fecha_nacimiento
  var id = req.params.id

  baseDeDatos.execute("UPDATE barbero SET nombre = ? WHERE idBarbero = ?", [nombre, id])
  .then(() => {
    console.log('Se actualizo correctamente')
    res.json({status: true})
  })
  .catch(err => {
    console.log(err)
    res.json({status: false})
  })

}

exports.deleteBarbero = (req, res) => {
  const id = req.params.id
  Barbero.BorrarBarbero(id)
  .then(() => {
    res.json({status: true})
  })
  .catch(err => {
    console.log(err) 
    res.json({status: false})
  })
    

}