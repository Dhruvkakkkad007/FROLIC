# Frolic 2025 - Event Management System

A premium technical and cultural symposium platform built with React, Tailwind CSS, Node.js, and MongoDB.

## 🚀 Features

- **Full-Stack Integration**: Connected React frontend with a secure Node.js REST API.
- **Dynamic Dashboard**: Personalized welcome messages and live featured events from the database.
- **Event Management**: Browse, filter (Technical/Non-Technical), and search for events.
- **Role-Based Access**: Specialized views for Students, Mentors, and Administrators.
- **Admin Suite**: Comprehensive forms for managing Institutes, Departments, and Events.
- **Premium UI**: Glassmorphism design, smooth animations, and a responsive mobile-first layout.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React, Axios.
- **Backend**: Node.js, Express 5, Mongoose, JWT (JWT-based cookie auth), Bcrypt.
- **Database**: MongoDB (Local or Atlas).

---

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/try/download/community) (Running locally or a cloud URI)

### 1. Project Setup

Clone the repository and install dependencies for both components.

```bash
# Install Backend dependencies
cd Backend
npm install

# Install Frontend dependencies
cd ../my-react-app
npm install
```

### 2. Configuration

Create a `.env` file in the `Backend` directory (copy from `.env.sample` if available).

```env
MONGO_URL=mongodb://127.0.0.1:27017/frolic
JWT_SECRET=your_jwt_secret_here
PORT=3000
NODE_ENV=development
```

### 3. Running the Application

You need to run the **Backend** and **Frontend** simultaneously.

#### Start the Backend
Open a terminal in the `Backend` folder:
```bash
npm run dev
```
*The server will start at `http://localhost:3000`*

#### Start the Frontend
Open a NEW terminal in the `my-react-app` folder:
```bash
npm run dev
```
*The application will be available at `http://localhost:5173`*

---

## 📂 Project Structure

- `/Backend`: Express server, Mongoose models, and API routes.
- `/my-react-app`: Vite-powered React frontend with Tailwind CSS.
  - `/src/components`: Reusable UI components (Forms, Modals, Navbar).
  - `/src/pages`: Main application views (Dashboard, Events, Login).
  - `/src/services`: API integration services using Axios.
  - `/src/context`: Authentication and global state management.

---

## 🛡️ Authentication

The system uses **JWT stored in HttpOnly Cookies** for secure sessions.
- **Login**: `authService.login(credentials)`
- **Session Check**: `authService.getMe()` (Persists user state across refreshes)
- **Logout**: `authService.logout()` (Clears server-side cookies)

---

## 🎨 Design System

- **Colors**: Dark theme with `#E91E63` (Primary) and `#9C27B0` (Secondary) accents.
- **Aesthetics**: Glass-morphism, backdrop blurs, and premium animations.
- **Responsiveness**: Fully optimized for mobile, tablet, and desktop viewports.
