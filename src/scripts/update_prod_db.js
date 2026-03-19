const mysql = require('mysql2/promise');

async function updateProductionDB() {
  const config = {
    host: '82.25.73.233',
    user: 'u555250317_whupishop',
    password: 'Whupi718!',
    database: 'u555250317_whupi'
  };

  try {
    const db = await mysql.createConnection(config);
    console.log('Connected to Production DB');

    try {
      await db.execute('ALTER TABLE orders ADD COLUMN customer_name VARCHAR(255) AFTER id');
      console.log('Added customer_name to orders');
    } catch (e) {
      console.log('customer_name might already exist');
    }

    try {
      await db.execute('ALTER TABLE merchants ADD COLUMN pediclub_id INT AFTER store_name');
      console.log('Added pediclub_id to merchants');
    } catch (e) {
      console.log('pediclub_id might already exist');
    }

    try {
        await db.execute('ALTER TABLE orders ADD COLUMN delivery_price DECIMAL(10, 2) AFTER status');
        console.log('Added delivery_price to orders');
    } catch (e) {
        console.log('delivery_price might already exist');
    }

    await db.execute('UPDATE merchants SET pediclub_id = 170 WHERE store_name LIKE "%Jacinto%"');
    console.log('Updated Lodejacinto mapping to 170');

    await db.end();
    console.log('Done!');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

updateProductionDB();
