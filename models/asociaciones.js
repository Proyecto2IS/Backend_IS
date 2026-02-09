const { Usuario } = require('./UsuarioModel');
const { Materia } = require('./MateriaModel');
const { DocenteMateria } = require('./DocenteMateriaModel');
const { DisponibilidadDocente } = require('./DisponibilidadDocenteModel');
const { Tutoria } = require('./TutoriaModel');

const { HistorialEstados } = require('./HistorialEstadosModel');

const { PropuestaDocente } = require('../models/PropuestaDocenteModel');
const { PropuestaAlternativa } = require('../models/PropuestaAlternativaModel');
// ==================================================
// DOCENTE ↔ MATERIAS
// ==================================================
Usuario.hasMany(DocenteMateria, {
  foreignKey: 'docente_id',
  as: 'MateriasDocente'
});

DocenteMateria.belongsTo(Usuario, {
  foreignKey: 'docente_id',
  as: 'Docente'
});

Materia.hasMany(DocenteMateria, {
  foreignKey: 'materia_id',
  as: 'DocentesMateria'
});

DocenteMateria.belongsTo(Materia, {
  foreignKey: 'materia_id',
  as: 'Materia'
});

// ==================================================
// DOCENTE ↔ DISPONIBILIDAD
// ==================================================
Usuario.hasMany(DisponibilidadDocente, {
  foreignKey: 'docente_id',
  as: 'Disponibilidades'
});

DisponibilidadDocente.belongsTo(Usuario, {
  foreignKey: 'docente_id',
  as: 'Docente'
});

// ==================================================
// TUTORÍAS
// ==================================================
Usuario.hasMany(Tutoria, {
  foreignKey: 'estudiante_id',
  as: 'TutoriasEstudiante'
});

Usuario.hasMany(Tutoria, {
  foreignKey: 'docente_id',
  as: 'TutoriasDocente'
});

Tutoria.belongsTo(Usuario, {
  foreignKey: 'estudiante_id',
  as: 'Estudiante'
});

Tutoria.belongsTo(Usuario, {
  foreignKey: 'docente_id',
  as: 'Docente'
});

Tutoria.belongsTo(Materia, {
  foreignKey: 'materia_id',
  as: 'Materia'
});

// ==================================================
// PROPUESTAS DE DOCENTE
// ==================================================
Tutoria.hasMany(PropuestaDocente, {
  foreignKey: 'tutoria_id',
  as: 'PropuestasDocente'
});

PropuestaDocente.belongsTo(Tutoria, {
  foreignKey: 'tutoria_id',
  as: 'Tutoria'
});

// ==================================================
// PROPUESTAS ALTERNATIVAS
// ==================================================
PropuestaDocente.hasMany(PropuestaAlternativa, {
  foreignKey: 'propuesta_id',
  as: 'Alternativas'
});

PropuestaAlternativa.belongsTo(PropuestaDocente, {
  foreignKey: 'propuesta_id',
  as: 'Propuesta'
});

// ==================================================
// HISTORIAL DE ESTADOS
// ==================================================
Tutoria.hasMany(HistorialEstados, {
  foreignKey: 'tutoria_id',
  as: 'Historial'
});

HistorialEstados.belongsTo(Tutoria, {
  foreignKey: 'tutoria_id',
  as: 'Tutoria'
});

module.exports = {};
