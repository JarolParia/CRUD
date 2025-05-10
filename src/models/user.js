'use strict';
const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {

      const { Position } = models;

      User.belongsTo(Position, {
        foreignKey: 'positionId',
        as: 'position'
      });
    }
  }
  User.init({
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: { 
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    age: {      
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 0,
        max: 80
      }
    },
    phone: {      
      type: DataTypes.STRING(10),
      allowNull: true,
      validate: {
        is: /^\d{10}$/
      }
    },
    positionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Position",
        key: "positionId"
      }
    },
    password: {
      type: DataTypes.STRING(255),  // Usamos 255 para almacenar contraseñas cifradas.
      allowNull: false,
      validate: {
        len: [8, 255]  // Validación para asegurarse que la longitud sea adecuada (al menos 8 caracteres).
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
  });
  return User;
};
