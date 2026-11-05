'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TransaccionPago extends Model {
    static associate(models) {
      TransaccionPago.belongsTo(models.Factura, {
        foreignKey: 'id_factura',
        as: 'factura'
      });

      TransaccionPago.belongsTo(models.MetodoPago, {
        foreignKey: 'id_metodo_pago',
        as: 'metodoPago'
      });
    }
  }

  TransaccionPago.init({
    id_transaccion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_factura: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_metodo_pago: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'completado', 'fallido'),
      defaultValue: 'completado',
      allowNull: false
    },
    referencia_bancaria: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'TransaccionPago',
    tableName: 'transacciones_pago',
    timestamps: true
  });

  return TransaccionPago;
};

