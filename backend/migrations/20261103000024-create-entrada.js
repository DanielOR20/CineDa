'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('entradas', {
      id_entrada: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_factura: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'facturas',
          key: 'id_factura'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_funcion: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'funciones',
          key: 'id_funcion'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      id_asiento: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'asientos',
          key: 'id_asiento'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      precio_pagado: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      estado: {
        type: Sequelize.ENUM('valida', 'usada', 'cancelada'),
        defaultValue: 'valida',
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
    await queryInterface.dropTable('entradas');
  }
};

