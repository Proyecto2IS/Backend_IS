// 🔴 MOCKS PRIMERO
jest.mock('../models/UsuarioModel', () => ({
  Usuario: {
    findOne: jest.fn()
  }
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));

jest.mock('../services/emailService', () => ({
  enviarCorreo: jest.fn()
}));

// 🔽 IMPORTS
const { login } = require('../controllers/AuthController');
const { Usuario } = require('../models/UsuarioModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 🧩 mock de res
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('AuthController - login', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'secret_test';
  });

  // ✅ CASO 1: LOGIN EXITOSO
  test('login exitoso', async () => {
    const req = {
      body: { email: 'test@gmail.com', password: '123456' }
    };
    const res = mockResponse();

    Usuario.findOne.mockResolvedValue({
      id: 1,
      email: 'test@gmail.com',
      password: 'hash'
    });

    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('token_falso');

    await login(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ token: 'token_falso' })
    );
  });

  // ❌ CASO 2: EMAIL O PASSWORD FALTANTE
  test('email o password faltante', async () => {
    const req = { body: { email: '' } };
    const res = mockResponse();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // ❌ CASO 3: USUARIO NO ENCONTRADO
  test('usuario no encontrado', async () => {
    const req = {
      body: { email: 'test@gmail.com', password: '123456' }
    };
    const res = mockResponse();

    Usuario.findOne.mockResolvedValue(null);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  // ❌ CASO 4: PASSWORD INCORRECTO
  test('password incorrecto', async () => {
    const req = {
      body: { email: 'test@gmail.com', password: '123456' }
    };
    const res = mockResponse();

    Usuario.findOne.mockResolvedValue({
      password: 'hash'
    });

    bcrypt.compare.mockResolvedValue(false);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

});