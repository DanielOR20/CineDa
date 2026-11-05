'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CategoriaProducto extends Model {
    static associate(models) {
      CategoriaProducto.hasMany(models.Producto, {
        foreignKey: 'id_categoria',
        as: 'productos',
        onDelete: 'RESTRICT'
      });
    }
  }

  CategoriaProducto.init({
    id_categoria: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'CategoriaProducto',
    tableName: 'categorias_productos',
    timestamps: true
  });

  return CategoriaProducto;
};

