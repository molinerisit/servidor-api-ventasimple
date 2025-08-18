// src/database/models/ProductoDepartamento.js (CORREGIDO PARA SINCRONIZACIÓN)
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ProductoDepartamento = sequelize.define('ProductoDepartamento', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        tableName: 'producto_departamentos',
        timestamps: true, // Activado para sincronización
        paranoid: true   // Activado para sincronización
    });

    return ProductoDepartamento;
};