'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DetalleVentaDulceria extends Model {
    static associate(models) {
      DetalleVentaDulceria.belongsTo(models.Factura, {
        foreignKey: 'id_factura',
        as: 'factura'
      });

      DetalleVentaDulceria.belongsTo(models.Producto, {
        foreignKey: 'id_producto',
        as: 'producto'
      });

      DetalleVentaDulceria.belongsTo(models.Combo, {
        foreignKey: 'id_combo',
        as: 'combo'
      });
    }
  }

  DetalleVentaDulceria.init({
    id_detalle_dulceria: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_factura: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_combo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'DetalleVentaDulceria',
    tableName: 'detalles_ventas_dulceria',
    timestamps: true
  });

  return DetalleVentaDulceria;
};

