const { Usuario } = require('./UsuarioModel');
const { Materia } = require('./MateriaModel');
const { DocenteMateria } = require('./DocenteMateriaModel');
const { DisponibilidadDocente } = require('./DisponibilidadDocenteModel');
const { Tutoria } = require('./TutoriaModel');
const { PropuestaDocente } = require('./PropuestaDocenteModel');
const { PropuestaAlternativa } = require('./PropuestaAlternativaModel');
const { HistorialEstados } = require('./HistorialEstadosModel');

// Docente ↔ Materias
Usuario.hasMany(DocenteMateria, { foreignKey: 'docente_id' });
DocenteMateria.belongsTo(Usuario, { foreignKey: 'docente_id' });
Materia.hasMany(DocenteMateria, { foreignKey: 'materia_id' });

// Tutorías
Usuario.hasMany(Tutoria, { foreignKey: 'estudiante_id', as: 'TutoriasEstudiante' });
Usuario.hasMany(Tutoria, { foreignKey: 'docente_id', as: 'TutoriasDocente' });

Tutoria.belongsTo(Usuario, { foreignKey: 'estudiante_id' });
Tutoria.belongsTo(Usuario, { foreignKey: 'docente_id' });
Tutoria.belongsTo(Materia, { foreignKey: 'materia_id' });

// Propuestas
Tutoria.hasMany(PropuestaDocente, { foreignKey: 'tutoria_id' });
PropuestaDocente.hasMany(PropuestaAlternativa, { foreignKey: 'propuesta_id' });

// Historial
Tutoria.hasMany(HistorialEstados, { foreignKey: 'tutoria_id' });

module.exports = {};
