const mysql = require('mysql2/promise');

async function testConnection() {
  const config = {
    host: '82.25.73.233', // Usando la IP del Hostinger de Whupi, asumimos que es el mismo servidor o accesible
    user: 'u555250317_hs32c',
    password: 'Pediclub2024',
    database: 'u555250317_wKogH'
  };

  try {
    const connection = await mysql.createConnection(config);
    console.log('Connected to Pediclub DB');

    const [rows] = await connection.execute('SELECT com_id, com_nombre FROM fi_comercios WHERE com_nombre LIKE "%jacinto%" OR com_nombre LIKE "%whupi%"');
    console.log('Merchants found:', JSON.stringify(rows));

    await connection.end();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testConnection();
