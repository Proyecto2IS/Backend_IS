const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');

router.get('/docentes/materia/:id', UsuarioController.obtenerDocentesPorMateria);
router.get('/estudiantes', UsuarioController.obtenerEstudiantes);
router.get('/docentes', UsuarioController.obtenerDocentes);

module.exports = router;
