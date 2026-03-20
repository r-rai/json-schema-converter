# Sprint 1 Implementation Tickets
## Security-Critical Foundations (Days 1-2)

**Sprint Goal:** Eliminate immediate security vulnerabilities in external dependency management  
**Duration:** 2 days  
**Team:** Developer + Test Specialist  
**Tech Lead Review:** Required after each ticket

---

## TICKET-CRIT-1: Add SRI Hashes to All CDN Libraries

### Priority: 🔴 CRITICAL
**Effort:** 2 hours  
**Assigned To:** Developer  
**Reviewer:** Tech Lead  
**Tester:** Test Specialist

---

### Problem Statement

Current CDN library references lack Subresource Integrity (SRI) hashes, making the application vulnerable to supply chain attacks. If a CDN is compromised, malicious code could be injected into the application.

**Security Risk:** CRITICAL  
**Attack Vector:** Compromised CDN serving malicious JavaScript  
**Impact:** Complete application compromise, user data theft

---

### Technical Background

**What is SRI?**
Subresource Integrity is a security feature that enables browsers to verify that files fetched from CDNs haven't been tampered with.

**How it works:**
```html
<script 
  src="https://cdn.example.com/library.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
  crossorigin="anonymous">
</script>
```

Browser computes hash of downloaded file and compares with `integrity` attribute. If mismatch, script is blocked.

---

### Current State Analysis

**CDN Libraries Found:**

1. **DOMPurify** (HTML sanitizer)
   - Used in: `tools/html-markdown/html-markdown.js`
   - URL: `https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js`
   - Version: 3.0.6
   - Status: ❌ No SRI hash

2. **Chart.js** (Charting library)
   - Used in: `tools/sip-calculator/sip-calculator.js`, `tools/emi-calculator/emi-calculator.js`
   - URL: `https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js`
   - Version: 4.4.0
   - Status: ❌ No SRI hash

3. **Diff** (Text diffing)
   - Used in: `tools/text-diff/text-diff.js`
   - URL: `https://cdn.jsdelivr.net/npm/diff@5.1.0/dist/diff.min.js`
   - Version: 5.1.0
   - Status: ❌ No SRI hash

4. **Turndown** (HTML to Markdown)
   - Used in: `tools/html-markdown/html-markdown.js`
   - URL: `https://cdn.jsdelivr.net/npm/turndown@7.1.2/dist/turndown.js`
   - Version: 7.1.2
   - Status: ❌ No SRI hash

5. **Marked** (Markdown to HTML)
   - Used in: `tools/html-markdown/html-markdown.js`
   - URL: `https://cdn.jsdelivr.net/npm/marked@9.1.6/lib/marked.umd.min.js`
   - Version: 9.1.6
   - Status: ❌ No SRI hash

---

### Implementation Steps

#### Step 1: Download Libraries Locally

```bash
# Create lib directory if it doesn't exist
mkdir -p lib

# Download all libraries
cd lib

# DOMPurify 3.0.6
curl -o dompurify.min.js https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js

# Chart.js 4.4.0
curl -o chart.umd.min.js https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js

# Diff 5.1.0
curl -o diff.min.js https://cdn.jsdelivr.net/npm/diff@5.1.0/dist/diff.min.js

# Turndown 7.1.2
curl -o turndown.js https://cdn.jsdelivr.net/npm/turndown@7.1.2/dist/turndown.js

# Marked 9.1.6
curl -o marked.umd.min.js https://cdn.jsdelivr.net/npm/marked@9.1.6/lib/marked.umd.min.js
```

#### Step 2: Generate SRI Hashes

```bash
# Generate SRI hashes for all libraries
cd lib

# DOMPurify
openssl dgst -sha384 -binary dompurify.min.js | openssl base64 -A > dompurify.sri

# Chart.js
openssl dgst -sha384 -binary chart.umd.min.js | openssl base64 -A > chart.sri

# Diff
openssl dgst -sha384 -binary diff.min.js | openssl base64 -A > diff.sri

# Turndown
openssl dgst -sha384 -binary turndown.js | openssl base64 -A > turndown.sri

# Marked
openssl dgst -sha384 -binary marked.umd.min.js | openssl base64 -A > marked.sri

# Display all hashes
echo "=== SRI Hashes ==="
echo "DOMPurify: sha384-$(cat dompurify.sri)"
echo "Chart.js: sha384-$(cat chart.sri)"
echo "Diff: sha384-$(cat diff.sri)"
echo "Turndown: sha384-$(cat turndown.sri)"
echo "Marked: sha384-$(cat marked.sri)"
```

**Alternative: Use online SRI generator**
- Visit: https://www.srihash.org/
- Enter CDN URL
- Copy generated integrity hash

#### Step 3: Update Script Tags in Tool Files

**File: `tools/html-markdown/html-markdown.js`**

Find this code:
```javascript
// Load DOMPurify
const script1 = document.createElement('script');
script1.src = 'https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js';
document.head.appendChild(script1);

// Load Turndown
const script2 = document.createElement('script');
script2.src = 'https://cdn.jsdelivr.net/npm/turndown@7.1.2/dist/turndown.js';
document.head.appendChild(script2);

// Load Marked
const script3 = document.createElement('script');
script3.src = 'https://cdn.jsdelivr.net/npm/marked@9.1.6/lib/marked.umd.min.js';
document.head.appendChild(script3);
```

Replace with:
```javascript
// Load DOMPurify with SRI
const script1 = document.createElement('script');
script1.src = 'https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js';
script1.integrity = 'sha384-[HASH_FROM_STEP_2]';
script1.crossOrigin = 'anonymous';
document.head.appendChild(script1);

// Load Turndown with SRI
const script2 = document.createElement('script');
script2.src = 'https://cdn.jsdelivr.net/npm/turndown@7.1.2/dist/turndown.js';
script2.integrity = 'sha384-[HASH_FROM_STEP_2]';
script2.crossOrigin = 'anonymous';
document.head.appendChild(script2);

// Load Marked with SRI
const script3 = document.createElement('script');
script3.src = 'https://cdn.jsdelivr.net/npm/marked@9.1.6/lib/marked.umd.min.js';
script3.integrity = 'sha384-[HASH_FROM_STEP_2]';
script3.crossOrigin = 'anonymous';
document.head.appendChild(script3);
```

**File: `tools/sip-calculator/sip-calculator.js`**

Find:
```javascript
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
document.head.appendChild(script);
```

Replace with:
```javascript
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
script.integrity = 'sha384-[HASH_FROM_STEP_2]';
script.crossOrigin = 'anonymous';
document.head.appendChild(script);
```

**File: `tools/emi-calculator/emi-calculator.js`**
- Same fix as SIP calculator

**File: `tools/text-diff/text-diff.js`**

Find:
```javascript
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/diff@5.1.0/dist/diff.min.js';
document.head.appendChild(script);
```

Replace with:
```javascript
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/diff@5.1.0/dist/diff.min.js';
script.integrity = 'sha384-[HASH_FROM_STEP_2]';
script.crossOrigin = 'anonymous';
document.head.appendChild(script);
```

#### Step 4: Create SRI Documentation

**File: `lib/README.md`**
```markdown
# External Libraries with SRI Hashes

This folder contains third-party libraries loaded from CDN with Subresource Integrity verification.

## Libraries

### DOMPurify 3.0.6
- **Purpose:** HTML sanitization
- **URL:** https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js
- **Integrity:** sha384-[HASH]
- **Used By:** HTML-Markdown converter

### Chart.js 4.4.0
- **Purpose:** Chart rendering
- **URL:** https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js
- **Integrity:** sha384-[HASH]
- **Used By:** SIP Calculator, EMI Calculator

### Diff 5.1.0
- **Purpose:** Text diffing
- **URL:** https://cdn.jsdelivr.net/npm/diff@5.1.0/dist/diff.min.js
- **Integrity:** sha384-[HASH]
- **Used By:** Text Diff Tool

### Turndown 7.1.2
- **Purpose:** HTML to Markdown conversion
- **URL:** https://cdn.jsdelivr.net/npm/turndown@7.1.2/dist/turndown.js
- **Integrity:** sha384-[HASH]
- **Used By:** HTML-Markdown converter

### Marked 9.1.6
- **Purpose:** Markdown to HTML conversion
- **URL:** https://cdn.jsdelivr.net/npm/marked@9.1.6/lib/marked.umd.min.js
- **Integrity:** sha384-[HASH]
- **Used By:** HTML-Markdown converter

## Updating Libraries

When updating a library:
1. Download new version to this folder
2. Generate new SRI hash: `openssl dgst -sha384 -binary file.js | openssl base64 -A`
3. Update integrity attribute in tool JavaScript
4. Update this README
5. Test thoroughly before deploying
```

---

### Acceptance Criteria

- [ ] All 5 CDN library references have `integrity` attribute
- [ ] All 5 CDN library references have `crossorigin="anonymous"` attribute
- [ ] SRI hashes are correct (browser loads libraries successfully)
- [ ] `lib/README.md` created with SRI documentation
- [ ] No console errors related to SRI verification
- [ ] All tools still function correctly
- [ ] Code reviewed by Tech Lead
- [ ] Validated by Test Specialist

---

### Testing Instructions

**Manual Testing:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Navigate to each tool:
   - HTML-Markdown Converter
   - SIP Calculator
   - EMI Calculator
   - Text Diff
4. Verify no SRI-related errors
5. Test tool functionality

**Expected Console Output:**
- No errors related to integrity validation
- Libraries load successfully
- Tools function normally

**Error Scenario Testing:**
1. Intentionally corrupt SRI hash (change one character)
2. Load page
3. Verify browser blocks the script
4. Verify console shows error: "Failed to find a valid digest in the 'integrity' attribute"
5. Revert to correct hash
6. Verify page loads normally

---

### Security Validation

Before marking complete, verify:
- [ ] All script tags loading external resources have SRI
- [ ] SRI hashes match file contents (browser verification passes)
- [ ] crossorigin attribute present on all external scripts
- [ ] No external scripts loaded without SRI protection

---

### Dependencies

**Prerequisites:**
- OpenSSL installed (for hash generation)
- Curl or wget (for downloading libraries)
- Write access to /lib/ folder

**Blocks:**
- TICKET-CRIT-5 (will replace CDN with local files)

**Blocked By:** None (can start immediately)

---

### Rollback Plan

If SRI causes issues:
1. Remove integrity and crossorigin attributes
2. Revert to original CDN loading code
3. Document the issue
4. Investigate and fix
5. Re-apply SRI with corrections

---

### Additional Notes

**Why SHA-384 instead of SHA-256?**
- SHA-384 provides stronger security than SHA-256
- Industry standard for SRI
- Minimal performance impact

**Why crossorigin="anonymous"?**
- Required for CORS when using integrity attribute
- Allows browser to verify resource without sending credentials
- Standard security practice

**Version Pinning:**
- Always use specific versions in CDN URLs (not "latest")
- Document version in comments
- Update intentionally, not automatically

---

## TICKET-CRIT-5: Move Libraries to Local /lib/ Folder

### Priority: 🔴 CRITICAL
**Effort:** 4 hours  
**Assigned To:** Developer  
**Reviewer:** Tech Lead  
**Tester:** Test Specialist

---

### Problem Statement

Current architecture loads all external libraries from CDN, violating the "zero infrastructure dependency" principle. If CDN goes down or is blocked, the entire application becomes non-functional.

**Architecture Risk:** CRITICAL  
**Issue:** External dependency on CDN availability  
**Impact:** Complete application failure if CDN unavailable

---

### Technical Background

**Architecture Requirement:**
> All external libraries must be hosted locally in /lib/ folder to ensure application works without external dependencies.

**Benefits of Local Hosting:**
1. **Zero External Dependencies** - App works offline
2. **Faster Load Times** - No CDN latency
3. **Cache Control** - Service workers can cache libraries
4. **No Third-Party Tracking** - Privacy improvement
5. **Predictable Performance** - No CDN rate limiting

---

### Current State

```
Current Structure:
/lib/                        ← EMPTY FOLDER ❌

Libraries loaded from CDN:
- DOMPurify 3.0.6
- Chart.js 4.4.0
- Diff 5.1.0
- Turndown 7.1.2
- Marked 9.1.6
```

**Target Structure:**
```
/lib/
├── README.md               ← Library documentation
├── dompurify.min.js        ← 19KB
├── chart.umd.min.js        ← 50KB
├── diff.min.js             ← 11KB
├── turndown.js             ← 9KB
└── marked.umd.min.js       ← 12KB
Total: ~101KB (acceptable for first load)
```

---

### Implementation Steps

#### Step 1: Download All Libraries

```bash
# Navigate to lib folder
cd /home/ravi/projects/json-schema-converter/lib

# Download DOMPurify 3.0.6
curl -o dompurify.min.js \
  https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js

# Download Chart.js 4.4.0
curl -o chart.umd.min.js \
  https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js

# Download Diff 5.1.0
curl -o diff.min.js \
  https://cdn.jsdelivr.net/npm/diff@5.1.0/dist/diff.min.js

# Download Turndown 7.1.2
curl -o turndown.js \
  https://cdn.jsdelivr.net/npm/turndown@7.1.2/dist/turndown.js

# Download Marked 9.1.6
curl -o marked.umd.min.js \
  https://cdn.jsdelivr.net/npm/marked@9.1.6/lib/marked.umd.min.js

# Verify downloads
ls -lh
# Should show all 5 files with reasonable sizes
```

#### Step 2: Update HTML-Markdown Tool

**File: `tools/html-markdown/html-markdown.js`**

**Current Code:**
```javascript
// Load external libraries
loadLibraries() {
  // Load DOMPurify
  const script1 = document.createElement('script');
  script1.src = 'https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js';
  script1.integrity = 'sha384-[HASH]';
  script1.crossOrigin = 'anonymous';
  document.head.appendChild(script1);

  // Load Turndown
  const script2 = document.createElement('script');
  script2.src = 'https://cdn.jsdelivr.net/npm/turndown@7.1.2/dist/turndown.js';
  script2.integrity = 'sha384-[HASH]';
  script2.crossOrigin = 'anonymous';
  document.head.appendChild(script2);

  // Load Marked
  const script3 = document.createElement('script');
  script3.src = 'https://cdn.jsdelivr.net/npm/marked@9.1.6/lib/marked.umd.min.js';
  script3.integrity = 'sha384-[HASH]';
  script3.crossOrigin = 'anonymous';
  document.head.appendChild(script3);
  
  // Wait for all to load
  return Promise.all([
    waitForGlobal('DOMPurify'),
    waitForGlobal('TurndownService'),
    waitForGlobal('marked')
  ]);
}
```

**New Code:**
```javascript
// Load external libraries from local files
loadLibraries() {
  // Load DOMPurify (local)
  const script1 = document.createElement('script');
  script1.src = '/lib/dompurify.min.js';
  document.head.appendChild(script1);

  // Load Turndown (local)
  const script2 = document.createElement('script');
  script2.src = '/lib/turndown.js';
  document.head.appendChild(script2);

  // Load Marked (local)
  const script3 = document.createElement('script');
  script3.src = '/lib/marked.umd.min.js';
  document.head.appendChild(script3);
  
  // Wait for all to load
  // Note: SRI not needed for local files (protected by CSP)
  return Promise.all([
    waitForGlobal('DOMPurify'),
    waitForGlobal('TurndownService'),
    waitForGlobal('marked')
  ]);
}
```

#### Step 3: Update SIP Calculator

**File: `tools/sip-calculator/sip-calculator.js`**

**Find:**
```javascript
loadChartJS() {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
  script.integrity = 'sha384-[HASH]';
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
  return waitForGlobal('Chart');
}
```

**Replace with:**
```javascript
loadChartJS() {
  const script = document.createElement('script');
  script.src = '/lib/chart.umd.min.js';
  document.head.appendChild(script);
  return waitForGlobal('Chart');
}
```

#### Step 4: Update EMI Calculator

**File: `tools/emi-calculator/emi-calculator.js`**

Same changes as SIP calculator above.

#### Step 5: Update Text Diff Tool

**File: `tools/text-diff/text-diff.js`**

**Find:**
```javascript
loadDiffLibrary() {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/diff@5.1.0/dist/diff.min.js';
  script.integrity = 'sha384-[HASH]';
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
  return waitForGlobal('Diff');
}
```

**Replace with:**
```javascript
loadDiffLibrary() {
  const script = document.createElement('script');
  script.src = '/lib/diff.min.js';
  document.head.appendChild(script);
  return waitForGlobal('Diff');
}
```

#### Step 6: Update CSP in wrangler.toml

**File: `wrangler.toml`**

**Current CSP:**
```toml
Content-Security-Policy = "default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self';"
```

**Updated CSP (remove CDN references, prepare for unsafe-inline removal):**
```toml
Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';"
```

**Note:** We keep `'unsafe-inline'` for now (will remove in TICKET-CRIT-2).

#### Step 7: Create Library Documentation

**File: `lib/README.md`** (already created in TICKET-CRIT-1, update it)

Add section:
```markdown
## Local Hosting

All libraries are hosted locally to ensure zero external dependencies.

### Benefits
- ✅ Works offline
- ✅ No CDN downtime risk
- ✅ Faster load times (no CDN latency)
- ✅ Better privacy (no third-party tracking)
- ✅ Service worker can cache libraries

### File Sizes
- dompurify.min.js: 19 KB
- chart.umd.min.js: 50 KB
- diff.min.js: 11 KB
- turndown.js: 9 KB
- marked.umd.min.js: 12 KB

**Total:** ~101 KB (acceptable first-load size)

### Loading Strategy
Libraries are loaded dynamically only when needed:
- DOMPurify: Loaded when HTML-Markdown tool opens
- Chart.js: Loaded when SIP or EMI calculator opens
- Diff: Loaded when Text Diff tool opens
- Turndown/Marked: Loaded when HTML-Markdown tool opens

This ensures tools without charts don't download Chart.js.
```

---

### Acceptance Criteria

- [ ] All 5 libraries downloaded to /lib/ folder
- [ ] All tool files updated to load from /lib/
- [ ] No external CDN references in JavaScript files
- [ ] CSP updated to remove CDN domains
- [ ] `lib/README.md` updated with local hosting info
- [ ] All tools still function correctly
- [ ] No 404 errors in console
- [ ] Libraries load successfully from local files
- [ ] Application works offline (test with DevTools offline mode)
- [ ] Code reviewed by Tech Lead
- [ ] Validated by Test Specialist

---

### Testing Instructions

**Functional Testing:**
1. Clear browser cache
2. Open application
3. Test each tool:
   - HTML-Markdown Converter
   - SIP Calculator
   - EMI Calculator
   - Text Diff
4. Verify all tools work correctly
5. Check browser DevTools Network tab
6. Verify libraries load from `/lib/` (not CDN)

**Offline Testing:**
1. Open DevTools (F12)
2. Go to Network tab
3. Check "Offline" mode
4. Reload page
5. Navigate to each tool
6. Verify tools load (may need service worker)

**Performance Testing:**
1. Open DevTools → Network tab
2. Hard reload (Ctrl+Shift+R)
3. Measure library load times
4. Compare with CDN load times (should be faster)

---

### Security Validation

- [ ] No external scripts loaded (check Network tab)
- [ ] CSP blocks external domains (test by adding external script)
- [ ] All libraries served from same origin
- [ ] No mixed content warnings

---

### Performance Impact

**Before (CDN):**
- DNS lookup: 20-50ms
- CDN latency: 50-200ms
- Total: 70-250ms per library

**After (Local):**
- Same origin: 0ms DNS
- Local latency: 5-20ms
- Total: 5-20ms per library

**Expected Improvement:** 50-230ms faster per library load

---

### Dependencies

**Prerequisites:**
- TICKET-CRIT-1 completed (SRI hashes generated)
- Curl or wget installed
- Write access to /lib/ folder

**Blocks:**
- TICKET-CRIT-2 (CSP hardening needs local files)

**Blocked By:**
- None (can run in parallel with TICKET-CRIT-1)

---

### Rollback Plan

If local loading causes issues:
1. Revert JavaScript changes
2. Restore CDN URLs with SRI hashes
3. Update CSP to allow CDN domains
4. Document specific issue
5. Investigate and fix
6. Re-apply local hosting

---

### Additional Notes

**Why remove SRI for local files?**
- SRI is for verifying third-party resources
- Local files are protected by CSP `'self'` directive
- Reduces complexity
- SRI hashes would break on any local file update

**Service Worker Considerations:**
- Once service worker is implemented (future), libraries will be cached
- First visit: Download 101KB
- Subsequent visits: Load from cache (instant)

**Bundle Size Trade-off:**
- Adding 101KB to first load
- But eliminates external dependency
- Modern connections handle this easily
- Can be further optimized with HTTP/2 multiplexing

---

## TICKET-CRIT-2-PREP: CSP Hardening Preparation

### Priority: 🔴 CRITICAL (Preparation)
**Effort:** 4 hours  
**Assigned To:** Developer  
**Reviewer:** Tech Lead  
**Tester:** Test Specialist

---

### Problem Statement

Current CSP allows `'unsafe-inline'` for scripts and styles, which completely defeats the purpose of CSP. Before removing it, we need to audit all inline scripts and styles and prepare migration plan.

**Security Risk:** CRITICAL  
**Issue:** CSP with `unsafe-inline` doesn't prevent XSS attacks  
**Impact:** Any XSS vulnerability can execute arbitrary code

---

### Technical Background

**What is CSP?**
Content Security Policy is a security layer that helps prevent XSS attacks by controlling which resources can be loaded and executed.

**Why is `unsafe-inline` bad?**
```html
<!-- With unsafe-inline, this XSS attack works -->
<div onclick="alert('XSS')">Click me</div>
<img src=x onerror="alert('XSS')">
<script>alert('XSS')</script>

<!-- Without unsafe-inline, all of these are blocked -->
```

**Current CSP (BAD):**
```
script-src 'self' 'unsafe-inline';
```

**Target CSP (GOOD):**
```
script-src 'self';
```

---

### Implementation Steps

#### Step 1: Audit All Inline Scripts

Create audit script:

**File: `/tmp/audit-inline-scripts.sh`**
```bash
#!/bin/bash
echo "=== Inline Script Audit ==="
echo ""
echo "1. Inline event handlers (onclick, onerror, etc.):"
grep -rn "on[a-z]*=" --include="*.html" --include="*.js" .

echo ""
echo "2. Inline <script> tags:"
grep -rn "<script>" --include="*.html" .

echo ""
echo "3. JavaScript URLs:"
grep -rn "javascript:" --include="*.html" --include="*.js" .

echo ""
echo "4. eval() usage:"
grep -rn "eval(" --include="*.js" shared/ tools/ home/

echo ""
echo "5. Function constructor:"
grep -rn "new Function" --include="*.js" shared/ tools/ home/

echo ""
echo "=== Audit Complete ==="
```

Run audit:
```bash
chmod +x /tmp/audit-inline-scripts.sh
cd /home/ravi/projects/json-schema-converter
/tmp/audit-inline-scripts.sh > inline-scripts-audit.txt
```

#### Step 2: Audit All Inline Styles

```bash
#!/bin/bash
echo "=== Inline Style Audit ==="
echo ""
echo "1. Inline style attributes:"
grep -rn 'style="' --include="*.html" --include="*.js" . | head -50

echo ""
echo "2. styleText assignments:"
grep -rn "styleText" --include="*.js" shared/ tools/ home/

echo ""
echo "3. style.cssText usage:"
grep -rn "style.cssText" --include="*.js" shared/ tools/ home/

echo ""
echo "=== Audit Complete ==="
```

Run:
```bash
bash /tmp/audit-inline-styles.sh > inline-styles-audit.txt
```

#### Step 3: Document Findings

**File: `docs/CSP_MIGRATION_PLAN.md`**

```markdown
# CSP Migration Plan - Remove unsafe-inline

## Inline Scripts Found

### Critical (Must Fix)
1. Theme toggle in index.html
   - Location: index.html line 25
   - Pattern: Inline onclick attribute
   - Migration: Move to theme.js with addEventListener

2. Router initialization
   - Location: shared/js/app.js
   - Pattern: Dynamic script loading
   - Status: Already safe (no inline scripts)

### Safe Patterns (No Action Needed)
1. ES6 module imports - Already safe
2. Script tags with src attribute - Already safe
3. External library loading - Already safe (no inline scripts)

## Inline Styles Found

### Keep for Now
1. CSS custom properties (variables)
   - Location: Throughout application
   - Reason: Required for theme switching
   - CSP: Keep `'unsafe-inline'` for style-src only

2. Dynamic positioning styles
   - Location: Modal, dropdown components
   - Reason: Cannot be pre-defined in CSS
   - CSP: Keep `'unsafe-inline'` for style-src only

## Migration Tasks

### Phase 1 (Sprint 1)
- [ ] Audit complete (this task)
- [ ] Documentation created
- [ ] Migration plan approved

### Phase 2 (Sprint 2)
- [ ] Remove inline event handlers
- [ ] Move all JavaScript to external files
- [ ] Update CSP: script-src 'self' (NO unsafe-inline)
- [ ] Keep style-src 'unsafe-inline' (justified)

## Testing Strategy

After migration:
1. Test with strict CSP (no unsafe-inline)
2. Verify no CSP violations in console
3. Verify all features work
4. Test in multiple browsers
```

#### Step 4: Identify Specific Violations

Expected violations to fix in Sprint 2:

1. **index.html - Theme toggle button**
   ```html
   <!-- Current (BAD) -->
   <button onclick="toggleTheme()">🌙</button>
   
   <!-- Fix (GOOD) -->
   <button data-theme-toggle>🌙</button>
   <!-- Then in theme.js: -->
   <!-- document.querySelector('[data-theme-toggle]').addEventListener('click', toggleTheme); -->
   ```

2. **Dynamic Script Loading**
   - Current pattern is safe (createElement + src)
   - No changes needed

3. **Eval Usage**
   - Audit result should show zero usage
   - If found, must remove

#### Step 5: Create Migration Checklist

**File: `docs/CSP_MIGRATION_CHECKLIST.md`**

```markdown
# CSP Migration Checklist

## Pre-Migration Validation
- [ ] All external libraries loaded locally (TICKET-CRIT-5)
- [ ] Inline script audit complete
- [ ] Inline style audit complete
- [ ] Migration plan reviewed by Tech Lead

## Migration Tasks (Sprint 2)
- [ ] Remove inline onclick attributes
- [ ] Remove inline event handlers
- [ ] Remove javascript: URLs
- [ ] Verify no eval() usage
- [ ] Verify no Function() constructor usage
- [ ] Update wrangler.toml CSP
- [ ] Test with strict CSP

## Post-Migration Validation
- [ ] No CSP violations in console
- [ ] All tools function correctly
- [ ] Theme toggle works
- [ ] Router navigation works
- [ ] Charts render correctly
- [ ] Text diff works
- [ ] HTML-Markdown conversion works

## Browser Testing
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## Security Validation
- [ ] CSP header correct in Network tab
- [ ] CSP violations logged (should be none)
- [ ] Try XSS payloads (should be blocked)
```

---

### Acceptance Criteria

- [ ] Inline script audit completed
- [ ] Inline style audit completed
- [ ] `inline-scripts-audit.txt` created
- [ ] `inline-styles-audit.txt` created
- [ ] `docs/CSP_MIGRATION_PLAN.md` created
- [ ] `docs/CSP_MIGRATION_CHECKLIST.md` created
- [ ] All inline script locations documented
- [ ] Migration strategy defined
- [ ] Tech Lead reviewed and approved plan
- [ ] Ready for Sprint 2 implementation

---

### Deliverables

1. **inline-scripts-audit.txt** - Complete list of inline scripts
2. **inline-styles-audit.txt** - Complete list of inline styles
3. **CSP_MIGRATION_PLAN.md** - Detailed migration strategy
4. **CSP_MIGRATION_CHECKLIST.md** - Step-by-step validation checklist

---

### Testing Instructions

**Validation (not yet fixing, just documenting):**
1. Run audit scripts
2. Review output files
3. Verify all inline patterns found
4. Document each finding
5. Categorize as critical/safe/keep
6. Get Tech Lead approval

---

### Dependencies

**Prerequisites:**
- Bash shell
- grep command
- Access to codebase

**Blocks:**
- TICKET-CRIT-2 (can't remove unsafe-inline without migration plan)

**Blocked By:**
- None (can start immediately in parallel with other tickets)

---

### Additional Notes

**Why keep style-src 'unsafe-inline'?**
- CSS custom properties (--var-name) often set via style attribute
- Used for theming throughout app
- Much lower security risk than script-src
- Industry standard to keep for styles

**CSP Violation Reporting:**
In CSP string, can add:
```
report-uri /csp-violation-report
```
This logs violations for monitoring (future enhancement).

---

## Sprint 1 Summary

**Total Effort:** 2 days  
**Critical Issues Addressed:** 3  
**Tickets:** 3

**Day 1:**
- Morning: TICKET-CRIT-1 (SRI hashes - 2 hours)
- Afternoon: TICKET-CRIT-5 (Local libraries - 4 hours)

**Day 2:**
- Morning: TICKET-CRIT-2-PREP (CSP audit - 4 hours)
- Afternoon: Testing and validation (2 hours)
- End of Day: Sprint 1 Review

**Deliverables:**
- ✅ All CDN libraries have SRI hashes
- ✅ All libraries moved to /lib/ folder
- ✅ CSP migration plan created
- ✅ Zero external CDN dependencies
- ✅ Documentation complete

**Ready for Sprint 2:**
- CSP hardening can begin
- Inline scripts documented
- Migration plan approved

---

**Status:** 🟡 Ready for assignment  
**Next Action:** Developer reviews tickets and begins TICKET-CRIT-1  
**Tech Lead:** Available for questions and code review

---

_Sprint 1 tickets created by: Senior Tech Lead AI Agent_  
_Last Updated: March 19, 2026_
