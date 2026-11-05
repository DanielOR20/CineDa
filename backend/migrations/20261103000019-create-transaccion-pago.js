'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transacciones_pago', {
      id_transaccion: {
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
      id_metodo_pago: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'metodos_pago',
          key: 'id_metodo_pago'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      monto: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      estado: {
        type: Sequelize.ENUM('pendiente', 'completado', 'fallido'),
        defaultValue: 'completado',
        allowNull: false
      },
      referencia_bancaria: {
        type: Sequelize.STRING,
        allowNull: true
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
    await queryInterface.dropTable('transacciones_pago');
  }
};

