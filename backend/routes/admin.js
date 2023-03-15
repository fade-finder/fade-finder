const express = require('express')
const router = express.Router()

// * * * * * * * GET * * * * * * * *
// login
// pefil
// landing page
// ver citas
// ver barberos, ver barbero, pagina para agregar barbero
// ver clientes
// ver estadisticas del negocio

// * * * * * * POST * * * * * * * * 
router.post('/barberos/agregar')   // agregar barbero
// login

// * * * * * * PUT * * * * * * * * *
router.put('/barberos/:idBarbero')   // actualizar barbero
// cancelar cita
// actualizar perfil

// * * * * * * DELETE * * * * * * * *
router.delete('/barberos/:idBarbero')    // eliminar barbero

module.exports = router