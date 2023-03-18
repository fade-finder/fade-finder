const barberosData = require('../utils/barberosData')

exports.getBarberos = (req, res) => {
  // Aqui estoy devolviendo al cliente los barberos tomados de un documento de js el cual importo arriba
  // debes sustituir este codigo por uno que retorne los barberos de la bd
  res.send(barberosData.barberos)
}