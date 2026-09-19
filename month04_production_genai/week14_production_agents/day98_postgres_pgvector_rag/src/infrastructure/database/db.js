import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function checkDatabase() {
  const result = await pool.query("SELECT NOW() AS now");
  return {
    connected: true,
    time: result.rows[0].now
  };
}

export async function closeDatabase() {
  await pool.end();
}
