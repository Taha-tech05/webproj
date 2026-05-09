const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const authenticate = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

const router = express.Router();
router.use(authenticate);

// ─── GET /api/projects ───────────────────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const result = await db.query(
            `SELECT 
        p.project_id as id, p.project_name as name, p.description, 
        p.budget, p.start_date, (case when p.is_active then 'active' else 'inactive' end) as status,
        COALESCE(SUM(d.amount), 0) as income,
        (SELECT COALESCE(SUM(e.amount), 0) FROM expenses e WHERE e.project_id = p.project_id) as expenses
      FROM projects p
      LEFT JOIN donations d ON p.project_id = d.project_id
      GROUP BY p.project_id
      ORDER BY p.created_at DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch projects.' });
    }
});

// Admin-only guard for mutations
router.use(requireRole('Admin'));

// ─── POST /api/projects ──────────────────────────────────────────────────────
router.post(
    '/',
    [
        body('name').notEmpty().withMessage('Project name is required'),
        body('budget').isNumeric().withMessage('Budget must be a number'),
    ],
    async (req, res) => {
        const errs = validationResult(req);
        if (!errs.isEmpty()) return res.status(400).json({ error: errs.array()[0].msg });

        const { name, description, budget, status = 'active' } = req.body;
        try {
            const result = await db.query(
                'INSERT INTO projects (project_name, description, budget, is_active) VALUES ($1, $2, $3, $4) RETURNING project_id as id, project_name as name, description, budget, (case when is_active then \'active\' else \'inactive\' end) as status',
                [name, description, budget, status === 'active']
            );
            res.status(201).json({ ...result.rows[0], income: 0, expenses: 0 });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to create project.' });
        }
    }
);

// ─── PUT /api/projects/:id ───────────────────────────────────────────────────
router.put(
    '/:id',
    [
        body('name').notEmpty(),
        body('budget').isNumeric(),
    ],
    async (req, res) => {
        const { id } = req.params;
        const { name, description, budget, status } = req.body;
        try {
            const result = await db.query(
                'UPDATE projects SET project_name = $1, description = $2, budget = $3, is_active = $4 WHERE project_id = $5 RETURNING project_id as id, project_name as name, description, budget, (case when is_active then \'active\' else \'inactive\' end) as status',
                [name, description, budget, status === 'active', id]
            );
            if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
            res.json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to update project.' });
        }
    }
);

// ─── DELETE /api/projects/:id ────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM projects WHERE project_id = $1', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete project.' });
    }
});

module.exports = router;
