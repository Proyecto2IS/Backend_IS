require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./db/conexion');

const app = express();
const PORT = process.env.PORT || 3000;

// ================= MIDDLEWARES =================
app.use(express.json());
app.use(cors());

// ================= CARGAR TODOS LOS MODELOS =================
// 🔥 ESTO ES LO QUE CREA LAS TABLAS

require('./models/UsuarioModel');
require('./models/MateriaModel');
require('./models/TutoriaModel');
require('./models/DocenteMateriaModel');
require('./models/DisponibilidadDocenteModel');

// ================= ASOCIACIONES =================
require('./models/asociaciones');

// ================= RUTAS =================
app.use('/usuarios', require('./routes/usuario.routes'));
app.use('/disponibilidad', require('./routes/disponibilidad.routes'));
app.use('/tutorias', require('./routes/tutoria.routes'));
app.use('/reportes', require('./routes/reporte.routes'));
app.use('/auth', require('./routes/auth.routes'));

// ================= RUTA BASE =================
app.get('/', (req, res) => {
  res.send('Backend IS funcionando 🚀');
});

// ================= INICIAR SERVIDOR =================
const main = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');

    // 🔥 CREA TABLAS SI NO EXISTEN
    await sequelize.sync({ alter: false });

    app.listen(PORT, () => {
      console.log(`🚀 Servidor Express ejecutando en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
  }
};

main();
