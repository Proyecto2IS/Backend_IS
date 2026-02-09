const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');

// ==================================================
// 🔹 DOCENTES POR MATERIA (combo dependiente)
// ==================================================
router.get(
  '/docentes/materia/:id',
  UsuarioController.obtenerDocentesPorMateria
);

// ==================================================
// 🔹 TODOS LOS DOCENTES (combo)
// ==================================================
router.get(
  '/docentes',
  UsuarioController.getDocentesCombo
);

// ==================================================
// 🔹 TODOS LOS ESTUDIANTES (combo)
// ==================================================
router.get(
  '/estudiantes',
  UsuarioController.getEstudiantesCombo
);

module.exports = router;
