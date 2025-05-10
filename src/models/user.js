'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      User.belongsTo(Position, {
        foreignKey: 'PositionId',
        as: 'position'
      });
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    FirstName: { 
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Lastname: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    Age: {      
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 0,
        max: 80
      }
    },
    Phone: {      
      type: DataTypes.STRING(10),
      allowNull: true,
      validate: {
        is: /^[0-9]+$/i
      }
    },
    PositionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Position",
        key: "positionid"
      }
    },
    Password: {
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
