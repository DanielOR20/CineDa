'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Sala extends Model {
    static associate(models) {
      Sala.belongsTo(models.Cine, {
        foreignKey: 'id_cine',
        as: 'cine'
      });

      Sala.belongsTo(models.TipoSala, {
        foreignKey: 'id_tiposala',
        as: 'tipoSala'
      });

      Sala.hasMany(models.Asiento, {
        foreignKey: 'id_sala',
        as: 'asientos',
        onDelete: 'CASCADE'
      });

      Sala.hasMany(models.RegistroLimpieza, {
        foreignKey: 'id_sala',
        as: 'registrosLimpieza',
        onDelete: 'CASCADE'
      });

      Sala.hasMany(models.MantenimientoSala, {
        foreignKey: 'id_sala',
        as: 'mantenimientos',
        onDelete: 'CASCADE'
      });

      Sala.hasMany(models.Funcion, {
        foreignKey: 'id_sala',
        as: 'funciones',
        onDelete: 'CASCADE'
      });
    }
  }

  Sala.init({
    id_sala: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_cine: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_tiposala: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    numero_sala: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    capacidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Sala',
    tableName: 'salas',
    timestamps: true
  });

  return Sala;
};

