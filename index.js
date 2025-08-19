const express = require("express");
const { Sequelize, Op } = require("sequelize");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

const PORT = process.env.PORT || 3000;

// --- Conexión a la Base de Datos de Railway ---
const DATABASE_URL =
"postgresql://postgres:QoAHClOZptlLQOyoagCXlFBQoFLBoNEf@tramway.proxy.rlwy.net:57333/railway";
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
});

// --- CARGA DE TODOS LOS MODELOS Y ASOCIACIONES ---
// 1. Cargamos todos los modelos.
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
  MovimientoCuentaCorriente: require("./models/MovimientoCuentaCorriente")(
    sequelize
  ),
  Producto: require("./models/Producto")(sequelize),
  ProductoDepartamento: require("./models/ProductoDepartamento")(sequelize),
  ProductoFamilia: require("./models/ProductoFamilia")(sequelize),
  Proveedor: require("./models/Proveedor")(sequelize),
  Usuario: require("./models/Usuario")(sequelize),
  Venta: require("./models/Venta")(sequelize),
};

// 2. ✅ APLICAMOS LAS ASOCIACIONES (¡AHORA SÍ!)
const { applyAssociations } = require('./associations'); // Asume que 'associations.js' está en la raíz
applyAssociations(models);
console.log("✅ Modelos y asociaciones cargados en la API.");


// --- Rutas de la API (Endpoints) ---

app.get("/", (req, res) => {
  res.send(
    "¡La API de sincronización en Railway está funcionando correctamente!"
  );
});

app.post("/sync/push", async (req, res) => {
  const registros = req.body;
  console.log(`Recibidos ${registros.length} registros para PUSH.`);

  if (!Array.isArray(registros) || registros.length === 0) {
    return res
      .status(400)
      .json({ message: "Se esperaba un array de registros." });
  }

  const transaction = await sequelize.transaction();
  try {
    for (const registro of registros) {
      const modelName = Object.keys(models).find(
        (m) => models[m].tableName === registro.tableName
      );
      if (modelName) {
        await models[modelName].upsert(registro, { transaction });
      } else {
        console.warn(
          `Se recibió un registro para una tabla desconocida: ${registro.tableName}`
        );
      }
    }

    await transaction.commit();
    console.log("Push completado con éxito.");
    res.status(200).json({ message: "Sincronización PUSH exitosa." });
  } catch (error) {
    await transaction.rollback();
    console.error("Error durante el PUSH:", error);
    res
      .status(500)
      .json({
        message: "Error en el servidor durante la sincronización.",
        error: error.message,
      });
  }
});

app.get("/sync/pull", async (req, res) => {
  const lastSyncTime = req.query.lastSyncTime;
  console.log(`Petición de PULL para cambios desde: ${lastSyncTime}`);

  if (!lastSyncTime) {
    return res
      .status(400)
      .json({ message: "Falta el parámetro lastSyncTime." });
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

    console.log(`Enviando ${allChanges.length} registros en PULL.`);
    res.status(200).json(allChanges);
  } catch (error) {
    console.error("Error durante el PULL:", error);
    res
      .status(500)
      .json({
        message: "Error en el servidor durante la sincronización.",
        error: error.message,
      });
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
