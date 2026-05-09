-- Financial Tracking System - Database Migration

-- Drop existing if re-running
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS donors CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Create role enum
CREATE TYPE user_role AS ENUM ('Admin', 'Operator', 'Viewer');

-- 1. Users Module
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role DEFAULT 'Operator',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast email lookup (used on every login)
CREATE INDEX idx_users_email ON users(email);

-- 2. Projects Module
CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    project_name VARCHAR(200) NOT NULL,
    description TEXT,
    budget DECIMAL(12, 2) DEFAULT 0.00,
    start_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Donors Module
CREATE TABLE donors (
    donor_id SERIAL PRIMARY KEY,
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(20),
    address TEXT,
    total_pledged DECIMAL(12, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Donations Module (The Income)
CREATE TABLE donations (
    donation_id SERIAL PRIMARY KEY,
    donor_id INT REFERENCES donors(donor_id) ON DELETE CASCADE,
    project_id INT REFERENCES projects(project_id) ON DELETE SET NULL,
    amount DECIMAL(12, 2) CHECK (amount > 0),
    payment_mode VARCHAR(50), -- e.g., Cash, Bank Transfer, Online
    donation_date DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    recorded_by INT REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Expenses Module (The Spending)
CREATE TABLE expenses (
    expense_id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(project_id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount DECIMAL(12, 2) CHECK (amount > 0),
    payment_mode VARCHAR(50),
    expense_date DATE DEFAULT CURRENT_DATE,
    recorded_by INT REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
