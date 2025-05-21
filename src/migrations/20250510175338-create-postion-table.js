//Enable strict JavaScript mode for best practices
'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  //Executes the operations to create the tables
  async up(queryInterface, Sequelize) {
    //Creation of the positions table
    await queryInterface.createTable('Positions', {
      positionid: {
        allowNull: false, //Does not allow null values
        autoIncrement: true, //Autoincrementable
        primaryKey: true, //Primary key
        type: Sequelize.INTEGER //Integer data type
      },
      PositionName: {
        type: Sequelize.STRING(50), //Text string with at least 50 characters
        allowNull: false //Required field
      },
      Status: {
        type: Sequelize.BOOLEAN, //Boolean type
        allowNull: false, //Required field
        defaultValue: true //Default value true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE, //Type date/time
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') //Default current date
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    //Creation of the users table
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      FirstName: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      Lastname: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      Email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true //Email must be unique in the database
      },
      Age: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Phone: {
        type: Sequelize.STRING(10), //Telephone number (10 characters)
        allowNull: true //Optional field
      },
      PositionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Positions', //Relationship to the table positions
          key: 'positionid' //Referenced field
        },
        onUpdate: 'CASCADE', //If the id is updated in positions, it propagates
        onDelete: 'RESTRICT' //Avoid deleting a charge if it has associated users
      },
      Password: {
        type: Sequelize.STRING(255),  // Use STRING(255) for the encrypted password
        allowNull: false,  // The password cannot be null
        validate: {
          len: [8, 255]  //Password length validation (minimum 8 characters) 
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    //Table deletion in reverse order (first user by dependencies)
    await queryInterface.dropTable('Users');
    await queryInterface.dropTable('Positions');
  }
};
