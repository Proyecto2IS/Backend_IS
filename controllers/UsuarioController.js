const { Usuario } = require('../models/UsuarioModel');
const { DocenteMateria } = require('../models/DocenteMateriaModel');
const { Materia } = require('../models/MateriaModel');

// ==================================================
// 🔹 DOCENTES POR MATERIA
// ==================================================
exports.obtenerDocentesPorMateria = async (req, res) => {
  try {
    const { id } = req.params;

    const docentes = await Usuario.findAll({
      where: { rol: 'docente' },
      include: [
        {
          model: DocenteMateria,
          as: 'MateriasDocente',
          where: { materia_id: id },
          include: [
            {
              model: Materia,
              as: 'Materia',
              attributes: ['id', 'nombre']
            }
          ]
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
// 🔹 TODOS LOS DOCENTES (COMBO)
// ==================================================
exports.getDocentesCombo = async (req, res) => {
  try {
    const docentes = await Usuario.findAll({
      where: { rol: 'docente' },
      attributes: ['id', 'nombre', 'email']
    });

    res.json(docentes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo docentes' });
  }
};

// ==================================================
// 🔹 TODOS LOS ESTUDIANTES (COMBO)
// ==================================================
exports.getEstudiantesCombo = async (req, res) => {
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
