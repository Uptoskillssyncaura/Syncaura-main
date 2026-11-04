import pkg from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// NOTE: Do NOT call dotenv.config() here — app.js already calls it before any imports.
// Calling it again with a different path (../../.env) caused env vars to silently fail on Render.

const { Pool } = pkg;

const poolConfig = {
  connectionString: process.env.DATABASE_URL,
};

if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('sslmode=')) {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle database client:', err.message);
});

pool.query("SELECT current_database(), current_schema()")
  .then(async (res) => {
    console.log("✅ PostgreSQL Connected");
    console.log("Connected DB:", res.rows[0].current_database);
    console.log("Current Schema:", res.rows[0].current_schema); 

    // Auto-migrate schema updates
    try {
      await pool.query(`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_pic TEXT;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255);
        CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
        ALTER TABLE leaves ADD COLUMN IF NOT EXISTS leave_type VARCHAR(100) DEFAULT 'Casual Leave';
        ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
        ALTER TABLE projects ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES users(id) ON DELETE SET NULL;
        ALTER TABLE tasks ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id) ON DELETE SET NULL;
        ALTER TABLE notices ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'GENERAL';
        ALTER TABLE notices ADD COLUMN IF NOT EXISTS creator_id UUID REFERENCES users(id) ON DELETE SET NULL;
        ALTER TABLE documents ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'GENERAL';
        ALTER TABLE documents ADD COLUMN IF NOT EXISTS type VARCHAR(100) DEFAULT 'DOCUMENT';
        ALTER TABLE documents ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Active';
        ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_url TEXT;
        ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_name VARCHAR(255);
        ALTER TABLE document_versions ADD COLUMN IF NOT EXISTS version_number VARCHAR(50) DEFAULT 'v1.0';
        ALTER TABLE document_versions ADD COLUMN IF NOT EXISTS title VARCHAR(255);
        ALTER TABLE complaints ADD COLUMN IF NOT EXISTS task_id UUID REFERENCES tasks(id) ON DELETE SET NULL;
        ALTER TABLE meetings ALTER COLUMN end_time DROP NOT NULL;
        CREATE TABLE IF NOT EXISTS project_members (
          project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (project_id, user_id)
        );
        CREATE TABLE IF NOT EXISTS oauth_exchange_codes (
          code VARCHAR(128) PRIMARY KEY,
          payload JSONB NOT NULL,
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_oauth_exchange_codes_expires_at ON oauth_exchange_codes(expires_at);
        CREATE TABLE IF NOT EXISTS oauth_nonces (
          nonce VARCHAR(128) PRIMARY KEY,
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_oauth_nonces_expires_at ON oauth_nonces(expires_at);
        -- Clean up expired codes and nonces periodically on startup
        DELETE FROM oauth_exchange_codes WHERE expires_at < NOW();
        DELETE FROM oauth_nonces WHERE expires_at < NOW();
      `);
      console.log("✅ Database schema migrated successfully");
    } catch (migErr) {
      console.error("Schema migration error:", migErr);
    }
  })
  .catch(console.error);

export const initDB = async () => {
  try {
    const initScriptPath = path.join(__dirname, "init.sql");
    const initScript = fs.readFileSync(initScriptPath, "utf8");

    await pool.query(initScript);

    console.log("Database initialized successfully.");
  } catch (err) {
    console.error("Error initializing database:", err);
  }
};

// testing the db is connected or not
// pool.query("SELECT NOW()", (err, res) => {
//   if (err) {
//     console.error("DB Test Failed ❌", err);
//   } else {
//     console.log("DB Test Success ✅", res.rows);
//   }
// });



export default pool;

