const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');

// 🔹 Docentes por materia (YA EXISTE)
router.get('/docentes/materia/:id', UsuarioController.obtenerDocentesPorMateria);

// 🔹 TODOS los docentes (combo)
router.get('/docentes', UsuarioController.getDocentesCombo);

// 🔹 TODOS los estudiantes (combo)
router.get('/estudiantes', UsuarioController.getEstudiantesCombo);

module.exports = router;
