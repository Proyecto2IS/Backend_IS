const { Usuario } = require('../models/UsuarioModel');
const { DocenteMateria } = require('../models/DocenteMateriaModel');

// ===============================
// DOCENTES POR MATERIA
// ===============================
exports.obtenerDocentesPorMateria = async (req, res) => {
  try {
    const { id } = req.params;

    const docentes = await Usuario.findAll({
      where: { rol: 'docente' },
      include: [{
        model: DocenteMateria,
        where: { materia_id: id }
      }]
    });

    res.json(docentes);

  } catch (error) {
    console.error("🔥 ERROR REAL:", error);
    res.status(500).json({ error: 'Error obteniendo docentes' });
  }
};


// ===============================
// OBTENER ESTUDIANTES
// ===============================
exports.obtenerEstudiantes = async (req, res) => {
  try {

    const estudiantes = await Usuario.findAll({
      where: { rol: 'estudiante' },
      attributes: ['id','nombre','email']
    });

    res.json(estudiantes);

  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo estudiantes' });
  }
};


// ===============================
// OBTENER DOCENTES
// ===============================
exports.obtenerDocentes = async (req, res) => {
  try {

    const docentes = await Usuario.findAll({
      where: { rol: 'docente' },
      attributes: ['id','nombre','email']
    });

    res.json(docentes);

  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo docentes' });
  }
};
