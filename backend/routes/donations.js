const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const authenticate = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

const router = express.Router();
router.use(authenticate);

// ─── GET /api/donations ──────────────────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        // Both Operators and Admins can view
        const result = await db.query(`
      SELECT 
        dn.donation_id as id, 
        dn.donor_id as "donorId", d.full_name as donor,
        dn.project_id as "projectId", p.project_name as project,
        TO_CHAR(dn.donation_date, 'YYYY-MM-DD') as date,
        TRIM(TO_CHAR(dn.donation_date, 'Month')) as month,
        dn.amount, dn.payment_mode as "paymentMode", 'paid' as status,
        dn.notes,
        u.name as "enteredBy"
      FROM donations dn
      LEFT JOIN donors d ON dn.donor_id = d.donor_id
      LEFT JOIN projects p ON dn.project_id = p.project_id
      LEFT JOIN users u ON dn.recorded_by = u.user_id
      ORDER BY dn.created_at DESC
    `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch donations.' });
    }
});

// ─── POST /api/donations ─────────────────────────────────────────────────────
router.post(
    '/',
    [
        body('donorId').notEmpty(),
        body('projectId').notEmpty(),
        body('amount').isNumeric(),
    ],
    async (req, res) => {
        const errs = validationResult(req);
        if (!errs.isEmpty()) return res.status(400).json({ error: errs.array()[0].msg });

        const { donorId, projectId, amount, paymentMode, date, notes } = req.body;
        try {
            const q = await db.query(
                'INSERT INTO donations (donor_id, project_id, amount, payment_mode, donation_date, notes, recorded_by) VALUES ($1, $2, $3, $4, COALESCE($5::date, CURRENT_DATE), $6, $7) RETURNING donation_id as id',
                [donorId, projectId, amount, paymentMode, date || null, notes, req.user.id]
            );
            // We return the id but the frontend will just refetch or rely on store integration
            res.status(201).json({ id: q.rows[0].id });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to record donation.' });
        }
    }
);

// Admins only past here
router.use(requireRole('Admin'));

// ─── DELETE /api/donations/:id ──────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM donations WHERE donation_id = $1', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete donation.' });
    }
});

module.exports = router;
