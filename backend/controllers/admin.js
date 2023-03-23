//Modelos
const Barbero = require('../models/barbero');

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
    res.json({status: false})
  })

}


exports.putBarbero = (req, res) => {
    console.log('Aqui va la lógica para actualizar un barbero');
    console.log(req.params.id)   // con esta linea obtengo el id del barbero que debo modificar de la base de datos
    // console.log(req.body)    // Todos los datos que el admin ingreso al formulario para editar al barbero estan en req.body, solo debes crear la interaccion con la bd para modificarlo
  
    res.json({status: true})
    // retorna al cliente lo siguiente si se modifica el barbero
    // res.json({status: true})
    // retorna al cliente lo siguiente si ocurre un error
    // res.json({status: false})
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