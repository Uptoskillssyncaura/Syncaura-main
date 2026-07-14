import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/task.routes.js';
import { errorMiddleware } from './middlewares/errorHandler.js';
import channelRoutes from './routes/channelRoutes.js';
import noticeRoutes from "./routes/notice.routes.js";
import documentRoutes from "./routes/documentRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

import messageRoutes from "./routes/messageRoutes.js";

import dashboardRoutes from './routes/dashboardRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import noteRoutes from "./routes/note.routes.js";
import attachmentRoutes from "./routes/attachment.routes.js";
import meetingRoutes from "./routes/meeting.routes.js";
import calendarTestRoute from "./routes/calendarTest.route.js";
import googleAuthRoutes from "./routes/googleAuth.route.js";
import githubRoutes from "./routes/github.routes.js";
import { initSlackBot } from "./services/slackBot.js";

// dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();



// Initialize Slack Bot (uncomment below if you want to use Slack bot features)
// initSlackBot();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Serve static files from public directory
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use("/api/notices", noticeRoutes);
app.use('/api/channels', channelRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/projects", projectRoutes);

app.use("/api/messages", messageRoutes);

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/notifications', notificationRoutes);
app.use("/api/attachments", attachmentRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api", calendarTestRoute);
app.use("/auth", googleAuthRoutes);

app.use("/api/github", githubRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Syncaura Backend is running 🚀",
  });
});

// Health check route
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Global error handler
app.use(errorMiddleware);

export default app;
