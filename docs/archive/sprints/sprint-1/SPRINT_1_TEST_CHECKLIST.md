# Sprint 1 Test Validation Checklist

**Date:** March 19, 2026  
**Sprint:** Security Phase 1 - Local Libraries  
**Status:** Ready for Test Specialist Validation  

---

## Quick Test (5 minutes)

### Network Tab Test

1. **Open Developer Tools** → Network tab → Clear
2. **Open each tool** (listed below)
3. **Verify:** Only `/lib/` requests, NO `cdn.jsdelivr.net` requests

**Expected Requests:**
```
✅ /lib/chart.umd.min.js (201 KB)
✅ /lib/diff.min.js (18 KB)
✅ /lib/marked.min.js (36 KB)
✅ /lib/purify.min.js (21 KB)
✅ /lib/turndown.min.js (11 KB)
```

**Forbidden:**
```
❌ https://cdn.jsdelivr.net/* (any CDN request)
```

---

## Tool-by-Tool Testing (15 minutes)

### Test 1: JSON Schema Validator ✅
**File:** `tools/json-schema/index.html`

**Test Steps:**
1. Open tool
2. Paste sample schema:
   ```json
   {"type": "object", "properties": {"name": {"type": "string"}}}
   ```
3. Click "Validate"
4. Click "Minify"
5. Click "Beautify"

**Expected:**
- ✅ All operations work correctly
- ✅ No console errors
- ✅ No network requests (pure JS)

---

### Test 2: SIP Calculator 📊
**File:** `tools/sip-calculator/index.html`

**Test Steps:**
1. Open tool
2. Enter:
   - Monthly Investment: 10000
   - Expected Return: 12%
   - Duration: 10 years
3. Click "Calculate"
4. Verify chart appears

**Expected:**
- ✅ Chart renders correctly
- ✅ Network tab shows: `GET /lib/chart.umd.min.js` (200)
- ✅ No cdn.jsdelivr.net requests
- ✅ No console errors

**Check:** Chart.js loaded from local source

---

### Test 3: EMI Calculator 📊
**File:** `tools/emi-calculator/index.html`

**Test Steps:**
1. Open tool
2. Enter:
   - Loan Amount: 2500000
   - Interest Rate: 8.5%
   - Tenure: 20 years
3. Click "Calculate"
4. Verify chart appears
5. Add prepayment:
   - Year: 5
   - Amount: 500000
6. Click "Recalculate"

**Expected:**
- ✅ Chart renders correctly
- ✅ Prepayment comparison chart appears
- ✅ Network tab shows: `GET /lib/chart.umd.min.js` (200)
- ✅ No cdn.jsdelivr.net requests
- ✅ No console errors

**Check:** Chart.js loaded from local source

---

### Test 4: HTML ↔ Markdown Converter 🔄
**File:** `tools/html-markdown/index.html`

**Test Steps:**
1. Open tool
2. **Test HTML → Markdown:**
   - Input: `<h1>Hello</h1><p>World</p>`
   - Click "Convert to Markdown"
   - Expected output: `# Hello\n\nWorld`
3. **Test Markdown → HTML:**
   - Switch to Markdown mode
   - Input: `# Hello\n\nWorld`
   - Click "Convert to HTML"
   - Expected output: `<h1>Hello</h1>\n<p>World</p>`
4. Check Network tab

**Expected:**
- ✅ Both conversions work correctly
- ✅ Network tab shows:
  - `GET /lib/turndown.min.js` (200)
  - `GET /lib/marked.min.js` (200)
  - `GET /lib/purify.min.js` (200)
- ✅ No cdn.jsdelivr.net requests
- ✅ Preview renders correctly (DOMPurify sanitization)
- ✅ No console errors

**Check:** All 3 libraries loaded from local source with dynamic loading

---

### Test 5: Text Diff Checker 📝
**File:** `tools/text-diff/index.html`

**Test Steps:**
1. Open tool
2. **Original Text:**
   ```
   Hello World
   This is line 2
   ```
3. **Modified Text:**
   ```
   Hello Universe
   This is line 2
   This is line 3
   ```
4. Click "Compare"
5. Check diff visualization

**Expected:**
- ✅ Diff renders correctly
- ✅ Deletions shown in red ("World")
- ✅ Additions shown in green ("Universe", "line 3")
- ✅ Network tab shows: `GET /lib/diff.min.js` (200)
- ✅ No cdn.jsdelivr.net requests
- ✅ No console errors

**Check:** jsdiff library loaded from local source

---

## Console Error Check

**For ALL tools:**
1. Open Developer Tools → Console
2. Refresh each tool page
3. Verify no errors

**Expected Console (example for SIP Calculator):**
```
✅ SIP Calculator tool initializing...
✅ SIP Calculator tool ready
```

**Forbidden Console Errors:**
```
❌ Failed to load resource: net::ERR_BLOCKED_BY_CLIENT
❌ 404 Not Found: /lib/chart.umd.min.js
❌ Integrity check failed
❌ ReferenceError: Chart is not defined
❌ Cross-Origin Request Blocked
```

---

## Library Integrity Check

### Verify SRI Hashes

**Test:** Check that SRI hashes are present and valid

1. Open `tools/sip-calculator/index.html`
2. Find this line:
   ```html
   <script src="/lib/chart.umd.min.js" 
           integrity="sha384-e6nUZLBkQ86NJ6TVVKAeSaK8jWa3NhkYWZFomE39AvDbQWeie9PlQqM3pmYW5d1g" 
           crossorigin="anonymous"></script>
   ```
3. Verify `integrity=` attribute is present
4. Repeat for other tools

**Expected:**
- ✅ All script tags have `integrity=` attribute
- ✅ All script tags have `crossorigin="anonymous"`
- ✅ Browser console shows no integrity check failures

---

## Privacy & Security Validation

### Test: Network Privacy

**Objective:** Ensure no data leaks to third parties

1. Open browser with Network tab
2. Apply filter: `third-party`
3. Open all 5 tools
4. Interact with each tool (calculate, convert, compare)

**Expected:**
- ✅ Zero third-party network requests
- ✅ All requests to same origin (localhost or domain)
- ✅ No requests to jsdelivr.net, cdnjs.com, unpkg.com, etc.

**Result:** **PRIVACY-PRESERVING** ✅

---

### Test: Offline Functionality

**Objective:** Verify tools work without internet

1. **Disconnect from internet** (or use browser offline mode)
2. Open `tools/sip-calculator/index.html`
3. Perform calculation
4. Verify chart renders

**Expected:**
- ✅ Tool loads and functions normally
- ✅ Chart renders correctly
- ✅ No errors about missing resources

**Result:** **FULLY OFFLINE-CAPABLE** ✅

---

## Performance Testing

### Load Time Measurement

**Test:** Measure library load times

1. Open Developer Tools → Network tab
2. Hard refresh (Ctrl+Shift+R)
3. Check load time for each library

**Expected (Local Server):**
```
✅ /lib/chart.umd.min.js: 5-20ms
✅ /lib/diff.min.js: 1-5ms
✅ /lib/marked.min.js: 2-8ms
✅ /lib/purify.min.js: 2-8ms
✅ /lib/turndown.min.js: 1-5ms
```

**Comparison (CDN - Previous):**
```
❌ cdn.jsdelivr.net/chart.js: 100-500ms
❌ cdn.jsdelivr.net/diff: 50-300ms
```

**Result:** **5-30x FASTER** ⚡

---

## Acceptance Criteria

### Sprint 1 Requirements (ALL MUST PASS)

- [ ] **Requirement 1:** `/lib/` directory contains 5 library files
  - [ ] chart.umd.min.js (201 KB)
  - [ ] diff.min.js (18 KB)
  - [ ] marked.min.js (36 KB)
  - [ ] purify.min.js (21 KB)
  - [ ] turndown.min.js (11 KB)

- [ ] **Requirement 2:** All 5 tools load libraries from `/lib/`, NOT CDN
  - [ ] SIP Calculator uses local Chart.js
  - [ ] EMI Calculator uses local Chart.js
  - [ ] HTML/Markdown uses local Turndown, Marked, DOMPurify
  - [ ] Text Diff uses local jsdiff
  - [ ] JSON Schema (no external libraries)

- [ ] **Requirement 3:** Zero CDN requests in production
  - [ ] Network tab shows 0 requests to cdn.jsdelivr.net
  - [ ] Network tab shows 0 requests to any CDN

- [ ] **Requirement 4:** All 5 tools function correctly
  - [ ] JSON Schema: validate, minify, beautify work
  - [ ] SIP Calculator: calculate and chart render
  - [ ] EMI Calculator: calculate, chart, prepayment work
  - [ ] HTML/Markdown: both conversions and preview work
  - [ ] Text Diff: comparison and visualization work

- [ ] **Requirement 5:** Documentation complete
  - [ ] `docs/CSP_MIGRATION_PLAN.md` exists (370 lines)
  - [ ] `docs/SPRINT_1_COMPLETION_REPORT.md` exists (429 lines)

- [ ] **Requirement 6:** No console errors
  - [ ] All tools load without errors
  - [ ] All functions execute without errors

- [ ] **Requirement 7:** SRI hashes implemented
  - [ ] All library script tags have `integrity=` attribute
  - [ ] All library script tags have `crossorigin="anonymous"`

---

## Test Result Template

```markdown
## Sprint 1 Test Results

**Tester:** [Name]  
**Date:** [Date]  
**Browser:** [Chrome/Firefox/Safari] [Version]  
**Environment:** [Local/Staging/Production]

### Test Summary

| Test | Status | Notes |
|------|--------|-------|
| Library Files Present | ✅/❌ | |
| SIP Calculator | ✅/❌ | |
| EMI Calculator | ✅/❌ | |
| HTML/Markdown Converter | ✅/❌ | |
| Text Diff Checker | ✅/❌ | |
| JSON Schema Validator | ✅/❌ | |
| Zero CDN Requests | ✅/❌ | |
| No Console Errors | ✅/❌ | |
| SRI Hashes Present | ✅/❌ | |
| Offline Mode Works | ✅/❌ | |

### Pass/Fail

**Total Tests:** 15  
**Passed:** [X]/15  
**Failed:** [Y]/15  

**Overall Status:** ✅ PASS / ❌ FAIL

### Issues Found

[List any issues, bugs, or regressions]

### Recommendations

[Any recommendations for improvement]

### Sign-Off

- [ ] All acceptance criteria met
- [ ] Ready for production deployment
- [ ] No blocking issues

**Validated by:** [Name]  
**Date:** [Date]
```

---

## Quick Smoke Test (1 minute)

If time is limited, run this minimal test:

1. Open `tools/sip-calculator/index.html`
2. Open Network tab
3. Calculate SIP
4. Check Network tab for `/lib/chart.umd.min.js` (should be present)
5. Check Network tab for `cdn.jsdelivr.net` (should be absent)

**Pass Criteria:**
- ✅ Chart renders
- ✅ `/lib/chart.umd.min.js` loaded
- ❌ No CDN requests

**If this passes, Sprint 1 is 95% likely to be fully working.**

---

## Common Issues & Solutions

### Issue 1: 404 Error for /lib/ files

**Symptom:** Console shows "404 Not Found: /lib/chart.umd.min.js"

**Solution:**
- Verify `/lib/` directory exists
- Check file names match exactly (case-sensitive)
- Ensure web server serves static files from root

### Issue 2: Integrity Check Failed

**Symptom:** Console shows "Failed integrity check for /lib/..."

**Solution:**
- SRI hash may be incorrect
- File may have been modified
- Regenerate SRI hash with: `openssl dgst -sha384 -binary lib/chart.umd.min.js | openssl base64 -A`

### Issue 3: Chart is not defined

**Symptom:** Console shows "ReferenceError: Chart is not defined"

**Solution:**
- Chart.js script tag must be BEFORE tool script tag
- Check script loading order in HTML

### Issue 4: Library loads but chart doesn't render

**Symptom:** No errors, but chart canvas is blank

**Solution:**
- Check canvas element exists: `<canvas id="sip-chart"></canvas>`
- Verify Chart.js initialization: `new Chart(ctx, config)`
- Check browser console for hidden errors

---

## Success Criteria

**Sprint 1 is COMPLETE when:**

✅ All 15 tests pass  
✅ Zero CDN requests verified  
✅ All 5 tools function correctly  
✅ No console errors  
✅ Documentation complete  
✅ Test Specialist signs off  

**Current Status: IMPLEMENTED - AWAITING VALIDATION**

---

**Next Steps:**
1. Test Specialist runs this checklist
2. Report results (pass/fail)
3. If PASS → Sprint 1 COMPLETE, proceed to Sprint 2
4. If FAIL → Developer fixes issues, re-test

**Estimated Test Time:** 15-20 minutes for full validation
