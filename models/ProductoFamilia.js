// src/database/models/ProductoFamilia.js (CORREGIDO PARA SINCRONIZACIÓN)
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ProductoFamilia = sequelize.define('ProductoFamilia', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: 'compositeIndex'
        }
        // Sequelize añadirá 'DepartamentoId' como UUID a través de la asociación
    }, {
        tableName: 'producto_familias',
        timestamps: true, // Activado para sincronización
        paranoid: true   // Activado para sincronización
    });

    return ProductoFamilia;
};