import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import app from './src/app.js';
import { Server } from "socket.io";
import socketHandler from "./src/config/socket.js";
import "./src/scheduler/reminderScheduler.js";
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
];
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || (process.env.CLIENT_URL && origin.startsWith(process.env.CLIENT_URL))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  }
});
app.set("io", io);

socketHandler(io);
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
