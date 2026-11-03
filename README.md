# Acewall Scholars Learning Online

A modern, full-featured learning management system (LMS) built with React and Vite. Acewall provides separate portals for **Students**, **Teachers**, and **Parents**, enabling course management, assessments, grading, attendance tracking, discussions, messaging, and real-time collaboration.

## Table of Contents

- [Project Overview](project-overview)
- [Prerequisites](prerequisites)
- [Setup & Installation](setup--installation)
- [Environment Variables](environment-variables)
- [Architecture](architecture)
- [Running the Application](running-the-application)
- [Available Scripts](available-scripts)
- [Tech Stack](tech-stack)
- [Key Features](key-features)
- [Authentication & Auth Providers](authentication--auth-providers)
- [Real-time Communication](real-time-communication)

## Project Overview

Acewall Scholar Learning Online is the frontend client for a school LMS platform. It supports three distinct user roles—Student, Teacher, and Parent—each with role-specific dashboards, routes, and workflows.

The application handles:
- Course creation, enrollment, and content delivery
- Assessments (assignments, quizzes) with submission and review flows
- Gradebooks and grading scales
- Attendance tracking (student and teacher views)
- Announcements and discussions (course-level and global)
- Real-time messaging via Socket.io
- Social profiles and interactions
- LTI 1.3 deep linking for LMS integration
- Google Drive API integration for file handling
- AI chatbot assistance
- Parent portal for monitoring child progress

## Prerequisites

Ensure the following tools are installed before proceeding:

- **Node.js** >= 18.x
- **npm** >= 9.x (or **yarn** / **pnpm**)
- A running instance of the Acewall backend API
- A modern web browser (Chrome, Edge, Firefox, or Safari)

## Setup & Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd acewall-frontend

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Create a .env file in the project root using the variables listed below

# 4. Start the development server
npm run dev
```

## Environment Variables

Create a `.env` file in the project root with the following variables:

| Variable | Description |
|---|---|
| `VITE_BASE_URL` | Backend API base URL (e.g. `http://localhost:5050/api/`) |
| `VITE_SOCKET_URL` | Backend WebSocket server URL (e.g. `http://localhost:5050`) |
| `VITE_CLOUD_NAME` | Cloudinary cloud name for media uploads |
| `VITE_UPLOAD_PRESET` | Cloudinary upload preset for teacher course uploads |
| `VITE_CLEVER_CLIENT_ID` | Clever SSO client ID |
| `VITE_CLEVER_REDIRECT_URI` | Clever SSO redirect URI |
| `VITE_CLEVER_DISTRICT_ID` | Clever SSO district ID |
| `VITE_GOOGLE_CSS_CLIENT_ID` | Google OAuth client ID |
| `VITE_GOOGLE_DRIVE_CLIENT_ID` | Google Drive OAuth client ID |
| `VITE_GOOGLE_DRIVE_APP_ID` | Google Drive application ID |
| `VITE_GOOGLE_DRIVE_API_KEY` | Google Drive API key |
| `FRONTEND_URL` | Production frontend URL |
| `VITE_FRONTEND_URL` | Development frontend URL (e.g. `http://localhost:5173`) |
| `VITE_TICKETING_SYSTEM_URL` | Ticketing system backend URL |
| `VITE_ENCRYPTION_KEY` | Frontend encryption key for request/response encryption |

> **Note**: A `.env` file with local development defaults is included in the repository. Never commit secrets to version control.

## Architecture

### High-Level Structure

```
src/
├── main.jsx                 # Application entry point, provider setup
├── App.jsx                  # Root router, route definitions for all roles
├── index.css                # Global styles & Tailwind directives
├── assets/                  # Static images, icons, videos
├── components/
│   ├── ui/                  # Reusable Radix UI primitives (button, dialog, etc.)
│   ├── LTI/                 # LTI 1.3 deep linking components
│   └── CustomComponent/     # Shared custom UI components
├── Context/                 # React Context providers
│   ├── GlobalProvider.jsx   # Auth state, socket, LTI context
│   ├── CoursesProvider.jsx  # Course data context
│   └── ActivityLogProvider.jsx
├── hooks/                   # Custom hooks (page tracking, form tracking, LTI)
├── lib/                     # Axios instance, utility functions, private routes
├── pages/                   # OAuth callback pages (Clever)
└── Page/                    # Feature page components
    ├── StudentPortal/       # Student routes (dashboard, courses, assessments, etc.)
    ├── teacher/             # Teacher routes (dashboard, courses, grading, etc.)
    ├── Parent/              # Parent routes (dashboard, child progress, etc.)
    └── ...
```

### Key Architectural Decisions

- **Client-Side Routing**: Uses `react-router-dom` v7 with nested routes and role-based `PrivateRoute` / `PublicRoute` guards.
- **State Management**: React Context API (`GlobalProvider`) for auth, socket, and LTI state; no external state library.
- **API Communication**: Axios instance with automatic request/response encryption and decryption via interceptors (`src/lib/AxiosInstance.jsx`).
- **Form Handling**: React Hook Form with Zod validation and `class-variance-authority` for component variants.
- **Real-Time**: Socket.io client connects on authenticated user mount, managed via context.
- **Rich Text**: Tiptap and Jodit React for content editors.
- **Styling**: Tailwind CSS v4 with `@tailwindcss/vite` and `tailwindcss-animate`.

### Role-Based Access

| Route Prefix | Role | Description |
|---|---|---|
| `/student/*` | Student, TeacherAsStudent | Student portal |
| `/teacher/*` | Teacher | Teacher portal |
| `/parent/*` | Parent | Parent portal |
| `/login`, `/signup` | Unauthenticated | Public only |
| `/lti/select` | LTI Context | LTI deep linking |

## Running the Application

### Development

```bash
npm run dev
```

Starts the Vite dev server on `http://localhost:5173` (or the port configured in `.env`). The Vite `server.proxy` configuration proxies `/api` requests to the backend server, so no CORS issues arise during development.

### Production Build

```bash
npm run build
```

Outputs optimized assets to the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for verification.

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint on the codebase |
| `npm run preview` | Preview the production build locally |

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4, tailwindcss-animate
- **Routing**: React Router DOM v7
- **UI Components**: Radix UI primitives, ShadCN-style component library
- **Form Management**: React Hook Form, Zod, class-variance-authority
- **HTTP Client**: Axios with custom interceptors
- **Real-Time**: Socket.io Client
- **Animations**: GSAP, @gsap/react
- **Rich Text**: Tiptap, Jodit React
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Icons**: Lucide React, React Icons
- **OAuth**: @react-oauth/google (Google), Clever SSO
- **Validation**: Zod
- **Utilities**: lodash, clsx, tailwind-merge, dompurify, crypto-js

## Key Features

### Student Portal (`/student`)
- Dashboard with course overview
- My Courses with chapters, lessons, and pacing charts
- Assessments (assignment submission, resubmission)
- Gradebook and grading scales
- Attendance tracking (daily and monthly views)
- AI Chatbot
- Discussions (course-level)
- Real-time messaging and conversations
- Announcements feed
- Social profile
- Account settings

### Teacher Portal (`/teacher`)
- Dashboard and analytics
- Course creation, editing, and import
- Chapter and lesson management
- Assessment creation, review, and analytics
- Gradebook per course
- Student management (all students, assistance tracking)
- Attendance management
- Login activity charts
- Discussion management
- Meeting scheduling
- Course pacing charts
- Social features
- Account settings

### Parent Portal (`/parent`)
- Child selection and dashboard
- Child gradebook overview
- Course overview and announcements
- Assessment results and review
- Analytics per course
- Support

### Shared Features
- Email and phone OTP verification
- Password reset flow
- Google and Clever SSO
- LTI 1.3 deep linking for external LMS integration
- Real-time notifications and online status
- Activity logging

## Authentication & Auth Providers

The application supports multiple authentication methods:
- **Email/Password** with OTP verification
- **Google OAuth** (`@react-oauth/google`)
- **Clever SSO** (district-level integration)
- **Passwordless login**
- **Parent passwordless login**

Authentication state is managed by `GlobalProvider` and checked via `checkAuth` on app mount. JWT tokens are stored in `localStorage` and `react-cookie` for session persistence.

## Real-time Communication

Socket.io is initialized when a user authenticates. The connection includes the user's ID in the query string for targeted events. The app listens for `getOnlineUsers` to track online status across the platform.
# acewall-school-web-frontend
