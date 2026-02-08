const { Usuario } = require('../models/UsuarioModel');
const { DocenteMateria } = require('../models/DocenteMateriaModel');
const { Materia } = require('../models/MateriaModel');
const { DisponibilidadDocente } = require('../models/DisponibilidadDocenteModel');

/**
 * ==================================================
 * GET DOCENTES POR MATERIA
 * /usuarios/docentes/materia/:id
 * ==================================================
 */
exports.obtenerDocentesPorMateria = async (req, res) => {
  try {
    const { id } = req.params;

    const docentes = await Usuario.findAll({
      where: { rol: 'docente' },
      attributes: ['id', 'nombre'],
      include: [{
        model: DocenteMateria,
        as: 'MateriasDocente',
        attributes: [],
        where: { materia_id: id }
      }],
      order: [['nombre', 'ASC']]
    });

    res.json(docentes);
  } catch (error) {
    console.error('🔥 Error obtenerDocentesPorMateria:', error);
    res.status(500).json({ error: 'Error obteniendo docentes por materia' });
  }
};

/**
 * ==================================================
 * GET DISPONIBILIDAD DE UN DOCENTE
 * /usuarios/docente/:id/disponibilidad
 * ==================================================
 */
exports.obtenerDisponibilidadDocente = async (req, res) => {
  try {
    const { id } = req.params;

    const disponibilidad = await DisponibilidadDocente.findAll({
      where: { docente_id: id },
      attributes: ['id', 'dia', 'hora_inicio', 'hora_fin'],
      order: [['dia', 'ASC'], ['hora_inicio', 'ASC']]
    });

    res.json(disponibilidad);
  } catch (error) {
    console.error('🔥 Error obtenerDisponibilidadDocente:', error);
    res.status(500).json({ error: 'Error obteniendo disponibilidad' });
  }
};

/**
 * ==================================================
 * GET TODOS LOS DOCENTES
 * /usuarios/docentes
 * ==================================================
 */
exports.obtenerDocentes = async (req, res) => {
  try {
    const docentes = await Usuario.findAll({
      where: { rol: 'docente' },
      attributes: ['id', 'nombre'],
      order: [['nombre', 'ASC']]
    });

    res.json(docentes);
  } catch (error) {
    console.error('🔥 Error obtenerDocentes:', error);
    res.status(500).json({ error: 'Error obteniendo docentes' });
  }
};

/**
 * ==================================================
 * GET TODOS LOS ESTUDIANTES
 * /usuarios/estudiantes
 * ==================================================
 */
exports.obtenerEstudiantes = async (req, res) => {
  try {
    const estudiantes = await Usuario.findAll({
      where: { rol: 'estudiante' },
      attributes: ['id', 'nombre'],
      order: [['nombre', 'ASC']]
    });

    res.json(estudiantes);
  } catch (error) {
    console.error('🔥 Error obtenerEstudiantes:', error);
    res.status(500).json({ error: 'Error obteniendo estudiantes' });
  }
};
