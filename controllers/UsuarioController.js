const { Usuario } = require('../models/UsuarioModel');
const { DocenteMateria } = require('../models/DocenteMateriaModel');

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
    console.error("🔥 ERROR REAL:", error); // 👈 AHORA VERÁS EL ERROR EXACTO
    res.status(500).json({ error: 'Error obteniendo docentes' });
  }
};
