require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('🚀 Iniciando conexión con Hostinger MySQL...');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
  });

  try {
    console.log('📄 Leyendo schema.sql...');
    const schema = fs.readFileSync(path.join(__dirname, '../../schema.sql'), 'utf8');

    console.log('⚙️ Creando tablas...');
    await connection.query(schema);

    console.log('✅ Base de datos inicializada correctamente en Hostinger.');
  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error);
  } finally {
    await connection.end();
  }
}

main();
