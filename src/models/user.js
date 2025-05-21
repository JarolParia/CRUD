//Enable strinct mode for better error hadling
'use strict';
const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
    // Destructure needed models 

      const { Position } = models;

      // Define many-to-one relationship with Position
      User.belongsTo(Position, {
        foreignKey: 'positionId', // Foreign key in User model
        as: 'position' // Alias for eager loading
      });
    }
  }

  // Model initialization
  User.init({
    // Primary key definition
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Marks as primary key
      autoIncrement: true // Auto-incrementing value
    },

    //User's first name
    firstName: { 
      type: DataTypes.STRING(50), // Limited to 50 characters
      allowNull: false, // Mandatory field
    },

    // User's last name
    lastName: {
      type: DataTypes.STRING(50), // Limited to 50 characters
      allowNull: false, // Mandatory field
    },

    // User email address
    email: {
      type: DataTypes.STRING(100), // Limited to 100 characters
      allowNull: false, // Mandatory field
      unique: true, // Must be unique across all users
      validate: {
        isEmail: true // Validates email format
      }
    },

    // User age
    age: {      
      type: DataTypes.INTEGER,
      allowNull: false, // Mandatory field
      validate: {
        isInt: true, // Must be integer
        min: 0, //Minimum age
        max: 80 // Maximum age
      }
    },

    // User phone number
    phone: {      
      type: DataTypes.STRING(10), // Exactly 10 characters
      allowNull: true, // Optional field
      validate: {
        is: /^\d{10}$/ // Must be exactly 10 digits
      }
    },

    // Reference to Position model
    positionId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Mandatory field
      references: {
        model: "Position", // Target model
        key: "positionId" // Target field
      }
    },

    // User password (hashed)
    password: {
      type: DataTypes.STRING(255),  // Adequate length for hashed passwords
      allowNull: false, // Mandatory field
      validate: {
        len: [8, 255]  // Minimum length of 8 characters
      }
    }
  }, {
    // Model configuration
    sequelize, // Sequelize instance
    modelName: 'User', // Model name
    tableName: 'Users', // Actual table name in database
    timestamps: true, // Enables automatic createdAt/updatedAt fields
  });
  return User; // Return the defined model
};
