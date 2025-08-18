// src/database/models/GastoFijo.js (CORREGIDO PARA SINCRONIZACIÓN)
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const GastoFijo = sequelize.define('GastoFijo', {
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
    monto: { 
      type: DataTypes.FLOAT, 
      allowNull: false, 
      defaultValue: 0 
    }
  }, { 
    tableName: 'gastos_fijos', 
    timestamps: true,
    paranoid: true // Activa la eliminación lógica
  });

  return GastoFijo;
};