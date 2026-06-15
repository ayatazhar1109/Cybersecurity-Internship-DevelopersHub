const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 60 * 1000,  // 1 minute
    max: 2,               // 2 attempts only
    message: { error: 'Too many login attempts. Try again after 1 minute.' }
});

module.exports = { loginLimiter };