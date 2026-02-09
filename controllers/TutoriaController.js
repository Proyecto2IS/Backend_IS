const { Tutoria } = require('../models/TutoriaModel');
const { Usuario } = require('../models/UsuarioModel');
const { PropuestaDocente } = require('../models/PropuestaDocenteModel');
const { PropuestaAlternativa } = require('../models/PropuestaAlternativaModel');
const { Materia } = require('../models/MateriaModel');
const { DocenteMateria } = require('../models/DocenteMateriaModel');
const { Op } = require('sequelize');
const { sequelize } = require('../db/conexion');
const { enviarCorreo } = require('../services/emailService');


// ==================================================
// 🔹 GET MATERIAS (COMBO)
// ==================================================
exports.obtenerMaterias = async (req, res) => {
  try {
    const materias = await Materia.findAll({
      attributes: ['id', 'nombre']
    });
    res.json(materias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo materias' });
  }
};


// ==================================================
// 🔹 DOCENTES POR MATERIA (COMBO DEPENDIENTE)
// ==================================================
exports.obtenerDocentesPorMateria = async (req, res) => {
  try {
    const { materiaId } = req.params;

    const docentes = await Usuario.findAll({
      where: { rol: 'docente' },
      attributes: ['id', 'nombre', 'email'],
      include: [
        {
          model: DocenteMateria,
          as: 'MateriasDocente',
          where: { materia_id: materiaId },
          attributes: []
        }
      ]
    });

    res.json(docentes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo docentes por materia' });
  }
};


// ==================================================
// 🔹 ESTUDIANTES (COMBO)
// ==================================================
exports.obtenerEstudiantes = async (req, res) => {
  try {
    const estudiantes = await Usuario.findAll({
      where: { rol: 'estudiante' },
      attributes: ['id', 'nombre', 'email']
    });

    res.json(estudiantes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo estudiantes' });
  }
};


// ==================================================
// 🔹 CREAR TUTORÍA (ESTUDIANTE)
// ==================================================
exports.crearTutoria = async (req, res) => {
  try {
    const usuario = req.usuario;

    if (usuario.rol !== 'estudiante') {
      return res.status(403).json({ error: 'Solo estudiantes pueden solicitar tutorías' });
    }

    const {
      docente_id,
      materia_id,
      fecha,
      hora_inicio,
      hora_fin,
      tema,
      numero_estudiantes_solicitados
    } = req.body;

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
      numero_estudiantes_solicitados: numero_estudiantes_solicitados || 1,
      estado: 'pendiente'
    });

    const estudiante = await Usuario.findByPk(usuario.id);
    const docente = await Usuario.findByPk(docente_id);

    await enviarCorreo(
      estudiante.email,
      'Tutoría registrada',
      `<h3>Tutoría registrada correctamente</h3>
       <p><strong>Fecha:</strong> ${fecha}</p>
       <p><strong>Hora:</strong> ${hora_inicio} - ${hora_fin}</p>
       <p><strong>Estudiantes previstos:</strong> ${nueva.numero_estudiantes_solicitados}</p>
       <p><strong>Estado:</strong> Pendiente</p>`
    );

    await enviarCorreo(
      docente.email,
      'Nueva solicitud de tutoría',
      `<h3>Nueva solicitud de tutoría</h3>
       <p><strong>Estudiante:</strong> ${estudiante.nombre}</p>
       <p><strong>Fecha:</strong> ${fecha}</p>
       <p><strong>Hora:</strong> ${hora_inicio} - ${hora_fin}</p>
       <p><strong>Estudiantes esperados:</strong> ${nueva.numero_estudiantes_solicitados}</p>`
    );

    res.json({ mensaje: 'Tutoría creada correctamente', tutoria: nueva });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creando tutoría' });
  }
};


// ==================================================
// 🔹 EDITAR TUTORÍA (DOCENTE)
// ==================================================
exports.editarTutoria = async (req, res) => {
  try {
    if (req.usuario.rol !== 'docente') {
      return res.status(403).json({ error: 'Solo el docente puede editar tutorías' });
    }

    const tutoria = await Tutoria.findByPk(req.params.id);
    if (!tutoria) {
      return res.status(404).json({ error: 'Tutoría no encontrada' });
    }

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
  try {

    const tutorias = await Tutoria.findAll({
      where: { estudiante_id: req.usuario.id },
      order: [['fecha', 'DESC']],
      include: [
        {
          model: PropuestaDocente,
          as: 'PropuestasDocente',   // 👈 EXACTAMENTE como lo definiste
          include: [
            {
              model: PropuestaAlternativa,
              as: 'Alternativas'     // 👈 EXACTAMENTE como lo definiste
            }
          ]
        }
      ]
    });

    res.json(tutorias);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo tutorías' });
  }
};

exports.obtenerTutoriasDocente = async (req, res) => {
  try {
    const tutorias = await Tutoria.findAll({
      where: { docente_id: req.usuario.id },
      order: [['fecha', 'DESC']]
    });
    res.json(tutorias);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo tutorías' });
  }
};

exports.obtenerTutoriasFinalizadas = async (req, res) => {
  try {
    const tutorias = await Tutoria.findAll({
      where: { estado: 'finalizada' },
      order: [['fecha', 'DESC']]
    });
    res.json(tutorias);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo tutorías finalizadas' });
  }
};


// ==================================================
// 🔹 CAMBIAR ESTADO TUTORÍA
// ==================================================
exports.cambiarEstadoTutoria = async (req, res) => {
  try {
    if (req.usuario.rol !== 'docente') {
      return res.status(403).json({ error: 'Solo el docente puede cambiar el estado' });
    }

    const { estado, numero_estudiantes_asistieron } = req.body;

    const tutoria = await Tutoria.findByPk(req.params.id);
    if (!tutoria) {
      return res.status(404).json({ error: 'Tutoría no encontrada' });
    }

    const transiciones = {
      pendiente: ['confirmada'],
      confirmada: ['finalizada'],
      finalizada: [],
      cancelada: []
    };

    if (!transiciones[tutoria.estado].includes(estado)) {
      return res.status(400).json({ error: 'Transición de estado no permitida' });
    }

    await tutoria.update({
      estado,
      numero_estudiantes_asistieron:
        estado === 'finalizada'
          ? numero_estudiantes_asistieron ?? tutoria.numero_estudiantes_asistieron
          : tutoria.numero_estudiantes_asistieron
    });

    const estudiante = await Usuario.findByPk(tutoria.estudiante_id);

    await enviarCorreo(
      estudiante.email,
      'Estado de tutoría actualizado',
      `<h3>Estado actualizado</h3>
       <p><strong>Estado:</strong> ${estado}</p>
       <p><strong>Asistieron:</strong> ${tutoria.numero_estudiantes_asistieron ?? 'No registrado'}</p>`
    );

    res.json({ mensaje: 'Estado actualizado correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error actualizando estado' });
  }
};


// ==================================================
// 🔹 CANCELAR + PROPONER ALTERNATIVAS
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
      'Tutoría cancelada',
      `<h3>Tutoría cancelada</h3>
       <p><strong>Motivo:</strong> ${motivo}</p>
       <p>Revisa las nuevas propuestas en el sistema.</p>`
    );

    res.json({ mensaje: 'Tutoría cancelada y propuestas enviadas' });

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
  const alternativaId = req.params.id;
  const usuarioId = req.usuario.id;

  try {
    if (req.usuario.rol !== 'estudiante') {
      return res.status(403).json({ error: 'Solo el estudiante puede aceptar propuestas' });
    }

    const propuestaAlt = await PropuestaAlternativa.findByPk(alternativaId);
    if (!propuestaAlt) return res.status(404).json({ error: 'Propuesta no encontrada' });

    const propuestaDocente = await PropuestaDocente.findByPk(propuestaAlt.propuesta_id);
    if (!propuestaDocente) return res.status(404).json({ error: 'Propuesta del docente no encontrada' });

    const tutoria = await Tutoria.findByPk(propuestaDocente.tutoria_id);
    if (!tutoria) return res.status(404).json({ error: 'Tutoría original no encontrada' });

    // Verificar permiso
    if (tutoria.estudiante_id !== usuarioId) {
      return res.status(403).json({ error: 'No autorizado para aceptar esta alternativa' });
    }

    // Ejecutar en transacción para asegurar consistencia
    await sequelize.transaction(async (t) => {
      // Actualizar la tutoría original con la alternativa seleccionada
      tutoria.fecha = propuestaAlt.fecha;
      tutoria.hora_inicio = propuestaAlt.hora_inicio;
      tutoria.hora_fin = propuestaAlt.hora_fin;
      tutoria.estado = 'confirmada';
      await tutoria.save({ transaction: t });

      // Marcar la alternativa como aceptada
      await propuestaAlt.update({ estado: 'aceptada' }, { transaction: t });

      // (Opcional) marcar la propuesta docente como respondida/aceptada si tienes campo
      // await propuestaDocente.update({ estado: 'aceptada' }, { transaction: t });

      // Registrar en historial de estados
      try {
        await HistorialEstados.create({
          tutoria_id: tutoria.id,
          estado: 'confirmada',
          usuario_id: usuarioId,
          creado_en: new Date()
        }, { transaction: t });
      } catch (histErr) {
        console.warn('No se pudo crear HistorialEstados:', histErr);
      }
    });

    // Notificar al docente (si mantienes enviarCorreo)
    try {
      const docente = await Usuario.findByPk(tutoria.docente_id);
      if (docente?.email) {
        await enviarCorreo(
          docente.email,
          'Propuesta aceptada',
          `<h3>Propuesta aceptada</h3>
           <p><strong>Fecha:</strong> ${propuestaAlt.fecha}</p>
           <p><strong>Hora:</strong> ${propuestaAlt.hora_inicio} - ${propuestaAlt.hora_fin}</p>`
        );
      }
    } catch (mailErr) {
      console.warn('Error al enviar correo:', mailErr);
    }

    // Devolver la tutoría actualizada
    const tutoriaActualizada = await Tutoria.findByPk(propuestaDocente.tutoria_id);
    return res.json({ mensaje: 'Propuesta aceptada', tutoria: tutoriaActualizada });
  } catch (error) {
    console.error('ERROR aceptarPropuesta:', error);
    return res.status(500).json({ error: 'Error aceptando propuesta' });
  }
};