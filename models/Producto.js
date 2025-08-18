// src/database/models/Producto.js (CORREGIDO PARA SINCRONIZACIÓN)
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Producto = sequelize.define('Producto', {
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
    stock: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    unidad: {
      type: DataTypes.STRING,
      defaultValue: 'unidad'
    },
    precioCompra: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    precioVenta: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    codigo_barras: {
      type: DataTypes.STRING,
      unique: true
    },
    imagen_url: {
      type: DataTypes.STRING
    },
    precio_oferta: {
      type: DataTypes.FLOAT
    },
    fecha_fin_oferta: {
      type: DataTypes.DATEONLY
    },
    fecha_vencimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    DepartamentoId: {
      type: DataTypes.UUID, // Clave foránea debe ser UUID
      allowNull: true
    },
    FamiliaId: {
      type: DataTypes.UUID, // Clave foránea debe ser UUID
      allowNull: true
    }
  }, {
    tableName: 'productos',
    timestamps: true,
    paranoid: true // Activa la eliminación lógica
  });

  return Producto;
};