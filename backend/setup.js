/**
 * setup.js — Creates the database (if not exists) and runs migrate.sql
 * Usage: node setup.js
 */
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function setup() {
    // Connect to "postgres" default DB to create our DB
    const adminUrl = process.env.DATABASE_URL.replace('/financial_tracking', '/postgres');
    const adminPool = new Pool({ connectionString: adminUrl });

    let dbCreated = false;
    try {
        const check = await adminPool.query("SELECT 1 FROM pg_database WHERE datname = 'financial_tracking'");
        if (check.rows.length === 0) {
            await adminPool.query('CREATE DATABASE financial_tracking');
            console.log('✓ Created database: financial_tracking');
            dbCreated = true;
        } else {
            console.log('✓ Database financial_tracking already exists');
        }
    } finally {
        await adminPool.end();
    }

    // Connect to financial_tracking and run migration
    const appPool = new Pool({ connectionString: process.env.DATABASE_URL });
    try {
        const sql = fs.readFileSync(path.join(__dirname, 'migrate.sql'), 'utf8');
        await appPool.query(sql);
        console.log('✓ Migration applied');
    } finally {
        await appPool.end();
    }

    console.log('\n✅ Database setup complete! Run: node seed.js');
}

setup().catch(err => {
    console.error('Setup failed:', err.message);
    process.exit(1);
});
