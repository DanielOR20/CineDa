'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cartelera extends Model {
    static associate(models) {
      Cartelera.belongsTo(models.Cine, {
        foreignKey: 'id_cine',
        as: 'cine'
      });

      Cartelera.belongsTo(models.Pelicula, {
        foreignKey: 'id_pelicula',
        as: 'pelicula'
      });

      Cartelera.hasMany(models.Funcion, {
        foreignKey: 'id_cartelera',
        as: 'funciones',
        onDelete: 'CASCADE'
      });
    }
  }

  Cartelera.init({
    id_cartelera: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_cine: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_pelicula: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha_inicio: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    fecha_fin: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('activa', 'inactiva'),
      defaultValue: 'activa',
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Cartelera',
    tableName: 'carteleras',
    timestamps: true
  });

  return Cartelera;
};

