import pkg from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// console.log("DATABASE_URL =", process.env.DATABASE_URL);
//  console.log("__dirname =", __dirname);
// console.log("ENV PATH =", path.resolve(__dirname, "../../.env"));
// console.log("Exists =", fs.existsSync(path.resolve(__dirname, "../../.env")));

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle database client:', err.message);
});

pool.connect()
  .then(() => console.log("✅ PostgreSQL Connected"))
  .catch((err) => console.error("❌ PostgreSQL Connection Error:", err));


  pool.query("SELECT current_database(), current_schema()")
  .then((res) => {
    console.log("Connected DB:", res.rows[0].current_database);
    console.log("Current Schema:", res.rows[0].current_schema); 

    const db =  pool.query("SELECT current_database()");
console.log(db.rows);

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

