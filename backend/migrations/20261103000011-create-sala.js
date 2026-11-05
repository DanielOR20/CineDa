'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('salas', {
      id_sala: {
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
      id_tiposala: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tipo_salas',
          key: 'id_tiposala'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      numero_sala: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      capacidad: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('salas');
  }
};

