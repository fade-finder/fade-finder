const Barbero = require('../models/barbero')

exports.getBarberos = (req, res) => {
  const barberos = Barbero.VerBarberos()
  .then(barberos => {
    res.send(barberos[0])
  })
  .catch(err => {
    console.log(err)
  })
}

exports.postLogin = (req, res) => {
  console.log(req.body.email);
  console.log(req.body.password);

  // De esta forma se valida el tipo de empleado
  if(req.body.rol == 0){
    console.log("Es Cliente");

    // res de prueba
    res.json({
      nombre: 'Bryan',
      ap_paterno: 'Sanchez',
    })
  } else {
    console.log("Es Empleado");

    // res de prueba
    res.json({
      nombre: 'Daniel',
      ap_paterno: 'Solis',
      puesto: 'Barbero'
    })
  }

  // Desarrolla la logica para el login dependieno del tipo de rol y retorna todos los datos de ese usuario con json()
}