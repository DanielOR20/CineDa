'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Calificacion extends Model {
    static associate(models) {
      Calificacion.belongsTo(models.Usuario, {
        foreignKey: 'id_usuario',
        as: 'usuario'
      });

      Calificacion.belongsTo(models.Pelicula, {
        foreignKey: 'id_pelicula',
        as: 'pelicula'
      });
    }
  }

  Calificacion.init({
    id_calificacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_pelicula: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    puntuacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Calificacion',
    tableName: 'calificaciones',
    timestamps: true
  });

  return Calificacion;
};

