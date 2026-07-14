# Syncaura Frontend 🚀

Syncaura Frontend is a modern and scalable **React-based web application** built with **Vite** and **Tailwind CSS**. It provides an intuitive dashboard interface for managing projects, tasks, chats, attendance, meetings, notices, and other organizational activities.

The application follows a **clean, modular architecture** that improves maintainability, scalability, and collaboration among development team members.

---
## 📁 Repository Structure

The following structure provides an overview of the frontend project organization. Each directory is designed to keep the codebase modular, maintainable, and easy to navigate.

```bash
FRONTEND/
│
├── public/
│   ├── background/           # Background images used across the application
│   ├── fonts/                # Custom fonts
│   ├── images/               # Static images and assets
│   └── vite.svg
│
├── src/
│   ├── assets/               # Icons, images, and other static assets
│   │
│   ├── components/           # Reusable UI components
│   │   ├── admin/            # Admin components
│   │   ├── AttendanceLeave/  # Attendance and Leave components
│   │   ├── auth/             # Authentication components (Sign In, Sign Up)
│   │   ├── chats/            # Chat components
│   │   ├── complaints/       # Complaint management components
│   │   ├── dashboard/        # Dashboard components
│   │   ├── Document/         # Document management components
│   │   ├── Meeting/          # Meeting components
│   │   ├── notice/           # Notice components
│   │   ├── projects/         # Project components
│   │   ├── userdashboard/    # User dashboard components
│   │   ├── FilterDropdown.jsx    # Reusable animated dropdown component
│   │   ├── SupportChatbot.jsx    # Support chatbot component
│   │   └── MobileSidebar.jsx     # Mobile sidebar component
│   │
│   ├── constant/             # Reusable constants
│   │   └── constant.js       # Constant values
│   │
│   ├── layouts/              # Layout components
│   │   └── MainLayout.jsx    # Common layout wrapper (Header & Sidebar)
│   │
│   ├── pages/                # Application pages
│   │   ├── Attendance.jsx
│   │   ├── Admin.jsx
│   │   ├── Chat.jsx
│   │   ├── Complaints.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Documents.jsx
│   │   ├── Home.jsx
│   │   ├── Meetings.jsx
│   │   ├── Notice.jsx
│   │   ├── Projects.jsx
│   │   ├── Settings.jsx
│   │   ├── SignIn.jsx
│   │   ├── SignUp.jsx
│   │   ├── Tasks.jsx
│   │   └── UserDashboard.jsx
│   │
│   ├── redux/                # Global state management
│   │   ├── slices/
│   │   │   └── themeSlice.js # Theme (Light/Dark) slice
│   │   └── store.js          # Redux store configuration
│   │
│   ├── App.jsx               # Root React component
│   └── main.jsx              # Application entry point
│
├── .gitignore                # Ignored files and folders
├── eslint.config.js          # ESLint configuration
├── index.html                # HTML entry point
├── package.json              # Project dependencies and scripts
├── package-lock.json         # Locked dependency versions
├── README.md                 # Project documentation
└── vite.config.js            # Vite configuration
```

## 🏗️ Frontend Architecture

React Components
        │
        ▼
Redux Toolkit (State Management)
        │
        ▼
Axios (API Requests)
        │
        ▼
Backend API

**Flow Overview**

- React components render the user interface.
- Redux Toolkit manages global application state.
- Axios handles communication with backend APIs.
- The backend processes requests and returns data to the frontend.


---
## 📌 Routes

| Route | Description |
|--------|-------------|
| `/` | Home Page |
| `/sign-up` | Sign-Up Page |
| `/normal-dashboard` | Normal Dashboard |
| `/user-dashboard` | User Dashboard |
| `/admin` | Admin Dashboard |
| `/projects` | Projects Page |
| `/chat` | Chat Page |
| `/meetings` | Meetings Page |
| `/attendance-leave` | Attendance & Leave Page |
| `/complaints` | Complaints Page |
| `/notice` | Notice Page |
| `/settings` | Settings Page |

---

## 🧩 Features Overview

### 📊 Dashboard

- Admin and User dashboards
- Statistics cards
- Interactive charts using **Chart.js**
- Fully responsive layouts

### 🔐 Authentication

- Sign In and Sign Up interfaces
- Role-based pages (Admin/User)
- Form validation for authentication

### 💬 Chat Module

- Real-time chat interface
- User-friendly chat experience
- Responsive chat layout

### 📁 Project & Task Management

- Project listing and overview
- Task management interface
- Clean and intuitive user experience

### 📅 Attendance & Meetings

- Attendance tracking interface
- Meeting management interface
- Easy navigation for attendance and meeting records

### 🌗 Theme Support

- Light and Dark mode
- Global theme management using **Redux Toolkit**
- Responsive UI built with Tailwind CSS

---

## 🛠 Tech Stack

- **React.js**
- **Vite**
- **Tailwind CSS**
- **Redux Toolkit** (State Management)
- **Chart.js**
- **React Chart.js 2**
- **JavaScript (ES6+)**
- **HTML5**
- **CSS3**

---

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v18 or later)
- **npm** (v9 or later)
- **Git**

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Uptoskillssyncaura/Syncaura-frontend.git
cd Syncaura-frontend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the project root and add:

```env
VITE_API_URL=http://localhost:5000/api
```

Update the value according to your backend server.

### 4️⃣ Run the Development Server

```bash
npm run dev
```

Open your browser and visit:

```text
http://localhost:5173
```
## 🔗 Backend Integration

The Syncaura Frontend communicates with the backend using **Axios** and REST APIs.

The backend API base URL is configured through the environment variable:

```env
VITE_API_URL=http://localhost:5000/api
```

The frontend is responsible for rendering the user interface, managing application state, and handling API requests, while the backend manages authentication, business logic, and data storage.

---

## 👥 Team Collaboration Guidelines

- Maintain a single Git repository for the frontend.
- Follow the existing project structure and coding standards.
- Do **not** commit `node_modules`, build files, or environment files.
- Pull the latest changes before starting new work:

```bash
git pull origin main
```

- Create meaningful commit messages.
- Test your changes before creating a Pull Request.

---

## 🚫 Ignored Files

The following files and directories are excluded using `.gitignore`:

- `node_modules/`
- `dist/`
- `.env`
- IDE/editor configuration files

---

## 🗺️ Roadmap

The following enhancements are planned for future releases:

- Backend API integration improvements
- Protected routes and enhanced role-based access
- Mobile responsiveness improvements
- Performance optimization
- Progressive Web App (PWA) support
- Unit and integration testing

---

## 📄 License

This project is intended for educational and internal development purposes.

---

## 🤝 Contributors

Developed and maintained by the **Syncaura Frontend Team**.

If you find this project useful, consider giving the repository a ⭐.