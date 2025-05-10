const express = require('express');
const { Sequelize } = require('sequelize'); 
const dbconfig = require('./config/config.js')[env]; 
const positionRoutes = require('./routes/positionRoutes');



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
app.use('/api/positions', positionRoutes);
module.exports = {app, sequelize};