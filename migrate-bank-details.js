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
    console.log("Adding bank details columns to merchants...");
    
    await db.execute("ALTER TABLE merchants ADD COLUMN IF NOT EXISTS bank_alias VARCHAR(255)");
    await db.execute("ALTER TABLE merchants ADD COLUMN IF NOT EXISTS bank_details TEXT");

    console.log("Migration successful!");
  } catch (error) {
    console.error("Migration Error:", error.message);
  } finally {
    db.end();
  }
}

migrate();
