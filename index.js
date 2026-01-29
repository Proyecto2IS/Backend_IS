require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./db/conexion');

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares básicos
app.use(express.json());
app.use(cors());

// ruta de prueba
app.get('/', (req, res) => {
  res.send('Backend IS funcionando 🚀');
});

const main = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida correctamente.');
        await sequelize.sync({ alter: false })
        app.listen(PORT, () => {
        console.log(`🚀 Servidor Express ejecutando en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error conectando a la base de datos:', error);
    }
}
main();
