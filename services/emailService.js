const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const enviarCorreo = async (destino, asunto, mensaje) => {
  try {
    await transporter.sendMail({
      from: `"Sistema Tutorías" <${process.env.EMAIL_USER}>`,
      to: destino,
      subject: asunto,
      html: mensaje
    });
    console.log("📧 Correo enviado a", destino);
  } catch (error) {
    console.error("❌ Error enviando correo:", error);
  }
};

module.exports = { enviarCorreo };
