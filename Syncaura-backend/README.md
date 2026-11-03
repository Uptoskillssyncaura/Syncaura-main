# Syncaura Backend 🚀

Syncaura Backend is a comprehensive **Node.js/Express-based REST API** built with **MongoDB** and **Socket.IO** for real-time features. It provides a robust backend infrastructure for a team collaboration and project management platform, handling authentication, project management, task tracking, real-time messaging, document management, meetings, and more.

The project follows a **modular MVC architecture** with clear separation of concerns to ensure maintainability, scalability, and smooth team collaboration.

---

## 📁 Repository Structure

This section explains the backend folder structure and the purpose of each directory and important file.

```bash
BACKEND/
│
├── src/
│   ├── app.js                    # Express app configuration and middleware setup
│   ├── server.js                 # HTTP server setup with Socket.IO initialization
│   │
│   ├── config/                   # Configuration files
│   │   ├── db.js                 # MongoDB connection setup
│   │   ├── socket.js             # Socket.IO event handlers
│   │   └── roles.js              # Role-based access control configuration
│   │
│   ├── controllers/              # Business logic handlers
│   │   ├── authController.js     # Authentication & authorization
│   │   ├── taskController.js     # Task management
│   │   ├── projectController.js  # Project management
│   │   ├── channelController.js  # Channel/chat management
│   │   ├── documentController.js # Document management
│   │   ├── meetingController.js  # Meeting scheduling & management
│   │   ├── noticeController.js   # Notice/announcement management
│   │   ├── leaveController.js    # Leave request management
│   │   ├── dashboardController.js # Dashboard statistics
│   │   ├── reportController.js   # Report generation
│   │   ├── noteController.js     # Notes management
│   │   └── attachmentController.js # File attachment handling
│   │
│   ├── models/                   # Mongoose schema definitions
│   │   ├── User.js               # User model with authentication
│   │   ├── Project.js            # Project model
│   │   ├── task.model.js         # Task model
│   │   ├── Channel.js            # Channel model
│   │   ├── Message.js            # Message model for real-time chat
│   │   ├── Document.js           # Document model
│   │   ├── Meetings.js           # Meeting model
│   │   ├── notice.model.js       # Notice model
│   │   ├── Leave.js              # Leave model
│   │   ├── Note.js               # Note model
│   │   └── Attachment.js         # Attachment model
│   │
│   ├── routes/                   # API route definitions
│   │   ├── authRoutes.js         # Authentication routes
│   │   ├── task.routes.js        # Task routes
│   │   ├── projectRoutes.js      # Project routes
│   │   ├── channelRoutes.js      # Channel routes
│   │   ├── documentRoutes.js     # Document routes
│   │   ├── meeting.routes.js     # Meeting routes
│   │   ├── notice.routes.js      # Notice routes
│   │   ├── leaveRoutes.js        # Leave routes
│   │   ├── dashboardRoutes.js    # Dashboard routes
│   │   ├── reportRoutes.js       # Report routes
│   │   ├── note.routes.js        # Note routes
│   │   ├── attachment.routes.js  # Attachment routes
│   │   └── calendarTest.route.js # Google Calendar integration routes
│   │
│   ├── middlewares/              # Express middleware
│   │   ├── auth.js               # JWT authentication middleware
│   │   ├── role.js               # Role-based access control middleware
│   │   └── errorHandler.js       # Global error handling middleware
│   │
│   ├── services/                 # External service integrations
│   │   └── googleCalendar.js     # Google Calendar API service
│   │
│   ├── utils/                    # Utility functions
│   │   └── [utility files]       # Helper functions and utilities
│   │
│   └── validators/               # Input validation schemas
│       └── [validator files]     # Express-validator schemas
│
├── public/                       # Static files (if any)
├── node_modules/                 # Dependencies (ignored in Git)
├── package.json                  # Project dependencies and scripts
├── package-lock.json             # Locked dependency versions
└── README.md                     # This file
```

---

## 🧩 Features Overview

### 🔐 Authentication & Authorization
- **JWT-based authentication** with access and refresh tokens
- **Role-based access control (RBAC)** with roles: `user`, `admin`, `co-admin`
- Password hashing using **bcrypt**
- Password reset functionality with OTP/token system
- Secure cookie-based token storage
- User activation/deactivation

### 📋 Project Management
- Create, read, update, and delete projects
- Project assignment and collaboration
- Project status tracking
- Project-based task organization

### ✅ Task Management
- Full CRUD operations for tasks
- Task assignment to team members
- Task status tracking (pending, in-progress, completed, etc.)
- Task priority levels
- Task comments and updates

### 💬 Real-time Chat & Channels
- **Socket.IO** powered real-time messaging
- Create and manage channels
- Real-time message broadcasting
- Channel-based team communication
- Message history persistence

### 📄 Document Management
- Upload and manage documents
- Document organization and categorization
- Document sharing and access control
- Document versioning support

### 📅 Meeting Management
- Schedule and manage meetings
- Meeting participants management
- Meeting details and notes
- **Google Calendar integration** for scheduling

### 📢 Notice & Announcements
- Create and publish notices
- Notice distribution to users
- Notice categories and priority levels

### 🏖 Leave Management
- Leave request submission
- Leave approval workflow
- Leave balance tracking
- Leave history and reports

### 📊 Dashboard & Analytics
- User and admin dashboards
- Statistics and analytics
- Activity tracking
- Performance metrics

### 📝 Notes & Attachments
- Personal and shared notes
- File attachment support
- Rich note organization

### 📈 Reports & Exports
- Generate reports (PDF/Excel) using **PDFKit** and **ExcelJS**
- Export data in multiple formats
- Custom report generation

### 📧 Email Integration
- **Nodemailer** integration for email notifications
- Automated email sending for various events
- Email templates support

---

## 🛠 Tech Stack

### Core Technologies
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Real-time Communication
- **Socket.IO** - Real-time bidirectional event-based communication

### Authentication & Security
- **JSON Web Token (JWT)** - Token-based authentication
- **bcrypt/bcryptjs** - Password hashing
- **cookie-parser** - Cookie parsing middleware

### Validation & Error Handling
- **express-validator** - Input validation
- Custom error handling middleware

### External Integrations
- **googleapis** - Google Calendar API integration
- **nodemailer** - Email sending service

### File Processing
- **PDFKit** - PDF generation
- **ExcelJS** - Excel file generation and manipulation

### Utilities
- **dotenv** - Environment variable management
- **cors** - Cross-Origin Resource Sharing
- **morgan** - HTTP request logger

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher recommended)
- **MongoDB** (v4.4 or higher) - Running locally or MongoDB Atlas
- **npm** or **yarn** package manager
- **Git**

### 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd Syncaura-backend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/clustername
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/clustername

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRE=30d

# Client Configuration
CLIENT_URL=http://localhost:5173

# Email Configuration (for Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Google Calendar API (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
```

### 4️⃣ Run the Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000` (or the port specified in `.env`).

### 5️⃣ Run Production Server

```bash
npm run run
```

---

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/me` - Get current user profile

### Task Routes (`/api/tasks`)
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Project Routes (`/api/projects`)
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Channel Routes (`/api/channels`)
- `GET /api/channels` - Get all channels
- `POST /api/channels` - Create a new channel
- `GET /api/channels/:id` - Get channel by ID
- `PUT /api/channels/:id` - Update channel
- `DELETE /api/channels/:id` - Delete channel
- `GET /api/channels/:id/messages` - Get channel messages

### Document Routes (`/api/documents`)
- `GET /api/documents` - Get all documents
- `POST /api/documents` - Upload/create document
- `GET /api/documents/:id` - Get document by ID
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document

### Meeting Routes (`/api/meetings`)
- `GET /api/meetings` - Get all meetings
- `POST /api/meetings` - Schedule a new meeting
- `GET /api/meetings/:id` - Get meeting by ID
- `PUT /api/meetings/:id` - Update meeting
- `DELETE /api/meetings/:id` - Cancel meeting

### Notice Routes (`/api/notices`)
- `GET /api/notices` - Get all notices
- `POST /api/notices` - Create a new notice
- `GET /api/notices/:id` - Get notice by ID
- `PUT /api/notices/:id` - Update notice
- `DELETE /api/notices/:id` - Delete notice

### Leave Routes (`/api/leave`)
- `GET /api/leave` - Get all leave requests
- `POST /api/leave` - Submit leave request
- `GET /api/leave/:id` - Get leave request by ID
- `PUT /api/leave/:id` - Update leave request
- `PUT /api/leave/:id/approve` - Approve leave request
- `PUT /api/leave/:id/reject` - Reject leave request

### Dashboard Routes (`/api/dashboard`)
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/user-stats` - Get user-specific statistics
- `GET /api/dashboard/project-health/:projectId` - Get a project's weighted health score (admin/co-admin)

### Report Routes (`/api/reports`)
- `GET /api/reports` - Generate reports
- `POST /api/reports/generate` - Create custom report
- `GET /api/reports/export/:format` - Export report (PDF/Excel)

### Note Routes (`/api/notes`)
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create a new note
- `GET /api/notes/:id` - Get note by ID
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Attachment Routes (`/api/attachments`)
- `GET /api/attachments` - Get all attachments
- `POST /api/attachments` - Upload attachment
- `GET /api/attachments/:id` - Get attachment by ID
- `DELETE /api/attachments/:id` - Delete attachment

### Health Check
- `GET /health` - Server health check endpoint

---

## 🔌 Socket.IO Events

### Client → Server Events
- `join-channel` - Join a channel room
- `leave-channel` - Leave a channel room
- `send-message` - Send a message to a channel

### Server → Client Events
- `new-message` - Broadcast new message to channel members
- `connection` - Client connected
- `disconnect` - Client disconnected

---

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt with salt rounds
- **CORS Protection** - Configurable CORS policies
- **Input Validation** - Express-validator for request validation
- **Error Handling** - Centralized error handling middleware
- **Rate Limiting** - Can be added for production
- **Helmet** - Security headers (recommended for production)

---

## 📝 Scripts

```bash
# Development
npm run dev          # Start development server with nodemon

# Production
npm run run          # Start production server

# Install dependencies
npm install          # Install all dependencies
```

---

## 🗄️ Database Schema

The backend uses MongoDB with Mongoose ODM. Key models include:

- **User** - User accounts with authentication
- **Project** - Project information and metadata
- **Task** - Task details and assignments
- **Channel** - Chat channels
- **Message** - Real-time chat messages
- **Document** - Document metadata and storage
- **Meeting** - Meeting schedules and details
- **Notice** - Announcements and notices
- **Leave** - Leave requests and approvals
- **Note** - User notes
- **Attachment** - File attachments

---

## 🔗 Frontend Integration

This backend is designed to work seamlessly with the **Syncaura Frontend** application:

- CORS is configured to allow frontend origin
- RESTful API design for easy integration
- Socket.IO support for real-time features
- Consistent error response format
- JWT-based session management

---

## 🧪 Testing

To test the API endpoints:

1. Use tools like **Postman**, **Insomnia**, or **Thunder Client**
2. Import the API collection (if available)
3. Start the server and test endpoints
4. Use authentication tokens in headers for protected routes

---

## 📦 Deployment

### Recommended Platforms
- **Heroku** - Easy deployment with MongoDB Atlas
- **Railway** - Simple Node.js deployment
- **AWS EC2** - Full control with MongoDB
- **DigitalOcean** - VPS deployment
- **Render** - Modern deployment platform

### Environment Variables
Ensure all environment variables are set in your deployment platform's environment configuration.

### Database
- Use **MongoDB Atlas** for cloud-hosted database
- Or set up MongoDB on your server

---

## 👥 Team Collaboration Rules

- Follow the modular folder structure
- **Do not commit** `node_modules` or `.env` files
- Use meaningful commit messages
- Always pull before pushing:
  ```bash
  git pull origin main
  ```
- Test your changes before pushing
- Follow ESLint/Prettier configurations (if configured)

---

## 🚫 Ignored Files

The following files are excluded using `.gitignore`:

- `node_modules/`
- `.env`
- `*.log`
- IDE/editor configuration files

---

## 📌 Future Enhancements

- [ ] API documentation with Swagger/OpenAPI
- [ ] Unit and integration testing (Jest/Mocha)
- [ ] CI/CD pipeline setup
- [ ] Rate limiting implementation
- [ ] Caching with Redis
- [ ] File upload to cloud storage (AWS S3, Cloudinary)
- [ ] Advanced search and filtering
- [ ] Webhook support
- [ ] GraphQL API option
- [ ] Microservices architecture migration

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is developed for **educational and internal purposes**.  
License information can be added if required.

---

## 👨‍💻 Contributors

Developed and maintained by the **Syncaura Backend Team**.

---

## 📞 Support

For issues, questions, or contributions, please open an issue in the repository or contact the development team.

---

⭐ If you find this project useful, consider starring the repository!
