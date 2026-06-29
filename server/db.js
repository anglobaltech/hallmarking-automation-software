import pg from 'pg';
import { config } from './config.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.databaseUrl,
});

export async function checkDatabase() {
  const result = await pool.query('SELECT now() AS now');
  return result.rows[0].now;
}
