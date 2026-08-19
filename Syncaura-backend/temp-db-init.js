import pkg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const { Pool } = pkg;

console.log("Database URL configured:", process.env.DATABASE_URL ? "Yes" : "No");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function run() {
  try {
    await pool.connect();
    console.log("✅ Successfully connected to PostgreSQL");
    
    // Check tables
    const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log("Existing tables:", res.rows.map(r => r.table_name));
    
    if (res.rows.length === 0) {
      console.log("No tables found. Initializing database schema...");
      const initSqlPath = path.join(__dirname, 'src', 'config', 'init.sql');
      const sql = fs.readFileSync(initSqlPath, 'utf8');
      await pool.query(sql);
      console.log("✅ Database schema initialized successfully!");
    } else {
      console.log("Database already has tables. Skipping initialization.");
    }
  } catch (err) {
    console.error("❌ Database operation failed:", err);
  } finally {
    await pool.end();
  }
}

run();
