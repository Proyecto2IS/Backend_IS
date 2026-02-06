const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth.middleware');

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    next = jest.fn();
  });

  test('rechaza si no se envía el token', async () => {
    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token requerido' });
    expect(next).not.toHaveBeenCalled();
  });

  test('rechaza si el token es inválido', async () => {
    req.headers.authorization = 'Bearer token_falso';

    jwt.verify.mockImplementation(() => {
      throw new Error('Token inválido');
    });

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido' });
    expect(next).not.toHaveBeenCalled();
  });

  test('permite el acceso si el token es válido', async () => {
    req.headers.authorization = 'Bearer token_valido';

    const decodedUser = { id: 1, rol: 'admin' };
    jwt.verify.mockReturnValue(decodedUser);

    await authMiddleware(req, res, next);

    expect(req.usuario).toEqual(decodedUser);
    expect(next).toHaveBeenCalled();
  });
});