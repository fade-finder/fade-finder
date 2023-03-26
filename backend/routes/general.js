const express = require('express')
const router = express.Router()
// Controlador
const controladorGeneral = require('../controllers/general')

// * * * * * * * * GET * * * * * * * * *
router.get('/barberos', controladorGeneral.getBarberos)
router.get('/clientes', controladorGeneral.getClientes)
router.get('/datos/:idToken', controladorGeneral.getDatos)

// * * * * * * * * POST * * * * * * * * *
router.post('/login', controladorGeneral.postLogin)

// * * * * * * * * PUT * * * * * * * * *
router.put('/perfil')   // actualizar pefil
router.put('/cancelar-cita/:idCita')  // cancelar cita

module.exports = router