'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TipoSala extends Model {
    static associate(models) {
      TipoSala.hasMany(models.Sala, {
        foreignKey: 'id_tiposala',
        as: 'salas',
        onDelete: 'RESTRICT'
      });
    }
  }

  TipoSala.init({
    id_tiposala: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre_tipo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    precio_base: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'TipoSala',
    tableName: 'tipo_salas',
    timestamps: true
  });

  return TipoSala;
};

