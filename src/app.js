const express = require('express');
const { Sequelize } = require('sequelize');  // Asegúrate de importar Sequelize correctamente
const dbconfig = require('./config/config');
const positionRoutes = require('./routes/positionRoutes'); // Asegúrate de que la ruta sea correcta

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
const port =8080;


app.use(express.json());

app.use('/positions', positionRoutes);

module.exports = { app, sequelize };
