const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/ReporteController');
const auth = require('../middleware/auth.middleware');

// =====================================================
// 🔹 REPORTE GENERAL POR DOCENTE
// GET /reportes/docente/:id
// Opcional: ?enviarCorreo=true
// =====================================================
router.get(
  '/docente/:id',
  auth,
  reporteController.reporteTutoriasPorDocente
);

// =====================================================
// 🔹 REPORTE POR ESTUDIANTE
// GET /reportes/estudiante/:id
// Opcional: ?enviarCorreo=true
// =====================================================
router.get(
  '/estudiante/:id',
  auth,
  reporteController.reporteTutoriasPorEstudiante
);

// =====================================================
// 🔹 REPORTE SEMANAL POR DOCENTE
// GET /reportes/semana?inicio=YYYY-MM-DD&fin=YYYY-MM-DD&docente_id=ID
// Opcional: &enviarCorreo=true
// =====================================================
router.get(
  '/semana',
  auth,
  reporteController.reporteTutoriasPorSemana
);

module.exports = router;
