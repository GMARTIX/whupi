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
    console.log("Adding payment method columns to merchants...");
    await db.execute("ALTER TABLE merchants ADD COLUMN IF NOT EXISTS accepts_cash BOOLEAN DEFAULT TRUE");
    await db.execute("ALTER TABLE merchants ADD COLUMN IF NOT EXISTS accepts_transfer BOOLEAN DEFAULT TRUE");
    await db.execute("ALTER TABLE merchants ADD COLUMN IF NOT EXISTS accepts_mercadopago BOOLEAN DEFAULT TRUE");

    // Activar por defecto para el local de prueba
    await db.execute(
      "UPDATE merchants SET accepts_cash = 1, accepts_transfer = 1, accepts_mercadopago = 1 WHERE id = ?",
      ["m-lodejacinto"]
    );

    console.log("Migration successful!");
  } catch (error) {
    console.error("Migration Error:", error.message);
  } finally {
    db.end();
  }
}

migrate();
