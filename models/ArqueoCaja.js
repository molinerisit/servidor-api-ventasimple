const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ArqueoCaja = sequelize.define('ArqueoCaja', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    fechaApertura: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    montoInicial: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    fechaCierre: {
      type: DataTypes.DATE,
      allowNull: true // Se rellena al cerrar la caja
    },
    montoFinalEstimado: {
      type: DataTypes.FLOAT,
      allowNull: true // Se calcula al cerrar
    },
    montoFinalReal: {
      type: DataTypes.FLOAT,
      allowNull: true // Se ingresa al cerrar
    },
    diferencia: {
      type: DataTypes.FLOAT,
      allowNull: true // Se calcula al cerrar
    },
    totalVentasEfectivo: { type: DataTypes.FLOAT, allowNull: true },
    totalVentasDebito: { type: DataTypes.FLOAT, allowNull: true },
    totalVentasCredito: { type: DataTypes.FLOAT, allowNull: true },
    totalVentasQR: { type: DataTypes.FLOAT, allowNull: true },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    estado: {
      type: DataTypes.ENUM('ABIERTA', 'CERRADA'),
      defaultValue: 'ABIERTA'
    },
    UsuarioId: { // Para saber qué usuario hizo el arqueo
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    tableName: 'arqueos_caja',
    timestamps: true,
    paranoid: true
  });

  return ArqueoCaja;
};