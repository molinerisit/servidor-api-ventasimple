// src/database/associations.js (CORREGIDO PARA USAR UUIDs EN LAS RELACIONES)
const { DataTypes } = require('sequelize'); // Importamos DataTypes

function applyAssociations(models) {
  const {
    Producto, ProductoDepartamento, ProductoFamilia, Proveedor, Venta,
    DetalleVenta, Usuario, Cliente, Factura, Empleado, GastoFijo, Insumo,
    InsumoDepartamento, InsumoFamilia, Compra, DetalleCompra, MovimientoCuentaCorriente
  } = models;

  // --- 1. Clasificación de PRODUCTOS ---
  ProductoDepartamento.hasMany(ProductoFamilia, { foreignKey: { name: 'DepartamentoId', type: DataTypes.UUID }, as: 'familias', onDelete: "CASCADE" });
  ProductoFamilia.belongsTo(ProductoDepartamento, { foreignKey: { name: 'DepartamentoId', type: DataTypes.UUID }, as: 'departamento' });

  ProductoFamilia.hasMany(Producto, { foreignKey: { name: 'FamiliaId', type: DataTypes.UUID }, as: 'productos', onDelete: "SET NULL" });
  Producto.belongsTo(ProductoFamilia, { foreignKey: { name: 'FamiliaId', type: DataTypes.UUID }, as: 'familia' });

  ProductoDepartamento.hasMany(Producto, { foreignKey: { name: 'DepartamentoId', type: DataTypes.UUID }, as: 'productos', onDelete: "SET NULL" });
  Producto.belongsTo(ProductoDepartamento, { foreignKey: { name: 'DepartamentoId', type: DataTypes.UUID }, as: 'departamento' });

  // --- 2. Clasificación de INSUMOS ---
  InsumoDepartamento.hasMany(InsumoFamilia, { foreignKey: { name: 'InsumoDepartamentoId', type: DataTypes.UUID }, as: 'familias', onDelete: "CASCADE" });
  InsumoFamilia.belongsTo(InsumoDepartamento, { foreignKey: { name: 'InsumoDepartamentoId', type: DataTypes.UUID }, as: 'departamento' });

  InsumoFamilia.hasMany(Insumo, { foreignKey: { name: 'InsumoFamiliaId', type: DataTypes.UUID }, as: 'insumos', onDelete: "SET NULL" });
  Insumo.belongsTo(InsumoFamilia, { foreignKey: { name: 'InsumoFamiliaId', type: DataTypes.UUID }, as: 'familia' });

  InsumoDepartamento.hasMany(Insumo, { foreignKey: { name: 'InsumoDepartamentoId', type: DataTypes.UUID }, as: 'insumos', onDelete: "SET NULL" });
  Insumo.belongsTo(InsumoDepartamento, { foreignKey: { name: 'InsumoDepartamentoId', type: DataTypes.UUID }, as: 'departamento' });

  // --- 3. Proveedores y Productos (Relación Muchos a Muchos) ---
  Proveedor.belongsToMany(Producto, { through: 'producto_proveedor', as: 'productos' });
  Producto.belongsToMany(Proveedor, { through: 'producto_proveedor', as: 'proveedores' });
  Proveedor.belongsToMany(Insumo, { through: 'insumo_proveedor', as: 'insumos' });
  Insumo.belongsToMany(Proveedor, { through: 'insumo_proveedor', as: 'proveedores' });

  // --- 4. Ventas y Detalles ---
  Venta.hasMany(DetalleVenta, { foreignKey: { name: 'VentaId', type: DataTypes.UUID }, as: "detalles", onDelete: "CASCADE" });
  DetalleVenta.belongsTo(Venta, { foreignKey: { name: 'VentaId', type: DataTypes.UUID } });

  Producto.hasMany(DetalleVenta, { foreignKey: { name: 'ProductoId', type: DataTypes.UUID }, as: 'detallesVenta' });
  DetalleVenta.belongsTo(Producto, { foreignKey: { name: 'ProductoId', type: DataTypes.UUID }, as: 'producto' });

  // --- 5. Relaciones de la Venta con Usuario y Cliente ---
  Usuario.hasMany(Venta, { foreignKey: { name: 'UsuarioId', type: DataTypes.UUID }, as: 'ventas', onDelete: "SET NULL" });
  Venta.belongsTo(Usuario, { foreignKey: { name: 'UsuarioId', type: DataTypes.UUID }, as: 'usuario' });

  Cliente.hasMany(Venta, { foreignKey: { name: 'ClienteId', type: DataTypes.UUID }, as: 'ventas', onDelete: "SET NULL" });
  Venta.belongsTo(Cliente, { foreignKey: { name: 'ClienteId', type: DataTypes.UUID }, as: 'cliente' });
  
  // --- 6. Relación Venta <-> Factura ---
  Venta.hasOne(Factura, { foreignKey: { name: 'VentaId', type: DataTypes.UUID }, as: 'factura', onDelete: "CASCADE" });
  Factura.belongsTo(Venta, { foreignKey: { name: 'VentaId', type: DataTypes.UUID }, as: 'venta' });
  
  // --- 7. Relaciones de Compras ---
  Usuario.hasMany(Compra, { foreignKey: { name: 'UsuarioId', type: DataTypes.UUID }, as: 'compras', onDelete: "SET NULL" });
  Compra.belongsTo(Usuario, { foreignKey: { name: 'UsuarioId', type: DataTypes.UUID }, as: 'usuario' });

  Proveedor.hasMany(Compra, { foreignKey: { name: 'ProveedorId', type: DataTypes.UUID }, as: 'compras', onDelete: "SET NULL" });
  Compra.belongsTo(Proveedor, { foreignKey: { name: 'ProveedorId', type: DataTypes.UUID }, as: 'proveedor' });

  Compra.hasMany(DetalleCompra, { foreignKey: { name: 'CompraId', type: DataTypes.UUID }, as: "detalles", onDelete: "CASCADE" });
  DetalleCompra.belongsTo(Compra, { foreignKey: { name: 'CompraId', type: DataTypes.UUID } });

  Producto.hasMany(DetalleCompra, { foreignKey: { name: 'ProductoId', type: DataTypes.UUID }, as: 'detallesCompra' });
  DetalleCompra.belongsTo(Producto, { foreignKey: { name: 'ProductoId', type: DataTypes.UUID }, as: 'producto' });
  
  Insumo.hasMany(DetalleCompra, { foreignKey: { name: 'InsumoId', type: DataTypes.UUID }, as: 'detallesCompra' });
  DetalleCompra.belongsTo(Insumo, { foreignKey: { name: 'InsumoId', type: DataTypes.UUID }, as: 'insumo' });

  // --- 8. Cuentas Corrientes ---
  Cliente.hasMany(MovimientoCuentaCorriente, { foreignKey: { name: 'ClienteId', type: DataTypes.UUID }, as: 'movimientos', onDelete: 'CASCADE' });
  MovimientoCuentaCorriente.belongsTo(Cliente, { foreignKey: { name: 'ClienteId', type: DataTypes.UUID }, as: 'cliente' });

  Venta.hasOne(MovimientoCuentaCorriente, { foreignKey: { name: 'VentaId', type: DataTypes.UUID }, as: 'movimiento', onDelete: 'SET NULL' });
  MovimientoCuentaCorriente.belongsTo(Venta, { foreignKey: { name: 'VentaId', type: DataTypes.UUID }, as: 'venta' });
}

module.exports = { applyAssociations };