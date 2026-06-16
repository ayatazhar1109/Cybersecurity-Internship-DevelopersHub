const express = require('express');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const winston = require('winston');
const { loginLimiter } = require('./rateLimiter');
const cors = require('cors');
const csrf = require('@dr.pogodin/csurf');
const cookieParser = require('cookie-parser');

// Setup logging
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'security.log' })
    ]
});

logger.info('Application started');

const app = express();

// Security Headers (CSP + HSTS)
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

// CSRF Protection
app.use(cookieParser());
app.use(csrf({ cookie: true }));

// CSRF token endpoint
app.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
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

// Homepage route
app.get('/', (req, res) => {
    res.send('✅ Secure Server is Running!');
});

// Fake database
const users = [];

// SIGNUP with SQLi prevention (input validation)
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    
    // SQLi Prevention - Input validation
    if (!validator.isEmail(email)) {
        logger.warn(`Signup failed - invalid email: ${email}`);
        return res.status(400).json({ error: 'Invalid email format' });
    }
    
    if (!password || password.length < 8) {
        logger.warn(`Signup failed - weak password for: ${email}`);
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    
    const userExists = users.find(u => u.email === email);
    if (userExists) {
        logger.warn(`Signup failed - user already exists: ${email}`);
        return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    users.push({
        email: email,
        password: hashedPassword
    });
    
    logger.info(`New user signed up: ${email}`);
    res.json({ message: 'Signup successful! Password hashed.' });
});

// LOGIN with rate limiting
app.post('/login', loginLimiter, async (req, res) => {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email);
    if (!user) {
        logger.warn(`Failed login attempt - user not found: ${email}`);
        return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        logger.warn(`Failed login attempt - wrong password for: ${email}`);
        return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
        { email: email },
        'my-secret-key',
        { expiresIn: '1h' }
    );
    
    logger.info(`User logged in: ${email}`);
    res.json({ 
        message: 'Login successful!',
        token: token 
    });
});

// PROTECTED PROFILE (requires JWT token)
app.get('/profile', (req, res) => {
    const token = req.headers['authorization'];
    
    if (!token) {
        logger.warn('Profile access denied - no token provided');
        return res.status(401).json({ error: 'No token provided' });
    }
    
    try {
        const verified = jwt.verify(token, 'my-secret-key');
        logger.info(`Profile accessed by: ${verified.email}`);
        res.json({ message: `Welcome ${verified.email}! This is your profile.` });
    } catch(err) {
        logger.warn('Profile access denied - invalid token');
        res.status(401).json({ error: 'Invalid token' });
    }
});

// START SERVER
app.listen(3000, () => {
    console.log('🔒 Secure server running on http://localhost:3000');
    console.log('✅ SQLi Prevention | CSRF Protection | Rate Limiting | API Keys | CSP | HSTS');
    logger.info('Server started on port 3000');
}); 