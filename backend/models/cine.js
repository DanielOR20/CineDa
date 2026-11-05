'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cine extends Model {
    static associate(models) {
      Cine.hasMany(models.Sala, {
        foreignKey: 'id_cine',
        as: 'salas',
        onDelete: 'CASCADE'
      });

      Cine.hasMany(models.Empleado, {
        foreignKey: 'id_cine',
        as: 'empleados',
        onDelete: 'CASCADE'
      });

      Cine.hasMany(models.Cartelera, {
        foreignKey: 'id_cine',
        as: 'carteleras',
        onDelete: 'CASCADE'
      });
    }
  }

  Cine.init({
    id_cine: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ubicacion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Cine',
    tableName: 'cines',
    timestamps: true
  });

  return Cine;
};

