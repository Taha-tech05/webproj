/**
 * Seed script — run once after migrate.sql to create initial users, donors, and projects.
 * Usage: node seed.js
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./db');

async function seed() {
    console.log('Seeding database...');

    // Create admin
    const adminHash = await bcrypt.hash('Admin@123', 12);
    const adminRes = await db.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING RETURNING user_id',
        ['Admin', 'admin@uni.edu', adminHash, 'Admin']
    );
    console.log('  ✓ Admin user: admin@uni.edu / Admin@123');
    const adminId = adminRes.rows.length > 0 ? adminRes.rows[0].user_id : (await db.query("SELECT user_id FROM users WHERE email='admin@uni.edu'")).rows[0].user_id;

    // Create operator
    const opHash = await bcrypt.hash('Op@12345', 12);
    const opRes = await db.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING RETURNING user_id',
        ['John Operator', 'operator@uni.edu', opHash, 'Operator']
    );
    console.log('  ✓ Operator user: operator@uni.edu / Op@12345');
    const opId = opRes.rows.length > 0 ? opRes.rows[0].user_id : (await db.query("SELECT user_id FROM users WHERE email='operator@uni.edu'")).rows[0].user_id;

    // Create some projects
    await db.query('DELETE FROM projects');
    await db.query('INSERT INTO projects (project_name, description, budget) VALUES ($1, $2, $3)', ['Education', 'Scholarships and supplies', 500000]);
    await db.query('INSERT INTO projects (project_name, description, budget) VALUES ($1, $2, $3)', ['Health', 'Medical camps', 1000000]);

    // Create donors
    await db.query('DELETE FROM donors');
    await db.query('INSERT INTO donors (full_name, email, phone, total_pledged) VALUES ($1, $2, $3, $4)', ['Ahmed Ali', 'ahmed@example.com', '+92 300 1234567', 500000]);
    await db.query('INSERT INTO donors (full_name, email, phone, total_pledged) VALUES ($1, $2, $3, $4)', ['Fatima Khan', 'fatima@example.com', '+92 301 7654321', 750000]);

    console.log('\nDone! You can now start the server with: npm run dev');
    process.exit(0);
}

seed().catch(err => {
    console.error('Seed failed:', err.message);
    process.exit(1);
});
