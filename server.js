const express = require('express');
const { loginLimiter } = require('./rateLimiter');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Security Headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"]
        }
    },
    hsts: { maxAge: 31536000, includeSubDomains: true }
}));

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

// HOMEPAGE ROUTE
app.get('/', (req, res) => {
    res.send('✅ Secure Server is Running!');
});

// API Key middleware
const VALID_API_KEY = 'my-secure-key-2026';

function apiKeyAuth(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== VALID_API_KEY) {
        return res.status(401).json({ error: 'Invalid or missing API key' });
    }
    next();
}

app.get('/api/protected', apiKeyAuth, (req, res) => {
    res.json({ message: 'Access granted! Valid API key provided.' });
});

// Fake database
const users = [];

app.post('/signup', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }
    if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'User already exists' });
    }
    users.push({ email, password });
    res.json({ message: 'Signup successful!' });
});

app.post('/login', loginLimiter, (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.json({ message: 'Login successful!' });
});

app.listen(3000, () => {
    console.log('🔒 Secure server running on http://localhost:3000');
});