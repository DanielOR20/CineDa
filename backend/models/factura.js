'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Factura extends Model {
    static associate(models) {
      Factura.belongsTo(models.Usuario, {
        foreignKey: 'id_usuario',
        as: 'usuario'
      });

      Factura.belongsTo(models.Cupon, {
        foreignKey: 'id_cupon',
        as: 'cupon'
      });

      Factura.hasMany(models.TransaccionPago, {
        foreignKey: 'id_factura',
        as: 'transaccionesPago',
        onDelete: 'CASCADE'
      });

      Factura.hasMany(models.DetalleVentaDulceria, {
        foreignKey: 'id_factura',
        as: 'detallesVentasDulceria',
        onDelete: 'CASCADE'
      });

      Factura.hasMany(models.Entrada, {
        foreignKey: 'id_factura',
        as: 'entradas',
        onDelete: 'CASCADE'
      });
    }
  }

  Factura.init({
    id_factura: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_cupon: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    numero_factura: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    descuento: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    fecha_emision: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Factura',
    tableName: 'facturas',
    timestamps: true
  });

  return Factura;
};

