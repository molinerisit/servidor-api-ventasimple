const express = require('express');
const { Sequelize } = require('sequelize');
const cors = require('cors');

const app = express();
app.use(cors()); // Permite conexiones desde cualquier origen (importante para tu app Electron)
app.use(express.json({ limit: '50mb' })); // Permite que el servidor entienda JSON y aumenta el límite de tamaño para la sincronización

// Railway o cualquier otro proveedor de hosting te dará el puerto a través de una variable de entorno.
const PORT = process.env.PORT || 3000;

// --- Conexión a la Base de Datos de Railway ---
// ¡¡¡ REEMPLAZA ESTA LÍNEA CON TU PROPIA URL PÚBLICA DE RAILWAY !!!
const DATABASE_URL = "postgresql://postgres:FEjOXRbGCMEnLrvmEJIcyvMWTzVUBFMD@shortline.proxy.rlwy.net:14492/railway";

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    // Esta configuración es común para bases de datos en la nube y asegura la conexión.
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false // Desactiva los logs de SQL en la consola para no saturarla en producción
});

// --- Modelos de la Base de Datos ---
// Aquí replicaremos los modelos de tu app Electron. Por ahora, solo creamos uno de ejemplo.
// NOTA: Debes copiar TODOS tus archivos de modelos a este proyecto de API también.
// Por ahora, solo definimos 'Proveedor' como ejemplo.
const Proveedor = require('./models/Proveedor')(sequelize); // Asumimos que crearás una carpeta 'models'

// --- Rutas de la API (Endpoints) ---

// Ruta de prueba para verificar que el servidor está online.
app.get('/', (req, res) => {
  res.send('¡La API de sincronización en Railway está funcionando correctamente!');
});

// Endpoint para recibir los cambios desde la aplicación de escritorio.
app.post('/sync/push', async (req, res) => {
  const registros = req.body; // Se espera un array de objetos
  console.log(`Recibidos ${registros.length} registros para PUSH.`);

  if (!Array.isArray(registros) || registros.length === 0) {
    return res.status(400).json({ message: 'Se esperaba un array de registros.' });
  }

  const transaction = await sequelize.transaction();
  try {
    // Por ahora, solo manejamos Proveedores como ejemplo.
    // En el futuro, necesitarás una lógica que determine el modelo basado en el tipo de registro.
    for (const registro of registros) {
      if (registro.tableName === 'proveedores') { // Necesitarás añadir un campo 'tableName' al enviar los datos
        // 'upsert' intenta actualizar si el ID existe, o insertar si es nuevo.
        await Proveedor.upsert(registro, { transaction });
      }
      // Añadir 'else if' para otros modelos (productos, clientes, etc.)
    }
    
    await transaction.commit();
    console.log('Push completado con éxito.');
    res.status(200).json({ message: 'Sincronización PUSH exitosa.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error durante el PUSH:', error);
    res.status(500).json({ message: 'Error en el servidor durante la sincronización.', error: error.message });
  }
});

// Endpoint para enviar los cambios de la nube a la aplicación de escritorio.
app.get('/sync/pull', async (req, res) => {
  const lastSyncTime = req.query.lastSyncTime;
  console.log(`Petición de PULL para cambios desde: ${lastSyncTime}`);

  if (!lastSyncTime) {
    return res.status(400).json({ message: 'Falta el parámetro lastSyncTime.' });
  }

  try {
    // Por ahora, solo buscamos cambios en Proveedores como ejemplo.
    const nuevosProveedores = await Proveedor.findAll({
      where: {
        updatedAt: {
          [Sequelize.Op.gt]: new Date(lastSyncTime) // Busca registros actualizados DESPUÉS de la última sincronización.
        }
      },
      paranoid: false // Incluye los registros eliminados lógicamente (con 'deletedAt' no nulo)
    });

    console.log(`Enviando ${nuevosProveedores.length} registros en PULL.`);
    res.status(200).json(nuevosProveedores);
  } catch (error) {
    console.error('Error durante el PULL:', error);
    res.status(500).json({ message: 'Error en el servidor durante la sincronización.', error: error.message });
  }
});

// --- Iniciar el servidor ---
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos de Railway establecida.');
    
    // Sincroniza los modelos con la base de datos de la nube.
    // Esto creará las tablas si no existen.
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados con la base de datos en la nube.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
    });
  } catch (error)
 {
    console.error('❌ No se pudo conectar o sincronizar con la base de datos de Railway:', error);
  }
};

startServer();