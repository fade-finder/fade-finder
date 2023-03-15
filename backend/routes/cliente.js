const express = require('express')
const router = express.Router()

// Controllers
const controladorCliente = require('../controllers/cliente')

// * * * * * * * GET * * * * * * * *
// login
// pefil
// landing page
// pagina register
// pagina agendar cita
// ver citas

// * * * * * * * * * POST * * * * * * * * * * *
router.post('/register')
router.post('/agendar-cita')  // agendar cita
// login

// * * * * * * * * * PUT * * * * * * * * * * *
// cancelar cita
// actualizar perfil

// * * * * * * * * * DELETE * * * * * * * * * * *
router.delete('/citas/:idCita')   // eliminar cita
router.delete('/perfil')    // eliminar cuenta

module.exports = router;