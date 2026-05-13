require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');
const donorRoutes = require('./routes/donors');
const donationRoutes = require('./routes/donations');
const expenseRoutes = require('./routes/expenses');

const app = express();

// Change this line:
app.use(cors({ 
    origin: [
        'http://localhost:3000', 
        'http://127.0.0.1:3000', 
        'https://financial-tracker-donation-manage.vercel.app' // ADD YOUR DEPLOYED URL HERE
    ], 
    credentials: true 
}));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/expenses', expenseRoutes);

app.use((req, res) => res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` }));
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'An unexpected server error occurred.' });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Financial Tracking API running on port ${PORT}`);
    console.log(`   Health Check: /api/health\n`);
});
