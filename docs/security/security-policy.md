# Security Policy

## 🛡️ Security Overview

DevToolbox is designed with security as a core principle. All tools run entirely in the browser with **zero backend dependencies**, ensuring your data never leaves your device.

## 🔒 Security Features

### 1. Client-Side Processing Only
- **Zero Data Transmission**: All calculations, conversions, and processing happen locally in your browser
- **No Analytics**: No tracking scripts, no third-party analytics  
- **Privacy First**: Your data is never sent to any server

### 2. Content Security Policy (CSP)
We enforce a strict Content Security Policy to prevent XSS and injection attacks:

```
Content-Security-Policy: 
  default-src 'self';
  script-src 'unsafe-inline';
  style-src 'unsafe-inline';
  img-src 'self' data:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
```

**Protection Against:**
- Cross-Site Scripting (XSS)
- Code injection attacks
- Clickjacking
- Data exfiltration

### 3. Input Validation Framework
All user inputs are validated using our comprehensive validation framework:

- **Numeric Validation**: Range checks, type validation, overflow protection
- **String Validation**: Length limits, safe string checks, XSS pattern detection
- **File Validation**: Type whitelisting, size limits (5MB max)
- **Real-time Feedback**: Immediate validation errors with clear messages

**Implementation**: `/shared/js/validator.js`

### 4. Data Encryption at Rest
Sensitive user preferences and session data are encrypted using AES-GCM-256:

- **Algorithm**: AES-GCM with 256-bit keys
- **Key Derivation**: PBKDF2 with 100,000 iterations (OWASP recommended)
- **Session-Based Keys**: Unique encryption keys per browser session
- **Web Crypto API**: Native browser cryptography (no third-party libraries)

**Implementation**: `/shared/js/crypto.js`, `/shared/js/secure-storage.js`

### 5. HTTPS Enforcement
- **Server-Level**: Cloudflare Pages enforces HTTPS for all production deployments
- **CSP Directive**: `upgrade-insecure-requests` automatically upgrades HTTP to HTTPS
- **Client-Side Check**: JavaScript enforcement for non-localhost environments
- **HSTS**: Strict-Transport-Security header with 1-year max-age

**Implementation**: `/shared/js/https-check.js`, `wrangler.toml`

### 6. Subresource Integrity (SRI)
All third-party libraries are:
- **Self-Hosted**: No CDN dependencies (zero external requests)
- **SRI Protected**: Cryptographic hashes verify library integrity
- **Version Locked**: Specific versions, no auto-updates

**Libraries with SRI**:
- Chart.js (201 KB)
- jsdiff (18 KB)
- marked (36 KB)
- DOMPurify (21 KB)
- Turndown (11 KB)

### 7. Security Headers
Additional HTTP security headers via Cloudflare Pages `_headers`:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### 8. Sanitization
- **HTML Sanitization**: DOMPurify sanitizes all user-generated HTML before rendering
- **Output Encoding**: Proper escaping for all dynamic content
- **DOM Manipulation**: Uses safe APIs to prevent injection

## 🎯 Threat Model

### Protected Against

| Threat | Mitigation |
|--------|------------|
| **XSS (Cross-Site Scripting)** | CSP, input validation, DOMPurify sanitization |
| **SQL Injection** | N/A - No database (client-side only) |
| **CSRF (Cross-Site Request Forgery)** | N/A - No server endpoints |
| **Clickjacking** | `X-Frame-Options: DENY` header |
| **Man-in-the-Middle** | HTTPS enforcement, HSTS |
| **Data Exfiltration** | No external requests, CSP blocks unauthorized origins |
| **Malicious File Upload** | Type whitelist, size limits, no server storage |
| **Session Hijacking** | Session-based encryption keys, httpOnly cookies (where applicable) |
| **Code Injection** | CSP, input validation, safe DOM APIs |

### Out of Scope

- **Physical Device Access**: Users are responsible for device security
- **Browser Exploitation**: We rely on modern browser security features
- **Social Engineering**: Users should verify they're on the correct domain
- **Supply Chain Attacks**: SRI protects against CDN compromises, but users should verify deployment integrity

## 📋 Best Practices for Users

1. ✅ **Verify URL**: Ensure you're on the official domain
2. ✅ **Use Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
3. ✅ **Keep Browser Updated**: Security patches are critical
4. ✅ **Enable JavaScript**: Required for client-side processing
5. ✅ **Review Permissions**: We never request camera, microphone, or location
6. ✅ **Use HTTPS**: If redirected to HTTP, close the tab immediately

## 🐛 Reporting Security Vulnerabilities

We take security seriously. If you discover a vulnerability:

### Contact Information
- **Email**: security@devtoolbox.example.com (use PGP key below)
- **GitHub**: Open a private security advisory at `/security/advisories/new`
- **Response Time**: Within 48 hours for critical issues, 7 days for others

### Reporting Guidelines
Please include:
1. **Description**: Clear explanation of the vulnerability
2. **Impact**: Potential security impact (XSS, data leak, etc.)
3. **Steps to Reproduce**: Detailed reproduction steps
4. **Proof of Concept**: Example payload or demo (if applicable)
5. **Environment**: Browser, version, OS
6. **Suggested Fix**: If you have one (optional)

### What NOT to Report
- Issues in outdated browsers (see supported versions below)
- Theoretical attacks without proof of concept
- Social engineering or phishing vectors
- Issues requiring physical device access

### Disclosure Policy
- **Coordinated Disclosure**: We prefer 90-day disclosure window
- **Credit**: Security researchers will be credited in release notes (if desired)
- **No Bounty Program**: This is an open-source project without funding

## 🔐 PGP Public Key
```
-----BEGIN PGP PUBLIC KEY BLOCK-----
[Key would be added for production use]
-----END PGP PUBLIC KEY BLOCK-----
```

## 🌐 Supported Browsers & Versions

We support browsers with modern security features:

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 90+ | Full support |
| Firefox | 88+ | Full support |
| Safari | 14+ | Full support |
| Edge | 90+ | Full support |
| Opera | 76+ | Full support |

**Required Browser Features:**
- Web Crypto API (for encryption)
- ES6 Modules (for code organization)
- localStorage/sessionStorage (for offline storage)
- Fetch API (for future enhancements)

## 📊 Security Audit History

| Date | Audit Type | Findings | Status |
|------|-----------|----------|--------|
| 2026-03-19 | Architecture Review | 15 observations | ✅ Resolved |
| 2026-03-19 | Security Audit | 8 critical items | ✅ Resolved |
| - | External Audit | N/A | Planned |

## 🔧 Development Security Guidelines

For contributors:

1. **Never log sensitive data** (passwords, encryption keys, personal info)
2. **Validate all inputs** using the Validator framework
3. **Sanitize HTML** using DOMPurify before rendering
4. **Use prepared statements** if backend is ever added (currently N/A)
5. **Follow CSP** - no inline scripts in production
6. **Test with CSP enabled** during development
7. **Review dependencies** for known vulnerabilities
8. **Use SRI hashes** for all external resources

## 📚 Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web Crypto API Spec](https://www.w3.org/TR/WebCryptoAPI/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)

## 📃 License & Liability

This software is provided "AS IS" under the MIT License. See [LICENSE](LICENSE) for details.

**No Warranty**: While we implement security best practices, we provide no warranties regarding security or data protection.

---

**Last Updated**: 2026-03-19  
**Version**: 1.0.0  
**Next Review**: 2026-06-19 (Quarterly)
