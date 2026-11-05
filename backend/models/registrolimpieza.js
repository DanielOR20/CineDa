'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RegistroLimpieza extends Model {
    static associate(models) {
      RegistroLimpieza.belongsTo(models.Sala, {
        foreignKey: 'id_sala',
        as: 'sala'
      });

      RegistroLimpieza.belongsTo(models.Empleado, {
        foreignKey: 'id_empleado',
        as: 'empleado'
      });
    }
  }

  RegistroLimpieza.init({
    id_limpieza: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_sala: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_empleado: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha_hora: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'en_proceso', 'completada'),
      defaultValue: 'completada',
      allowNull: false
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'RegistroLimpieza',
    tableName: 'registros_limpieza',
    timestamps: true
  });

  return RegistroLimpieza;
};

