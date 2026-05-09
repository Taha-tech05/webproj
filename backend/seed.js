/**
 * Seed script — run once after migrate.sql to create the initial admin user.
 * Usage: node seed.js
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./db');

async function seed() {
    console.log('Seeding database...');

    // Create admin
    const adminHash = await bcrypt.hash('Admin@123', 12);
    await db.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
        ['Admin', 'admin@uni.edu', adminHash, 'Admin']
    );
    console.log('  ✓ Admin user: admin@uni.edu / Admin@123');

    // Create a sample operator
    const opHash = await bcrypt.hash('Op@12345', 12);
    await db.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
        ['John Operator', 'operator@uni.edu', opHash, 'Operator']
    );
    console.log('  ✓ Operator user: operator@uni.edu / Op@12345');

    console.log('\nDone! You can now start the server with: npm run dev');
    process.exit(0);
}

seed().catch(err => {
    console.error('Seed failed:', err.message);
    process.exit(1);
});
