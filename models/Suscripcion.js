const { DataTypes, Sequelize } = require('sequelize'); // <-- CORRECCIÓN: Añadir Sequelize a la importación

module.exports = (sequelize) => {
  const Suscripcion = sequelize.define('Suscripcion', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    license_key: {
      type: DataTypes.UUID,
      // Ahora `Sequelize.literal` funcionará porque Sequelize ha sido importado.
      defaultValue: Sequelize.literal('gen_random_uuid()'), 
      allowNull: false,
      unique: true
    },
    client_name: { // Nombre del cliente para identificarlo
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: { // El interruptor para activar/desactivar el programa
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    expires_on: { // Fecha de vencimiento
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'Suscripciones',
    timestamps: true
  });
  
  return Suscripcion;
};