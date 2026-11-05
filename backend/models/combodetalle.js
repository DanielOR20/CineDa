'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ComboDetalle extends Model {
    static associate(models) {
      ComboDetalle.belongsTo(models.Combo, {
        foreignKey: 'id_combo',
        as: 'combo'
      });

      ComboDetalle.belongsTo(models.Producto, {
        foreignKey: 'id_producto',
        as: 'producto'
      });
    }
  }

  ComboDetalle.init({
    id_combodetalle: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_combo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ComboDetalle',
    tableName: 'combo_detalles',
    timestamps: true
  });

  return ComboDetalle;
};

