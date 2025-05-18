const express = require('express');
const { Sequelize } = require('sequelize');
const dbconfig = require('./config/config');
const positionRoutes = require('./routes/positionRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes'); // Nueva importación
const cors = require('cors');

// Crea una nueva instancia de Sequelize utilizando la configuración
const sequelize = new Sequelize(
  dbconfig.development.database, 
  dbconfig.development.username, 
  dbconfig.development.password, 
  {
    host: dbconfig.development.host,
    dialect: dbconfig.development.dialect
  }
);

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use(cors({
  origin: 'http://localhost:3000', // Solo permite requests desde React
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
}));

// Rutas
app.use('/api/auth', authRoutes); // Rutas de autenticación (públicas)
app.use('/api/positions', positionRoutes); // Rutas protegidas
app.use('/api/users', userRoutes); // Rutas protegidas

// Ruta de prueba pública
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = { app, sequelize };