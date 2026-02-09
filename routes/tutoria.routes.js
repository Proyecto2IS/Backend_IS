const express = require('express');
const router = express.Router();
const controller = require('../controllers/TutoriaController');
const auth = require('../middleware/auth.middleware');

// ==================================================
// 🔹 GET MATERIAS (COMBO BOX)
// ==================================================
router.get('/materias', auth, controller.obtenerMaterias);

// ==================================================
// 🔹 GET DOCENTES POR MATERIA (COMBO BOX)
// ==================================================
router.get(
  '/docentes/materia/:materiaId',
  auth,
  controller.obtenerDocentesPorMateria
);

// ==================================================
// 🔹 GET ESTUDIANTES (COMBO BOX)
// ==================================================
router.get('/estudiantes', auth, controller.obtenerEstudiantes);

// ==================================================
// 🔹 CREAR TUTORÍA (ESTUDIANTE)
// ==================================================
router.post('/', auth, controller.crearTutoria);

// ==================================================
// 🔹 VER TUTORÍAS DEL ESTUDIANTE (TOKEN)
// ==================================================
router.get('/estudiante', auth, controller.obtenerTutoriasEstudiante);

// ==================================================
// 🔹 VER TUTORÍAS DEL DOCENTE (TOKEN)
// ==================================================
router.get('/docente', auth, controller.obtenerTutoriasDocente);

// ==================================================
// 🔹 EDITAR TUTORÍA (SOLO DOCENTE / PENDIENTE)
// ==================================================
router.put('/:id', auth, controller.editarTutoria);

// ==================================================
// 🔹 CAMBIAR ESTADO (CONFIRMAR / FINALIZAR)
// ==================================================
router.put('/:id/estado', auth, controller.cambiarEstadoTutoria);

// ==================================================
// 🔹 CANCELAR + PROPONER ALTERNATIVA (DOCENTE)
// ==================================================
router.put('/:id/cancelar', auth, controller.cancelarConPropuesta);

// ==================================================
// 🔹 ACEPTAR PROPUESTA (ESTUDIANTE)
// ==================================================
router.post(
  '/propuestas/alternativas/:id/aceptar',
  auth,
  controller.aceptarPropuesta
);

// ==================================================
// 🔹 HISTORIAL DE TUTORÍAS FINALIZADAS
// ==================================================
router.get(
  '/historial/finalizadas',
  auth,
  controller.obtenerTutoriasFinalizadas
);

module.exports = router;
