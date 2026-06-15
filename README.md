# Cybersecurity Internship Project - DevelopersHub Corporation

## Project Overview
This project demonstrates security assessment and hardening of a web application.

## Week 1 - Vulnerability Assessment
- Found XSS vulnerability in search box
- Found SQL Injection in login page
- Identified weak password storage issues

## Week 2 - Security Measures Implemented
- **Validator library** - Input validation (blocks XSS)
- **Bcrypt** - Password hashing (10 rounds)
- **JWT** - Token-based authentication
- **Helmet.js** - Security headers

## Week 3 - Advanced Security
- Nmap penetration testing
- Winston logging to security.log file
- Security checklist created

## Week 4: Security Enhancements

### Features Added
- **Rate Limiting:** 2 attempts per minute on login
- **CORS:** Only http://localhost:3000 allowed
- **API Key Authentication:** Protected /api/protected endpoint
- **CSP (Content Security Policy):** Prevents XSS attacks
- **HSTS:** Enforces HTTPS for 1 year

### Security Headers Active
| Header | Purpose |
|--------|---------|
| Content-Security-Policy | Blocks unauthorized scripts |
| Strict-Transport-Security | Forces HTTPS |
| X-Frame-Options | Prevents clickjacking |


## Week 5: Security Improvements

### SQL Injection Prevention
- Input validation using `validator.isEmail()`
- No direct SQL queries in code
- SQLMap test confirmed: NOT injectable

### CSRF Protection
- Implemented `csurf` middleware
- CSRF token endpoint at `/csrf-token`
- Requests without token get 403 Forbidden

### Files Updated
- `server.js` - Added CSRF protection and SQLi prevention
- `README.md` - Documentation updated

### Security Features Active
- ✅ Rate Limiting (2 attempts/minute)
- ✅ CORS Configuration
- ✅ API Key Authentication
- ✅ CSP & HSTS Headers
- ✅ SQL Injection Prevention
- ✅ CSRF Protection
- ✅ JWT Authentication
- ✅ Password Hashing (bcrypt)
- ✅ Winston Logging
