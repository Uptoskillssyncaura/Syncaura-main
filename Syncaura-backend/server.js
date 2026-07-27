import 'dotenv/config';
import http from 'http';
import app from './src/app.js';
import { Server } from "socket.io";
import socketHandler from "./src/config/socket.js";
import "./src/scheduler/reminderScheduler.js";
import connectMongoDB from "./src/config/mongodb.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

socketHandler(io);
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  // Connect to MongoDB Atlas after server is up
  connectMongoDB();
});
