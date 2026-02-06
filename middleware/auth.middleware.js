const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const header = req.headers['authorization'];

    if (!header) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    const token = header.split(' ')[1]; // Quita "Bearer "

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    req.usuario = decoded;
    next();

  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
