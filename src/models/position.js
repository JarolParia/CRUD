//Enables strict mode for better error handling
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Position extends Model {
    static associate(models) {
      //Destructure needed models

      const { User } = models;
      //Define one-to-many relationship with User

      Position.hasMany(User,{
        foreignKey: 'positionId', //Foreign key in User model
        as: 'users' //Alias for eager loading
      });
    }
  }

  //Model initialization
  Position.init({
    // Primary key definition
    positionId: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Marks as primary key
      autoIncrement: true // Auto-incrementing value
    },
    positionName: {
      type: DataTypes.STRING,
      allowNull: false, // Mandatory field
      validate: {
        len: [1, 50] // Length validation (1-50 characters)
      }
    },

    // Status field
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false, // Mandatory field
      defaultValue: true // Default value if not provided
    }
  }, {

    // Model configuration
    sequelize,
    modelName: 'Position', // Model name
    tableName: 'Positions', // Actual table name in database
    timestamps: false, // Disables automatic createdAt/updatedAt fields
  });
  return Position; // Return the defined model
};