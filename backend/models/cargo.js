'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cargo extends Model {
    static associate(models) {
      Cargo.hasMany(models.Empleado, {
        foreignKey: 'id_cargo',
        as: 'empleados',
        onDelete: 'RESTRICT'
      });
    }
  }

  Cargo.init({
    id_cargo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    titulo_cargo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    salario_base: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Cargo',
    tableName: 'cargos',
    timestamps: true
  });

  return Cargo;
};

