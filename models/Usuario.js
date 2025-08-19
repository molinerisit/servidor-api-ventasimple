const { DataTypes } = require('sequelize');

// NO USAR 'bcrypt'

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
          type: DataTypes.STRING, // 'administrador' o 'cajero'
          allowNull: false
      },
      permisos: {
          type: DataTypes.JSON, // Guardará un array de strings, ej: ["caja", "productos"]
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
          allowNull: true,
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
      afip_cuit: { 
        type: DataTypes.STRING 
      },
      afip_pto_vta: { 
        type: DataTypes.INTEGER 
      },
      afip_cert_path: { 
        type: DataTypes.STRING 
      },
      afip_key_path: { 
        type: DataTypes.STRING 
      },
        // --- ✅ NUEVO CAMPO AÑADIDO ---
      config_arqueo_caja: {
        type: DataTypes.JSON,
        allowNull: true
      }
  }, {
      tableName: 'Usuario',
      timestamps: true,
      paranoid: true
      // El bloque 'hooks' ha sido completamente eliminado.
  });

  // El método 'Usuario.prototype.validPassword' ha sido completamente eliminado.

  return Usuario;
};
