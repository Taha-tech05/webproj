const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const authenticate = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

const router = express.Router();
router.use(authenticate);

// ─── GET /api/donors ─────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        // Join with donations to calculate received money dynamically
        const result = await db.query(
            `SELECT d.donor_id as id, d.full_name as name, d.email, d.phone,
       d.total_pledged as pledged, 'active' as status,
       COALESCE(SUM(dn.amount), 0) as received
       FROM donors d
       LEFT JOIN donations dn ON d.donor_id = dn.donor_id
       GROUP BY d.donor_id
       ORDER BY d.created_at DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch donors.' });
    }
});

// Admin-only guard for mutations
router.use(requireRole('Admin'));

// ─── POST /api/donors ────────────────────────────────────────────────────────
router.post(
    '/',
    [
        body('name').notEmpty().withMessage('Full name is required'),
    ],
    async (req, res) => {
        const errs = validationResult(req);
        if (!errs.isEmpty()) return res.status(400).json({ error: errs.array()[0].msg });

        const { name, email, phone, pledged = 0 } = req.body;
        try {
            const result = await db.query(
                'INSERT INTO donors (full_name, email, phone, total_pledged) VALUES ($1, $2, $3, $4) RETURNING donor_id as id, full_name as name, email, phone, total_pledged as pledged, \'active\' as status',
                [name, email, phone, pledged]
            );
            res.status(201).json({ ...result.rows[0], received: 0 });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to create donor.' });
        }
    }
);

// ─── PUT /api/donors/:id ─────────────────────────────────────────────────────
router.put(
    '/:id',
    async (req, res) => {
        const { id } = req.params;
        const { name, email, phone, pledged } = req.body;
        try {
            const result = await db.query(
                'UPDATE donors SET full_name = $1, email = $2, phone = $3, total_pledged = $4 WHERE donor_id = $5 RETURNING donor_id as id, full_name as name, email, phone, total_pledged as pledged',
                [name, email, phone, pledged, id]
            );
            if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
            res.json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to update donor.' });
        }
    }
);

// ─── DELETE /api/donors/:id ──────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM donors WHERE donor_id = $1', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete donor.' });
    }
});

module.exports = router;
