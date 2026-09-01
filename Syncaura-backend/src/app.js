import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();
import pool from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/task.routes.js';
import { errorMiddleware } from './middlewares/errorHandler.js';
import channelRoutes from './routes/channelRoutes.js';
import noticeRoutes from "./routes/notice.routes.js";
import documentRoutes from "./routes/documentRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import profileRoutes from "./routes/profile.routes.js";

import messageRoutes from "./routes/messageRoutes.js";

import dashboardRoutes from './routes/dashboardRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import noteRoutes from "./routes/note.routes.js";
import attachmentRoutes from "./routes/attachment.routes.js";
import meetingRoutes from "./routes/meeting.routes.js";
import calendarTestRoute from "./routes/calendarTest.route.js";
import googleAuthRoutes from "./routes/googleAuth.route.js";
import githubRoutes from "./routes/github.routes.js";
import { initSlackBot } from "./services/slackBot.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import adminRoutes from './routes/adminRoutes.js';
import coAdminRoutes from './routes/coAdminRoutes.js';
import userRoutes from './routes/userRoutes.js';

// dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, '../../Syncaura-frontend/dist');
const frontendIndexPath = path.join(frontendDistPath, 'index.html');

const app = express();



// Initialize Slack Bot (uncomment below if you want to use Slack bot features)
// initSlackBot();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
];
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || (process.env.CLIENT_URL && origin.startsWith(process.env.CLIENT_URL))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Serve static files from public directory
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
app.use('/api/auth', authRoutes);

app.use('/api/admin', adminRoutes);
app.use('/api/co-admin', coAdminRoutes);
app.use('/api/users', userRoutes);

app.use('/api/tasks', taskRoutes);
app.use("/api/notices", noticeRoutes);
app.use('/api/channels', channelRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/profile", profileRoutes);

app.use("/api/messages", messageRoutes);

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/notifications', notificationRoutes);
app.use("/api/attachments", attachmentRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api", calendarTestRoute);
app.use("/auth", googleAuthRoutes);

app.use("/api/github", githubRoutes);
app.use("/api/chatbot", chatbotRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Syncaura Backend is running 🚀",
  });
});

// Health check route
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Serve the React app for frontend routes when users open the backend URL.
app.use(express.static(frontendDistPath));

const frontendRoutes = [
  '/login',
  '/signin',
  '/sign-in',
  '/role-selection',
  '/signup',
  '/sign-up',
  '/auth/callback',
  '/auth/github/callback',
  '/learn-more',
  '/about-us',
  '/meet/:id',
  '/admin',
  '/co-admin',
  '/user-dashboard',
  '/projects',
  '/attendance-leave',
  '/my-attendance',
  '/tasks',
  '/meetings',
  '/profile',
  '/chat',
  '/notice',
  '/documents',
  '/complaints',
  '/settings',
];

app.get(frontendRoutes, (req, res) => {
  if (fs.existsSync(frontendIndexPath)) {
    return res.sendFile(frontendIndexPath);
  }

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  return res.redirect(`${clientUrl}${req.originalUrl}`);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Global error handler
app.use(errorMiddleware);

export default app;
