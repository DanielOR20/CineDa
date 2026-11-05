'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Director extends Model {
    static associate(models) {
      Director.hasMany(models.Pelicula, {
        foreignKey: 'id_director',
        as: 'peliculas',
        onDelete: 'SET NULL'
      });
    }
  }

  Director.init({
    id_director: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nacionalidad: {
      type: DataTypes.STRING,
      allowNull: true
    },
    biografia: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Director',
    tableName: 'directores',
    timestamps: true
  });

  return Director;
};

