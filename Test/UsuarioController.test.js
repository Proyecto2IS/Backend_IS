// ================================
// MOCKS ANTES DE CUALQUIER REQUIRE
// ================================
jest.mock('../models/UsuarioModel', () => ({
  Usuario: {
    findAll: jest.fn()
  }
}));

jest.mock('../models/DocenteMateriaModel', () => ({
  DocenteMateria: {}
}));

// ================================
// IMPORTS
// ================================
const { obtenerDocentesPorMateria } = require('../controllers/UsuarioController');
const { Usuario } = require('../models/UsuarioModel');

// ================================
// MOCK RESPONSE
// ================================
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

// ================================
// TESTS
// ================================
describe('UsuarioController - obtenerDocentesPorMateria', () => {

  beforeEach(() => {
    // 🔇 Silenciar console.error SOLO en tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    console.error.mockRestore();
  });

  it('retorna docentes asociados a una materia', async () => {
    const req = {
      params: { id: 1 }
    };
    const res = mockResponse();

    const docentesFake = [
      { id: 1, nombre: 'Docente 1' },
      { id: 2, nombre: 'Docente 2' }
    ];

    Usuario.findAll.mockResolvedValue(docentesFake);

    await obtenerDocentesPorMateria(req, res);

    expect(Usuario.findAll).toHaveBeenCalledWith({
      where: { rol: 'docente' },
      include: [
        {
          model: expect.anything(),
          where: { materia_id: 1 }
        }
      ]
    });

    expect(res.json).toHaveBeenCalledWith(docentesFake);
  });

  it('retorna 500 si ocurre un error', async () => {
    const req = {
      params: { id: 1 }
    };
    const res = mockResponse();

    Usuario.findAll.mockRejectedValue(new Error('Fallo Sequelize'));

    await obtenerDocentesPorMateria(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error obteniendo docentes'
    });
  });

});