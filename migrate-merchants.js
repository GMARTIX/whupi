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
    console.log("Updating merchants table...");
    await db.execute("ALTER TABLE merchants ADD COLUMN IF NOT EXISTS lat DECIMAL(10, 8)");
    await db.execute("ALTER TABLE merchants ADD COLUMN IF NOT EXISTS lng DECIMAL(11, 8)");
    await db.execute("ALTER TABLE merchants ADD COLUMN IF NOT EXISTS base_shipping_cost DECIMAL(10, 2) DEFAULT 1400.00");
    await db.execute("ALTER TABLE merchants ADD COLUMN IF NOT EXISTS per_meter_cost DECIMAL(10, 4) DEFAULT 0.9");

    // Datos del local de prueba (Alberdi 20, Río Gallegos)
    // Coordenadas aproximadas de Alberdi 20: -51.62198, -69.21334
    console.log("Setting coordinates for test merchant...");
    await db.execute(
      "UPDATE merchants SET address = ?, lat = ?, lng = ? WHERE id = ?",
      ["Alberdi 20, Río Gallegos", -51.62198, -69.21334, "m-lodejacinto"]
    );

    console.log("Migration successful!");
  } catch (error) {
    console.error("Migration Error:", error.message);
  } finally {
    db.end();
  }
}

migrate();
