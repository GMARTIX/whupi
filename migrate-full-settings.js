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
    console.log("Adding Treinta-style columns to merchants...");
    
    // Business info
    await db.execute("ALTER TABLE merchants ADD COLUMN IF NOT EXISTS category VARCHAR(100)");
    await db.execute("ALTER TABLE merchants ADD COLUMN IF NOT EXISTS city VARCHAR(100)");
    await db.execute("ALTER TABLE merchants ADD COLUMN IF NOT EXISTS email VARCHAR(255)");
    
    // Catalog settings
    await db.execute("ALTER TABLE merchants ADD COLUMN IF NOT EXISTS stock_display_mode VARCHAR(50) DEFAULT 'SHOW'"); // SHOW, HIDE, UNAVAILABLE
    
    // Delivery settings
    await db.execute("ALTER TABLE merchants ADD COLUMN IF NOT EXISTS enable_pickup BOOLEAN DEFAULT TRUE");
    await db.execute("ALTER TABLE merchants ADD COLUMN IF NOT EXISTS enable_delivery BOOLEAN DEFAULT TRUE");
    
    // Financial settings
    await db.execute("ALTER TABLE merchants ADD COLUMN IF NOT EXISTS enable_tips BOOLEAN DEFAULT FALSE");
    await db.execute("ALTER TABLE merchants ADD COLUMN IF NOT EXISTS tip_percentage INT DEFAULT 0");
    await db.execute("ALTER TABLE merchants ADD COLUMN IF NOT EXISTS tax_mode VARCHAR(50) DEFAULT 'NONE'"); // NONE, IVA_10, IVA_21
    
    // Service hours (JSON)
    await db.execute("ALTER TABLE merchants ADD COLUMN IF NOT EXISTS service_hours JSON");
    
    // Notifications & UI
    await db.execute("ALTER TABLE merchants ADD COLUMN IF NOT EXISTS notify_cash_drawer BOOLEAN DEFAULT FALSE");
    await db.execute("ALTER TABLE merchants ADD COLUMN IF NOT EXISTS sound_on_sale BOOLEAN DEFAULT TRUE");

    console.log("Migration successful!");
  } catch (error) {
    console.error("Migration Error:", error.message);
  } finally {
    db.end();
  }
}

migrate();
