const express = require("express");
const { Sequelize, Op } = require("sequelize");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

const PORT = process.env.PORT || 3000;

// --- Conexión a la Base de Datos de Railway ---
// Se lee la URL de la base de datos desde las variables de entorno de Railway.
const DATABASE_URL = process.env.DATABASE_URL;

// Validación para asegurar que la variable de entorno está presente.
if (!DATABASE_URL) {
    console.error("❌ FATAL: La variable de entorno DATABASE_URL no está definida.");
    process.exit(1); // Detiene la aplicación si no hay URL de base de datos.
}

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
  Suscripcion: require("./models/Suscripcion")(sequelize),
  MovimientoCuentaCorriente: require("./models/MovimientoCuentaCorriente")(
    sequelize
  ),
  Producto: require("./models/Producto")(sequelize),
  ProductoDepartamento: require("./models/ProductoDepartamento")(sequelize),
  ProductoFamilia: require("./models/ProductoFamilia")(sequelize),
  Proveedor: require("./models/Proveedor")(sequelize),
  Usuario: require("./models/Usuario")(sequelize),
  Venta: require("./models/Venta")(sequelize),
  ArqueoCaja: require("./models/ArqueoCaja")(sequelize),
};

// 2. APLICAMOS LAS ASOCIACIONES (¡AHORA SÍ!)
const { applyAssociations } = require('./associations');
applyAssociations(models);
console.log("✅ Modelos y asociaciones cargados en la API.");


// --- Rutas de la API (Endpoints) ---

app.get("/", (req, res) => {
  res.send(
    "¡La API de sincronización en Railway está funcionando correctamente!"
  );
});

// Endpoint de PUSH
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

// Endpoint de PULL
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
      // Ignoramos la tabla de suscripciones para el pull, ya que no es un dato del cliente
      if (Model.tableName === 'Suscripciones') continue;

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

// Endpoint de Verificación de Suscripción
app.get("/subscription/status", async (req, res) => {
    const { licenseKey } = req.query;
    if (!licenseKey) {
        return res.status(400).json({ message: "Falta el parámetro licenseKey." });
    }

    try {
        const subscription = await models.Suscripcion.findOne({ where: { license_key: licenseKey } });

        if (!subscription) {
            return res.status(404).json({ message: "Licencia no encontrada." });
        }

        if (!subscription.is_active) {
            return res.status(403).json({ 
                status: 'disabled',
                message: "Este programa ha sido desactivado. Por favor, contacte con soporte."
            });
        }
        
        // Si no hay fecha de expiración, la suscripción es vitalicia y siempre está activa.
        if (!subscription.expires_on) {
            return res.status(200).json({
                status: 'active',
                message: 'Suscripción vitalicia activa.'
            });
        }

        const now = new Date();
        const expires = new Date(subscription.expires_on);
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(now.getDate() + 3);

        if (expires < now) {
            return res.status(403).json({
                status: 'expired',
                message: `Su suscripción ha expirado el ${expires.toLocaleDateString()}. Contacte con soporte.`
            });
        }
        
        if (expires < threeDaysFromNow) {
            return res.status(200).json({
                status: 'warning', // El estado cambia a 'warning' para que la app local pueda mostrar una alerta.
                message: `¡Atención! Su suscripción está por vencer el ${expires.toLocaleDateString()}.`
            });
        }

        // Si todo está bien
        return res.status(200).json({
            status: 'active',
            message: `Suscripción activa hasta el ${expires.toLocaleDateString()}.`
        });

    } catch (error) {
        console.error("Error al verificar suscripción:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});


// --- Iniciar el servidor (VERSIÓN MEJORADA CON REINTENTOS) ---

// Función auxiliar para pausar la ejecución
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const startServer = async () => {
  const MAX_RETRIES = 5; // Intentaremos conectar 5 veces
  const RETRY_DELAY = 5000; // Esperaremos 5 segundos entre cada intento

  for (let i = 1; i <= MAX_RETRIES; i++) {
    try {
      // Intento N° i de conectar
      console.log(`[DB] Intento de conexión a la base de datos N° ${i}/${MAX_RETRIES}...`);
      await sequelize.authenticate();
      console.log("✅ Conexión a la base de datos de Railway establecida.");
      
      // Si la conexión fue exitosa, sincronizamos y arrancamos el servidor
      await sequelize.sync({ alter: true });
      console.log("✅ Todos los modelos fueron sincronizados con la base de datos en la nube.");

      app.listen(PORT, () => {
        console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
      });

      // Si todo funcionó, salimos del bucle
      return; 
    
    } catch (error) {
      console.error(`❌ Falló el intento de conexión N° ${i}. Error: ${error.name}`);
      
      // Si este fue el último intento, nos rendimos y mostramos el error completo.
      if (i === MAX_RETRIES) {
        console.error("❌ No se pudo conectar a la base de datos después de varios intentos:", error);
        // Salimos del proceso con un código de error para que Railway sepa que algo salió muy mal.
        process.exit(1); 
      }
      
      // Si no es el último intento, esperamos antes de volver a intentarlo.
      console.log(`[DB] Reintentando en ${RETRY_DELAY / 1000} segundos...`);
      await sleep(RETRY_DELAY);
    }
  }
};

startServer();