const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const authenticate = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

const router = express.Router();
router.use(authenticate);

// ─── GET /api/expenses ───────────────────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const result = await db.query(`
      SELECT 
        e.expense_id as id,
        e.project_id as "projectId",
        p.project_name as project,
        TO_CHAR(e.expense_date, 'YYYY-MM-DD') as date,
        e.description,
        e.amount,
        e.payment_mode as "paymentMode",
        u.name as "enteredBy"
      FROM expenses e
      LEFT JOIN projects p ON e.project_id = p.project_id
      LEFT JOIN users u ON e.recorded_by = u.user_id
      ORDER BY e.created_at DESC
    `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch expenses.' });
    }
});

// ─── POST /api/expenses ──────────────────────────────────────────────────────
router.post(
    '/',
    [
        body('projectId').notEmpty(),
        body('amount').isNumeric(),
        body('description').notEmpty(),
    ],
    async (req, res) => {
        const errs = validationResult(req);
        if (!errs.isEmpty()) return res.status(400).json({ error: errs.array()[0].msg });

        const { projectId, amount, description, paymentMode, date } = req.body;
        try {
            const q = await db.query(
                'INSERT INTO expenses (project_id, amount, description, payment_mode, expense_date, recorded_by) VALUES ($1, $2, $3, $4, COALESCE($5::date, CURRENT_DATE), $6) RETURNING expense_id as id',
                [projectId, amount, description, paymentMode, date || null, req.user.id]
            );
            res.status(201).json({ id: q.rows[0].id });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to record expense.' });
        }
    }
);

// ─── DELETE /api/expenses/:id ──────────────────────────────────────────────
router.delete('/:id', requireRole('Admin'), async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM expenses WHERE expense_id = $1', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete expense.' });
    }
});

module.exports = router;
