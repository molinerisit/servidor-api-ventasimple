// src/database/models/Empleado.js (CORREGIDO PARA SINCRONIZACIÓN)
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Empleado = sequelize.define('Empleado', {
    id: { 
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true 
    },
    nombre: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    funcion: { 
      type: DataTypes.STRING, 
      allowNull: true 
    },
    sueldo: { 
      type: DataTypes.FLOAT, 
      allowNull: false, 
      defaultValue: 0 
    }
  }, { 
    tableName: 'empleados', 
    timestamps: true,
    paranoid: true // Activa la eliminación lógica
  });

  return Empleado;
};