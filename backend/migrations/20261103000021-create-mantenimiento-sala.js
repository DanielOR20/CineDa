'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('mantenimientos_sala', {
      id_mantenimiento: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_sala: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'salas',
          key: 'id_sala'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tipo_mantenimiento: {
        type: Sequelize.ENUM('butacas', 'proyector', 'audio', 'climatizacion'),
        allowNull: false
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      costo: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      fecha_mantenimiento: {
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
    await queryInterface.dropTable('mantenimientos_sala');
  }
};

