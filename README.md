# Cybersecurity Internship Project - DevelopersHub Corporation

## Project Overview
This project demonstrates security assessment and hardening of a web application.

## Week 1 - Vulnerability Assessment
- Found XSS vulnerability in search box
- Found SQL Injection in login page
- Identified weak password storage issues

## Week 2 - Security Measures Implemented
- **Validator library** | Input validation (blocks XSS)
- **Bcrypt** | Password hashing (10 rounds)
- **JWT** | Token-based authentication
- **Helmet.js** - Security headers

## Week 3 - Advanced Security
- Nmap penetration testing
- Winston logging to security.log file
- Security checklist created

### Week 4: Advanced Threat Detection
- Rate Limiting (express-rate-limit) | prevents brute force attacks
- CORS Configuration | restricts unauthorized access
- API Key Authentication | secures API endpoints
- CSP Headers | prevents XSS attacks
- HSTS Headers | enforces HTTPS

### Week 5: Ethical Hacking & Exploiting Vulnerabilities
- Kali Linux Reconnaissance (Nmap, WhatWeb)
- SQL Injection Testing (SQLMap) | confirmed NOT injectable
- CSRF Protection (csurf middleware)
- OWASP ZAP CSRF testing | 403 Forbidden

### Week 6: Advanced Security Audits & Final Deployment
- OWASP ZAP Scan | 0 high/critical vulnerabilities
- Nikto Scan | no dangerous findings
- Lynis Audit | hardening score: 64/100
- Metasploitable Penetration Testing
- OWASP Top 10 Compliance
