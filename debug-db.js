require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function debug() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log("Checking products table...");
    const [rows] = await db.execute("DESCRIBE products");
    console.log("Table structure:", JSON.stringify(rows, null, 2));
    
    const [products] = await db.execute("SELECT COUNT(*) as count FROM products");
    console.log("Total products:", products[0].count);
  } catch (error) {
    console.error("DB Error:", error.message);
  } finally {
    db.end();
  }
}

debug();
