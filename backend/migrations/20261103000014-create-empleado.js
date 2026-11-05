'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('empleados', {
      id_empleado: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_cine: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cines',
          key: 'id_cine'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_cargo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cargos',
          key: 'id_cargo'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      identificacion: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      fecha_contratacion: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('empleados');
  }
};

