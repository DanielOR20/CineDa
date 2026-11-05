'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('funciones', {
      id_funcion: {
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
      id_pelicula: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'peliculas',
          key: 'id_pelicula'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      id_cartelera: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'carteleras',
          key: 'id_cartelera'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      fecha: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      hora_inicio: {
        type: Sequelize.TIME,
        allowNull: false
      },
      precio: {
        type: Sequelize.DECIMAL(10, 2),
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
    await queryInterface.dropTable('funciones');
  }
};

