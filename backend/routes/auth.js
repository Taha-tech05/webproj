const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../db');

const router = express.Router();

// Helper — generate JWT
const signToken = (user) =>
    jwt.sign(
        { id: user.user_id, email: user.email, role: user.role, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

// ─── POST /api/auth/register ─────────────────────────────────────────────────
router.post(
    '/register',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
        body('password')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('role')
            .optional()
            .isIn(['Admin', 'Operator', 'Viewer']).withMessage('Role must be Admin, Operator, or Viewer'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        const { name, email, password, role = 'Operator' } = req.body;

        try {
            // Check if email already exists
            const existing = await db.query('SELECT user_id FROM users WHERE email = $1', [email]);
            if (existing.rows.length > 0) {
                return res.status(409).json({ error: 'An account with this email already exists.' });
            }

            const password_hash = await bcrypt.hash(password, 12);

            const result = await db.query(
                'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING user_id, name, email, role, is_active, created_at',
                [name, email, password_hash, role]
            );

            const user = result.rows[0];
            return res.status(201).json({ message: 'Account created successfully.', user: { id: user.user_id, name: user.name, email: user.email, role: user.role } });
        } catch (err) {
            console.error('Register error:', err.message);
            return res.status(500).json({ error: 'Server error. Please try again.' });
        }
    }
);

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post(
    '/login',
    [
        body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        const { email, password } = req.body;

        try {
            const result = await db.query(
                'SELECT user_id, name, email, password_hash, role, is_active FROM users WHERE email = $1',
                [email]
            );

            if (result.rows.length === 0) {
                return res.status(401).json({ error: 'Invalid email or password.' });
            }

            const user = result.rows[0];

            if (!user.is_active) {
                return res.status(403).json({ error: 'Your account has been deactivated. Contact an Admin.' });
            }

            const passwordMatch = await bcrypt.compare(password, user.password_hash);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid email or password.' });
            }

            const token = signToken(user);
            const safeUser = { id: user.user_id, name: user.name, email: user.email, role: user.role };

            return res.json({ token, user: safeUser });
        } catch (err) {
            console.error('Login error:', err.message);
            return res.status(500).json({ error: 'Server error. Please try again.' });
        }
    }
);

router.post('/logout', (req, res) => {
    return res.json({ message: 'Logged out successfully.' });
});

module.exports = router;
