# Syncaura Frontend Repository Documentation

## 1. Overview

Syncaura Frontend is a React-based web application built with Vite and Tailwind CSS. It provides a dashboard-driven interface for team collaboration, project management, meetings, attendance tracking, complaints, notices, documents, and chat.

This repository appears to be the frontend client for a larger Syncaura platform and is structured as a modular single-page application.

---

## 2. Project Purpose

The application is designed to help users and administrators:

- manage projects and tasks
- join and view meetings
- communicate through a chat interface
- upload and review documents
- track attendance and leave
- view notices and complaints
- access role-based dashboards

---

## 3. Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router DOM
- Redux Toolkit
- Axios
- Chart.js and Recharts
- Framer Motion
- React Hook Form
- i18next for localization

### Development Tools
- ESLint
- Vite plugin for React
- Lucide icons
- React Toastify

---

## 4. Architecture Summary

The application follows a component-based architecture with:

- pages for route-level views
- components for reusable UI modules
- layouts for shared app shell structure
- Redux slices for global state
- service/config modules for API calls and media handling

The entry flow starts from the main app bootstrap, which wraps the app with Redux, media context, and routing.

---

## 5. Architecture Information

### 5.1 Application Flow

The frontend application starts in [src/main.jsx](src/main.jsx), where the React root is created and the app is wrapped with:

- Redux Provider for global state
- MediaProvider for meeting and media features
- App component for route-based rendering

From [src/App.jsx](src/App.jsx), the application sets up routing and role-based access for different user types.

### 5.2 Layered Architecture

The project is organized into the following architectural layers:

1. Presentation Layer
   - Pages in [src/pages](src/pages)
   - Reusable UI components in [src/components](src/components)
   - Shared shell layout in [src/layouts](src/layouts)

2. State Management Layer
   - Redux store in [src/redux/store.js](src/redux/store.js)
   - Feature slices and thunks in [src/redux](src/redux)

3. Service Layer
   - Axios client in [src/config/axios.js](src/config/axios.js)
   - Backend API interaction through Redux thunks
   - Media services in [src/services/mediaService.js](src/services/mediaService.js)

4. Infrastructure Layer
   - Routing via React Router in [src/App.jsx](src/App.jsx)
   - Localization setup in [src/i18n/i18n.js](src/i18n/i18n.js)
   - Environment-based API configuration in [src/config/routes.js](src/config/routes.js)

### 5.3 Component Interaction Model

A typical user action follows this flow:

1. The user navigates to a page from the route configuration.
2. The page renders UI components from the components folder.
3. Component events trigger actions handled by Redux thunks or local state.
4. Data is fetched or submitted through the Axios API layer.
5. Redux updates the shared state.
6. The updated state re-renders the related UI components.

### 5.4 Role-Based Architecture

The platform appears to support three primary roles:

- user
- admin
- co-admin

These roles are reflected in route protection and dashboard access. The route structure in [src/App.jsx](src/App.jsx) shows separate access paths for each role.

### 5.5 Module-Based Design

The repository uses a domain-based module structure, where related features are grouped together. For example:

- chat-related UI modules are under [src/components/chats](src/components/chats)
- meeting logic is organized under [src/components/FlowbitMeeting](src/components/FlowbitMeeting) and [src/components/Meeting](src/components/Meeting)
- complaints, documents, notices, and attendance are each grouped into dedicated folders

This modular design improves maintainability and makes it easier to extend the app for new features.

### 5.6 Runtime Responsibilities

- Pages coordinate the overall screen experience
- Components encapsulate UI behavior and presentation
- Redux stores shared business data and app state
- Thunks manage server communication and async workflows
- Context handles browser media and meeting-related state
- Layouts provide consistent chrome such as sidebar and topbar

---

## 6. Main Folder Structure

### Root Files
- package.json: dependencies and scripts
- vite.config.js: Vite configuration
- eslint.config.js: linting rules
- index.html: HTML entry point
- README.md: project introduction

### src/
- App.jsx: central route setup and app shell
- main.jsx: application entry point
- index.css: global styling

### src/pages/
Contains page-level screens such as:
- Home
- SignIn
- SignUp
- Dashboard
- UserDashboard
- Admin
- CoAdmin
- Projects
- Tasks
- Meetings
- CurrentMeet
- Chat
- Documents
- Complaints
- AttendanceLeave
- Notice
- Settings

### src/components/
Contains reusable UI components organized by domain:
- admin/
- auth/
- chats/
- complaints/
- dashboard/
- Document/
- FlowbitMeeting/
- home/
- Meeting/
- notice/
- projects/
- settings/
- userdashboard/

### src/layouts/
- MainLayout.jsx: shared layout with top bar, sidebar, and support chatbot

### src/redux/
- store.js: Redux store configuration
- slices/: state slices for meetings, documents, auth, notices, complaints, theme, language, reports, notifications
- features/: async thunks for API calls

### src/config/
- axios.js: Axios base configuration
- routes.js: route definitions

### src/context/
- MediaContext.jsx: media-related state for camera, mic, and screen sharing

### src/services/
- mediaService.js: browser media APIs integration

### src/i18n/
- i18n.js: translation setup and localization resources

### src/RouteProtection/
- ProtectRoute.jsx: route protection wrapper

---

## 6. Core Features

### Authentication
The app includes authentication-related pages and Redux async actions for:
- register
- login
- refresh token
- change password

### Dashboard Modules
The frontend includes separate experiences for:
- user dashboard
- admin dashboard
- co-admin dashboard

### Project & Task Management
The project contains UI modules for listing and managing projects and tasks.

### Meetings
Meeting-related pages and components support:
- meeting listings
- meeting detail views
- meeting controls
- media-based meeting experience

### Chat
The application includes a chat interface with message bubbles, input area, profile panel, and chat sidebar.

### Documents
There is a document management flow with filters, modals, table rows, and detail views.

### Complaints
The repository includes complaint listing, filters, sliders, and a new complaint modal.

### Attendance & Leave
The app includes attendance cards, leave forms, and filtering views.

### Notice & Settings
The app also provides notice display and settings pages for account preferences.

---

## 7. Routing Overview

The application uses React Router with role-based route protection. Key routes include:

- / : Home page
- /sign-in and /sign-up: authentication pages
- /user-dashboard: general user dashboard
- /projects: project management view
- /tasks: task management view
- /meetings: meetings page
- /meet/:id: current meeting route
- /chat: chat interface
- /documents: documents page
- /complaints: complaints page
- /attendance-leave: attendance and leave page
- /notice: notices page
- /settings: user settings
- /admin: admin dashboard
- /co-admin: co-admin dashboard

The route protection layer is currently present but appears to be simplified and may need further enforcement logic in future development.

---

## 8. State Management

Redux Toolkit is used for global state management.

### Main Redux Modules
- auth: authentication state and tokens
- theme: dark/light theme state
- meeting: meeting state
- documents: document-related state
- notification: notification state
- notice: notice state
- complaint: complaints state
- language: localization state
- reports: reporting analytics state
- ui: UI-level state

### Async Thunks
The repository includes thunk modules for:
- auth
- complaints
- documents
- meetings
- notices
- notifications
- reports

---

## 9. API Integration

The frontend communicates with a backend through Axios.

### Current API Configuration
- base URL is set to http://localhost:5000/api
- credentials are enabled for cookie-based requests
- Authorization header uses a stored token when available

### Environment Expectation
The app also references an environment variable for the API URL:
- VITE_API_URL

This suggests the project is intended to be configured for a backend service in development and production environments.

---

## 10. Media and Meeting Features

The app includes media handling support for:
- camera
- microphone
- screen sharing

This is managed through a dedicated context and media service module, indicating support for meeting or video-related functionality.

---

## 11. Localization

The project uses i18next and includes a large translation dictionary for the UI. This means the frontend is already prepared for multilingual support.

---

## 12. Setup Instructions

### Prerequisites
- Node.js installed
- npm installed

### Install dependencies
```bash
npm install
```

### Run the development server
```bash
npm run dev
```

The app should be available at:
```text
http://localhost:5173
```

---

## 13. Build and Verification Status

I attempted to verify the project build with:
```bash
npm run build
```

### Result
The build could not be completed in this environment due to a PowerShell security exception:
```text
PSSecurityException
UnauthorizedAccess
```

This indicates an environment or terminal permission issue rather than a clear application code error from the repository itself.

---

## 14. Observations and Recommendations

### Strengths
- Clean modular folder structure
- Role-based routing support
- Redux-based state management
- Good separation between pages and reusable components
- Support for localization and media features

### Areas to Review
- The route protection logic appears currently simplified and may need stronger enforcement
- Some routes and components may still need backend integration validation
- The app appears to be in active development, so the documentation should be updated as modules evolve

### Recommended Next Steps
- connect and test all backend APIs
- complete role-based access enforcement
- verify the build in a non-restricted terminal environment
- add unit/integration tests for critical flows

---

## 15. Summary

Syncaura Frontend is a feature-rich React application for modern workplace collaboration. It is organized around dashboards, modular components, and Redux state management, and it is positioned as the client side of a broader Syncaura platform.

No application code was modified during this repository analysis. Only documentation was created.
