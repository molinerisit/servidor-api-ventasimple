// src/database/models/Usuario.js (CORREGIDO PARA SINCRONIZACIÓN)
const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const Usuario = sequelize.define('Usuario', {
      id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
      },
      nombre: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
      },
      password: {
          type: DataTypes.STRING,
          allowNull: false
      },
      rol: {
          type: DataTypes.STRING,
          allowNull: false
      },
      permisos: {
          type: DataTypes.JSON,
          allowNull: true,
      },
      config_puerto_scanner: {
          type: DataTypes.STRING,
          allowNull: true,
      },
      config_puerto_impresora: {
          type: DataTypes.STRING,
          allowNull: true
      },
      mp_access_token: {
          type: DataTypes.STRING,
          allowNull: true
      },
      mp_pos_id: {
          type: DataTypes.STRING,
          allowNull: true
      },
      mp_user_id: {
          type: DataTypes.STRING,
          allowNull: true
      },
      config_balanza: {
          type: DataTypes.JSON,
          allowNull: true,
      },
      config_recargo_credito: {
          type: DataTypes.FLOAT,
          allowNull: true,
          defaultValue: 0,
      },
      nombre_negocio: {
          type: DataTypes.STRING,
          allowNull: true
      },
      slogan_negocio: {
          type: DataTypes.STRING,
          allowNull: true
      },
      footer_ticket: {
          type: DataTypes.STRING,
          allowNull: true
      },
      logo_url: {
          type: DataTypes.STRING,
          allowNull: true
      },
      config_descuento_efectivo: {
          type: DataTypes.FLOAT,
          allowNull: true,
          defaultValue: 0,
      },
      facturacion_activa: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      afip_cuit: { type: DataTypes.STRING },
      afip_pto_vta: { type: DataTypes.INTEGER },
      afip_cert_path: { type: DataTypes.STRING },
      afip_key_path: { type: DataTypes.STRING }
  }, {
      tableName: 'Usuario',
      timestamps: true,
      paranoid: true, // Activa la eliminación lógica
      hooks: {
        beforeCreate: async (usuario) => {
          if (usuario.password) {
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(usuario.password, salt);
          }
        },
        beforeUpdate: async (usuario) => {
          if (usuario.changed('password')) {
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(usuario.password, salt);
          }
        }
      }
  });

  Usuario.prototype.validPassword = async function(password) {
      return await bcrypt.compare(password, this.password);
  }

  return Usuario;
};