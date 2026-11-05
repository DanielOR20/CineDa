'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Combo extends Model {
    static associate(models) {
      Combo.hasMany(models.ComboDetalle, {
        foreignKey: 'id_combo',
        as: 'detallesCombo',
        onDelete: 'CASCADE'
      });

      Combo.hasMany(models.DetalleVentaDulceria, {
        foreignKey: 'id_combo',
        as: 'detallesVentasDulceria',
        onDelete: 'SET NULL'
      });
    }
  }

  Combo.init({
    id_combo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Combo',
    tableName: 'combos',
    timestamps: true
  });

  return Combo;
};

