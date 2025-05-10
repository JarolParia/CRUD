'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Position extends Model {
    static associate(models) {

      const { User } = models;

      Position.hasMany(User,{
        foreignKey: 'PositionId',
        as: 'users'
      });
    }
  }
  Position.init({
    positionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    positionName: {
      type: DataTypes.STRING,
      allowNull: false, 
      validate: {
        len: [1, 50]
      }
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Position',
    tableName: 'Positions',
    timestamps: false,
  });
  return Position;
};