const express = require('express');
const router = express.Router();
const controller = require('../controllers/DisponibilidadDocenteController');

router.get('/docente/:id', controller.obtenerDisponibilidadPorDocente);

module.exports = router;
