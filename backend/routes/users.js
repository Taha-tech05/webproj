const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const authenticate = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

// All user-management routes require: authenticated + Admin role
router.use(authenticate, requireRole('Admin'));

// ─── GET /api/users ────────────────────────────────────────────────────────────
// List all users (password_hash excluded)
router.get('/', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id, name, email, role, is_active, created_at FROM users ORDER BY created_at ASC'
        );
        return res.json({ users: result.rows });
    } catch (err) {
        console.error('Get users error:', err.message);
        return res.status(500).json({ error: 'Failed to fetch users.' });
    }
});

// ─── PATCH /api/users/:id/role ─────────────────────────────────────────────────
// Admin changes a user's role
router.patch(
    '/:id/role',
    [body('role').isIn(['Admin', 'Operator']).withMessage('Role must be Admin or Operator')],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

        const { id } = req.params;
        const { role } = req.body;

        // Prevent admin from changing their own role
        if (parseInt(id) === req.user.id) {
            return res.status(400).json({ error: 'You cannot change your own role.' });
        }

        try {
            const result = await db.query(
                'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role, is_active',
                [role, id]
            );
            if (result.rows.length === 0) return res.status(404).json({ error: 'User not found.' });
            return res.json({ user: result.rows[0] });
        } catch (err) {
            console.error('Change role error:', err.message);
            return res.status(500).json({ error: 'Failed to update role.' });
        }
    }
);

// ─── PATCH /api/users/:id/status ──────────────────────────────────────────────
// Admin activates or deactivates a user
router.patch(
    '/:id/status',
    [body('is_active').isBoolean().withMessage('is_active must be true or false')],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

        const { id } = req.params;
        const { is_active } = req.body;

        // Prevent admin from deactivating themselves
        if (parseInt(id) === req.user.id) {
            return res.status(400).json({ error: 'You cannot change your own account status.' });
        }

        try {
            const result = await db.query(
                'UPDATE users SET is_active = $1 WHERE id = $2 RETURNING id, name, email, role, is_active',
                [is_active, id]
            );
            if (result.rows.length === 0) return res.status(404).json({ error: 'User not found.' });
            return res.json({ user: result.rows[0] });
        } catch (err) {
            console.error('Change status error:', err.message);
            return res.status(500).json({ error: 'Failed to update user status.' });
        }
    }
);

module.exports = router;
