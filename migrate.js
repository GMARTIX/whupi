require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function migrate() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log("Migrating products table...");
    await db.execute("ALTER TABLE products ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
    await db.execute("ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INT DEFAULT 0");
    await db.execute("ALTER TABLE products ADD COLUMN IF NOT EXISTS status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE'");
    console.log("Migration successful!");
  } catch (error) {
    console.error("Migration Error:", error.message);
  } finally {
    db.end();
  }
}

migrate();
