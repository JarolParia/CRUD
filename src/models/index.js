//Enable strict JavaScript mode for better error handling'use strict';

//Importing modules
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');

//Initial configuration
const basename = path.basename(__filename); //Gets the name of the current file
const env = process.env.NODE_ENV || 'development'; //Gets the name of the runtime environment (development by default)
const config = require(__dirname + '/../config/config')[env]; //Load the configuration according to the environment
const db = {}; //Object that will contain all the models

//Sequelize initialization
let sequelize;
if (config.use_env_variable) {
  //Connection using environment variable (for production)
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  //Connection using direct credentials (for development)
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

//Dynamic loading of models
fs
  .readdirSync(__dirname) //Reads all files in the current directory
  .filter(file => {
    //Filter the files to obtain only the models
    return (
      file.indexOf('.') !== 0 && //Excludes hidden files
      file !== basename && //Excludes the current file
      file.slice(-3) === '.js' && //JavaScript files only
      file.indexOf('.test.js') === -1 //Excludes test files
    );
  })
  .forEach(file => {
    //Import each model found
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

  //Confuguration of associations between models
Object.keys(db).forEach(modelName => {
  //If the model has associate function, the execution
  if (db[modelName].associate) {
    db[modelName].associate(db); //Pass all models to establish relationships
  }
});

//Adds important instances to the db object
db.sequelize = sequelize; //Database connection instruction
db.Sequelize = Sequelize; //Sequelize class for external use

//Export the db object with all models and configurations.
module.exports = db;
