'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MantenimientoSala extends Model {
    static associate(models) {
      MantenimientoSala.belongsTo(models.Sala, {
        foreignKey: 'id_sala',
        as: 'sala'
      });
    }
  }

  MantenimientoSala.init({
    id_mantenimiento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_sala: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo_mantenimiento: {
      type: DataTypes.ENUM('butacas', 'proyector', 'audio', 'climatizacion'),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    costo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    fecha_mantenimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'MantenimientoSala',
    tableName: 'mantenimientos_sala',
    timestamps: true
  });

  return MantenimientoSala;
};

