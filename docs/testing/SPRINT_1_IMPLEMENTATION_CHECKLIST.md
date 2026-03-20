# Sprint 1 Implementation Checklist
## Developer Quick-Start Guide

**Goal:** Fix 3 critical security vulnerabilities in 6 hours

---

## ✅ TICKET-CRIT-1: Add SRI Hashes (2 hours)

### Step 1: Generate SRI Hashes (15 min)

```bash
# Generate hash for Chart.js
echo -n "sha384-" && curl -s https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js | \
  openssl dgst -sha384 -binary | openssl base64 -A

# Generate hash for jsdiff
echo -n "sha384-" && curl -s https://cdn.jsdelivr.net/npm/diff@5.1.0/dist/diff.min.js | \
  openssl dgst -sha384 -binary | openssl base64 -A

# Generate hash for DOMPurify
echo -n "sha384-" && curl -s https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js | \
  openssl dgst -sha384 -binary | openssl base64 -A

# Generate hash for Marked
echo -n "sha384-" && curl -s https://cdn.jsdelivr.net/npm/marked@9.1.6/marked.min.js | \
  openssl dgst -sha384 -binary | openssl base64 -A

# Generate hash for Turndown
echo -n "sha384-" && curl -s https://cdn.jsdelivr.net/npm/turndown@7.1.2/dist/turndown.min.js | \
  openssl dgst -sha384 -binary | openssl base64 -A
```

### Step 2: Update HTML Files (45 min)

#### File 1: tools/sip-calculator/index.html (Line 283)
**BEFORE:**
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js"></script>
```

**AFTER:**
```html
<script 
  src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js"
  integrity="sha384-[YOUR_GENERATED_HASH_HERE]"
  crossorigin="anonymous">
</script>
```

#### File 2: tools/emi-calculator/index.html (Line 326)
**BEFORE:**
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
```

**AFTER:**
```html
<script 
  src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"
  integrity="sha384-[YOUR_GENERATED_HASH_HERE]"
  crossorigin="anonymous">
</script>
```

#### File 3: tools/text-diff/index.html (Line 177)
**BEFORE:**
```html
<script src="https://cdn.jsdelivr.net/npm/diff@5.1.0/dist/diff.min.js"></script>
```

**AFTER:**
```html
<script 
  src="https://cdn.jsdelivr.net/npm/diff@5.1.0/dist/diff.min.js"
  integrity="sha384-[YOUR_GENERATED_HASH_HERE]"
  crossorigin="anonymous">
</script>
```

### Step 3: Update Dynamic Loading (30 min)

#### File 4: tools/html-markdown/html-markdown.js

**BEFORE (Lines 12-14):**
```javascript
const TURNDOWN_CDN = 'https://cdn.jsdelivr.net/npm/turndown@7.1.2/dist/turndown.min.js';
const MARKED_CDN = 'https://cdn.jsdelivr.net/npm/marked@9.1.6/marked.min.js';
const DOMPURIFY_CDN = 'https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js';
```

**AFTER:**
```javascript
const LIBRARIES = {
  turndown: {
    url: 'https://cdn.jsdelivr.net/npm/turndown@7.1.2/dist/turndown.min.js',
    integrity: 'sha384-[YOUR_GENERATED_HASH_HERE]'
  },
  marked: {
    url: 'https://cdn.jsdelivr.net/npm/marked@9.1.6/marked.min.js',
    integrity: 'sha384-[YOUR_GENERATED_HASH_HERE]'
  },
  dompurify: {
    url: 'https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js',
    integrity: 'sha384-[YOUR_GENERATED_HASH_HERE]'
  }
};
```

**Update function calls (Lines 204, 262, 265):**
```javascript
// BEFORE:
await loadLibrary('turndown', TURNDOWN_CDN);
await loadLibrary('marked', MARKED_CDN);
await loadLibrary('dompurify', DOMPURIFY_CDN);

// AFTER:
await loadLibrary('turndown', LIBRARIES.turndown);
await loadLibrary('marked', LIBRARIES.marked);
await loadLibrary('dompurify', LIBRARIES.dompurify);
```

**Update loadLibrary function (Lines 313-320):**
```javascript
// BEFORE:
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

// AFTER:
function loadLibrary(name, config) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = config.url;
    script.integrity = config.integrity;
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      librariesLoaded[name] = true;
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load ${name} library`));
    document.head.appendChild(script);
  });
}
```

### Step 4: Test (30 min)
```bash
# 1. Open tools in browser
# 2. Check Console for SRI errors (should be none)
# 3. Verify tools function correctly
# 4. Test with network throttling
```

**✅ DONE:** Notify Test Specialist

---

## ✅ TICKET-CRIT-5: Local Libraries (3 hours)

### Step 1: Create Directory (1 min)
```bash
cd /home/ravi/projects/json-schema-converter
mkdir -p lib
cd lib
```

### Step 2: Download Libraries (10 min)
```bash
# Chart.js
curl -o chart.umd.min.js https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js

# DOMPurify
curl -o purify.min.js https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js

# Marked
curl -o marked.min.js https://cdn.jsdelivr.net/npm/marked@9.1.6/marked.min.js

# Turndown
curl -o turndown.min.js https://cdn.jsdelivr.net/npm/turndown@7.1.2/dist/turndown.min.js

# jsdiff
curl -o diff.min.js https://cdn.jsdelivr.net/npm/diff@5.1.0/dist/diff.min.js
```

### Step 3: Verify Downloads (2 min)
```bash
# Check all files exist and are not empty
ls -lh

# Should see:
# chart.umd.min.js (~200KB)
# purify.min.js (~40KB)
# marked.min.js (~70KB)
# turndown.min.js (~20KB)
# diff.min.js (~80KB)
```

### Step 4: Update HTML References (1 hour)

#### File 1: tools/sip-calculator/index.html (Line 283)
**BEFORE:**
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js"></script>
```

**AFTER:**
```html
<script src="/lib/chart.umd.min.js"></script>
```

#### File 2: tools/emi-calculator/index.html (Line 326)
**BEFORE:**
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
```

**AFTER:**
```html
<script src="/lib/chart.umd.min.js"></script>
```

#### File 3: tools/text-diff/index.html (Line 177)
**BEFORE:**
```html
<script src="https://cdn.jsdelivr.net/npm/diff@5.1.0/dist/diff.min.js"></script>
```

**AFTER:**
```html
<script src="/lib/diff.min.js"></script>
```

### Step 5: Update JavaScript References (30 min)

#### File 4: tools/html-markdown/html-markdown.js (Lines 12-14)
**BEFORE:**
```javascript
const TURNDOWN_CDN = 'https://cdn.jsdelivr.net/npm/turndown@7.1.2/dist/turndown.min.js';
const MARKED_CDN = 'https://cdn.jsdelivr.net/npm/marked@9.1.6/marked.min.js';
const DOMPURIFY_CDN = 'https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js';
```

**AFTER:**
```javascript
const TURNDOWN_LOCAL = '/lib/turndown.min.js';
const MARKED_LOCAL = '/lib/marked.min.js';
const DOMPURIFY_LOCAL = '/lib/purify.min.js';
```

**Update function calls (Lines 204, 262, 265):**
```javascript
// BEFORE:
await loadLibrary('turndown', TURNDOWN_CDN);
await loadLibrary('marked', MARKED_CDN);
await loadLibrary('dompurify', DOMPURIFY_CDN);

// AFTER:
await loadLibrary('turndown', TURNDOWN_LOCAL);
await loadLibrary('marked', MARKED_LOCAL);
await loadLibrary('dompurify', DOMPURIFY_LOCAL);
```

### Step 6: Test Offline (1 hour)
```bash
# 1. Start local server
python3 -m http.server 8000

# 2. Open browser to http://localhost:8000
# 3. Open DevTools → Network tab
# 4. Filter for "cdn.jsdelivr.net" (should show 0 requests)
# 5. Verify all tools function correctly
# 6. Test with DevTools → Network → Offline mode
```

**Verification Checklist:**
- [ ] 0 requests to cdn.jsdelivr.net
- [ ] All /lib/*.js files load with 200 OK
- [ ] SIP Calculator works (chart renders)
- [ ] EMI Calculator works (chart renders)
- [ ] HTML/Markdown works (conversion + preview)
- [ ] Text Diff works (diff display)
- [ ] Tools work in offline mode

**✅ DONE:** Notify Test Specialist

---

## ✅ TICKET-CRIT-2-PREP: CSP Audit (1 hour)

### Step 1: Run Audit Scripts (10 min)
```bash
cd /home/ravi/projects/json-schema-converter

# Count inline styles
echo "=== Inline Styles ===" > csp-audit.txt
grep -rn "style=" tools/ --include="*.html" | grep -v "test" >> csp-audit.txt
echo "" >> csp-audit.txt

# Count event handlers
echo "=== Inline Event Handlers ===" >> csp-audit.txt
grep -rn " on[a-z]*=" tools/ --include="*.html" | grep -v "test" >> csp-audit.txt
echo "" >> csp-audit.txt

# Count inline scripts
echo "=== Inline Scripts ===" >> csp-audit.txt
grep -rn "<script>" tools/ --include="*.html" | grep -v "src=" | grep -v "test" >> csp-audit.txt
```

### Step 2: Create Migration Plan (30 min)
```bash
# Create documentation file
touch docs/CSP_MIGRATION_PLAN.md
```

**Template:** Use this structure

```markdown
# CSP Migration Plan

## Audit Results

### Inline Styles: 27
[List all 27 with file:line references]

### Inline Event Handlers: 0 ✅
All event handlers already use addEventListener()

### Inline Scripts: 0 ✅
All scripts are external files

## Migration Strategy

### Phase 1: Convert Inline Styles to CSS Classes
**Effort:** 4 hours
**Files affected:** [List 5 tools]

Example migration:
```html
<!-- BEFORE -->
<div style="display: flex; gap: 1rem;">

<!-- AFTER -->
<div class="flex-row gap-1">
```

### Phase 2: Update CSS Files
**Effort:** 2 hours
Add new utility classes to shared/css/utilities.css

### Phase 3: Test All Tools
**Effort:** 2 hours
Verify layout and styling unchanged

## Target CSP Policy

```
Content-Security-Policy: 
  default-src 'self';
  script-src 'self';
  style-src 'self';
  img-src 'self' data:;
  font-src 'self';
  connect-src 'self';
```

## Timeline

- Sprint 2 (Days 3-5): Implement inline style migration
- Sprint 2 (Day 5): Test CSP enforcement
- Sprint 2 (Day 5): Deploy with CSP headers
```

### Step 3: Document Examples (20 min)

Pick 5 examples of inline styles and document the migration plan:

```markdown
## Example Migrations

### Example 1: JSON Schema Tool
**File:** tools/json-schema/index.html:45
**Current:** `<div style="margin-bottom: 1rem;">`
**New:** `<div class="mb-1">`
**CSS:** `.mb-1 { margin-bottom: 1rem; }`

[... 4 more examples ...]
```

**✅ DONE:** Notify Test Specialist

---

## Combined Approach (RECOMMENDED)

If doing TICKET-CRIT-1 + TICKET-CRIT-5 together, you can:

1. Download libraries to `/lib/` (10 min)
2. Update all references to use `/lib/` (2 hours)
3. Skip SRI hashes for local files (they're not needed for same-origin)
4. Test thoroughly (1 hour)

**Time Saved:** 1 hour (no need to generate/manage SRI hashes for local files)

---

## Testing Commands

After each ticket, run these checks:

```bash
# Verify no CDN requests
grep -r "cdn.jsdelivr.net" tools/ --include="*.html" --include="*.js"
# Expected: 0 matches (after TICKET-CRIT-5)

# Verify local files exist
ls -lh lib/
# Expected: 5 files

# Verify CSP doc exists
ls docs/CSP_MIGRATION_PLAN.md
# Expected: File exists

# Start test server
python3 -m http.server 8000
# Open http://localhost:8000 in browser
```

---

## Done Criteria

### TICKET-CRIT-1 ✅
- [ ] All 6 CDN scripts have `integrity` attribute
- [ ] All 6 CDN scripts have `crossorigin="anonymous"`
- [ ] loadLibrary() function adds integrity/crossorigin
- [ ] No console errors about SRI
- [ ] Test Specialist validates with S1-1, S1-2, S1-3

### TICKET-CRIT-5 ✅
- [ ] /lib/ directory contains 5 library files
- [ ] All HTML files reference /lib/ not CDN
- [ ] html-markdown.js uses local paths
- [ ] 0 requests to cdn.jsdelivr.net
- [ ] All tools work in offline mode
- [ ] Test Specialist validates with S1-4, S1-5, S1-6, S1-7

### TICKET-CRIT-2-PREP ✅
- [ ] docs/CSP_MIGRATION_PLAN.md exists
- [ ] Document lists all 27 inline styles
- [ ] Migration strategy is documented
- [ ] Effort estimates provided
- [ ] Target CSP policy defined
- [ ] Test Specialist validates with S1-8, S1-9, S1-10

---

## Need Help?

- **Implementation Guide:** docs/tickets/SPRINT_1_IMPLEMENTATION_TICKETS.md
- **Test Cases:** docs/tickets/SPRINT_1_TEST_VALIDATION.md  
- **Test Report:** docs/testing/SPRINT_1_VALIDATION_REPORT.md

---

**Estimated Total Time:** 6 hours  
**Expected Completion:** End of Day 2 (Sprint 1)

🚀 **Let's fix these security issues!**
