# Security Fixes - Implementation Guide

**Priority:** 🔴 CRITICAL - Must complete before production  
**Timeline:** 10 days  
**Status:** ⏳ PENDING

---

## Quick Reference

| Task | Priority | Time | Status |
|------|----------|------|--------|
| Add SRI Hashes | 🔴 Critical | 2h | ⏳ |
| Fix CSP Policy | 🔴 Critical | 2d | ⏳ |
| Fix innerHTML XSS | 🔴 Critical | 3d | ⏳ |
| Input Validation | 🟠 High | 1d | ⏳ |
| Remove console.log | 🟠 High | 2h | ⏳ |
| Improve DOMPurify | 🟠 High | 1h | ⏳ |

---

## CRITICAL FIX #1: Add SRI Hashes

**Time:** 2 hours  
**Risk:** Supply chain attack  
**Files to modify:** 3 HTML files

### Step-by-Step Implementation

**1. Generate SRI Hashes**

Create script `scripts/generate-sri.sh`:
```bash
#!/bin/bash

echo "Generating SRI hashes..."

# Chart.js
echo -n "Chart.js: sha384-"
curl -s "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js" | \
  openssl dgst -sha384 -binary | openssl base64 -A
echo ""

# DOMPurify
echo -n "DOMPurify: sha384-"
curl -s "https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js" | \
  openssl dgst -sha384 -binary | openssl base64 -A
echo ""

# Marked
echo -n "Marked: sha384-"
curl -s "https://cdn.jsdelivr.net/npm/marked@9.1.6/marked.min.js" | \
  openssl dgst -sha384 -binary | openssl base64 -A
echo ""

# Turndown
echo -n "Turndown: sha384-"
curl -s "https://cdn.jsdelivr.net/npm/turndown@7.1.2/dist/turndown.min.js" | \
  openssl dgst -sha384 -binary | openssl base64 -A
echo ""

# jsdiff
echo -n "jsdiff: sha384-"
curl -s "https://cdn.jsdelivr.net/npm/diff@5.1.0/dist/diff.min.js" | \
  openssl dgst -sha384 -binary | openssl base64 -A
echo ""
```

Run it:
```bash
chmod +x scripts/generate-sri.sh
./scripts/generate-sri.sh > scripts/sri-hashes.txt
```

**2. Update HTML Files**

**File: tools/text-diff/index.html**
```html
<!-- BEFORE -->
<script src="https://cdn.jsdelivr.net/npm/diff@5.1.0/dist/diff.min.js"></script>

<!-- AFTER -->
<script 
  src="https://cdn.jsdelivr.net/npm/diff@5.1.0/dist/diff.min.js"
  integrity="sha384-[PASTE_HASH_HERE]"
  crossorigin="anonymous">
</script>
```

**File: tools/emi-calculator/index.html**
```html
<!-- BEFORE -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

<!-- AFTER -->
<script 
  src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"
  integrity="sha384-[PASTE_HASH_HERE]"
  crossorigin="anonymous">
</script>
```

**File: tools/sip-calculator/index.html**
```html
<!-- BEFORE -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js"></script>

<!-- AFTER -->
<script 
  src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js"
  integrity="sha384-[PASTE_HASH_HERE]"
  crossorigin="anonymous">
</script>
```

**3. Update Dynamic Loading (HTML/Markdown Converter)**

**File: tools/html-markdown/html-markdown.js**

```javascript
// BEFORE
function loadLibrary(name, url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = () => {
      librariesLoaded[name] = true;
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load ${name} library`));
    document.head.appendChild(script);
  });
}

// AFTER
const LIBRARY_SRI = {
  'turndown': 'sha384-[HASH]',
  'marked': 'sha384-[HASH]',
  'dompurify': 'sha384-[HASH]'
};

function loadLibrary(name, url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    
    // Add SRI protection
    if (LIBRARY_SRI[name]) {
      script.integrity = LIBRARY_SRI[name];
      script.crossOrigin = 'anonymous';
    }
    
    script.onload = () => {
      librariesLoaded[name] = true;
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load ${name} library`));
    document.head.appendChild(script);
  });
}
```

**4. Test**

```bash
# Open browser DevTools, Network tab
# Verify "integrity" attribute present
# Try changing hash - should fail to load
```

**✅ Verification:**
- [ ] All external scripts have integrity attribute
- [ ] Hashes are correct (scripts load successfully)
- [ ] Modifying hash causes script to fail loading

---

## CRITICAL FIX #2: Fix CSP Policy

**Time:** 1-2 days  
**Risk:** XSS not prevented  
**Files to modify:** wrangler.toml + move inline scripts

### Step-by-Step Implementation

**1. Update wrangler.toml**

```toml
# BEFORE
Content-Security-Policy = "default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self';"

# AFTER
Content-Security-Policy = "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;"
```

**2. Find All Inline Scripts**

```bash
# Search for inline scripts
grep -r "<script>" --include="*.html" tools/ home/ index.html

# Search for inline event handlers
grep -r "onclick\|onerror\|onload" --include="*.html" tools/ home/ index.html
```

**3. Move Inline Scripts to External Files**

**Example: If you find inline scripts in index.html**

```html
<!-- BEFORE -->
<script>
  function initApp() {
    console.log('App initialized');
  }
  initApp();
</script>

<!-- AFTER (in HTML) -->
<script src="/js/init.js"></script>

<!-- NEW FILE: /js/init.js -->
function initApp() {
  console.log('App initialized');
}
initApp();
```

**4. Replace Inline Event Handlers**

```html
<!-- BEFORE -->
<button onclick="handleClick()">Click Me</button>

<!-- AFTER -->
<button id="my-button">Click Me</button>

<script type="module">
  // In your existing JS file
  document.getElementById('my-button').addEventListener('click', handleClick);
</script>
```

**5. Test CSP Enforcement**

```bash
# Deploy to staging
wrangler pages publish . --project-name=devtoolbox-staging

# Open browser DevTools Console
# Look for CSP violations:
# "Refused to execute inline script because it violates CSP directive"
```

**6. Fix CSP Violations**

For each violation:
1. Identify the inline script/handler
2. Move to external file
3. Use addEventListener()
4. Retest

**✅ Verification:**
- [ ] No inline `<script>` tags
- [ ] No onclick/onerror/onload attributes
- [ ] All features still work
- [ ] No CSP violations in console

---

## CRITICAL FIX #3: Fix innerHTML XSS

**Time:** 2-3 days  
**Risk:** Multiple XSS injection points  
**Files to modify:** 35+ locations

### Step-by-Step Implementation

**1. Create Global Sanitization Utility**

**NEW FILE: shared/js/sanitize.js**

```javascript
/**
 * Global HTML Sanitization Utility
 * Uses DOMPurify for all user-controlled HTML
 */

// Load DOMPurify dynamically
let DOMPurify = null;

export async function loadSanitizer() {
  if (DOMPurify) return DOMPurify;
  
  // Import from CDN
  const module = await import('https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.es.js');
  DOMPurify = module.default;
  return DOMPurify;
}

/**
 * Sanitize HTML with DOMPurify
 * @param {string} html - HTML to sanitize
 * @param {string} level - 'strict', 'basic', or 'markdown'
 */
export async function sanitize(html, level = 'basic') {
  if (!DOMPurify) await loadSanitizer();
  
  const configs = {
    strict: {
      ALLOWED_TAGS: [],
      KEEP_CONTENT: true
    },
    basic: {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p', 'span'],
      ALLOWED_ATTR: []
    },
    markdown: {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'hr',
        'strong', 'em', 'u', 's', 'del',
        'a', 'img',
        'ul', 'ol', 'li',
        'blockquote', 'code', 'pre',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'div', 'span'
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class'],
      ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|ftp):)/i,
      SANITIZE_DOM: true
    }
  };
  
  return DOMPurify.sanitize(html, configs[level] || configs.basic);
}

/**
 * Safe innerHTML setter
 * Automatically sanitizes before setting innerHTML
 */
export async function setSafeInnerHTML(element, html, level = 'basic') {
  const clean = await sanitize(html, level);
  element.innerHTML = clean;
}

/**
 * Escape HTML (convert to text)
 * More secure than sanitization
 */
export function escapeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
```

**2. Fix High-Risk Locations**

**File: shared/components/card.js**

```javascript
// BEFORE (Line 84)
if (typeof content === 'string' && content.trim().startsWith('<')) {
  contentElement.innerHTML = content;
} else {
  contentElement.textContent = content;
}

// AFTER
import { sanitize } from '/shared/js/sanitize.js';

if (typeof content === 'string' && content.trim().startsWith('<')) {
  // Sanitize HTML content
  contentElement.innerHTML = await sanitize(content, 'basic');
} else {
  contentElement.textContent = content;
}
```

**File: shared/components/modal.js**

```javascript
// BEFORE (Line 77)
if (typeof content === 'string') {
  body.innerHTML = content;
}

// AFTER
import { sanitize } from '/shared/js/sanitize.js';

if (typeof content === 'string') {
  body.innerHTML = await sanitize(content, 'basic');
}
```

**File: home/home.js**

```javascript
// BEFORE (Line 233)
container.innerHTML = html;

// AFTER
import { escapeHTML } from '/shared/js/sanitize.js';

// If html is static (no user input), OK to keep
container.innerHTML = html;  // ✅ SAFE - static template

// If html contains user data:
container.innerHTML = await sanitize(html, 'basic');

// If just text:
container.textContent = text;  // ✅ ALWAYS SAFE
```

**3. Audit All innerHTML Usages**

```bash
# Generate report
grep -rn "innerHTML" --include="*.js" shared/ tools/ home/ > innerHTML-audit.txt

# Review each instance:
# ✅ SAFE: Static content only
# ⚠️  FIX: User-controlled data
# ❌ BLOCKED: Cannot determine - assume unsafe
```

**4. Fix Pattern Examples**

**Pattern 1: Static HTML - Safe**
```javascript
// ✅ SAFE - No user input
element.innerHTML = `<div class="card">Static Content</div>`;
```

**Pattern 2: User Input - Must Sanitize**
```javascript
// ❌ UNSAFE
element.innerHTML = userInput;

// ✅ SAFE - Option 1: Escape
import { escapeHTML } from '/shared/js/sanitize.js';
element.innerHTML = escapeHTML(userInput);

// ✅ SAFE - Option 2: Sanitize
import { sanitize } from '/shared/js/sanitize.js';
element.innerHTML = await sanitize(userInput);

// ✅ SAFE - Option 3: Use textContent
element.textContent = userInput;
```

**Pattern 3: Template with User Data**
```javascript
// ❌ UNSAFE
element.innerHTML = `<div class="name">${userName}</div>`;

// ✅ SAFE - Escape variables
import { escapeHTML } from '/shared/js/sanitize.js';
element.innerHTML = `<div class="name">${escapeHTML(userName)}</div>`;

// ✅ SAFE - Use DOM API
const div = document.createElement('div');
div.className = 'name';
div.textContent = userName;
element.appendChild(div);
```

**5. Update HTML/Markdown Converter DOMPurify Config**

**File: tools/html-markdown/html-markdown.js (Line 279)**

```javascript
// BEFORE
if (sanitizeHtml.checked && window.DOMPurify) {
  html = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [...],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id']
  });
}

// AFTER
// Always sanitize (don't let user disable)
if (window.DOMPurify) {
  html = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'strong', 'em', 'u', 's', 'del',
      'a', 'img',
      'ul', 'ol', 'li',
      'blockquote', 'code', 'pre',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class'],  // Removed 'id'
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|ftp):)/i,  // Block javascript:
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
    SANITIZE_DOM: true,
    KEEP_CONTENT: true,
    SAFE_FOR_TEMPLATES: true
  });
}
```

**✅ Verification:**
- [ ] All 35+ innerHTML usages reviewed
- [ ] High-risk locations sanitized
- [ ] XSS test suite passes
- [ ] No broken functionality

---

## HIGH PRIORITY FIX #4: Input Validation & DoS Protection

**Time:** 1 day  
**Risk:** Client-side DoS  
**Files to modify:** All calculator tools

### Step-by-Step Implementation

**1. Create Validation Utility**

**NEW FILE: shared/js/validators.js**

```javascript
/**
 * Input Validation & Sanitization
 */

// Maximum input sizes
export const LIMITS = {
  MAX_TEXT_LENGTH: 1048576,     // 1MB
  MAX_TEXT_LINES: 10000,
  MAX_TENURE_YEARS: 50,
  MAX_LOAN_AMOUNT: 100000000,   // 10 crore
  MAX_MONTHLY_INVESTMENT: 1000000,
  MAX_RETURN_RATE: 50,          // 50%
  MAX_TABLE_ROWS: 1000
};

/**
 * Validate text input size
 */
export function validateTextSize(text, maxLength = LIMITS.MAX_TEXT_LENGTH) {
  if (text.length > maxLength) {
    throw new Error(`Input too large. Maximum: ${(maxLength / 1024).toFixed(0)} KB`);
  }
  
  const lines = text.split('\n');
  if (lines.length > LIMITS.MAX_TEXT_LINES) {
    throw new Error(`Too many lines. Maximum: ${LIMITS.MAX_TEXT_LINES}`);
  }
  
  return true;
}

/**
 * Validate numeric input
 */
export function validateNumber(value, min, max, name = 'Value') {
  const num = parseFloat(value);
  
  if (isNaN(num)) {
    throw new Error(`${name} must be a valid number`);
  }
  
  if (num < min) {
    throw new Error(`${name} must be at least ${min}`);
  }
  
  if (num > max) {
    throw new Error(`${name} cannot exceed ${max}`);
  }
  
  return num;
}

/**
 * Validate computation size
 */
export function validateComputationSize(size, max, operation = 'Operation') {
  if (size > max) {
    throw new Error(
      `${operation} will generate ${size} items. ` +
      `Maximum allowed: ${max}. Please reduce your inputs.`
    );
  }
  return true;
}
```

**2. Add Validation to EMI Calculator**

**File: tools/emi-calculator/emi-calculator.js**

```javascript
import { validateNumber, validateComputationSize, LIMITS } from '/shared/js/validators.js';

calculateEMI() {
  try {
    // Validate inputs
    const loanAmount = validateNumber(
      this.loanAmountInput.value,
      10000,
      LIMITS.MAX_LOAN_AMOUNT,
      'Loan amount'
    );
    
    const interestRate = validateNumber(
      this.interestRateInput.value,
      0.1,
      LIMITS.MAX_RETURN_RATE,
      'Interest rate'
    );
    
    const tenure = validateNumber(
      this.loanTenureInput.value,
      1,
      LIMITS.MAX_TENURE_YEARS,
      'Loan tenure'
    );
    
    // Validate table size
    const rows = tenure * 12;
    validateComputationSize(
      rows,
      LIMITS.MAX_TABLE_ROWS,
      'Amortization table'
    );
    
    // Warn for large tables
    if (rows > 600) {
      if (!confirm(
        `This will generate ${rows} rows. Your browser may slow down. Continue?`
      )) {
        return;
      }
    }
    
    // ... rest of calculation
    
  } catch (error) {
    alert(error.message);
    return;
  }
}
```

**3. Add Validation to SIP Calculator**

**File: tools/sip-calculator/sip-calculator.js**

```javascript
import { validateNumber, LIMITS } from '/shared/js/validators.js';

function validateInputs(inputs) {
  const errors = [];
  
  try {
    validateNumber(
      inputs.monthlyInvestment,
      100,
      LIMITS.MAX_MONTHLY_INVESTMENT,
      'Monthly investment'
    );
  } catch (e) {
    errors.push(e.message);
  }
  
  try {
    validateNumber(
      inputs.returnRate,
      0.1,
      LIMITS.MAX_RETURN_RATE,
      'Expected return'
    );
  } catch (e) {
    errors.push(e.message);
  }
  
  try {
    validateNumber(
      inputs.duration,
      1,
      LIMITS.MAX_TENURE_YEARS,
      'Investment duration'
    );
  } catch (e) {
    errors.push(e.message);
  }
  
  return errors;
}
```

**4. Add Validation to Text Diff**

**File: tools/text-diff/text-diff.js**

```javascript
import { validateTextSize } from '/shared/js/validators.js';

performDiff() {
  try {
    // Validate text sizes
    validateTextSize(this.originalTextarea.value);
    validateTextSize(this.modifiedTextarea.value);
    
    this.originalText = this.originalTextarea.value;
    this.modifiedText = this.modifiedTextarea.value;
    
    // ... rest of diff logic
    
  } catch (error) {
    alert(error.message);
    return;
  }
}
```

**5. Add Computation Timeout**

**NEW FILE: shared/js/timeout.js**

```javascript
/**
 * Execute function with timeout
 */
export function withTimeout(fn, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Operation timeout - calculation took too long'));
    }, timeout);
    
    try {
      const result = fn();
      clearTimeout(timer);
      resolve(result);
    } catch (error) {
      clearTimeout(timer);
      reject(error);
    }
  });
}

// Usage in calculators:
import { withTimeout } from '/shared/js/timeout.js';

try {
  const schedule = await withTimeout(
    () => this.generateAmortizationSchedule(...),
    5000
  );
} catch (error) {
  alert('Calculation timeout. Please reduce inputs.');
}
```

**✅ Verification:**
- [ ] Cannot input extreme values
- [ ] Large computations show warning
- [ ] Timeout prevents freezing
- [ ] Helpful error messages

---

## HIGH PRIORITY FIX #5: Remove Production console.log

**Time:** 2 hours  
**Risk:** Information disclosure  
**Files to modify:** 50+ locations

### Step-by-Step Implementation

**1. Create Debug Utility**

**NEW FILE: shared/js/debug.js**

```javascript
/**
 * Debug Logging Utility
 * Only logs in development mode
 */

const IS_DEV = window.location.hostname === 'localhost' ||
               window.location.hostname === '127.0.0.1' ||
               window.location.search.includes('debug=true');

export const logger = {
  log: (...args) => {
    if (IS_DEV) console.log(...args);
  },
  
  error: (...args) => {
    if (IS_DEV) console.error(...args);
  },
  
  warn: (...args) => {
    if (IS_DEV) console.warn(...args);
  },
  
  info: (...args) => {
    if (IS_DEV) console.info(...args);
  },
  
  // Performance timing
  time: (label) => {
    if (IS_DEV) console.time(label);
  },
  
  timeEnd: (label) => {
    if (IS_DEV) console.timeEnd(label);
  }
};
```

**2. Replace All console.* Calls**

```bash
# Find all console statements
grep -rn "console\." --include="*.js" shared/ tools/ home/ > console-audit.txt

# Example replacements:
```

**Before:**
```javascript
console.log('JSON Schema Tool initialized');
console.error('Failed to load:', error);
console.log(`Diff computed in ${duration}ms`);
```

**After:**
```javascript
import { logger } from '/shared/js/debug.js';

logger.log('JSON Schema Tool initialized');
logger.error('Failed to load:', error);
logger.log(`Diff computed in ${duration}ms`);
```

**3. Automated Find & Replace**

```bash
# Create replace script
cat > scripts/replace-console.sh << 'EOF'
#!/bin/bash

# Add import to each file
find shared/ tools/ home/ -name "*.js" -exec sed -i '1i\
import { logger } from '"'"'/shared/js/debug.js'"'"';\
' {} \;

# Replace console.log with logger.log
find shared/ tools/ home/ -name "*.js" -exec sed -i 's/console\.log/logger.log/g' {} \;
find shared/ tools/ home/ -name "*.js" -exec sed -i 's/console\.error/logger.error/g' {} \;
find shared/ tools/ home/ -name "*.js" -exec sed -i 's/console\.warn/logger.warn/g' {} \;
find shared/ tools/ home/ -name "*.js" -exec sed -i 's/console\.time/logger.time/g' {} \;
find shared/ tools/ home/ -name "*.js" -exec sed -i 's/console\.timeEnd/logger.timeEnd/g' {} \;

EOF

chmod +x scripts/replace-console.sh
./scripts/replace-console.sh
```

**4. Manual Review**

Some console statements should remain (errors):
```javascript
// Keep these for critical errors
try {
  // ...
} catch (error) {
  console.error('CRITICAL:', error);  // Keep for production error tracking
}
```

**✅ Verification:**
- [ ] No console output in production (open DevTools)
- [ ] Debug logging works in localhost
- [ ] ?debug=true query param enables logging

---

## Testing Checklist

### After Each Fix

**Fix #1 - SRI Hashes:**
```bash
# 1. Load page with DevTools Network tab
# 2. Verify integrity attribute present
# 3. Check console for SRI errors
# 4. Modify hash in HTML - should fail to load
```

**Fix #2 - CSP:**
```bash
# 1. Deploy to staging
# 2. Open DevTools Console
# 3. Look for CSP violations
# 4. Test all features - ensure working
# 5. Check Security tab for CSP policy
```

**Fix #3 - innerHTML:**
```bash
# 1. Test XSS payloads:
<script>alert('XSS')</script>
<img src=x onerror=alert(1)>
<a href="javascript:alert(1)">link</a>

# 2. Verify all blocked
# 3. Test legitimate HTML works
# 4. Check preview modes render correctly
```

**Fix #4 - Input Validation:**
```bash
# 1. Input extreme values
# 2. Verify error messages
# 3. Test boundary values
# 4. Ensure warnings show for large computations
```

**Fix #5 - console.log:**
```bash
# 1. Open production build in DevTools
# 2. Console should be clean
# 3. Test localhost - should have logging
# 4. Test ?debug=true - should enable logging
```

---

## Final Verification

### Security Test Suite

Run complete test suite:

**1. XSS Tests**
```javascript
// Test in HTML/Markdown converter
const xssPayloads = [
  '<script>alert("XSS")</script>',
  '<img src=x onerror=alert(1)>',
  '<svg onload=alert(1)>',
  '<iframe src="javascript:alert(1)">',
  '<a href="javascript:alert(1)">click</a>',
  '<body onload=alert(1)>',
  '<input onfocus=alert(1) autofocus>',
  '<marquee onstart=alert(1)>',
  '<details open ontoggle=alert(1)>',
  '<math href="javascript:alert(1)">click</math>'
];

xssPayloads.forEach(payload => {
  // Convert and verify blocked
});
```

**2. CSP Test**
```javascript
// Try to execute inline script
const script = document.createElement('script');
script.innerHTML = 'alert("CSP Bypass")';
document.body.appendChild(script);
// Should be blocked by CSP
```

**3. Input Validation Test**
```javascript
// Test extreme values
calculateEMI({
  loanAmount: 999999999,
  tenure: 999,
  interestRate: 100
});
// Should show error
```

**4. SRI Test**
```bash
# Modify script tag hash
<script src="..." integrity="sha384-WRONG_HASH"></script>
# Script should fail to load
```

### Deployment Checklist

- [ ] All critical fixes implemented
- [ ] All tests pass
- [ ] Code review completed
- [ ] Security team sign-off
- [ ] Staging deployment successful
- [ ] Production deployment plan ready

---

## Rollback Plan

If issues arise after deployment:

**1. Quick Rollback (< 5 min)**
```bash
# Revert to previous version
wrangler pages deployments list
wrangler pages deployment tail [PREVIOUS_DEPLOYMENT_ID]
```

**2. Partial Rollback**
```bash
# Revert specific file
git checkout HEAD^ -- path/to/file.js
git commit -m "Rollback file.js"
wrangler pages publish
```

**3. Emergency CSP Relaxation**
```toml
# Temporarily re-enable unsafe-inline if critical breakage
Content-Security-Policy = "... script-src 'self' 'unsafe-inline' ..."
```

---

## Success Criteria

### Done When:
- [x] All 3 critical issues fixed
- [x] Security test suite passes
- [x] No console errors in production
- [x] No CSP violations
- [x] All features functional
- [x] Performance unchanged
- [x] Security grade: B+ or higher

### Metrics:
- Security score: 76 → 85+ (B+ grade)
- XSS test pass rate: 80% → 100%
- Critical vulnerabilities: 3 → 0
- High vulnerabilities: 5 → 0

---

## Support & Questions

**Issues during implementation?**
- Review: `docs/security-notes.md` (full audit)
- Review: `docs/SECURITY_AUDIT_EXECUTIVE_SUMMARY.md`
- Contact: Security team

**Tools:**
- SRI Hash Generator: https://www.srihash.org/
- CSP Validator: https://csp-evaluator.withgoogle.com/
- OWASP XSS Filter Evasion: https://owasp.org/www-community/xss-filter-evasion-cheatsheet

---

**Good luck with implementation! 🔒**

