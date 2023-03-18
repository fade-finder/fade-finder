const express = require('express')
const router = express.Router()
// Controlador
const controladorGeneral = require('../controllers/general')

// * * * * * * * * GET * * * * * * * * *
router.get('/barberos', controladorGeneral.getBarberos)

// * * * * * * * * POST * * * * * * * * *
router.post('/login')

// * * * * * * * * PUT * * * * * * * * *
router.put('/perfil')   // actualizar pefil
router.put('/cancelar-cita/:idCita')  // cancelar cita

module.exports = router