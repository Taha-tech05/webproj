# Financial Tracking System

A modern web application to manage donations, projects, donors, and financial tracking.

## Project Structure

```
project_web/
├── src/
│   ├── components/
│   │   └── Layout.jsx          # Main layout with navigation
│   ├── pages/
│   │   ├── Dashboard.jsx       # Dashboard with charts and stats
│   │   ├── LoginPage.jsx       # Login page
│   │   └── [other pages]       # Placeholder pages
│   ├── App.jsx                 # Main app component
│   ├── AuthContext.jsx         # Authentication context
│   ├── data.js                 # Mock data
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles
├── index.html                  # HTML entry point
├── package.json                # Dependencies
├── vite.config.js              # Vite configuration
└── README.md                   # This file
```

## Files Overview

- **App.jsx** - Main app component that manages routing and authentication
- **AuthContext.jsx** - Handles user login/logout with context API
- **Dashboard.jsx** - Main dashboard with charts using Recharts
- **Layout.jsx** - Navigation bar and layout wrapper
- **LoginPage.jsx** - Login form with demo credentials
- **data.js** - Mock data for donors, projects, donations

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

This installs all required packages:
- React 18.3
- React DOM 18.3
- Recharts (for charts)
- Vite (development server)

### 2. Run Development Server

```bash
npm run dev
```

This starts the Vite development server at `http://localhost:5173`

The app will auto-open in your browser. You can login with:
- **Email**: demo@example.com
- **Password**: password

### 3. Build for Production

```bash
npm run build
```

Creates optimized build in the `dist/` folder.

### 4. Preview Production Build

```bash
npm run preview
```

Preview the built version locally.

## How It Works

1. **Login Page** - User sees LoginPage.jsx unless authenticated
2. **AuthContext** - Manages user state globally
3. **Dashboard** - Main dashboard with statistics and charts
4. **Navigation** - Layout.jsx provides navigation to different pages
5. **Data Flow**:
   - App.jsx checks authentication
   - If authenticated, shows Layout + current page
   - If not, shows LoginPage
   - Navigation changes pages without reloading

## Demo Credentials

- **Email**: demo@example.com
- **Password**: password

## Key Features

- ✅ User authentication
- ✅ Dashboard with charts and statistics
- ✅ Mock data for testing
- ✅ Responsive design
- ✅ Navigation between pages
- ✅ User profile dropdown

## Technologies

- **React** - UI framework
- **Vite** - Build tool & dev server
- **Recharts** - Charts and graphs
- **Context API** - State management
