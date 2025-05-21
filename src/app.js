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
const port = process.env.PORT || 8080; //Default to 8080 if PORT not specified

app.use(express.json()); // For parsing application/json
app.use(cors()); // For parsing form data

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000', // Whitelisted frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
}));

// Route Configuration
app.use('/api/auth', authRoutes); // Authentication routes (login, register, etc.)
app.use('/api/positions', positionRoutes); // Position management routes
app.use('/api/users', userRoutes); // User management routes


app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Export app and sequelize for testing and server startup
module.exports = { app, sequelize };