const express = require('express');
const router = express.Router();
const controller = require('../controllers/TutoriaController');
const auth = require('../middleware/auth.middleware');

// Crear tutoría (solo estudiante logueado)
router.post('/', auth, controller.crearTutoria);

// Tutorías del estudiante (solo él mismo)
router.get('/estudiante/:id', auth, controller.obtenerTutoriasEstudiante);

// Tutorías del docente (solo él mismo)
router.get('/docente/:id', auth, controller.obtenerTutoriasDocente);

// Editar tutoría
router.put('/:id', auth, controller.editarTutoria);

// Cambiar estado
router.put('/:id/estado', auth, controller.cambiarEstadoTutoria);

// Historial finalizadas
router.get('/historial/finalizadas', auth, controller.obtenerTutoriasFinalizadas);

module.exports = router;
