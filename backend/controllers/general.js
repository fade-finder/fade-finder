const Barbero = require('../models/barbero')

exports.getBarberos = (req, res) => {
  // Aqui estoy devolviendo al cliente los barberos tomados de un documento de js el cual importo arriba
  // debes sustituir este codigo por uno que retorne los barberos de la bd
  // res.send(Barbero.VerBarberos)
  Barbero.VerBarberos()
  .then(resultado => {
    console.log(resultado)
    res.send(resultado)
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