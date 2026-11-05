'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Producto extends Model {
    static associate(models) {
      Producto.belongsTo(models.CategoriaProducto, {
        foreignKey: 'id_categoria',
        as: 'categoria'
      });

      Producto.hasMany(models.ComboDetalle, {
        foreignKey: 'id_producto',
        as: 'comboDetalles',
        onDelete: 'CASCADE'
      });

      Producto.hasMany(models.DetalleVentaDulceria, {
        foreignKey: 'id_producto',
        as: 'detallesVentasDulceria',
        onDelete: 'SET NULL'
      });
    }
  }

  Producto.init({
    id_producto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Producto',
    tableName: 'productos',
    timestamps: true
  });

  return Producto;
};

