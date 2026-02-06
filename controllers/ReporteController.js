const { Tutoria } = require('../models/TutoriaModel');
const { Usuario } = require('../models/UsuarioModel');
const { Op, fn, col } = require('sequelize');
const { enviarCorreo } = require('../services/emailService');

// =====================================================
// 🔹 REPORTE POR DOCENTE
// =====================================================
exports.reporteTutoriasPorDocente = async (req, res) => {
  try {
    const { id } = req.params;
    const { enviarCorreo: enviar = 'false' } = req.query;

    const tutorias = await Tutoria.findAll({
      where: { docente_id: id }
    });

    if (!tutorias.length) {
      return res.json({ mensaje: 'El docente no tiene tutorías registradas' });
    }

    let totalSolicitados = 0;
    let totalAsistieron = 0;

    tutorias.forEach(t => {
      totalSolicitados += t.numero_estudiantes_solicitados || 1;

      if (t.estado === 'finalizada' && t.numero_estudiantes_asistieron !== null) {
        totalAsistieron += t.numero_estudiantes_asistieron;
      }
    });

    const resumenEstados = await Tutoria.findAll({
      attributes: [
        'estado',
        [fn('COUNT', col('estado')), 'total']
      ],
      where: { docente_id: id },
      group: ['estado']
    });

    const docente = await Usuario.findByPk(id);

    // 📧 ENVÍO DE CORREO (OPCIONAL)
    if (enviar === 'true') {
      await enviarCorreo(
        docente.email,
        '📊 Reporte General de Tutorías',
        `
        <h3>Reporte General de Tutorías</h3>
        <p><b>Total de tutorías:</b> ${tutorias.length}</p>
        <p><b>Estudiantes esperados:</b> ${totalSolicitados}</p>
        <p><b>Estudiantes que asistieron:</b> ${totalAsistieron}</p>
        <p><b>Detalle por estado:</b></p>
        <ul>
          ${resumenEstados.map(r => `<li>${r.estado}: ${r.dataValues.total}</li>`).join('')}
        </ul>
        `
      );
    }

    res.json({
      docente_id: id,
      total_tutorias: tutorias.length,
      estudiantes_solicitados: totalSolicitados,
      estudiantes_asistieron: totalAsistieron,
      detalle_por_estado: resumenEstados,
      tutorias
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generando reporte del docente' });
  }
};

// =====================================================
// 🔹 REPORTE POR ESTUDIANTE
// =====================================================
exports.reporteTutoriasPorEstudiante = async (req, res) => {
  try {
    const { id } = req.params;
    const { enviarCorreo: enviar = 'false' } = req.query;

    const tutorias = await Tutoria.findAll({
      where: { estudiante_id: id }
    });

    if (!tutorias.length) {
      return res.json({ mensaje: 'El estudiante no tiene tutorías registradas' });
    }

    const estudiante = await Usuario.findByPk(id);

    if (enviar === 'true') {
      await enviarCorreo(
        estudiante.email,
        '📘 Reporte de Tutorías',
        `
        <h3>Reporte de Tutorías</h3>
        <p>Total de tutorías solicitadas: ${tutorias.length}</p>
        `
      );
    }

    res.json({
      estudiante_id: id,
      total_tutorias: tutorias.length,
      tutorias
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generando reporte del estudiante' });
  }
};

// =====================================================
// 🔹 REPORTE SEMANAL POR DOCENTE
// =====================================================
exports.reporteTutoriasPorSemana = async (req, res) => {
  try {
    const { inicio, fin, docente_id, enviarCorreo: enviar = 'false' } = req.query;

    if (!inicio || !fin || !docente_id) {
      return res.status(400).json({
        error: 'Debe enviar inicio, fin y docente_id'
      });
    }

    const tutorias = await Tutoria.findAll({
      where: {
        docente_id,
        fecha: { [Op.between]: [inicio, fin] }
      }
    });

    let totalSolicitados = 0;
    let totalAsistieron = 0;

    tutorias.forEach(t => {
      totalSolicitados += t.numero_estudiantes_solicitados || 1;

      if (t.estado === 'finalizada' && t.numero_estudiantes_asistieron !== null) {
        totalAsistieron += t.numero_estudiantes_asistieron;
      }
    });

    const docente = await Usuario.findByPk(docente_id);

    if (enviar === 'true') {
      await enviarCorreo(
        docente.email,
        '📅 Reporte Semanal de Tutorías',
        `
        <h3>Reporte Semanal</h3>
        <p>Semana: ${inicio} a ${fin}</p>
        <p>Total de tutorías: ${tutorias.length}</p>
        <p>Estudiantes esperados: ${totalSolicitados}</p>
        <p>Estudiantes que asistieron: ${totalAsistieron}</p>
        `
      );
    }

    res.json({
      semana: { inicio, fin },
      docente_id,
      total_tutorias: tutorias.length,
      estudiantes_solicitados: totalSolicitados,
      estudiantes_asistieron: totalAsistieron,
      tutorias
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generando reporte semanal' });
  }
};
