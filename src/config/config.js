const dotenv = require('dotenv')
const path = require('path')

dotenv.config();

module.exports = {
  "development": {
    "username": process.env.DB_USER || 'root',
    "password": process.env.DB_PASS || null,
    "database": process.env.DB_NAME || 'crud_db',
    "host": process.env.DB_HOST || 'localhost',
    "port": process.env.DB_PORT || 3306,
    "dialect": process.env.DB_DIALECT || 'mysql',
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}



