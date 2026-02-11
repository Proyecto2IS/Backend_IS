const express = require('express');
const router = express.Router();
const controller = require('../controllers/TutoriaController');
const auth = require('../middleware/auth.middleware');
const materiaController = require('../controllers/MateriaController');

router.get('/materias', materiaController.obtenerMaterias);

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
router.get('/historial/finalizadas', auth, controller.obtenerTutoriasFinalizadas);

module.exports = router;
