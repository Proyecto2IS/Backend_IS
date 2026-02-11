const { Tutoria } = require('../models/TutoriaModel');
const { Usuario } = require('../models/UsuarioModel');
const { PropuestaDocente } = require('../models/PropuestaDocenteModel');
const { PropuestaAlternativa } = require('../models/PropuestaAlternativaModel');
const { Op } = require('sequelize'); // ✅ SOLO OPERADORES
const { sequelize } = require('../db/conexion'); // ✅ TU CONEXIÓN REAL
const { enviarCorreo } = require('../services/emailService');


// ==================================================
// 🔹 CREAR TUTORÍA (ESTUDIANTE)
// ==================================================
exports.crearTutoria = async (req, res) => {
  try {
    const usuario = req.usuario;

    if (usuario.rol !== 'estudiante') {
      return res.status(403).json({ error: 'Solo estudiantes pueden solicitar tutorías' });
    }

    const { docente_id, materia_id, fecha, hora_inicio, hora_fin, tema } = req.body;

    if (!docente_id || !materia_id || !fecha || !hora_inicio || !hora_fin) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const ahora = new Date();
    const fechaTutoria = new Date(`${fecha}T${hora_inicio}`);
    if (fechaTutoria < ahora) {
      return res.status(400).json({ error: 'No puedes crear tutorías en el pasado' });
    }

    const conflictoEstudiante = await Tutoria.findOne({
      where: {
        estudiante_id: usuario.id,
        fecha,
        estado: { [Op.ne]: 'cancelada' },
        [Op.and]: [
          { hora_inicio: { [Op.lt]: hora_fin } },
          { hora_fin: { [Op.gt]: hora_inicio } }
        ]
      }
    });

    if (conflictoEstudiante) {
      return res.status(400).json({ error: 'Ya tienes una tutoría en ese horario' });
    }

    const conflictoDocente = await Tutoria.findOne({
      where: {
        docente_id,
        fecha,
        estado: { [Op.ne]: 'cancelada' },
        [Op.and]: [
          { hora_inicio: { [Op.lt]: hora_fin } },
          { hora_fin: { [Op.gt]: hora_inicio } }
        ]
      }
    });

    if (conflictoDocente) {
      return res.status(400).json({ error: 'El docente ya tiene una tutoría en ese horario' });
    }

    const nueva = await Tutoria.create({
      estudiante_id: usuario.id,
      docente_id,
      materia_id,
      fecha,
      hora_inicio,
      hora_fin,
      tema,
      estado: 'pendiente'
    });

    const estudiante = await Usuario.findByPk(usuario.id);
    const docente = await Usuario.findByPk(docente_id);

    await enviarCorreo(
      estudiante.email,
      'Tutoría registrada',
      `<h3>Tutoría registrada correctamente</h3>
       <p>Fecha: ${fecha}</p>
       <p>Hora: ${hora_inicio} - ${hora_fin}</p>
       <p>Estado: Pendiente</p>`
    );

    await enviarCorreo(
      docente.email,
      'Nueva solicitud de tutoría',
      `<h3>Nueva solicitud de tutoría</h3>
       <p>Estudiante: ${estudiante.nombre}</p>
       <p>Fecha: ${fecha}</p>
       <p>Hora: ${hora_inicio} - ${hora_fin}</p>`
    );

    res.json({ mensaje: 'Tutoría creada correctamente', tutoria: nueva });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creando tutoría' });
  }
};


// ==================================================
// 🔹 EDITAR TUTORÍA (DOCENTE / PENDIENTE)
// ==================================================
exports.editarTutoria = async (req, res) => {
  try {
    if (req.usuario.rol !== 'docente') {
      return res.status(403).json({ error: 'Solo el docente puede editar tutorías' });
    }

    const tutoria = await Tutoria.findByPk(req.params.id);
    if (!tutoria) return res.status(404).json({ error: 'Tutoría no encontrada' });

    if (tutoria.estado !== 'pendiente') {
      return res.status(400).json({ error: 'Solo tutorías pendientes pueden editarse' });
    }

    await tutoria.update(req.body);
    res.json({ mensaje: 'Tutoría actualizada correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error editando tutoría' });
  }
};


// ==================================================
// 🔹 OBTENER TUTORÍAS
// ==================================================
exports.obtenerTutoriasEstudiante = async (req, res) => {
  const tutorias = await Tutoria.findAll({
    where: { estudiante_id: req.usuario.id },
    order: [['fecha', 'DESC']]
  });
  res.json(tutorias);
};

exports.obtenerTutoriasDocente = async (req, res) => {
  const tutorias = await Tutoria.findAll({
    where: { docente_id: req.usuario.id },
    order: [['fecha', 'DESC']]
  });
  res.json(tutorias);
};

exports.obtenerTutoriasFinalizadas = async (req, res) => {
  const tutorias = await Tutoria.findAll({
    where: { estado: 'finalizada' },
    order: [['fecha', 'DESC']]
  });
  res.json(tutorias);
};


// ==================================================
// 🔹 CAMBIAR ESTADO (CONFIRMAR / FINALIZAR)
// ==================================================
exports.cambiarEstadoTutoria = async (req, res) => {
  try {
    if (req.usuario.rol !== 'docente') {
      return res.status(403).json({ error: 'Solo el docente puede cambiar el estado' });
    }

    const { estado } = req.body;
    const tutoria = await Tutoria.findByPk(req.params.id);
    if (!tutoria) return res.status(404).json({ error: 'Tutoría no encontrada' });

    const transiciones = {
      pendiente: ['confirmada'],
      confirmada: ['finalizada'],
      finalizada: [],
      cancelada: []
    };

    if (!transiciones[tutoria.estado].includes(estado)) {
      return res.status(400).json({ error: 'Transición de estado no permitida' });
    }

    await tutoria.update({ estado });

    const estudiante = await Usuario.findByPk(tutoria.estudiante_id);

    await enviarCorreo(
      estudiante.email,
      'Estado de tutoría actualizado',
      `<h3>Tu tutoría ahora está ${estado.toUpperCase()}</h3>`
    );

    res.json({ mensaje: 'Estado actualizado correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error actualizando estado' });
  }
};


// ==================================================
// 🔹 CANCELAR + PROPONER ALTERNATIVA (DOCENTE)
// ==================================================
exports.cancelarConPropuesta = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { motivo, propuestas } = req.body;

    if (req.usuario.rol !== 'docente') {
      await t.rollback();
      return res.status(403).json({ error: 'Solo el docente puede cancelar tutorías' });
    }

    if (!motivo || !Array.isArray(propuestas) || propuestas.length === 0) {
      await t.rollback();
      return res.status(400).json({ error: 'Debe indicar motivo y propuestas' });
    }

    const tutoria = await Tutoria.findByPk(req.params.id, { transaction: t });
    if (!tutoria) {
      await t.rollback();
      return res.status(404).json({ error: 'Tutoría no encontrada' });
    }

    await tutoria.update({ estado: 'cancelada' }, { transaction: t });

    const propuestaDocente = await PropuestaDocente.create(
      { tutoria_id: tutoria.id, comentario: motivo },
      { transaction: t }
    );

    for (const p of propuestas) {
      await PropuestaAlternativa.create(
        {
          propuesta_id: propuestaDocente.id,
          fecha: p.fecha,
          hora_inicio: p.hora_inicio,
          hora_fin: p.hora_fin
        },
        { transaction: t }
      );
    }

    await t.commit();

    const estudiante = await Usuario.findByPk(tutoria.estudiante_id);

    await enviarCorreo(
      estudiante.email,
      'Tutoría cancelada - Nueva propuesta',
      `<h3>El docente canceló la tutoría</h3>
       <p>Motivo: ${motivo}</p>
       <p>Revisa las nuevas propuestas en el sistema.</p>`
    );

    res.json({ mensaje: 'Tutoría cancelada y propuesta enviada' });

  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ error: 'Error cancelando tutoría' });
  }
};


// ==================================================
// 🔹 ACEPTAR PROPUESTA (ESTUDIANTE)
// ==================================================
exports.aceptarPropuesta = async (req, res) => {
  try {
    if (req.usuario.rol !== 'estudiante') {
      return res.status(403).json({ error: 'Solo el estudiante puede aceptar propuestas' });
    }

    const propuestaAlt = await PropuestaAlternativa.findByPk(req.params.id);
    if (!propuestaAlt) {
      return res.status(404).json({ error: 'Propuesta alternativa no encontrada' });
    }

    const propuestaDocente = await PropuestaDocente.findByPk(propuestaAlt.propuesta_id);
    if (!propuestaDocente) {
      return res.status(404).json({ error: 'Propuesta del docente no encontrada' });
    }

    const tutoriaOriginal = await Tutoria.findByPk(propuestaDocente.tutoria_id);
    if (!tutoriaOriginal) {
      return res.status(404).json({ error: 'Tutoría original no encontrada' });
    }

    const nuevaTutoria = await Tutoria.create({
      estudiante_id: tutoriaOriginal.estudiante_id,
      docente_id: tutoriaOriginal.docente_id,
      materia_id: tutoriaOriginal.materia_id,
      fecha: propuestaAlt.fecha,
      hora_inicio: propuestaAlt.hora_inicio,
      hora_fin: propuestaAlt.hora_fin,
      tema: tutoriaOriginal.tema,
      estado: 'confirmada'
    });

    await propuestaAlt.update({ estado: 'aceptada' });

    const docente = await Usuario.findByPk(tutoriaOriginal.docente_id);

    await enviarCorreo(
      docente.email,
      'Propuesta aceptada',
      `<h3>El estudiante aceptó tu propuesta</h3>
       <p>Nueva tutoría confirmada</p>
       <p>Fecha: ${propuestaAlt.fecha}</p>
       <p>Hora: ${propuestaAlt.hora_inicio} - ${propuestaAlt.hora_fin}</p>`
    );

    res.json({
      mensaje: 'Propuesta aceptada y tutoría creada',
      tutoria: nuevaTutoria
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error aceptando propuesta' });
  }
};
