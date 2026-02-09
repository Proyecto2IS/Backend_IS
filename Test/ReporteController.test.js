// ===============================
// MOCKS
// ===============================
jest.mock('../models/TutoriaModel', () => ({
  Tutoria: {
    findAll: jest.fn()
  }
}));

jest.mock('../models/UsuarioModel', () => ({
  Usuario: {
    findByPk: jest.fn()
  }
}));

jest.mock('../services/emailService', () => ({
  enviarCorreo: jest.fn()
}));

const {
  reporteTutoriasPorDocente,
  reporteTutoriasPorEstudiante,
  reporteTutoriasPorSemana
} = require('../controllers/ReporteController');

const { Tutoria } = require('../models/TutoriaModel');
const { Usuario } = require('../models/UsuarioModel');
const { enviarCorreo } = require('../services/emailService');

// ===============================
// HELPERS
// ===============================
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

// ===============================
// TESTS
// ===============================
describe('ReporteController', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ---------------------------------
  // REPORTE POR DOCENTE
  // ---------------------------------
  test('reporteTutoriasPorDocente devuelve resumen correcto', async () => {
    Tutoria.findAll
      .mockResolvedValueOnce([
        {
          estado: 'finalizada',
          numero_estudiantes_solicitados: 2,
          numero_estudiantes_asistieron: 1
        },
        {
          estado: 'pendiente',
          numero_estudiantes_solicitados: 1
        }
      ])
      .mockResolvedValueOnce([
        { estado: 'finalizada', dataValues: { total: 1 } },
        { estado: 'pendiente', dataValues: { total: 1 } }
      ]);

    Usuario.findByPk.mockResolvedValue({ email: 'docente@mail.com' });

    const req = {
      params: { id: 1 },
      query: {}
    };

    const res = mockResponse();

    await reporteTutoriasPorDocente(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        docente_id: 1,
        total_tutorias: 2,
        estudiantes_solicitados: 3,
        estudiantes_asistieron: 1
      })
    );
  });

  // ---------------------------------
  // REPORTE POR ESTUDIANTE
  // ---------------------------------
  test('reporteTutoriasPorEstudiante devuelve tutorías', async () => {
    Tutoria.findAll.mockResolvedValue([
      { id: 1 },
      { id: 2 }
    ]);

    Usuario.findByPk.mockResolvedValue({ email: 'estudiante@mail.com' });

    const req = {
      params: { id: 5 },
      query: {}
    };

    const res = mockResponse();

    await reporteTutoriasPorEstudiante(req, res);

    expect(res.json).toHaveBeenCalledWith({
      estudiante_id: 5,
      total_tutorias: 2,
      tutorias: expect.any(Array)
    });
  });

  // ---------------------------------
  // REPORTE SEMANAL
  // ---------------------------------
  test('reporteTutoriasPorSemana devuelve error si faltan parámetros', async () => {
    const req = { query: {} };
    const res = mockResponse();

    await reporteTutoriasPorSemana(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Debe enviar inicio, fin y docente_id'
    });
  });

  test('reporteTutoriasPorSemana genera reporte correctamente', async () => {
    Tutoria.findAll.mockResolvedValue([
      {
        estado: 'finalizada',
        numero_estudiantes_solicitados: 2,
        numero_estudiantes_asistieron: 2
      }
    ]);

    Usuario.findByPk.mockResolvedValue({ email: 'docente@mail.com' });

    const req = {
      query: {
        inicio: '2024-01-01',
        fin: '2024-01-07',
        docente_id: 3
      }
    };

    const res = mockResponse();

    await reporteTutoriasPorSemana(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        docente_id: '3',
        total_tutorias: 1,
        estudiantes_solicitados: 2,
        estudiantes_asistieron: 2
      })
    );
  });

});