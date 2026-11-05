'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Empleado extends Model {
    static associate(models) {
      Empleado.belongsTo(models.Cine, {
        foreignKey: 'id_cine',
        as: 'cine'
      });

      Empleado.belongsTo(models.Cargo, {
        foreignKey: 'id_cargo',
        as: 'cargo'
      });

      Empleado.hasMany(models.RegistroLimpieza, {
        foreignKey: 'id_empleado',
        as: 'registrosLimpieza',
        onDelete: 'RESTRICT'
      });
    }
  }

  Empleado.init({
    id_empleado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_cine: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_cargo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    identificacion: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    fecha_contratacion: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Empleado',
    tableName: 'empleados',
    timestamps: true
  });

  return Empleado;
};

