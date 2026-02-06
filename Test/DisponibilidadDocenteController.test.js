// 🔴 MOCK DEL MODELO ANTES DE IMPORTAR EL CONTROLLER
jest.mock('../models/DisponibilidadDocenteModel', () => ({
  DisponibilidadDocente: {
    findAll: jest.fn()
  }
}));

const { obtenerDisponibilidadPorDocente } = require('../controllers/DisponibilidadDocenteController');
const { DisponibilidadDocente } = require('../models/DisponibilidadDocenteModel');

describe('DisponibilidadDocenteController', () => {

  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 1 }
    };

    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    jest.clearAllMocks();
  });

  // ===============================
  // ✅ CASO OK
  // ===============================
  it('debe devolver la disponibilidad del docente', async () => {
    const mockData = [
      { dia: 'Lunes', hora_inicio: '08:00', hora_fin: '10:00' }
    ];

    DisponibilidadDocente.findAll.mockResolvedValue(mockData);

    await obtenerDisponibilidadPorDocente(req, res);

    expect(DisponibilidadDocente.findAll).toHaveBeenCalledWith({
      where: { docente_id: 1 }
    });

    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  // ===============================
  // ✅ CASO ERROR (sin ruido)
  // ===============================
  it('debe manejar error interno correctamente', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    DisponibilidadDocente.findAll.mockRejectedValue(
      new Error('Fallo Sequelize')
    );

    await obtenerDisponibilidadPorDocente(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error obteniendo disponibilidad'
    });
  });

});