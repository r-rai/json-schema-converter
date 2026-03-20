# TICKET: BOTH-1 - CSP Hardening (Remove unsafe-inline)

**Priority:** P0 (Critical - Both Reviews)  
**Effort:** 2 days  
**Owner:** Developer  
**Reviewer:** Tech Lead + Security Reviewer  
**Dependencies:** ARCH-2 (local libraries must be done first)  
**Sprint Days:** Day 1-3  

---

## Problem Statement

Current Content Security Policy (CSP) includes `unsafe-inline`, which completely defeats the purpose of CSP and allows XSS attacks. This issue was flagged by **both** the Solution Architect and Security Reviewer as critical.

**Security Impact:**
- Any XSS vulnerability can execute arbitrary JavaScript
- Inline event handlers (onclick, onerror, etc.) work
- `<script>` tags without src work
- CSP provides zero protection

**Current CSP (wrangler.toml):**
```toml
Content-Security-Policy = "
  default-src 'self'; 
  script-src 'unsafe-inline';  # ← CRITICAL VULNERABILITY
  style-src 'unsafe-inline';   # ← Less critical but still weak
  img-src 'self' data:; 
  object-src 'none'; 
  base-uri 'self'; 
  form-action 'self';
"
```

**Attack Example (Currently Possible):**
```html
<!-- These would execute with unsafe-inline: -->
<img src=x onerror="alert('XSS')">
<div onclick="maliciousCode()">Click me</div>
<script>steal(document.cookie)</script>
```

**Target CSP (Production-Ready):**
```toml
Content-Security-Policy = "
  default-src 'self';
  script-src 'self';           # ← No unsafe-inline
  style-src 'self' 'unsafe-inline';  # OK for styles
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
"
```

---

## Acceptance Criteria

- [ ] wrangler.toml updated with strict CSP (no `script-src unsafe-inline`)
- [ ] 0 inline event handlers in production HTML files
- [ ] 0 inline `<script>` tags without src in production files
- [ ] All event handlers use addEventListener
- [ ] 0 CSP violations in browser console
- [ ] All 6 tools fully functional
- [ ] All 52 automated tests passing
- [ ] Security validation passed (XSS vectors blocked)

---

## Implementation Phases

### Phase 1: Audit (Day 1 Afternoon - 4 hours)

#### Task 1.1: Audit Inline Event Handlers

**Search Command:**
```bash
cd /home/ravi/projects/json-schema-converter

# Find all inline event handlers
grep -rn "on\(click\|change\|input\|submit\|load\|focus\|blur\|keyup\|keydown\)=" \
  --include="*.html" \
  tools/ home/ shared/ index.html \
  | grep -v "automated-tests.html" \
  | grep -v "comprehensive-security-test.html" \
  > CSP_AUDIT_INLINE_HANDLERS.txt

# Review results
cat CSP_AUDIT_INLINE_HANDLERS.txt
```

**Expected Findings:**
- Test files have many inline handlers (safe to ignore for production)
- Production files should have 0-5 instances
- Most production code likely already uses addEventListener

**Document Each Finding:**
```markdown
# CSP_AUDIT_REPORT.md

## Inline Event Handlers Found

### Production Files (Priority: Fix All)
1. File: index.html, Line: 45
   Code: <button onclick="toggleTheme()">
   Impact: HIGH (defeats CSP)
   Fix: Use addEventListener

2. [etc.]

### Test Files (Priority: Low - Not Deployed)
- automated-tests.html: 15 instances
- comprehensive-security-test.html: 8 instances
- Action: Document but don't fix (test files not in production)
```

#### Task 1.2: Audit Inline Scripts

**Search Command:**
```bash
# Find inline <script> tags (without src attribute)
grep -rn "<script>" --include="*.html" \
  tools/ home/ shared/ index.html \
  | grep -v "src=" \
  | grep -v "automated-tests" \
  | grep -v "test-" \
  > CSP_AUDIT_INLINE_SCRIPTS.txt

cat CSP_AUDIT_INLINE_SCRIPTS.txt
```

**Expected:** Likely 0-3 instances in production code.

**For Each Instance, Decide:**
- Can it be moved to external .js file? (preferred)
- Is it initialization code? (move to DOMContentLoaded in main.js)
- Is it a module loader? (ensure proper src attribute)

#### Task 1.3: Audit Dynamic eval/Function Usage

**Search Command:**
```bash
# Find dangerous dynamic code execution
grep -rn "\(eval(\|Function(\|setTimeout.*[\"']\|setInterval.*[\"']\)" \
  --include="*.js" \
  tools/ home/ shared/ \
  > CSP_AUDIT_DYNAMIC_CODE.txt

cat CSP_AUDIT_DYNAMIC_CODE.txt
```

**Expected:** 0 instances (architecture review confirmed none exist).

**If Found:** Must refactor to eliminate.

#### Task 1.4: Design New CSP Policy

**Considerations:**

1. **script-src Whitelist:**
   - `'self'` - All our scripts
   - NO 'unsafe-inline'
   - NO 'unsafe-eval'
   - NO external CDNs (libraries are local now)

2. **style-src:**
   - `'self'` - Our CSS files
   - `'unsafe-inline'` - OK for inline styles (lower risk)
   - Consider nonces for critical styles

3. **img-src:**
   - `'self'` - Our images
   - `data:` - Base64 images (needed for charts)
   - `https:` - Allow HTTPS images (for future embeds)

4. **frame-ancestors:**
   - `'none'` - Prevent clickjacking

**Final Policy:**
```toml
Content-Security-Policy = "
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
"
```

**Deliverable:** `CSP_MIGRATION_PLAN.md` with:
- Complete audit results
- List of changes required
- New CSP policy
- Testing strategy

---

### Phase 2: Remove Inline Handlers (Day 2 - 8 hours)

#### Task 2.1: Refactor Pattern - Simple onclick

**Example from audit:**

**BEFORE (inline handler):**
```html
<!-- index.html -->
<button id="themeToggle" onclick="toggleTheme()">
  Toggle Theme
</button>

<script>
  function toggleTheme() {
    // theme logic
  }
</script>
```

**AFTER (addEventListener):**
```html
<!-- index.html -->
<button id="themeToggle">
  Toggle Theme
</button>

<script type="module">
  import { toggleTheme } from './shared/js/theme.js';
  
  document.getElementById('themeToggle')
    .addEventListener('click', toggleTheme);
</script>
```

Or better, delegate in main app initialization:
```javascript
// shared/js/app.js
document.addEventListener('DOMContentLoaded', () => {
  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', theme.toggle.bind(theme));
  }
});
```

#### Task 2.2: Refactor Pattern - Form Events

**BEFORE:**
```html
<input 
  type="number" 
  id="loanAmount"
  oninput="validateInput(this)"
  onchange="calculateEMI()"
>
```

**AFTER:**
```html
<input 
  type="number" 
  id="loanAmount"
>

<script type="module">
  const loanAmountInput = document.getElementById('loanAmount');
  
  loanAmountInput.addEventListener('input', (e) => {
    validateInput(e.target);
  });
  
  loanAmountInput.addEventListener('change', () => {
    calculateEMI();
  });
</script>
```

#### Task 2.3: Refactor Pattern - Event Delegation

**For multiple similar elements:**

**BEFORE:**
```html
<div class="buttons">
  <button onclick="handleClick('btn1')">Button 1</button>
  <button onclick="handleClick('btn2')">Button 2</button>
  <button onclick="handleClick('btn3')">Button 3</button>
</div>
```

**AFTER:**
```html
<div class="buttons" id="buttonContainer">
  <button data-action="btn1">Button 1</button>
  <button data-action="btn2">Button 2</button>
  <button data-action="btn3">Button 3</button>
</div>

<script type="module">
  document.getElementById('buttonContainer')
    .addEventListener('click', (e) => {
      if (e.target.matches('button')) {
        const action = e.target.dataset.action;
        handleClick(action);
      }
    });
</script>
```

#### Task 2.4: Move Inline Scripts to External Files

**For any inline initialization scripts:**

**BEFORE:**
```html
<!-- index.html -->
<script>
  // Initialize app
  document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    setupRouter();
    loadTool();
  });
</script>
```

**AFTER:**
```html
<!-- index.html -->
<script type="module" src="./shared/js/app.js"></script>
```

```javascript
// shared/js/app.js
import { theme } from './theme.js';
import { router } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
  theme.initialize();
  router.setup();
  router.loadCurrentRoute();
});
```

#### Files Likely Requiring Changes

Based on typical patterns, expect changes in:

1. **index.html**
   - Theme toggle button
   - Navigation links (if any)
   - Move initialization to app.js

2. **home/home.html** (if any inline handlers)
   - Tool card click handlers (probably already in home.js)

3. **tools/*/index.html**
   - Form submit handlers (probably already in tool JS)
   - Button click handlers (probably already in tool JS)

**Most likely:** Very few changes needed - codebase probably already follows best practices.

---

### Phase 3: Update CSP (Day 3 Morning - 2 hours)

#### Task 3.1: Update wrangler.toml

**File: wrangler.toml**

**BEFORE:**
```toml
[[headers]]
for = "/*"
  [headers.values]
  Content-Security-Policy = "default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self';"
```

**AFTER:**
```toml
[[headers]]
for = "/*"
  [headers.values]
  Content-Security-Policy = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;"
```

**Changes:**
- ❌ Removed: `script-src 'unsafe-inline'`
- ✅ Added: `font-src 'self'` (for custom fonts)
- ✅ Added: `connect-src 'self'` (for fetch/XHR)
- ✅ Added: `frame-ancestors 'none'` (clickjacking protection)
- ✅ Added: `upgrade-insecure-requests` (force HTTPS)
- ✅ Updated: `img-src` to include `https:` (for future flexibility)
- ✅ Kept: `style-src 'unsafe-inline'` (safe, needed for inline styles)

#### Task 3.2: Test Locally First

**Before deploying to Cloudflare:**

1. **Test with CSP Report-Only mode:**
   ```toml
   # Temporary - for testing
   Content-Security-Policy-Report-Only = "default-src 'self'; script-src 'self'; ..."
   ```
   
   This logs violations without blocking. Check console for violations.

2. **Once clean, switch to enforcing:**
   ```toml
   Content-Security-Policy = "default-src 'self'; script-src 'self'; ..."
   ```

#### Task 3.3: Add CSP Meta Tag (Optional Backup)

**In case Cloudflare headers don't work:**

Add to `<head>` of index.html:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self'; ...">
```

**Note:** Header-based CSP is preferred, but meta tag is a good fallback.

---

### Phase 4: Validation (Day 3 Afternoon - 4 hours)

#### Task 4.1: CSP Violation Monitoring

**Test 1: Check for Violations**

1. Open each tool in Chrome DevTools
2. Check Console tab
3. Look for CSP violation errors:
   ```
   Refused to execute inline script because it violates CSP
   Refused to load script from ... because it violates CSP
   ```

4. ✅ **Expected:** 0 CSP violations

**Test 2: Verify CSP Active**

1. Open Chrome DevTools → Network tab
2. Load any page
3. Click on page request (document)
4. Check Response Headers
5. ✅ **Expected:** See `Content-Security-Policy` header with new policy

**Test 3: Try to Bypass CSP**

In browser console, try dangerous operations:
```javascript
// Should all FAIL with CSP error:
eval('alert("xss")');  // Should be blocked
new Function('alert("xss")')();  // Should be blocked
```

✅ **Expected:** Both blocked by CSP

#### Task 4.2: Functional Testing

Test all core functionality in every tool:

**JSON Schema Converter:**
- [ ] Load sample JSON
- [ ] Generate schema
- [ ] Validate JSON
- [ ] Copy to clipboard
- [ ] Download schema
- [ ] All buttons work
- [ ] No console errors

**SIP Calculator:**
- [ ] Enter investment amount
- [ ] Set rate and tenure
- [ ] Enable step-up
- [ ] Click Calculate
- [ ] Chart renders
- [ ] Table displays
- [ ] Export CSV
- [ ] Copy table
- [ ] No console errors

**EMI Calculator:**
- [ ] Enter loan details
- [ ] Click Calculate EMI
- [ ] Chart renders
- [ ] Amortization table displays
- [ ] Add prepayment
- [ ] Recalculate
- [ ] Export schedule
- [ ] No console errors

**Text Diff Checker:**
- [ ] Enter two texts
- [ ] Click Compare
- [ ] Diff renders with colors
- [ ] Switch diff modes
- [ ] Copy diff
- [ ] No console errors

**HTML/Markdown Converter:**
- [ ] Enter HTML
- [ ] Convert to Markdown
- [ ] Preview renders safely
- [ ] Convert Markdown to HTML
- [ ] Preview renders
- [ ] Copy output
- [ ] No console errors

**Home Page:**
- [ ] All tool cards display
- [ ] Click each card
- [ ] Navigation works
- [ ] Theme toggle works
- [ ] No console errors

#### Task 4.3: Security Validation

**XSS Attack Tests:**

Test that CSP blocks common XSS vectors:

```javascript
// In browser console - all should FAIL:

// 1. Inline script execution
const script = document.createElement('script');
script.textContent = 'alert("xss")';
document.body.appendChild(script);
// ✅ Expected: CSP blocks (no alert)

// 2. eval() attack
eval('alert("xss")');
// ✅ Expected: Error (eval not allowed by CSP)

// 3. Function constructor
new Function('alert("xss")')();
// ✅ Expected: Error (Function constructor blocked)

// 4. setTimeout with string
setTimeout('alert("xss")', 100);
// ✅ Expected: Error (string eval blocked)

// 5. Inline event handler injection
const btn = document.createElement('button');
btn.setAttribute('onclick', 'alert("xss")');
document.body.appendChild(btn);
btn.click();
// ✅ Expected: No alert (inline handler blocked)
```

**Test XSS Vectors from Security Audit:**
```html
<!-- Try to inject these (should all be blocked): -->
<img src=x onerror=alert(1)>  ← Blocked by CSP
<svg onload=alert(1)>  ← Blocked by CSP
<script>alert(1)</script>  ← Blocked by CSP
<iframe src="javascript:alert(1)">  ← Blocked by CSP
```

#### Task 4.4: Performance Testing

Ensure CSP doesn't impact performance:

**Benchmark:**
- Page load time: Should be unchanged (~1s)
- Tool initialization: Should be unchanged (~500ms)
- No additional network requests
- No additional console overhead

**Test:**
1. Open DevTools → Performance tab
2. Reload page
3. Check timing metrics
4. ✅ **Expected:** No performance regression

#### Task 4.5: Browser Compatibility

Test CSP enforcement across browsers:

- [ ] **Chrome 90+**: CSP active, 0 violations
- [ ] **Firefox 88+**: CSP active, 0 violations
- [ ] **Safari 14+**: CSP active, 0 violations
- [ ] **Edge 90+**: CSP active, 0 violations

**Known Issues:**
- Older browsers may not support all CSP directives
- Safari has different CSP implementation (test carefully)
- Mobile browsers (test on iOS Safari, Chrome Android)

---

## Testing Checklist

### Pre-Deployment Testing

- [ ] CSP policy updated in wrangler.toml
- [ ] 0 inline event handlers remain in production files
- [ ] 0 inline scripts without src remain
- [ ] Local testing shows 0 CSP violations
- [ ] All 6 tools fully functional
- [ ] All 52 automated tests passing
- [ ] Security tests pass (XSS vectors blocked)
- [ ] Performance unchanged

### Post-Deployment Monitoring

Day 1 after deployment:
- [ ] Monitor Cloudflare logs for CSP violations
- [ ] Check user reports for broken features
- [ ] Review error tracking (if implemented)

Week 1 after deployment:
- [ ] No CSP-related user complaints
- [ ] No CSP violations in production logs
- [ ] Performance metrics stable

---

## Rollback Plan

### Immediate Rollback (if critical issues found)

**Option 1: Revert CSP only**
```bash
# Restore old wrangler.toml with unsafe-inline
git checkout main -- wrangler.toml
git commit -m "rollback: Restore unsafe-inline CSP (temporary)"
git push

# Cloudflare auto-deploys in ~1 minute
```

**Option 2: Add temporary nonce**
```toml
# Emergency fallback - use nonce for inline scripts
Content-Security-Policy = "script-src 'self' 'nonce-RANDOM_VALUE';"
```

Then add nonce to any problematic inline scripts:
```html
<script nonce="RANDOM_VALUE">
  // Inline code that needs to run
</script>
```

**Option 3: Full rollback**
```bash
# Revert all changes from this ticket
git revert <commit-hash-range>
git push
```

### Partial Rollback (if specific feature breaks)

```bash
# Just revert the problematic file
git checkout main -- path/to/file.html
git commit -m "rollback: Restore inline handlers for [specific feature]"
```

---

## Files to Change

**Definitely:**
- `wrangler.toml` (CSP policy update)

**Possibly (based on audit):**
- `index.html` (remove any inline handlers)
- `home/home.html` (remove any inline handlers)
- `tools/*/index.html` (unlikely - already modular)
- `shared/js/app.js` (move initialization code here)

**Won't Change (test files):**
- `tools/*/automated-tests.html` (not deployed to production)
- `test-*.html` (not deployed to production)

---

## Success Metrics

**Before:**
- ❌ CSP includes `unsafe-inline` (defeats purpose)
- ❌ Inline event handlers may exist
- ❌ XSS attacks not prevented by CSP
- ⚠️ Security Grade: C+ (76/100)

**After:**
- ✅ Strict CSP (no `unsafe-inline` for scripts)
- ✅ 0 inline event handlers in production
- ✅ XSS attacks blocked by CSP (10/10 test vectors)
- ✅ Security Grade: B+ (85/100) - **+9 points**
- ✅ All features work
- ✅ No performance regression

---

## Documentation Updates

After implementation, update:

**1. docs/SECURITY_AUDIT_EXECUTIVE_SUMMARY.md:**
```markdown
## CSP Status: ✅ HARDENED

Content Security Policy updated to production standards:
- Removed `unsafe-inline` from script-src
- Strict policy prevents XSS attacks
- All inline handlers refactored to addEventListener
- CSP validated with 0 violations
```

**2. wrangler.toml (add comments):**
```toml
# Content Security Policy - Production-Hardened
# No unsafe-inline: XSS attacks prevented
# Last updated: [Date] - TICKET: BOTH-1
[[headers]]
for = "/*"
  [headers.values]
  Content-Security-Policy = "..."
```

**3. docs/DEVELOPER_GUIDE.md:**
```markdown
## Security Guidelines

### Content Security Policy

Our CSP is strict and prohibits:
- ❌ Inline event handlers (onclick, onerror, etc.)
- ❌ Inline scripts without src
- ❌ eval() and Function() constructor
- ❌ setTimeout/setInterval with string arguments

**Always use:**
✅ External script files
✅ addEventListener for events  
✅ Proper function references
```

---

## Related Tickets

**Depends On:**
- **ARCH-2:** Local libraries (must be done first - no CDN in CSP)

**Enables:**
- **SEC-1:** innerHTML sanitization (CSP provides defense-in-depth)
- **ARCH-3:** Error boundaries (needs clean CSP for proper error handling)

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Break existing features | MEDIUM | HIGH | Thorough testing, incremental deployment |
| Miss inline handlers in audit | LOW | MEDIUM | Automated search, manual review |
| Browser compatibility | LOW | MEDIUM | Test in 4 browsers before deployment |
| User complaints | LOW | HIGH | Staging environment test first |

---

## Code Review Checklist

**Before Requesting Review:**
- [ ] Audit report complete (CSP_AUDIT_REPORT.md)
- [ ] All inline handlers removed (0 in production files)
- [ ] wrangler.toml updated with strict CSP
- [ ] All tools tested and working
- [ ] 0 CSP violations in console
- [ ] All automated tests passing (52/52)
- [ ] XSS vectors blocked (10/10)
- [ ] Documentation updated

**Reviewer Checklist:**
- [ ] CSP policy strictly disallows inline scripts
- [ ] No inline event handlers in production HTML
- [ ] All addEventListener properly scoped
- [ ] No eval or Function constructor usage
- [ ] Test files (not deployed) can be ignored
- [ ] Rollback plan clear and tested

---

## Timeline

| Day | Phase | Duration | Deliverable |
|-----|-------|----------|-------------|
| **1 (PM)** | Audit | 4 hours | CSP_AUDIT_REPORT.md |
| **2 (Full)** | Refactor | 8 hours | 0 inline handlers |
| **3 (AM)** | Update CSP | 2 hours | wrangler.toml updated |
| **3 (PM)** | Validate | 4 hours | Security tests pass |
| **Total** | | **18 hours** | **~2 days** |

---

**Status:** READY FOR IMPLEMENTATION  
**Blocked By:** ARCH-2 (local libraries)  
**Blocking:** SEC-1 (innerHTML sanitization works better with strict CSP)

**Priority Justification:** Flagged as critical by **BOTH** architecture and security reviews. Foundational security fix that enables other security hardening.
