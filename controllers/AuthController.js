const { Usuario } = require('../models/UsuarioModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { enviarCorreo } = require('../services/emailService');


// =============================
// 🔐 LOGIN
// =============================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    const emailNormalizado = email.toLowerCase().trim();

    // 🔥 Solo permitir Gmail
    if (!emailNormalizado.endsWith('@gmail.com')) {
      return res.status(400).json({ error: 'Correo no autorizado' });
    }

    const usuario = await Usuario.findOne({ where: { email: emailNormalizado } });

    if (!usuario) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const valido = await bcrypt.compare(password, usuario.password);

    if (!valido) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.TOKEN_KEY,
      { expiresIn: '8h' }
    );

    res.json({
      mensaje: 'Login correcto',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error("ERROR LOGIN ❌", error);
    res.status(500).json({ error: 'Error en login' });
  }
};


// =============================
// 🆕 REGISTER
// =============================
exports.register = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const emailNormalizado = email.toLowerCase().trim();

    // 🔥 Solo permitir Gmail
    if (!emailNormalizado.endsWith('@gmail.com')) {
      return res.status(400).json({ error: 'Solo se permiten correos Gmail' });
    }

    // 🎭 Validar rol permitido
    const rolesValidos = ['estudiante', 'docente'];
    if (!rolesValidos.includes(rol)) {
      return res.status(400).json({ error: 'Rol inválido' });
    }

    const existe = await Usuario.findOne({ where: { email: emailNormalizado } });
    if (existe) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    const hash = await bcrypt.hash(password, 10);

    const nuevoUsuario = await Usuario.create({
      nombre: nombre.trim(),
      email: emailNormalizado,
      password: hash,
      rol
    });

    // 📧 Correo de bienvenida (no rompe el registro si falla)
    try {
      await enviarCorreo(
        emailNormalizado,
        "Bienvenido al Sistema de Tutorías 🎓",
        `
        <h2>Hola ${nombre} 👋</h2>
        <p>Tu cuenta fue creada correctamente.</p>
        <p>Ya puedes iniciar sesión y solicitar tutorías académicas.</p>
        <br>
        <p>Sistema de Tutorías</p>
        `
      );
    } catch (correoError) {
      console.log("⚠️ Usuario creado pero falló el envío de correo");
    }

    res.json({
      mensaje: 'Usuario creado correctamente',
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      }
    });

  } catch (error) {
    console.error("ERROR REGISTER ❌", error);
    res.status(500).json({ error: 'Error registrando usuario' });
  }
};
