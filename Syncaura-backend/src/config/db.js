import pkg from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// console.log("DATABASE_URL =", process.env.DATABASE_URL);


const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

pool.connect()
  .then(() => console.log("✅ PostgreSQL Connected"))
  .catch((err) => console.error("❌ PostgreSQL Connection Error:", err));

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

