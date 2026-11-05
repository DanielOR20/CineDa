'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Asiento extends Model {
    static associate(models) {
      Asiento.belongsTo(models.Sala, {
        foreignKey: 'id_sala',
        as: 'sala'
      });

      Asiento.hasMany(models.Entrada, {
        foreignKey: 'id_asiento',
        as: 'entradas',
        onDelete: 'RESTRICT'
      });
    }
  }

  Asiento.init({
    id_asiento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_sala: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fila: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo: {
      type: DataTypes.STRING(20),
      defaultValue: 'estándar',
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Asiento',
    tableName: 'asientos',
    timestamps: true
  });

  return Asiento;
};

