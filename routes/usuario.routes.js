const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');

router.get('/docentes/materia/:id', UsuarioController.obtenerDocentesPorMateria);

module.exports = router;
