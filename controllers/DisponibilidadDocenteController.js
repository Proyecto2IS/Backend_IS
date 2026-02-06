const { DisponibilidadDocente } = require('../models/DisponibilidadDocenteModel');

exports.obtenerDisponibilidadPorDocente = async (req, res) => {
  try {
    const { id } = req.params;

    const disponibilidad = await DisponibilidadDocente.findAll({
      where: { docente_id: id }
    });

    res.json(disponibilidad);

  } catch (error) {
    console.error("🔥 ERROR REAL:", error); // ahora verás si algo falla
    res.status(500).json({ error: 'Error obteniendo disponibilidad' });
  }
};
