# TICKET: ARCH-2 - Local Libraries with SRI Hashes

**Priority:** P0 (Critical - Quick Win)  
**Effort:** 2 hours  
**Owner:** Test-Specialist  
**Reviewer:** Tech Lead  
**Dependencies:** None (can start immediately)  
**Sprint Day:** Day 1 Morning  

---

## Problem Statement

External JavaScript libraries are loaded from CDN without local copies or integrity verification. This violates the architecture specification and creates security and reliability risks:

1. **Architecture Violation:** Libraries should be in `/lib/` folder per spec
2. **Security Risk:** No SRI (Subresource Integrity) hashes - vulnerable to CDN compromise
3. **Reliability Risk:** CDN failure breaks the platform
4. **Performance Risk:** Extra DNS lookups and connections

**Current State:**
```html
<!-- tools/sip-calculator/sip-calculator.html -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js"></script>

<!-- tools/html-markdown/html-markdown.js (dynamic loading) -->
const TURNDOWN_CDN = 'https://cdn.jsdelivr.net/npm/turndown@7.1.2/dist/turndown.min.js';
```

**Target State:**
```html
<!-- Local with SRI hash -->
<script 
  src="/lib/chart.min.js" 
  integrity="sha384-HASH_HERE"
  crossorigin="anonymous">
</script>
```

---

## Acceptance Criteria

- [ ] `/lib/` directory created with all 5 libraries
- [ ] All libraries downloaded (Chart.js, DOMPurify, jsdiff, Turndown, Marked)
- [ ] SRI hashes generated for each library
- [ ] All HTML files updated to use local paths with SRI
- [ ] All tools load without CDN access
- [ ] Offline functionality works (network disconnected test)
- [ ] No performance regression
- [ ] No console errors

---

## Implementation Steps

### Step 1: Create Library Directory (5 minutes)

```bash
cd /home/ravi/projects/json-schema-converter

# Create lib directory
mkdir -p lib

# Verify structure
ls -la lib/
```

---

### Step 2: Download Libraries (15 minutes)

Download each library from CDN and save to `/lib/`:

```bash
cd lib

# 1. Chart.js v4.4.0 (~50KB)
curl -o chart.min.js \
  https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js

# 2. DOMPurify v3.0.6 (~25KB)
curl -o dompurify.min.js \
  https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js

# 3. jsdiff v5.1.0 (~11KB)
curl -o jsdiff.min.js \
  https://cdn.jsdelivr.net/npm/diff@5.1.0/dist/diff.min.js

# 4. Turndown v7.1.2 (~20KB)
curl -o turndown.min.js \
  https://cdn.jsdelivr.net/npm/turndown@7.1.2/dist/turndown.min.js

# 5. Marked v9.1.6 (~20KB)
curl -o marked.min.js \
  https://cdn.jsdelivr.net/npm/marked@9.1.6/marked.min.js

# Verify all files downloaded
ls -lh
```

**Expected Output:**
```
-rw-r--r-- 1 user user  50K chart.min.js
-rw-r--r-- 1 user user  25K dompurify.min.js
-rw-r--r-- 1 user user  11K jsdiff.min.js
-rw-r--r-- 1 user user  20K turndown.min.js
-rw-r--r-- 1 user user  20K marked.min.js
```

---

### Step 3: Generate SRI Hashes (20 minutes)

Generate SHA-384 integrity hashes for each library:

```bash
cd lib

# Function to generate SRI hash
generate_sri() {
  echo "$1:"
  openssl dgst -sha384 -binary "$1" | openssl base64 -A
  echo ""
  echo ""
}

# Generate all hashes
generate_sri chart.min.js
generate_sri dompurify.min.js
generate_sri jsdiff.min.js
generate_sri turndown.min.js
generate_sri marked.min.js
```

**Save output to:** `lib/SRI_HASHES.txt`

**Expected Format:**
```
chart.min.js:
sha384-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX==

dompurify.min.js:
sha384-YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY==

[etc.]
```

**Alternative (online tool):**
Visit https://www.srihash.org/ and paste file contents to generate hashes.

---

### Step 4: Update HTML Files (40 minutes)

Update 5 tool HTML files to use local libraries with SRI hashes:

#### File 1: tools/sip-calculator/sip-calculator.html

**BEFORE:**
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js"></script>
```

**AFTER:**
```html
<script 
  src="/lib/chart.min.js"
  integrity="sha384-[HASH_FROM_STEP_3]"
  crossorigin="anonymous">
</script>
```

#### File 2: tools/emi-calculator/emi-calculator.html

**BEFORE:**
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
```

**AFTER:**
```html
<script 
  src="/lib/chart.min.js"
  integrity="sha384-[HASH_FROM_STEP_3]"
  crossorigin="anonymous">
</script>
```

#### File 3: tools/text-diff/text-diff.html

**BEFORE:**
```html
<script src="https://cdn.jsdelivr.net/npm/diff@5.1.0/dist/diff.min.js"></script>
```

**AFTER:**
```html
<script 
  src="/lib/jsdiff.min.js"
  integrity="sha384-[HASH_FROM_STEP_3]"
  crossorigin="anonymous">
</script>
```

#### File 4: tools/html-markdown/html-markdown.js

**BEFORE:**
```javascript
const TURNDOWN_CDN = 'https://cdn.jsdelivr.net/npm/turndown@7.1.2/dist/turndown.min.js';
const MARKED_CDN = 'https://cdn.jsdelivr.net/npm/marked@9.1.6/marked.min.js';
const DOMPURIFY_CDN = 'https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js';

if (!window.Turndown) {
  await this.loadScript(TURNDOWN_CDN);
}
```

**AFTER:**
```javascript
const TURNDOWN_LOCAL = '/lib/turndown.min.js';
const MARKED_LOCAL = '/lib/marked.min.js';
const DOMPURIFY_LOCAL = '/lib/dompurify.min.js';

if (!window.Turndown) {
  await this.loadScript(TURNDOWN_LOCAL);
}
```

**Note:** SRI hashes cannot be added to dynamically loaded scripts easily. Consider loading libraries in HTML instead:

**Better Approach - Update tools/html-markdown/html-markdown.html:**
```html
<!-- Add to <head> section -->
<script 
  src="/lib/turndown.min.js"
  integrity="sha384-[HASH]"
  crossorigin="anonymous">
</script>
<script 
  src="/lib/marked.min.js"
  integrity="sha384-[HASH]"
  crossorigin="anonymous">
</script>
<script 
  src="/lib/dompurify.min.js"
  integrity="sha384-[HASH]"
  crossorigin="anonymous">
</script>
```

Then update html-markdown.js to remove dynamic loading:
```javascript
// Remove loadScript calls - libraries already loaded in HTML
// Just check if they exist:
if (!window.Turndown || !window.marked || !window.DOMPurify) {
  throw new Error('Required libraries not loaded');
}
```

---

### Step 5: Update CSP Policy (10 minutes)

Update `wrangler.toml` to remove CDN domains from CSP (will be done in CSP ticket, but verify no CDN needed):

```toml
# BEFORE
script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;

# AFTER (eventually)
script-src 'self';
```

**For now:** Just verify local libraries work with current CSP.

---

## Testing Checklist

### Functional Testing

**Test Environment Setup:**
```bash
# Start local server
cd /home/ravi/projects/json-schema-converter
python3 -m http.server 8080

# Open browser to http://localhost:8080
```

**Test Each Tool:**

- [ ] **JSON Schema Converter**
  - Navigate to tool
  - Load sample JSON
  - Generate schema
  - Validate JSON
  - ✅ No errors

- [ ] **SIP Calculator**
  - Navigate to tool
  - Enter investment details
  - Click Calculate
  - ✅ Chart renders (Chart.js loaded)
  - ✅ Table displays
  - ✅ No console errors

- [ ] **EMI Calculator**
  - Navigate to tool
  - Enter loan details
  - Click Calculate EMI
  - ✅ Chart renders (Chart.js loaded)
  - ✅ Amortization table displays
  - ✅ No console errors

- [ ] **Text Diff Checker**
  - Navigate to tool
  - Enter two texts
  - Click Compare
  - ✅ Diff displays (jsdiff loaded)
  - ✅ Color-coded differences
  - ✅ No console errors

- [ ] **HTML/Markdown Converter**
  - Navigate to tool
  - Enter HTML content
  - Convert to Markdown
  - ✅ Conversion works (Turndown loaded)
  - Convert Markdown to HTML
  - ✅ Conversion works (Marked loaded)
  - ✅ Preview safe (DOMPurify loaded)
  - ✅ No console errors

- [ ] **Home Page**
  - Navigate to home
  - ✅ All tool cards display
  - ✅ Navigation works
  - ✅ No console errors

---

### Security Testing

**Test 1: SRI Validation Works**

1. Open browser DevTools → Network tab
2. Reload page
3. Find library request (e.g., chart.min.js)
4. Verify integrity attribute present:
   ```
   integrity="sha384-..."
   ```

**Test 2: SRI Blocks Tampered Files**

1. Edit `/lib/chart.min.js` - add a comment: `// tampered`
2. Reload page with SIP or EMI Calculator
3. ✅ **Expected:** Console error: "Failed to find a valid digest in 'integrity' attribute"
4. Revert change to chart.min.js
5. ✅ **Expected:** Tool works again

---

### Offline Testing

**Test: Platform Works Without Internet**

1. Open Chrome DevTools → Network tab
2. Enable "Offline" mode (checkbox at top)
3. Reload page
4. Navigate to each tool
5. ✅ **Expected:** All tools work (no network requests for libraries)
6. Test key features on each tool
7. ✅ **Expected:** Full functionality without CDN

**Alternative (Command Line):**
```bash
# Disconnect network
sudo ifconfig wlan0 down

# Open browser and test

# Reconnect network
sudo ifconfig wlan0 up
```

---

### Performance Testing

**Benchmark Before/After:**

**Before (CDN):**
```
- DNS lookup: ~20-50ms
- CDN connection: ~50-100ms
- Download: ~100-200ms
- Total: ~170-350ms
```

**After (Local):**
```
- Local file read: ~5-10ms
- Total: ~5-10ms
```

**Test:**
1. Open DevTools → Network tab
2. Hard refresh (Ctrl+Shift+R)
3. Find library requests
4. Check timing:
   - ✅ **Expected:** <10ms for local files
   - ✅ **Expected:** No external requests to cdn.jsdelivr.net

**Performance Checklist:**
- [ ] Page load time ≤ 1s (unchanged or faster)
- [ ] Library load time <10ms each
- [ ] No external network requests
- [ ] Tool initialization <500ms

---

### Browser Compatibility

Test in multiple browsers:

- [ ] **Chrome 90+**
  - All tools work
  - SRI validation active
  - No console errors

- [ ] **Firefox 88+**
  - All tools work
  - SRI validation active
  - No console errors

- [ ] **Safari 14+**
  - All tools work
  - SRI validation active
  - No console errors

- [ ] **Edge 90+**
  - All tools work
  - SRI validation active
  - No console errors

---

## Rollback Plan

**If issues found:**

```bash
# Quick rollback - restore CDN links
git checkout main -- tools/*/index.html tools/html-markdown/html-markdown.js
git commit -m "Rollback: Revert to CDN libraries"
git push

# Platform works immediately (CDN fallback)
```

**Partial Rollback (if one tool has issues):**
```bash
# Just rollback problematic tool
git checkout main -- tools/sip-calculator/sip-calculator.html
```

---

## Files to Change

```
CREATE:
- lib/chart.min.js (50KB)
- lib/dompurify.min.js (25KB)
- lib/jsdiff.min.js (11KB)
- lib/turndown.min.js (20KB)
- lib/marked.min.js (20KB)
- lib/SRI_HASHES.txt (documentation)

MODIFY:
- tools/sip-calculator/sip-calculator.html (script src)
- tools/emi-calculator/emi-calculator.html (script src)
- tools/text-diff/text-diff.html (script src)
- tools/html-markdown/html-markdown.html (add script tags)
- tools/html-markdown/html-markdown.js (remove dynamic loading)
```

---

## Success Metrics

**Before:**
- ❌ 0 libraries in /lib/
- ❌ 5 CDN dependencies
- ❌ 0 SRI hashes
- ❌ Fails offline

**After:**
- ✅ 5 libraries in /lib/
- ✅ 0 CDN dependencies
- ✅ 5 SRI hashes
- ✅ Works offline
- ✅ 97% faster library loading (350ms → 10ms)

---

## Documentation Updates

After implementation, update:

1. **README.md:**
   ```markdown
   ## Dependencies
   
   All external libraries are self-hosted in `/lib/`:
   - Chart.js v4.4.0 - Data visualization
   - DOMPurify v3.0.6 - HTML sanitization
   - jsdiff v5.1.0 - Text diffing
   - Turndown v7.1.2 - HTML to Markdown
   - Marked v9.1.6 - Markdown to HTML
   
   All libraries include SRI (Subresource Integrity) hashes for security.
   ```

2. **docs/ARCHITECTURE.md:**
   ```markdown
   ## External Libraries
   
   Libraries are self-hosted in `/lib/` per architecture specification:
   - Local hosting ensures offline functionality
   - SRI hashes prevent CDN compromise attacks
   - Faster load times (~10ms vs ~350ms CDN)
   ```

---

## Code Review Checklist

**Before Requesting Review:**
- [ ] All libraries downloaded and in /lib/
- [ ] SRI hashes generated and documented
- [ ] All 5 tools tested and working
- [ ] Offline mode tested and working
- [ ] Performance benchmarks met
- [ ] No console errors in any browser
- [ ] Documentation updated
- [ ] Commit message clear: "feat(libs): self-host all external libraries with SRI"

**Reviewer Checklist:**
- [ ] Library files are minified versions
- [ ] SRI hashes match file contents (verify one manually)
- [ ] All script tags have integrity attribute
- [ ] crossorigin="anonymous" attribute present
- [ ] No CDN fallbacks remaining
- [ ] Code follows project conventions

---

## Estimated Timeline

| Task | Duration | Cumulative |
|------|----------|------------|
| Create /lib/ directory | 5 min | 5 min |
| Download 5 libraries | 15 min | 20 min |
| Generate SRI hashes | 20 min | 40 min |
| Update HTML files | 40 min | 80 min (1h20m) |
| Test all tools | 30 min | 110 min (1h50m) |
| **Total** | **110 min** | **~2 hours** |

---

## Notes

- This is a **quick win** - low risk, high impact
- Test-specialist can execute independently
- No code logic changes required
- Easy rollback if needed
- Immediate security improvement
- Foundation for CSP hardening (next ticket)

---

## Related Tickets

- **BOTH-1:** CSP Hardening (depends on this - needs local libraries)
- **SEC-1:** innerHTML Sanitization (will use local DOMPurify)

---

**Status:** READY FOR IMPLEMENTATION  
**Blocked By:** None  
**Blocking:** BOTH-1 (CSP update needs local libraries first)
