// =======================================
// MOCKS (ANTES DEL CONTROLLER)
// =======================================
jest.mock('../models/TutoriaModel', () => ({
  Tutoria: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn()
  }
}));

jest.mock('../models/UsuarioModel', () => ({
  Usuario: {
    findByPk: jest.fn()
  }
}));

jest.mock('../models/PropuestaDocenteModel', () => ({
  PropuestaDocente: {
    create: jest.fn(),
    findByPk: jest.fn()
  }
}));

jest.mock('../models/PropuestaAlternativaModel', () => ({
  PropuestaAlternativa: {
    create: jest.fn(),
    findByPk: jest.fn()
  }
}));

jest.mock('../services/emailService', () => ({
  enviarCorreo: jest.fn()
}));

jest.mock('../db/conexion', () => ({
  sequelize: {
    transaction: jest.fn(async () => ({
      commit: jest.fn(),
      rollback: jest.fn()
    }))
  }
}));

jest.mock('sequelize', () => ({
  Op: {
    ne: Symbol('ne'),
    lt: Symbol('lt'),
    gt: Symbol('gt'),
    and: Symbol('and')
  }
}));

// =======================================
// IMPORTS
// =======================================
const {
  crearTutoria,
  editarTutoria,
  cambiarEstadoTutoria,
  cancelarConPropuesta,
  aceptarPropuesta
} = require('../controllers/TutoriaController');

const { Tutoria } = require('../models/TutoriaModel');
const { Usuario } = require('../models/UsuarioModel');
const { enviarCorreo } = require('../services/emailService');

// =======================================
// HELPERS
// =======================================
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

// =======================================
// TESTS
// =======================================
describe('TutoriaController (actualizado)', () => {

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    console.error.mockRestore();
  });

  // ---------------------------------------
  // crearTutoria
  // ---------------------------------------
  it('rechaza si no es estudiante', async () => {
    const req = {
      usuario: { rol: 'docente' },
      body: {}
    };
    const res = mockRes();

    await crearTutoria(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('crea tutoría correctamente (flujo feliz)', async () => {
    const req = {
      usuario: { id: 1, rol: 'estudiante' },
      body: {
        docente_id: 2,
        materia_id: 3,
        fecha: '2099-12-31',
        hora_inicio: '10:00',
        hora_fin: '11:00',
        tema: 'Álgebra'
      }
    };
    const res = mockRes();

    Tutoria.findOne.mockResolvedValue(null);
    Tutoria.create.mockResolvedValue({
      id: 99,
      numero_estudiantes_solicitados: 1
    });

    Usuario.findByPk.mockResolvedValue({
      nombre: 'Test',
      email: 'test@mail.com'
    });

    await crearTutoria(req, res);

    expect(Tutoria.create).toHaveBeenCalled();
    expect(enviarCorreo).toHaveBeenCalledTimes(2);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ mensaje: expect.any(String) })
    );
  });

  // ---------------------------------------
  // editarTutoria
  // ---------------------------------------
  it('rechaza editar si no es docente', async () => {
    const req = {
      usuario: { rol: 'estudiante' },
      params: { id: 1 }
    };
    const res = mockRes();

    await editarTutoria(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  // ---------------------------------------
  // cambiarEstadoTutoria
  // ---------------------------------------
  it('cambia estado correctamente', async () => {
    const req = {
      usuario: { rol: 'docente' },
      params: { id: 1 },
      body: { estado: 'confirmada' }
    };
    const res = mockRes();

    Tutoria.findByPk.mockResolvedValue({
      estado: 'pendiente',
      estudiante_id: 1,
      numero_estudiantes_solicitados: 2,
      update: jest.fn()
    });

    Usuario.findByPk.mockResolvedValue({
      email: 'est@mail.com'
    });

    await cambiarEstadoTutoria(req, res);

    expect(enviarCorreo).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });

  // ---------------------------------------
  // cancelarConPropuesta
  // ---------------------------------------
  it('rechaza cancelar si no es docente', async () => {
    const req = {
      usuario: { rol: 'estudiante' },
      body: {}
    };
    const res = mockRes();

    await cancelarConPropuesta(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  // ---------------------------------------
  // aceptarPropuesta
  // ---------------------------------------
  it('rechaza aceptar propuesta si no es estudiante', async () => {
    const req = {
      usuario: { rol: 'docente' },
      params: { id: 1 }
    };
    const res = mockRes();

    await aceptarPropuesta(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

});