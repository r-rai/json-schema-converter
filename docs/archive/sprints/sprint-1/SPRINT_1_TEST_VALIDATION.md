# Sprint 1 Test Validation Checklist
## Security-Critical Foundations Testing

**Sprint:** Sprint 1 (Days 1-2)  
**Test Specialist:** [Name]  
**Tech Lead:** Senior Tech Lead AI Agent  
**Focus:** Security validation for SRI hashes, local library hosting, and CSP preparation

---

## 🎯 Testing Objectives

### Primary Goals
1. Validate SRI hash implementation prevents tamperedScripts
2. Verify local library hosting eliminates external dependencies
3. Confirm CSP audit captures all inline patterns
4. Ensure no functionality regression

### Security Validation Focus
- **SRI Verification:** Scripts with incorrect hashes are blocked
- **Dependency Isolation:** Application works without internet
- **Attack Surface:** No new XSS vectors introduced

---

## ✅ TICKET-CRIT-1: SRI Hashes Validation

### Test ENV Setup

**Prerequisites:**
- [ ] Fresh browser session (no cache)
- [ ] Browser DevTools open (F12)
- [ ] Console tab visible
- [ ] Network tab open
- [ ] Disable cache in DevTools

---

### Test Case 1.1: SRI Hash Presence

**Objective:** Verify all CDN scripts have integrity attributes

**Steps:**
1. Open application in browser
2. Open DevTools → Sources or Network tab
3. Check each CDN script reference

**Validation:**
```bash
# automated check
grep -r "cdn.jsdelivr.net" tools/ --include="*.js" | \
  grep -v "integrity=" && \
  echo "❌ FAIL: Script without SRI" || \
  echo "✅ PASS: All scripts have SRI"
```

**Expected Result:**
- [ ] All CDN script tags have `integrity="sha384-..."` attribute
- [ ] All CDN script tags have `crossorigin="anonymous"` attribute

**Actual Result:**
- ____________________________________________

**Status:** ⬜ Not Started / ⏳ In Progress / ✅ Pass / ❌ Fail

---

### Test Case 1.2: SRI Hash Correctness

**Objective:** Verify hashes are correct and scripts load successfully

**Steps:**
1. Clear browser cache
2. Navigate to HTML-Markdown converter
3. Check console for errors
4. Navigate to SIP Calculator
5. Check console for errors
6. Navigate to EMI Calculator
7. Check console for errors
8. Navigate to Text Diff
9. Check console for errors

**Expected Result:**
- [ ] No SRI-related errors in console
- [ ] All libraries load successfully
- [ ] No "Failed to find a valid digest" errors

**Actual Result:**
- ____________________________________________

**Status:** ⬜ Not Started / ⏳ In Progress / ✅ Pass / ❌ Fail

---

### Test Case 1.3: SRI Enforcement (Negative Test)

**Objective:** Verify browser blocks scripts with invalid SRI hashes

**Steps:**
1. Backup `tools/html-markdown/html-markdown.js`
2. Edit file: Change ONE character in DOMPurify integrity hash
3. Save and reload page
4. Try to open HTML-Markdown converter
5. Observe console errors

**Expected Result:**
- [ ] Console shows error: "Failed to find a valid digest in the 'integrity' attribute"
- [ ] Script is blocked from executing
- [ ] Tool fails to load (expected behavior)
- [ ] Error message clearly indicates SRI failure

**Actual Result:**
- ____________________________________________

**Cleanup:**
- [ ] Restore backup file
- [ ] Verify tool works again

**Status:** ⬜ Not Started / ⏳ In Progress / ✅ Pass / ❌ Fail

---

### Test Case 1.4: Crossorigin Attribute

**Objective:** Verify crossorigin attribute present for CORS

**Steps:**
1. Inspect Network tab
2. Select one of the CDN script requests
3. Check request headers

**Expected Result:**
- [ ] Origin header present in request
- [ ] `crossorigin="anonymous"` attribute in script tag
- [ ] No credentials sent with request

**Actual Result:**
- ____________________________________________

**Status:** ⬜ Not Started / ⏳ In Progress / ✅ Pass / ❌ Fail

---

### Test Case 1.5: Documentation Verification

**Objective:** Verify SRI documentation is complete

**Steps:**
1. Open `/lib/README.md`
2. Verify all libraries documented
3. Check SRI hashes match code

**Expected Result:**
- [ ] README.md exists
- [ ] All 5 libraries documented
- [ ] Each library has: name, version, URL, integrity hash, purpose
- [ ] Hashes in README match hashes in code

**Actual Result:**
- ____________________________________________

**Status:** ⬜ Not Started / ⏳ In Progress / ✅ Pass / ❌ Fail

---

### Test Case 1.6: Functional Regression

**Objective:** Ensure SRI doesn't break any functionality

**Test Matrix:**

| Tool | Test Action | Expected Result | Actual Result | Status |
|------|-------------|-----------------|---------------|--------|
| HTML→MD | Convert HTML | Markdown output correct | | ⬜ |
| MD→HTML | Convert Markdown | HTML output correct | | ⬜ |
| SIP Calc | Calculate SIP | Chart renders | | ⬜ |
| EMI Calc | Calculate EMI | Chart renders | | ⬜ |
| Text Diff | Compare texts | Diff shown | | ⬜ |
| JSON Schema | Validate JSON | Validation works | | ⬜ |

**Overall Status:** ⬜ Not Started / ⏳ In Progress / ✅ Pass / ❌ Fail

---

## ✅ TICKET-CRIT-5: Local Library Hosting Validation

### Test Case 2.1: Library Files Presence

**Objective:** Verify all libraries downloaded to /lib/

**Steps:**
```bash
cd /home/ravi/projects/json-schema-converter/lib
ls -lh
```

**Expected Result:**
```
-rw-r--r-- 1 user user  19K dompurify.min.js
-rw-r--r-- 1 user user  50K chart.umd.min.js
-rw-r--r-- 1 user user  11K diff.min.js
-rw-r--r-- 1 user user   9K turndown.js
-rw-r--r-- 1 user user  12K marked.umd.min.js
-rw-r--r-- 1 user user  xxx README.md
```

**Actual Result:**
- ____________________________________________

**Status:** ⬜ Not Started / ⏳ In Progress / ✅ Pass / ❌ Fail

---

### Test Case 2.2: No External CDN References

**Objective:** Verify zero CDN dependencies in code

**Steps:**
```bash
cd /home/ravi/projects/json-schema-converter
grep -r "cdn.jsdelivr.net" tools/ shared/ --include="*.js"
grep -r "unpkg.com" tools/ shared/ --include="*.js"
grep -r "cdnjs.cloudflare.com" tools/ shared/ --include="*.js"
```

**Expected Result:**
- No output (no CDN references found)
- All scripts load from /lib/

**Actual Result:**
- ____________________________________________

**Status:** ⬜ Not Started / ⏳ In Progress / ✅ Pass / ❌ Fail

---

### Test Case 2.3: Local Loading Verification

**Objective:** Confirm scripts load from local /lib/ folder

**Steps:**
1. Open application
2. Open DevTools → Network tab
3. Filter by "JS"
4. Navigate to each tool
5. Observe script requests

**Expected Result:**
- [ ] All requests to `/lib/` (not external CDN)
- [ ] No external domain requests
- [ ] All libraries return 200 OK
- [ ] Local files load faster than CDN (<50ms)

**Network Tab Screenshots:**
- HTML-Markdown Tool: ________________
- SIP Calculator: ________________
- EMI Calculator: ________________
- Text Diff: ________________

**Status:** ⬜ Not Started / ⏳ In Progress / ✅ Pass / ❌ Fail

---

### Test Case 2.4: Offline Functionality

**Objective:** Verify application works without internet

**Steps:**
1. Open application with internet
2. Navigate to each tool (cache libraries)
3. Open DevTools → Network tab
4. Enable "Offline" mode
5. Reload page (Ctrl+F5)
6. Test each tool

**Expected Result:**
- [ ] Page loads successfully offline
- [ ] All tools accessible
- [ ] Libraries load from cache/local server
- [ ] No network errors for libraries

**Actual Result:**
- ____________________________________________

**Note:** May require service worker for full offline support (future feature)

**Status:** ⬜ Not Started / ⏳ In Progress / ✅ Pass / ❌ Fail

---

### Test Case 2.5: Performance Comparison

**Objective:** Measure load time improvement

**Test Setup:**
1. Clear cache
2. Use DevTools → Network → Throttling: "Fast 3G"
3. Measure library load times

**Before (CDN):** (if available from baseline)
- DOMPurify: _______ ms
- Chart.js: _______ ms
- Diff: _______ ms
- Turndown: _______ ms
- Marked: _______ ms

**After (Local):**
- DOMPurify: _______ ms
- Chart.js: _______ ms
- Diff: _______ ms
- Turndown: _______ ms
- Marked: _______ ms

**Expected:**
- Local loading should be faster (5-20ms vs 70-250ms)

**Actual Improvement:** _______ ms average reduction

**Status:** ⬜ Not Started / ⏳ In Progress / ✅ Pass / ❌ Fail

---

### Test Case 2.6: CSP Compliance

**Objective:** Verify CSP updated correctly in wrangler.toml

**Steps:**
1. Open `wrangler.toml`
2. Check CSP header configuration
3. Verify 'self' includes /lib/ folder

**Expected CSP:**
```
Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';"
```

**Key Points:**
- [ ] `script-src 'self'` allows /lib/ scripts
- [ ] No external CDN domains listed
- [ ] `'unsafe-inline'` still present (removed in Sprint 2)

**Actual Result:**
- ____________________________________________

**Status:** ⬜ Not Started / ⏳ In Progress / ✅ Pass / ❌ Fail

---

### Test Case 2.7: Functional Regression

**Objective:** Ensure local hosting doesn't break functionality

**Full Tool Test Suite:**

#### HTML-Markdown Converter
- [ ] Convert HTML to Markdown
- [ ] Convert Markdown to HTML
- [ ] DOMPurify sanitizes HTML
- [ ] Preview renders correctly
- [ ] Copy to clipboard works

#### SIP Calculator
- [ ] Calculate SIP returns
- [ ] Chart renders with Chart.js
- [ ] Table displays correctly
- [ ] Download results works

#### EMI Calculator
- [ ] Calculate EMI amount
- [ ] Chart renders with Chart.js
- [ ] Amortization table shows
- [ ] Download works

#### Text Diff
- [ ] Text comparison works
- [ ] Diff library loads
- [ ] Differences highlighted
- [ ] Character/word/line modes work

#### JSON Schema Generator
- [ ] Generate schema from JSON
- [ ] Validate JSON against schema
- [ ] No external library (pure JS)
- [ ] All features work

**Overall Functional Status:** ⬜ Not Started / ⏳ In Progress / ✅ Pass / ❌ Fail

---

## ✅ TICKET-CRIT-2-PREP: CSP Audit Validation

### Test Case 3.1: Audit Scripts Executed

**Objective:** Verify audit scripts ran successfully

**Steps:**
1. Check for audit output files
2. Verify completeness

**Expected Files:**
- [ ] `inline-scripts-audit.txt` exists
- [ ] `inline-styles-audit.txt` exists
- [ ] Both files have content (not empty)

**Actual Result:**
- ____________________________________________

**Status:** ⬜ Not Started / ⏳ In Progress / ✅ Pass / ❌ Fail

---

### Test Case 3.2: Inline Script Findings Review

**Objective:** Validate all inline scripts documented

**Manual Check:**
1. Open `index.html`
2. Search for inline event handlers: `onclick`, `onerror`, `onload`
3. Compare with audit findings

**Expected Findings:**
- Theme toggle button (if inline)
- Any other inline handlers

**Test Query:**
```bash
grep -rn "on[a-z]*=" --include="*.html" /home/ravi/projects/json-schema-converter/
```

**Findings Match Audit:** ⬜ Yes / ⬜ No

**Status:** ⬜ Not Started / ⏳ In Progress / ✅ Pass / ❌ Fail

---

### Test Case 3.3: Documentation Quality

**Objective:** Verify migration plan is comprehensive

**Checklist:**
- [ ] `docs/CSP_MIGRATION_PLAN.md` exists
- [ ] Identifies all inline scripts
- [ ] Categorizes findings (critical/safe/keep)
- [ ] Defines migration strategy
- [ ] Includes testing approach
- [ ] Approved by Tech Lead

**Actual Result:**
- ____________________________________________

**Status:** ⬜ Not Started / ⏳ In Progress / ✅ Pass / ❌ Fail

---

### Test Case 3.4: Baseline CSP Behavior

**Objective:** Document current CSP with unsafe-inline

**Steps:**
1. Open DevTools → Console
2. Navigate application
3. Look for CSP violations

**Expected:**
- No CSP violations (unsafe-inline allows everything)

**Baseline Captured:** ⬜ Yes / ⬜ No

**Purpose:** Compare with Sprint 2 after unsafe-inline removed

**Status:** ⬜ Not Started / ⏳ In Progress / ✅ Pass / ❌ Fail

---

## 🔒 Security Testing

### Security Test 1: SRI Attack Prevention

**Objective:** Verify SRI prevents tampered scripts

**Scenario:** Attacker compromises CDN
**Simulation:**
1. Corrupt integrity hash in code
2. Try to load page
3. Verify browser blocks script

**Expected:**
- [ ] Browser blocks execution
- [ ] Console error clearly indicates SRI failure
- [ ] Application fails gracefully (doesn't execute malicious code)

**Status:** ⬜ Not Started / ⏳ In Progress / ✅ Pass / ❌ Fail

---

### Security Test 2: Zero External Dependencies

**Objective:** Confirm no data leaves application

**Steps:**
1. Open DevTools → Network tab
2. Load application
3. Use all tools
4. Filter requests by domain

**Expected:**
- [ ] All requests to same origin (localhost or domain)
- [ ] Zero requests to external domains
- [ ] Zero cookies sent to third parties
- [ ] Zero tracking pixels

**Status:** ⬜ Not Started / ⏳ In Progress / ✅ Pass / ❌ Fail

---

### Security Test 3: CSP Header Presence

**Objective:** Verify CSP header set correctly

**Steps:**
1. Open DevTools → Network
2. Select HTML document request
3. Check Response Headers

**Expected Header:**
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; ...
```

**Actual Header:**
- ____________________________________________

**Status:** ⬜ Not Started / ⏳ In Progress / ✅ Pass / ❌ Fail

---

## 📊 Performance Testing

### Performance Test 1: Library Load Times

**Objective:** Measure impact of local hosting

**Metrics to Capture:**

| Library | Size | CDN Time | Local Time | Improvement |
|---------|------|----------|------------|-------------|
| DOMPurify | 19KB | ___ms | ___ms | ___ms |
| Chart.js | 50KB | ___ms | ___ms | ___ms |
| Diff | 11KB | ___ms | ___ms | ___ms |
| Turndown | 9KB | ___ms | ___ms | ___ms |
| Marked | 12KB | ___ms | ___ms | ___ms |

**Status:** ⬜ Not Started / ⏳ In Progress / ✅ Pass / ❌ Fail

---

### Performance Test 2: First Contentful Paint

**Test Setup:**
1. Use Lighthouse in DevTools
2. Run performance audit
3. Compare before/after

**Metrics:**
- First Contentful Paint: _______ ms
- Time to Interactive: _______ ms
- Total Blocking Time: _______ ms

**Target:** No regression (should improve)

**Status:** ⬜ Not Started / ⏳ In Progress / ✅ Pass / ❌ Fail

---

## 🌐 Browser Compatibility Testing

### Browser Test Matrix

| Browser | Version | CRIT-1 (SRI) | CRIT-5 (Local) | CRIT-2-PREP | Status |
|---------|---------|--------------|----------------|-------------|---------|
| Chrome | Latest | ⬜ | ⬜ | ⬜ | ⬜ |
| Firefox | Latest | ⬜ | ⬜ | ⬜ | ⬜ |
| Safari | Latest | ⬜ | ⬜ | ⬜ | ⬜ |
| Edge | Latest | ⬜ | ⬜ | ⬜ | ⬜ |

**Notes:**
- All modern browsers support SRI
- Local loading is universal
- No compatibility issues expected

---

## 📝 Test Summary Report

### Sprint 1 Test Results

**Date:** _______________  
**Tester:** _______________  
**Duration:** _______________

#### Test Statistics

| Category | Total | Pass | Fail | Blocked | Pass Rate |
|----------|-------|------|------|---------|-----------|
| Functional | ___ | ___ | ___ | ___ | ___% |
| Security | ___ | ___ | ___ | ___ | ___% |
| Performance | ___ | ___ | ___ | ___ | ___% |
| Browser Compat | ___ | ___ | ___ | ___ | ___% |
| **TOTAL** | ___ | ___ | ___ | ___ | ___% |

#### Critical Issues Found

| Issue ID | Severity | Description | Status |
|----------|----------|-------------|--------|
| | | | |

#### Recommendations

1. ___________________________________________
2. ___________________________________________
3. ___________________________________________

#### Sign-off

**Test Specialist Approval:** ⬜ PASS / ⬜ FAIL / ⬜ CONDITIONAL

**Conditions (if any):**
- ___________________________________________

**Tech Lead Review Required:** ⬜ Yes / ⬜ No

**Ready for Sprint 2:** ⬜ Yes / ⬜ No

---

## 🚀 Sprint 1 Exit Criteria

All must be ✅ to proceed to Sprint 2:

### Code Quality
- [ ] All 3 tickets completed
- [ ] Code reviewed by Tech Lead
- [ ] No console errors or warnings
- [ ] All tests passing

### Security
- [ ] All CDN scripts have SRI hashes
- [ ] Zero external CDN dependencies
- [ ] CSP audit complete
- [ ] No new XSS vectors introduced

### Functionality
- [ ] All 6 tools working correctly
- [ ] No regression bugs
- [ ] Performance maintained or improved

### Documentation
- [ ] lib/README.md complete
- [ ] CSP_MIGRATION_PLAN.md created
- [ ] Audit results documented
- [ ] Test report complete

### Approval
- [ ] Test Specialist approval
- [ ] Tech Lead approval
- [ ] Sprint review completed

---

**Sprint 1 Status:** ⬜ Ready to Test / ⏳ Testing / ✅ Complete / ❌ Blocked

**Next Sprint:** Sprint 2 - CSP & Architecture Foundation

---

_Test validation checklist created by: Senior Tech Lead AI Agent_  
_Last Updated: March 19, 2026_
