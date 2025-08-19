const express = require("express");
const { Sequelize, Op } = require("sequelize");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

const PORT = process.env.PORT || 3000;

// --- Conexión a la Base de Datos de Railway ---
const DATABASE_URL = "postgresql://postgres:QoAHClOZptlLQOyoagCXlFBQoFLBoNEf@tramway.proxy.rlwy.net:57333/railway";

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// --- CARGA DE TODOS LOS MODELOS Y ASOCIACIONES ---
const models = {
  Cliente: require("./models/Cliente")(sequelize),
  Compra: require("./models/Compra")(sequelize),
  DetalleCompra: require("./models/DetalleCompra")(sequelize),
  DetalleVenta: require("./models/DetalleVenta")(sequelize),
  Empleado: require("./models/Empleado")(sequelize),
  Factura: require("./models/Factura")(sequelize),
  GastoFijo: require("./models/GastoFijo")(sequelize),
  Insumo: require("./models/Insumo")(sequelize),
  InsumoDepartamento: require("./models/InsumoDepartamento")(sequelize),
  InsumoFamilia: require("./models/InsumoFamilia")(sequelize),
  MovimientoCuentaCorriente: require("./models/MovimientoCuentaCorriente")(sequelize),
  Producto: require("./models/Producto")(sequelize),
  ProductoDepartamento: require("./models/ProductoDepartamento")(sequelize),
  ProductoFamilia: require("./models/ProductoFamilia")(sequelize),
  Proveedor: require("./models/Proveedor")(sequelize),
  Usuario: require("./models/Usuario")(sequelize),
  Venta: require("./models/Venta")(sequelize),
  ArqueoCaja: require("./models/ArqueoCaja")(sequelize),

};

const { applyAssociations } = require('./associations');
applyAssociations(models);
console.log("✅ Modelos y asociaciones cargados en la API.");


// --- Rutas de la API (Endpoints) ---

app.get("/", (req, res) => {
  res.send("¡La API de sincronización en Railway está funcionando correctamente!");
});

// --- ✅ RUTA /sync/push CORREGIDA CON LÓGICA MANUAL ---
app.post("/sync/push", async (req, res) => {
  const registros = req.body;
  console.log(`[PUSH] Recibidos ${registros.length} registros.`);

  if (!Array.isArray(registros) || registros.length === 0) {
    return res.status(400).json({ message: "Se esperaba un array de registros." });
  }

  const transaction = await sequelize.transaction();
  try {
    for (const registro of registros) {
      const modelName = Object.keys(models).find(m => models[m].tableName === registro.tableName);
      if (!modelName) {
        console.warn(`[PUSH] Tabla desconocida: ${registro.tableName}, saltando registro.`);
        continue;
      }
      
      const Model = models[modelName];
      
      // Lógica Manual: Buscamos si el registro ya existe en la nube.
      const existingRecord = await Model.findByPk(registro.id, { transaction, paranoid: false });

      if (existingRecord) {
        // Si existe, lo actualizamos explícitamente.
        console.log(`[PUSH] Actualizando registro en ${registro.tableName} con ID ${registro.id}`);
        await Model.update(registro, {
          where: { id: registro.id },
          transaction,
          paranoid: false
        });
      } else {
        // Si no existe, lo creamos explícitamente.
        console.log(`[PUSH] Creando nuevo registro en ${registro.tableName} con ID ${registro.id}`);
        await Model.create(registro, { transaction });
      }
    }

    await transaction.commit();
    console.log("[PUSH] Completado con éxito.");
    res.status(200).json({ message: "Sincronización PUSH exitosa." });
  } catch (error) {
    await transaction.rollback();
    console.error("[PUSH] Error:", error);
    res.status(500).json({ message: "Error en el servidor durante PUSH.", error: error.message });
  }
});


app.get("/sync/pull", async (req, res) => {
  const lastSyncTime = req.query.lastSyncTime;
  console.log(`[PULL] Petición para cambios desde: ${lastSyncTime}`);

  if (!lastSyncTime) {
    return res.status(400).json({ message: "Falta el parámetro lastSyncTime." });
  }

  try {
    const allChanges = [];
    const syncDate = new Date(lastSyncTime);

    for (const modelName in models) {
      const Model = models[modelName];
      const changes = await Model.findAll({
        where: { updatedAt: { [Op.gt]: syncDate } },
        paranoid: false,
      });
      changes.forEach((c) =>
        allChanges.push({ ...c.toJSON(), tableName: Model.tableName })
      );
    }

    console.log(`[PULL] Enviando ${allChanges.length} registros.`);
    res.status(200).json(allChanges);
  } catch (error) {
    console.error("[PULL] Error:", error);
    res.status(500).json({ message: "Error en el servidor durante PULL.", error: error.message });
  }
});

// --- Iniciar el servidor ---
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos de Railway establecida.");
    
    await sequelize.sync({ alter: true });
    console.log("✅ Todos los modelos fueron sincronizados con la base de datos en la nube.");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("❌ No se pudo conectar o sincronizar con la base de datos de Railway:", error);
  }
};

startServer();
