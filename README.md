# Financial Tracking System

A comprehensive web application for managing donations, expenses, projects, and donors for non-profit organizations. Built with Next.js (frontend) and Node.js/Express (backend) with PostgreSQL database.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [User Roles & Permissions](#user-roles--permissions)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)

## ✨ Features

### Core Functionality
- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin, Operator, Viewer)
  - Secure password hashing with bcrypt

- **Dashboard & Analytics**
  - Real-time financial overview with key metrics
  - Interactive charts for monthly trends and project funding
  - Visual progress indicators for funding and expenses

- **Project Management**
  - Create and manage multiple projects
  - Track project budgets and expenses
  - Monitor project status (active/inactive)

- **Donor Management**
  - Comprehensive donor database
  - Track pledged vs. received amounts
  - Contact information and donation history

- **Donation Tracking**
  - Record donations with payment modes
  - Link donations to specific projects
  - Track donation dates and amounts

- **Expense Management**
  - Record project-related expenses
  - Categorize expenses by payment mode
  - Track expense dates and descriptions

- **Reporting & Export**
  - PDF report generation for financial summaries
  - Export capabilities for data analysis
  - Comprehensive financial reporting

### Technical Features
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Live data synchronization
- **Data Validation**: Server-side and client-side validation
- **Error Handling**: Comprehensive error management
- **Security**: JWT tokens, input sanitization, CORS protection

## 🛠 Technology Stack

### Frontend
- **Next.js 14** - React framework for production
- **React 18** - UI library
- **Recharts** - Data visualization library
- **jsPDF** - PDF generation for reports

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Development Tools
- **Nodemon** - Development server auto-restart
- **ESLint** - Code linting
- **Git** - Version control

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd webproj
```

### 2. Install Dependencies

#### Frontend Dependencies
```bash
npm install
```

#### Backend Dependencies
```bash
cd backend
npm install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/financial_tracking

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=4000
```

**Security Note**: Never commit the `.env` file to version control. Add it to `.gitignore`.

## 🗄 Database Setup

### 1. Create Database

The setup script will automatically create the database if it doesn't exist. Run:

```bash
cd backend
node setup.js
```

This will:
- Create the `financial_tracking` database
- Run the migration script to create all tables
- Set up the database schema

### 2. Seed Initial Data

After database setup, seed with sample data:

```bash
node seed.js
```

This creates:
- **Admin user**: `admin@uni.edu` / `Admin@123`
- **Operator user**: `operator@uni.edu` / `Op@12345`
- Sample projects and donors

## ▶ Running the Application

### Development Mode

#### Start Backend Server
```bash
cd backend
npm run dev
```
Server will run on `http://localhost:4000`

#### Start Frontend (in new terminal)
```bash
npm run dev
```
Frontend will run on `http://localhost:3000`

### Production Build

#### Build Frontend
```bash
npm run build
npm start
```

#### Start Backend
```bash
cd backend
npm start
```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |

### Protected Endpoints (Require JWT Token)

#### Users Management
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/users` | Get all users | Admin |
| POST | `/api/users` | Create user | Admin |
| PUT | `/api/users/:id` | Update user | Admin |
| DELETE | `/api/users/:id` | Delete user | Admin |

#### Projects Management
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/projects` | Get all projects | All roles |
| POST | `/api/projects` | Create project | Admin |
| PUT | `/api/projects/:id` | Update project | Admin |
| DELETE | `/api/projects/:id` | Delete project | Admin |

#### Donors Management
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/donors` | Get all donors | All roles |
| POST | `/api/donors` | Create donor | Admin, Operator |
| PUT | `/api/donors/:id` | Update donor | Admin, Operator |
| DELETE | `/api/donors/:id` | Delete donor | Admin |

#### Donations Management
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/donations` | Get all donations | All roles |
| POST | `/api/donations` | Create donation | Admin, Operator |
| PUT | `/api/donations/:id` | Update donation | Admin, Operator |
| DELETE | `/api/donations/:id` | Delete donation | Admin, Operator |

#### Expenses Management
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/expenses` | Get all expenses | All roles |
| POST | `/api/expenses` | Create expense | Admin, Operator |
| PUT | `/api/expenses/:id` | Update expense | Admin, Operator |
| DELETE | `/api/expenses/:id` | Delete expense | Admin, Operator |

### API Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": [...],
  "message": "Optional message"
}
```

Error responses:
```json
{
  "error": "Error message",
  "details": "Optional details"
}
```

## 👥 User Roles & Permissions

### Admin
- Full access to all features
- User management (create, update, delete users)
- All CRUD operations on all modules
- System configuration

### Operator
- Read access to all data
- Create, update, delete operations for:
  - Donors
  - Donations
  - Expenses
- Cannot manage users or projects

### Viewer
- Read-only access to all data
- Cannot create, update, or delete any records
- View dashboards and reports

## 📁 Project Structure

```
webproj/
├── src/                          # Frontend (Next.js)
│   ├── components/               # Reusable React components
│   │   ├── Footer.jsx           # Footer component
│   │   ├── Layout.jsx           # Main layout wrapper
│   │   └── UI.jsx               # UI utility components
│   ├── pages/                   # Next.js pages (routes)
│   │   ├── _app.jsx             # App wrapper
│   │   ├── index.jsx            # Home page (redirects to login)
│   │   ├── login.jsx            # Login page
│   │   ├── signup.jsx           # Registration page
│   │   ├── dashboard/           # Dashboard pages
│   │   │   └── index.jsx        # Main dashboard
│   │   ├── donors/              # Donor management
│   │   │   └── index.jsx
│   │   ├── donations/           # Donation management
│   │   │   └── index.jsx
│   │   ├── expenses/            # Expense management
│   │   │   └── index.jsx
│   │   ├── projects/            # Project management
│   │   │   └── index.jsx
│   │   ├── reports/             # Reports and analytics
│   │   │   └── index.jsx
│   │   └── users/               # User management
│   │       └── index.jsx
│   ├── AuthContext.jsx          # Authentication context
│   ├── store.js                 # Global state management
│   ├── data.js                  # Mock data (development)
│   └── index.css                # Global styles
├── backend/                     # Backend (Express.js)
│   ├── middleware/              # Express middleware
│   │   ├── auth.js              # JWT authentication middleware
│   │   └── requireRole.js       # Role-based access control
│   ├── routes/                  # API route handlers
│   │   ├── auth.js              # Authentication routes
│   │   ├── users.js             # User management routes
│   │   ├── projects.js          # Project routes
│   │   ├── donors.js            # Donor routes
│   │   ├── donations.js         # Donation routes
│   │   └── expenses.js          # Expense routes
│   ├── db.js                    # Database connection
│   ├── index.js                 # Main server file
│   ├── setup.js                 # Database setup script
│   ├── seed.js                  # Database seeding script
│   ├── migrate.sql              # Database schema
│   └── package.json             # Backend dependencies
├── package.json                 # Frontend dependencies
├── next.config.js               # Next.js configuration
└── README.md                    # This file
```

## 💻 Development

### Code Style
- Use ESLint for code linting
- Follow React best practices
- Use meaningful variable and function names
- Add comments for complex logic

### Database Schema

The application uses PostgreSQL with the following main tables:

- **users**: User accounts with roles
- **projects**: Project information and budgets
- **donors**: Donor contact and pledge information
- **donations**: Donation records linked to donors and projects
- **expenses**: Expense records linked to projects

### Adding New Features

1. **Frontend**: Create new pages in `src/pages/`
2. **Backend**: Add new routes in `backend/routes/`
3. **Database**: Update `migrate.sql` for schema changes
4. **Authentication**: Use `authenticate` middleware for protected routes

### Testing

Currently, the application doesn't have automated tests. Manual testing is recommended:

1. Test all CRUD operations
2. Test role-based permissions
3. Test authentication flow
4. Test data validation
5. Test responsive design

## 🚀 Deployment

### Environment Variables for Production

```env
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-production-jwt-secret
JWT_EXPIRES_IN=7d
PORT=4000
NODE_ENV=production
```

### Build Process

1. **Build Frontend**:
   ```bash
   npm run build
   ```

2. **Start Production Server**:
   ```bash
   npm start
   ```

3. **Database Migration**:
   ```bash
   cd backend
   node setup.js
   node seed.js
   ```

### Recommended Hosting

- **Frontend**: Vercel, Netlify, or any static hosting
- **Backend**: Heroku, DigitalOcean, AWS, or any Node.js hosting
- **Database**: PostgreSQL hosting (Heroku Postgres, AWS RDS, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify database connection
3. Ensure all dependencies are installed
4. Check environment variables
5. Review API endpoints and authentication

## 🔄 Version History

- **v0.0.1**: Initial release with core financial tracking features
  - User authentication and role management
  - Project, donor, donation, and expense management
  - Dashboard with analytics and charts
  - PDF report generation
