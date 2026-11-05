'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Entrada extends Model {
    static associate(models) {
      Entrada.belongsTo(models.Factura, {
        foreignKey: 'id_factura',
        as: 'factura'
      });

      Entrada.belongsTo(models.Funcion, {
        foreignKey: 'id_funcion',
        as: 'funcion'
      });

      Entrada.belongsTo(models.Asiento, {
        foreignKey: 'id_asiento',
        as: 'asiento'
      });
    }
  }

  Entrada.init({
    id_entrada: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_factura: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_funcion: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_asiento: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    precio_pagado: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('valida', 'usada', 'cancelada'),
      defaultValue: 'valida',
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Entrada',
    tableName: 'entradas',
    timestamps: true
  });

  return Entrada;
};

