'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cupon extends Model {
    static associate(models) {
      Cupon.hasMany(models.Factura, {
        foreignKey: 'id_cupon',
        as: 'facturas',
        onDelete: 'SET NULL'
      });
    }
  }

  Cupon.init({
    id_cupon: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    codigo: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false
    },
    porcentaje_descuento: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    fecha_vencimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Cupon',
    tableName: 'cupones',
    timestamps: true
  });

  return Cupon;
};

