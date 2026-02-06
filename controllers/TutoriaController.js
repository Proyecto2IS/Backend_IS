const { Tutoria } = require('../models/TutoriaModel');
const { Usuario } = require('../models/UsuarioModel');
const { Op } = require('sequelize');
const { enviarCorreo } = require('../services/emailService');


// =============================
// 🔹 CREAR TUTORÍA (ESTUDIANTE)
// =============================
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

    // ❌ Evitar fechas pasadas
    const ahora = new Date();
    const fechaTutoria = new Date(`${fecha}T${hora_inicio}`);
    if (fechaTutoria < ahora) {
      return res.status(400).json({ error: 'No puedes crear tutorías en el pasado' });
    }

    // ⛔ Conflicto estudiante
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
      return res.status(400).json({ error: 'Ya tienes tutoría en ese horario' });
    }

    // ⛔ Conflicto docente
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
      return res.status(400).json({ error: 'El docente ya tiene tutoría en ese horario' });
    }

    const nueva = await Tutoria.create({
      estudiante_id: usuario.id,
      docente_id,
      materia_id,
      fecha,
      hora_inicio,
      hora_fin,
      tema,
      estado: 'pendiente',
      creado_en: new Date()
    });

    const estudiante = await Usuario.findByPk(usuario.id);
    const docente = await Usuario.findByPk(docente_id);

    // 📧 Correo al estudiante
    await enviarCorreo(
      estudiante.email,
      'Tutoría registrada',
      `<h3>Tu tutoría fue registrada</h3>
       <p>Fecha: ${fecha}</p>
       <p>Hora: ${hora_inicio} - ${hora_fin}</p>
       <p>Estado: Pendiente de aprobación</p>`
    );

    // 📧 Correo al docente
    await enviarCorreo(
      docente.email,
      'Nueva solicitud de tutoría',
      `<h3>Tienes una nueva solicitud</h3>
       <p>Estudiante: ${estudiante.nombre}</p>
       <p>Fecha: ${fecha}</p>
       <p>Hora: ${hora_inicio} - ${hora_fin}</p>`
    );

    res.json({ mensaje: 'Tutoría creada', tutoria: nueva });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creando tutoría' });
  }
};


// =============================
// 🔹 EDITAR TUTORÍA (DOCENTE)
// =============================
exports.editarTutoria = async (req, res) => {
  try {
    const usuario = req.usuario;

    if (usuario.rol !== 'docente') {
      return res.status(403).json({ error: 'Solo el docente puede editar tutorías' });
    }

    const tutoria = await Tutoria.findByPk(req.params.id);
    if (!tutoria) return res.status(404).json({ error: 'Tutoría no encontrada' });

    if (tutoria.estado !== 'pendiente') {
      return res.status(400).json({ error: 'Solo tutorías pendientes pueden editarse' });
    }

    await tutoria.update(req.body);

    res.json({ mensaje: 'Tutoría actualizada' });

  } catch (error) {
    res.status(500).json({ error: 'Error editando tutoría' });
  }
};


// =============================
// 🔹 CONSULTAS
// =============================
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


// =============================
// 🔹 CAMBIAR ESTADO
// =============================
exports.cambiarEstadoTutoria = async (req, res) => {
  try {
    const { estado } = req.body;
    const usuario = req.usuario;

    const tutoria = await Tutoria.findByPk(req.params.id);
    if (!tutoria) return res.status(404).json({ error: 'Tutoría no encontrada' });

    const transicionesValidas = {
      pendiente: ['confirmada', 'cancelada'],
      confirmada: ['finalizada', 'cancelada'],
      finalizada: [],
      cancelada: []
    };

    if (!transicionesValidas[tutoria.estado].includes(estado)) {
      return res.status(400).json({ error: 'Transición de estado no permitida' });
    }

    // 🔒 Reglas por rol
    if (estado === 'confirmada' && usuario.rol !== 'docente')
      return res.status(403).json({ error: 'Solo el docente puede confirmar' });

    if (estado === 'finalizada' && usuario.rol !== 'docente')
      return res.status(403).json({ error: 'Solo el docente puede finalizar' });

    if (estado === 'cancelada' && usuario.rol === 'estudiante' && usuario.id !== tutoria.estudiante_id)
      return res.status(403).json({ error: 'No puedes cancelar tutorías de otros' });

    await tutoria.update({ estado });

    const estudiante = await Usuario.findByPk(tutoria.estudiante_id);
    const docente = await Usuario.findByPk(tutoria.docente_id);

    // 📧 Notificar estudiante
    await enviarCorreo(
      estudiante.email,
      'Estado de tutoría actualizado',
      `<h3>Tu tutoría ahora está: ${estado.toUpperCase()}</h3>`
    );

    // 📧 Notificar docente
    await enviarCorreo(
      docente.email,
      'Actualización de tutoría',
      `<h3>La tutoría con ${estudiante.nombre} ahora está: ${estado.toUpperCase()}</h3>`
    );

    res.json({ mensaje: 'Estado actualizado correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error actualizando estado' });
  }
};
