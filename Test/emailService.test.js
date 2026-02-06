// 🔴 EL MOCK VA PRIMERO, ANTES DE CUALQUIER REQUIRE
jest.mock('nodemailer', () => {
  const sendMailMock = jest.fn().mockResolvedValue(true);

  return {
    createTransport: jest.fn(() => ({
      sendMail: sendMailMock
    }))
  };
});

// 🔽 DESPUÉS recién importas
const nodemailer = require('nodemailer');
const { enviarCorreo } = require('../services/emailService');

describe('Pruebas del servicio de correo', () => {

  beforeEach(() => {
    process.env.EMAIL_USER = 'test@mail.com';
    process.env.EMAIL_PASS = '123456';
  });

  test('envía un correo con los datos correctos', async () => {
    const destino = 'destino@mail.com';
    const asunto = 'Asunto de prueba';
    const mensaje = '<p>Hola mundo</p>';

    await enviarCorreo(destino, asunto, mensaje);

    // obtener el transporter falso
    const transporter = nodemailer.createTransport.mock.results[0].value;

    expect(transporter.sendMail).toHaveBeenCalledTimes(1);

    expect(transporter.sendMail).toHaveBeenCalledWith({
      from: `"Sistema Tutorías" <test@mail.com>`,
      to: destino,
      subject: asunto,
      html: mensaje
    });
  });

});