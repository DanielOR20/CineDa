'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Pelicula extends Model {
    static associate(models) {
      Pelicula.belongsTo(models.Director, {
        foreignKey: 'id_director',
        as: 'director'
      });

      Pelicula.hasMany(models.Calificacion, {
        foreignKey: 'id_pelicula',
        as: 'calificaciones',
        onDelete: 'CASCADE'
      });

      Pelicula.hasMany(models.Cartelera, {
        foreignKey: 'id_pelicula',
        as: 'carteleras',
        onDelete: 'CASCADE'
      });

      Pelicula.hasMany(models.Funcion, {
        foreignKey: 'id_pelicula',
        as: 'funciones',
        onDelete: 'RESTRICT'
      });
    }
  }

  Pelicula.init({
    id_pelicula: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_director: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    genero: {
      type: DataTypes.STRING,
      allowNull: false
    },
    duracion: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    clasificacion: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    sinopsis: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Pelicula',
    tableName: 'peliculas',
    timestamps: true
  });

  return Pelicula;
};

