require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    console.log('🌱 Seeding database...');

    const merchantUserId = 'u-merchant-1';
    const riderUserId = 'u-rider-1';
    const merchantId = 'm-lodejacinto';
    const riderId = 'r-pedro';

    // 1. Create Merchant User
    await connection.query(
      'INSERT IGNORE INTO users (id, email, phone, role) VALUES (?, ?, ?, ?)',
      [merchantUserId, 'merchant@whupi.shop', '12345678', 'MERCHANT']
    );

    await connection.query(
      'INSERT IGNORE INTO merchants (id, user_id, store_name, address) VALUES (?, ?, ?, ?)',
      [merchantId, merchantUserId, 'Lodejacinto', 'Jofré de Loaiza 26']
    );

    // 2. Create Rider User
    await connection.query(
      'INSERT IGNORE INTO users (id, email, phone, role) VALUES (?, ?, ?, ?)',
      [riderUserId, 'rider@whupi.shop', '87654321', 'RIDER']
    );

    await connection.query(
      'INSERT IGNORE INTO riders (id, user_id, vehicle_type, is_active) VALUES (?, ?, ?, ?)',
      [riderId, riderUserId, 'Moto', true]
    );

    console.log('✅ Seeding completado.');
    console.log('Merchant ID:', merchantId);
    console.log('Rider ID:', riderId);

  } catch (error) {
    console.error('❌ Error en seeding:', error);
  } finally {
    await connection.end();
  }
}

main();
