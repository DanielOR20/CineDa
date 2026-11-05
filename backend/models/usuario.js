'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.hasMany(models.Factura, {
        foreignKey: 'id_usuario',
        as: 'facturas',
        onDelete: 'RESTRICT'
      });

      Usuario.hasMany(models.Calificacion, {
        foreignKey: 'id_usuario',
        as: 'calificaciones',
        onDelete: 'CASCADE'
      });
    }

    // Método de instancia para validar password con bcrypt
    async validarPassword(passPlano) {
      if (!this.password || !passPlano) return false;
      return await bcrypt.compare(passPlano, this.password);
    }

    // Excluir password por defecto al devolver JSON
    toJSON() {
      const values = { ...this.get() };
      delete values.password;
      return values;
    }
  }

  Usuario.init({
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'El formato de correo electrónico no es válido'
        }
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'Admin1234*',
      validate: {
        len: {
          args: [8, 255],
          msg: 'La contraseña debe contener al menos 8 caracteres'
        }
      }
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rol: {
      type: DataTypes.ENUM('cliente', 'administrador', 'empleado'),
      defaultValue: 'cliente',
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: true,
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.password && !usuario.password.startsWith('$2')) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed('password') && usuario.password && !usuario.password.startsWith('$2')) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      },
      beforeBulkCreate: async (usuarios) => {
        for (const usuario of usuarios) {
          if (usuario.password && !usuario.password.startsWith('$2')) {
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(usuario.password, salt);
          }
        }
      }
    }
  });

  return Usuario;
};
