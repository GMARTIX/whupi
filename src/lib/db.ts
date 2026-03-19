import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const db = pool;

// Pediclub Database (Legacy System)
const pediclubPool = mysql.createPool({
  host: process.env.PEDICLUB_DB_HOST || process.env.DB_HOST || 'localhost',
  user: process.env.PEDICLUB_DB_USER,
  password: process.env.PEDICLUB_DB_PASSWORD,
  database: process.env.PEDICLUB_DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

export const pediclubDb = pediclubPool;

export async function query(sql: string, params?: any[]) {
  const [results] = await pool.execute(sql, params);
  return results;
}
