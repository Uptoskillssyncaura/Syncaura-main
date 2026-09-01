import pool from './src/config/db.js';

async function run() {
  try {
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_pic TEXT;');
    console.log('Successfully added profile_pic column.');
  } catch (err) {
    console.error('Error adding column:', err);
  } finally {
    process.exit(0);
  }
}

run();
