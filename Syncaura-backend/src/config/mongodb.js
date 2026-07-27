import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10s timeout
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    // Do not crash the server — PostgreSQL is the primary DB
    // MongoDB is available as an additional data store
  }
};

// Graceful disconnect on process exit
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed (app terminated).");
  process.exit(0);
});

export default connectMongoDB;
