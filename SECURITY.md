# Security Policy

## 🛡️ Supported Versions

We actively support the following versions of ABB with security updates:

| Version | Supported          |
| ------- | ------------------ |
| main    | :white_check_mark: |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

## 🔒 Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

**DO NOT** create a public GitHub issue for security vulnerabilities.

Instead, please send an email to [security@laparo.biz](mailto:security@laparo.biz) with:

- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact assessment
- Suggested remediation (if any)

### What to Expect

- **Acknowledgment**: We will acknowledge your report within 48 hours
- **Initial Assessment**: We will provide an initial assessment within 5 business days
- **Updates**: We will keep you informed of our progress
- **Resolution**: We aim to resolve critical vulnerabilities within 30 days

### Vulnerability Disclosure Policy

- We will work with you to understand and resolve the issue quickly
- We will keep your report confidential until a fix is available
- We will credit you in our security advisory (if desired)
- We will coordinate the public disclosure timeline with you

## 🔐 Security Best Practices

This project follows security best practices:

### Authentication & Authorization

- Azure Entra ID (Azure AD) integration
- Secure session management
- Role-based access control

### Data Protection

- Environment variables for sensitive data
- No secrets in source code
- HTTPS enforced in production
- Secure cookie settings

### Infrastructure Security

- Azure Static Web Apps security features
- Content Security Policy (CSP) headers
- HSTS headers
- Secure Azure SQL connections

### Development Security

- Dependency vulnerability scanning
- ESLint security rules
- TypeScript strict mode
- Automated security testing in CI/CD

## 🚨 Known Security Considerations

### Development Environment

- SQLite database used locally (not for production)
- Local `.env` files should never be committed
- Use secure secrets management for production

### Production Environment

- Azure SQL with encrypted connections
- Environment variables via Azure configuration
- Regular dependency updates via Dependabot

## 📋 Security Checklist

For contributors and maintainers:

- [ ] No hardcoded secrets or credentials
- [ ] Environment variables used for configuration
- [ ] Dependencies regularly updated
- [ ] Security headers configured
- [ ] Authentication properly implemented
- [ ] Input validation and sanitization
- [ ] SQL injection prevention (Prisma ORM)
- [ ] XSS prevention (Vue.js built-in protection)

## 🔄 Updates and Patches

- Security updates are released as soon as possible
- Critical vulnerabilities get immediate attention
- Regular dependency updates via automated tools
- Security advisories published for major issues

## 📞 Contact

For security-related questions or concerns:

- Email: [security@laparo.biz](mailto:security@laparo.biz)
- General issues: [GitHub Issues](https://github.com/Laparo/abb/issues)
- Non-security questions: [hello@laparo.biz](mailto:hello@laparo.biz)

---

Thank you for helping keep ABB and our community safe! 🙏
