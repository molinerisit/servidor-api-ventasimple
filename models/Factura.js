// src/database/models/Factura.js (CORREGIDO PARA SINCRONIZACIÓN)
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Factura = sequelize.define('Factura', {
    id: { 
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true 
    },
    cae: { type: DataTypes.STRING, allowNull: false },
    caeVto: { type: DataTypes.DATEONLY, allowNull: false },
    tipoComp: { type: DataTypes.INTEGER, allowNull: false },
    ptoVta: { type: DataTypes.INTEGER, allowNull: false },
    nroComp: { type: DataTypes.INTEGER, allowNull: false },
    docTipo: { type: DataTypes.INTEGER },
    docNro: { type: DataTypes.STRING },
    impTotal: { type: DataTypes.FLOAT, allowNull: false }
  }, {
    tableName: 'facturas',
    timestamps: true,
    paranoid: true // Activa la eliminación lógica
  });

  return Factura;
};