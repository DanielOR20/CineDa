'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Funcion extends Model {
    static associate(models) {
      Funcion.belongsTo(models.Sala, {
        foreignKey: 'id_sala',
        as: 'sala'
      });

      Funcion.belongsTo(models.Pelicula, {
        foreignKey: 'id_pelicula',
        as: 'pelicula'
      });

      Funcion.belongsTo(models.Cartelera, {
        foreignKey: 'id_cartelera',
        as: 'cartelera'
      });

      Funcion.hasMany(models.Entrada, {
        foreignKey: 'id_funcion',
        as: 'entradas',
        onDelete: 'RESTRICT'
      });
    }
  }

  Funcion.init({
    id_funcion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_sala: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_pelicula: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_cartelera: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    hora_inicio: {
      type: DataTypes.TIME,
      allowNull: false
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Funcion',
    tableName: 'funciones',
    timestamps: true
  });

  return Funcion;
};

