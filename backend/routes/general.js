const express = require('express')
const router = express.Router()

// * * * * * * * * POST * * * * * * * * *
router.post('/login')

// * * * * * * * * PUT * * * * * * * * *
router.put('/perfil')   // actualizar pefil
router.put('/cancelar-cita/:idCita')  // cancelar cita


module.exports = router