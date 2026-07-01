import { PGlite } from '@electric-sql/pglite';

// Initialize a local PGlite database
export const pool = new PGlite('./pglite-data');

export async function checkDatabase() {
  const result = await pool.query('SELECT now() AS now');
  return result.rows[0].now;
}
