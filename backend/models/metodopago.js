'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MetodoPago extends Model {
    static associate(models) {
      MetodoPago.hasMany(models.TransaccionPago, {
        foreignKey: 'id_metodo_pago',
        as: 'transaccionesPago',
        onDelete: 'RESTRICT'
      });
    }
  }

  MetodoPago.init({
    id_metodo_pago: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'MetodoPago',
    tableName: 'metodos_pago',
    timestamps: true
  });

  return MetodoPago;
};

