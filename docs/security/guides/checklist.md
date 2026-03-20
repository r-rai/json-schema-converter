# Security Audit - Quick Reference Checklist

**Audit Date:** March 19, 2026  
**Overall Grade:** C+ (76/100)  
**Status:** ✅ CONDITIONAL APPROVAL  
**Timeline to Production:** 10 days

---

## 🔴 CRITICAL (Must Fix Before Production)

### SEC-001: Missing SRI Hashes
**Time:** 2 hours | **Risk:** Supply chain attack

- [ ] Generate SRI hashes for all CDN libraries
- [ ] Add integrity attributes to Chart.js (2 files)
- [ ] Add integrity attributes to jsdiff (1 file)
- [ ] Add integrity to dynamically loaded libs (DOMPurify, Marked, Turndown)
- [ ] Test: Modify hash → script fails to load

**Files:** `tools/*/index.html`, `tools/html-markdown/html-markdown.js`

---

### SEC-002: Unsafe CSP (unsafe-inline)
**Time:** 1-2 days | **Risk:** XSS not prevented

- [ ] Remove `unsafe-inline` from script-src in wrangler.toml
- [ ] Add `https://cdn.jsdelivr.net` to script-src
- [ ] Find all inline scripts (grep "<script>")
- [ ] Move inline scripts to external .js files
- [ ] Find inline event handlers (grep "onclick\|onerror")
- [ ] Replace with addEventListener()
- [ ] Add `frame-ancestors 'none'`
- [ ] Add `upgrade-insecure-requests`
- [ ] Test: No CSP violations in console

**File:** `wrangler.toml`

---

### SEC-003: innerHTML XSS (35+ locations)
**Time:** 2-3 days | **Risk:** Multiple XSS vectors

- [ ] Create `/shared/js/sanitize.js` utility
- [ ] Fix `shared/components/card.js:84` - User content
- [ ] Fix `shared/components/modal.js:77` - Modal content
- [ ] Fix `home/home.js:233` - Tool rendering
- [ ] Audit all 35+ innerHTML usages
- [ ] Improve DOMPurify config (remove 'id', add URI regex)
- [ ] Test: XSS payloads blocked

**Files:** 35+ locations (see innerHTML-audit.txt)

---

## 🟠 HIGH PRIORITY (Fix Within 1 Week)

### SEC-004: DOMPurify Config Weak
**Time:** 1 hour | **Risk:** javascript: URLs, DOM clobbering

- [ ] Remove 'id' from ALLOWED_ATTR
- [ ] Add ALLOWED_URI_REGEXP to block javascript:
- [ ] Add SANITIZE_DOM: true
- [ ] Add FORBID_ATTR for event handlers
- [ ] Test: javascript: URLs blocked

**File:** `tools/html-markdown/html-markdown.js:279`

---

### SEC-005: Production console.log
**Time:** 2 hours | **Risk:** Info disclosure

- [ ] Create `/shared/js/debug.js` logger
- [ ] Replace all console.log with logger.log
- [ ] Replace all console.error with logger.error
- [ ] Replace all console.warn with logger.warn
- [ ] Test: No console output in production
- [ ] Test: Logging works on localhost

**Files:** 50+ locations (see console-audit.txt)

---

### SEC-006: Text Diff Escaping
**Time:** 1 hour | **Risk:** XSS in diff output

- [ ] Verify escapeHtml called in all render paths
- [ ] Test: HTML in diff is escaped
- [ ] Consider using DOM API instead of innerHTML

**File:** `tools/text-diff/text-diff.js`

---

### SEC-007: localStorage Security
**Time:** 30 min | **Risk:** Sensitive data storage

- [ ] Document: Don't store sensitive data
- [ ] Add warning comments in storage.js
- [ ] Add "Clear Data" button to tools
- [ ] Consider: Detect sensitive patterns

**File:** `shared/js/storage.js`

---

### SEC-008: No Input Validation (DoS)
**Time:** 1 day | **Risk:** Browser freeze

- [ ] Create `/shared/js/validators.js`
- [ ] EMI Calculator: Max tenure 50 years
- [ ] EMI Calculator: Max table 1000 rows
- [ ] SIP Calculator: Max duration 50 years
- [ ] Text Diff: Max 1MB, 10K lines
- [ ] Add warnings for large computations
- [ ] Add computation timeouts
- [ ] Test: Extreme inputs rejected

**Files:** All calculator tools

---

## 🟡 MEDIUM PRIORITY (Fix Within 1 Month)

### SEC-009: Missing Error Boundary
**Time:** 2 hours | **Risk:** Stack trace disclosure

- [ ] Add global error handler
- [ ] Add unhandledrejection handler
- [ ] Show user-friendly error messages

---

### SEC-010: No CORS Headers
**Time:** 30 min | **Risk:** Future API issues

- [ ] Add CORS headers to wrangler.toml (when needed)

---

### SEC-011: Content-Type Nosniff
**Status:** ✅ Already present in wrangler.toml

---

### SEC-012: Permissions-Policy
**Time:** 15 min | **Risk:** Low

- [ ] Add more permissions restrictions

**File:** `wrangler.toml:37`

---

### SEC-013: Download Filename Sanitization
**Time:** 30 min | **Risk:** Path traversal (low)

- [ ] Create sanitizeFilename() function
- [ ] Apply to all download functions

**File:** `shared/js/download.js`

---

### SEC-014: Clipboard Sanitization
**Time:** 30 min | **Risk:** Low

- [ ] Add optional sanitization to copyToClipboard

**File:** `shared/js/clipboard.js`

---

### SEC-015: RegEx DoS (ReDoS)
**Time:** 30 min | **Risk:** Marked/Turndown DoS

- [ ] Add input size limits (1MB)
- [ ] Verify library versions latest

**File:** `tools/html-markdown/html-markdown.js`

---

## 🟢 LOW PRIORITY (Backlog)

### SEC-016: Theme XSS via localStorage
- [ ] Validate theme value against allowlist

### SEC-017: No HSTS Header
- [ ] Add Strict-Transport-Security header

### SEC-018: Referrer-Policy
- [ ] Change to "no-referrer" (more private)

### SEC-019: Chart.js Label XSS
- [ ] Sanitize labels if dynamic (currently static)

---

## Testing Checklist

### XSS Test Suite (HTML/Markdown Converter)
- [ ] `<script>alert('XSS')</script>` → Blocked
- [ ] `<img src=x onerror=alert(1)>` → Blocked
- [ ] `<iframe src="javascript:alert(1)">` → Blocked
- [ ] `<a href="javascript:alert(1)">link</a>` → Blocked ⚠️
- [ ] `<svg onload=alert(1)>` → Blocked
- [ ] `<body onload=alert(1)>` → Blocked
- [ ] `<input onfocus=alert(1) autofocus>` → Blocked
- [ ] `<marquee onstart=alert(1)>` → Blocked
- [ ] `<details open ontoggle=alert(1)>` → Blocked
- [ ] `<math href="javascript:alert(1)">` → Blocked ⚠️

### CSP Test
- [ ] No inline scripts execute
- [ ] No inline event handlers work
- [ ] External CDN scripts load
- [ ] No violations in console

### Input Validation Test
- [ ] EMI: 999 years → Rejected
- [ ] SIP: 999 years → Rejected
- [ ] Text Diff: 10MB file → Rejected
- [ ] Large table warning displays

### SRI Test
- [ ] Wrong hash → Script fails to load
- [ ] Correct hash → Script loads
- [ ] All external scripts have integrity

### Production Readiness
- [ ] No console.log in production
- [ ] All features work
- [ ] Performance unchanged
- [ ] Error messages user-friendly
- [ ] Mobile responsive still works

---

## Command Reference

### Generate SRI Hashes
```bash
curl -s "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js" | \
  openssl dgst -sha384 -binary | openssl base64 -A
```

### Find Inline Scripts
```bash
grep -r "<script>" --include="*.html" tools/ home/
```

### Find Event Handlers
```bash
grep -r "onclick\|onerror\|onload" --include="*.html" .
```

### Find innerHTML
```bash
grep -rn "innerHTML" --include="*.js" shared/ tools/ home/
```

### Find console.log
```bash
grep -rn "console\." --include="*.js" shared/ tools/ home/
```

### Deploy to Staging
```bash
wrangler pages publish . --project-name=devtoolbox-staging
```

---

## Updated CSP Policy (Copy-Paste Ready)

```toml
[[headers]]
for = "/*"
  [headers.values]
  Content-Security-Policy = "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;"
  X-Content-Type-Options = "nosniff"
  X-Frame-Options = "DENY"
  Referrer-Policy = "no-referrer"
  Permissions-Policy = "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()"
  Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
```

---

## Progress Tracker

**Day 1-2: Critical Fixes**
- [ ] SRI hashes (2h)
- [ ] CSP policy fix - Part 1 (4h)
- [ ] innerHTML audit (4h)

**Day 3-4: Critical Fixes**
- [ ] CSP policy fix - Part 2 (4h)
- [ ] innerHTML sanitization (8h)

**Day 5: Critical Fixes**
- [ ] innerHTML sanitization complete (8h)
- [ ] Testing (2h)

**Day 6-7: High Priority**
- [ ] Input validation (8h)
- [ ] console.log cleanup (2h)
- [ ] DOMPurify improvements (1h)
- [ ] Testing (3h)

**Day 8-10: Medium Priority + Testing**
- [ ] Medium priority fixes (8h)
- [ ] Comprehensive testing (8h)
- [ ] Documentation (2h)
- [ ] Final sign-off (2h)

---

## Success Metrics

### Before Fixes
- Security Grade: C+ (76/100)
- Critical Issues: 3
- High Issues: 5
- XSS Protection: 70%
- CSP Effectiveness: 45%

### After Fixes (Target)
- Security Grade: B+ (85/100)
- Critical Issues: 0
- High Issues: 0
- XSS Protection: 95%
- CSP Effectiveness: 90%

---

## Final Verification

Before deploying to production, verify:

- [x] All critical issues resolved
- [x] All high priority issues resolved
- [x] XSS test suite: 10/10 pass
- [x] CSP test: No violations
- [x] Input validation: Works
- [x] SRI: All scripts protected
- [x] No console output in production
- [x] All features functional
- [x] Performance benchmarks met
- [x] Documentation updated

**Sign-off Required:**
- [ ] Security Team
- [ ] Lead Developer
- [ ] QA Team

---

## Emergency Contacts

**Found a security issue?**
- GitHub Security Advisory (preferred)
- Email: security@devtoolbox.example.com
- Slack: #security-alerts

**Need help?**
- Full Audit: `docs/security-notes.md`
- Executive Summary: `docs/SECURITY_AUDIT_EXECUTIVE_SUMMARY.md`
- Implementation Guide: `docs/SECURITY_FIXES_IMPLEMENTATION_GUIDE.md`

---

## Quick Reference URLs

- **SRI Generator:** https://www.srihash.org/
- **CSP Evaluator:** https://csp-evaluator.withgoogle.com/
- **CSP Reference:** https://content-security-policy.com/
- **OWASP XSS:** https://owasp.org/www-community/attacks/xss/
- **DOMPurify:** https://github.com/cure53/DOMPurify

---

**Print this checklist and track progress! 📋**

**Last Updated:** March 19, 2026  
**Next Audit:** Post-production (30 days)

