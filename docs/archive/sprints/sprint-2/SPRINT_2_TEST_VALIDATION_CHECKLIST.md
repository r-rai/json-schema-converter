# Sprint 2 Test Validation Checklist
**For Test Specialist**

**Sprint:** 2 of 4 | **Test Count:** 35 tests | **Pass Target:** ≥95% (33+ tests)

---

## Overview

This checklist validates Sprint 2 deliverables across 6 focus areas:
1. CSP Compliance (10 tests) - CRITICAL
2. Component Adoption (8 tests) - HIGH
3. Error Boundaries (6 tests) - HIGH
4. innerHTML Security (5 tests) - CRITICAL
5. Performance Budget (3 tests) - MEDIUM
6. State Manager (3 tests) - MEDIUM

**Test Environment:**
- Browsers: Chrome/Edge, Firefox, Safari (latest versions)
- Tools: DevTools Console, Network tab, Application/Storage tab
- Local server: `http://localhost:8080` or equivalent

---

## Section 1: CSP Compliance (10 tests) [CRITICAL]

**Objective:** Verify strict CSP policy is enforced and no violations occur

### Test 1.1: No Inline Styles in HTML
**Steps:**
1. View source of each tool HTML file (5 tools)
2. Search for `style=` attribute

**Expected:** Zero occurrences of `style=` in HTML

**Actual:** ___________

**Status:** [ ] PASS [ ] FAIL

---

### Test 1.2: No Inline Event Handlers
**Steps:**
1. View source of each tool HTML file
2. Search for `onclick=`, `onerror=`, `onload=`, `onchange=` patterns

**Expected:** Zero inline event handlers

**Actual:** ___________

**Status:** [ ] PASS [ ] FAIL

---

### Test 1.3: CSP Meta Tag Strict Policy
**Steps:**
1. Open DevTools → Elements
2. Find `<meta http-equiv="Content-Security-Policy">` in each tool
3. Verify content does NOT include `unsafe-inline`

**Expected CSP:**
```
default-src 'self'; 
script-src 'self'; 
style-src 'self'; 
img-src 'self' data:;
```

**Actual:** ___________

**Status:** [ ] PASS [ ] FAIL

---

### Test 1.4: Zero CSP Violations in Console
**Steps:**
1. Open each tool with DevTools console visible
2. Interact with all features (calculate, convert, compare)
3. Check console for CSP violation warnings

**Expected:** No CSP errors/warnings

**Tools Tested:**
- [ ] SIP Calculator - No CSP violations
- [ ] EMI Calculator - No CSP violations
- [ ] Text Diff - No CSP violations
- [ ] HTML/Markdown - No CSP violations
- [ ] JSON Schema - No CSP violations

**Status:** [ ] PASS [ ] FAIL

---

### Test 1.5: All Tools Load Without Errors
**Steps:**
1. Open each tool
2. Check console for JavaScript errors

**Expected:** All tools load successfully, no console errors

**Status:** [ ] PASS [ ] FAIL

---

### Test 1.6: Dark/Light Theme Toggle Works
**Steps:**
1. Open any tool
2. Toggle theme (dark ↔ light)
3. Verify visual change applies correctly

**Expected:** Theme switches, styling updates, no console errors

**Status:** [ ] PASS [ ] FAIL

---

### Test 1.7: Error States Display Correctly
**Steps:**
1. In SIP Calculator, leave fields empty and click Calculate
2. Verify error messages display with red styling

**Expected:** Error text visible, styled correctly (red color, appropriate size)

**Status:** [ ] PASS [ ] FAIL

---

### Test 1.8: Responsive Layout Preserved
**Steps:**
1. Open any tool
2. Resize browser window (desktop → tablet → mobile sizes)

**Expected:** Layout adapts responsively, no visual breaks

**Status:** [ ] PASS [ ] FAIL

---

### Test 1.9: Hover States Work
**Steps:**
1. Hover over buttons in each tool
2. Verify hover effects apply

**Expected:** Hover states change (color, shadow, etc.)

**Status:** [ ] PASS [ ] FAIL

---

### Test 1.10: Focus States Work
**Steps:**
1. Tab through form inputs and buttons
2. Verify focus indicators appear

**Expected:** Visible focus outline on keyboard navigation

**Status:** [ ] PASS [ ] FAIL

---

## Section 2: Component Adoption (8 tests) [HIGH]

**Objective:** Verify shared component usage increased to ≥80%

### Test 2.1: Calculate Component Adoption Percentage
**Steps:**
1. Run audit: `grep -rn "createButton\|createInput\|createCard\|createModal" tools/ | wc -l`
2. Count total UI elements
3. Calculate percentage

**Expected:** ≥80% of UI elements use shared components

**Calculation:**
- Component usages: _____
- Total UI elements: _____
- Percentage: _____% 

**Status:** [ ] PASS [ ] FAIL

---

### Test 2.2: SIP Calculator Uses Shared Components
**Steps:**
1. Open `tools/sip-calculator/sip-calculator.js`
2. Search for `import` statements from `shared/components/`

**Expected:** Uses `createButton`, `createInput` (or equivalent)

**Status:** [ ] PASS [ ] FAIL

---

### Test 2.3: EMI Calculator Uses Shared Components
**Steps:**
1. Check `tools/emi-calculator/emi-calculator.js`
2. Verify component imports

**Expected:** Uses button, input, and card components

**Status:** [ ] PASS [ ] FAIL

---

### Test 2.4: Text Diff Uses Shared Components
**Steps:**
1. Check `tools/text-diff/text-diff.js`
2. Verify component usage

**Expected:** Uses button and/or card components

**Status:** [ ] PASS [ ] FAIL

---

### Test 2.5: HTML/Markdown Uses Shared Components
**Steps:**
1. Check `tools/html-markdown/html-markdown.js`
2. Verify modal and button usage

**Expected:** Uses modal and button components

**Status:** [ ] PASS [ ] FAIL

---

### Test 2.6: JSON Schema Uses Shared Components
**Steps:**
1. Check `tools/json-schema/json-schema.js`
2. Verify component usage

**Expected:** Uses input and button components

**Status:** [ ] PASS [ ] FAIL

---

### Test 2.7: No Visual Regressions
**Steps:**
1. Compare tool appearance to Sprint 1 screenshots (if available)
2. Verify buttons, inputs, cards look consistent

**Expected:** Visual appearance identical to Sprint 1

**Status:** [ ] PASS [ ] FAIL

---

### Test 2.8: No Functionality Regressions
**Steps:**
1. Test all features in each tool:
   - SIP Calculator: Calculate with valid input
   - EMI Calculator: Calculate EMI with prepayment
   - Text Diff: Compare two text blocks
   - HTML/Markdown: Convert markdown to HTML
   - JSON Schema: Validate JSON against schema

**Expected:** All features work identically to Sprint 1

**Status:** [ ] PASS [ ] FAIL

---

## Section 3: Error Boundaries (6 tests) [HIGH]

**Objective:** Verify graceful error handling is active in all tools

### Test 3.1: ErrorBoundary Module Exists
**Steps:**
1. Check file exists: `shared/js/error-boundary.js`
2. Verify exports: `ErrorBoundary` class and `setupGlobalErrorHandler`

**Expected:** File exists with correct exports

**Status:** [ ] PASS [ ] FAIL

---

### Test 3.2: All Tools Import ErrorBoundary
**Steps:**
1. Check each tool JS file for import statement
2. Verify: `import { ErrorBoundary } from '/shared/js/error-boundary.js';`

**Tools Checked:**
- [ ] SIP Calculator
- [ ] EMI Calculator
- [ ] Text Diff
- [ ] HTML/Markdown
- [ ] JSON Schema

**Status:** [ ] PASS [ ] FAIL

---

### Test 3.3: Simulated Error Shows Modal
**Steps:**
1. Open browser console in SIP Calculator
2. Inject error: `throw new Error('Test error');`
3. Observe error modal appears

**Expected:** User-friendly modal with error message and actions

**Status:** [ ] PASS [ ] FAIL

---

### Test 3.4: Error Modal is User-Friendly
**Steps:**
1. Review error modal content from Test 3.3

**Expected:**
- [ ] Title: "Oops! Something went wrong"
- [ ] Message is friendly (not technical stack trace visible by default)
- [ ] Refresh button present
- [ ] Close button present
- [ ] Technical details hidden in collapsible section

**Status:** [ ] PASS [ ] FAIL

---

### Test 3.5: "Refresh Page" Button Works
**Steps:**
1. Trigger error modal (Test 3.3)
2. Click "Refresh Page" button

**Expected:** Page reloads successfully

**Status:** [ ] PASS [ ] FAIL

---

### Test 3.6: Error Logged to Console
**Steps:**
1. Open console before triggering error
2. Trigger error (Test 3.3)
3. Check console output

**Expected:** Error details logged with:
- Error message
- Function name where error occurred
- Stack trace
- Timestamp

**Status:** [ ] PASS [ ] FAIL

---

## Section 4: innerHTML Security (5 tests) [CRITICAL]

**Objective:** Verify no XSS vulnerabilities via innerHTML

### Test 4.1: No Unsafe innerHTML with User Input
**Steps:**
1. Audit `docs/INNERHTML_SECURITY_AUDIT.md`
2. Verify all innerHTML usages with user input are marked "FIXED"

**Expected:** Audit document shows zero unsafe innerHTML

**Status:** [ ] PASS [ ] FAIL

---

### Test 4.2: User Content Uses textContent or Sanitizer
**Steps:**
1. Review code in tools for innerHTML usage
2. For each innerHTML:
   - If user input → must use `textContent` or `DOMPurify.sanitize()`
   - If static → must have "SAFE:" comment

**Expected:** All user content properly escaped or sanitized

**Status:** [ ] PASS [ ] FAIL

---

### Test 4.3: Safe innerHTML Has Comments
**Steps:**
1. Search for innerHTML in codebase: `grep -rn "innerHTML" tools/`
2. Verify each has a comment like `// SAFE: Static template`

**Expected:** All remaining innerHTML documented as safe

**Status:** [ ] PASS [ ] FAIL

---

### Test 4.4: HTML Preview Sanitized (HTML/Markdown Tool)
**Steps:**
1. Open HTML/Markdown converter
2. Enter markdown: `# Hello <script>alert("XSS")</script>`
3. Convert to HTML preview

**Expected:** Script tag does NOT execute, appears as text or is removed

**Status:** [ ] PASS [ ] FAIL

---

### Test 4.5: XSS Injection Tests Fail Safely
**Steps:**
Run these XSS test cases:

**Test Case A: Script Injection**
1. Tool: Text Diff
2. Input left: `<script>alert("XSS1")</script>`
3. Input right: `Normal text`
4. Click Compare

**Expected:** No alert fires, script displayed as text

**Result:** ___________

**Test Case B: Event Handler Injection**
1. Tool: HTML/Markdown
2. Input: `<img src=x onerror="alert('XSS2')">`
3. Convert

**Expected:** No alert fires, onerror does not execute

**Result:** ___________

**Test Case C: onclick Injection**
1. Tool: SIP Calculator (or any input field)
2. Input: `<div onclick="alert('XSS3')">Click</div>`

**Expected:** If displayed, onclick does not execute

**Result:** ___________

**Status:** [ ] PASS [ ] FAIL

---

## Section 5: Performance Budget (3 tests) [MEDIUM]

**Objective:** Verify bundle size monitoring is active

### Test 5.1: performance-budget.json Exists
**Steps:**
1. Check file: `performance-budget.json`
2. Verify it contains budget definitions

**Expected:** File exists with budget entries for all tools

**Status:** [ ] PASS [ ] FAIL

---

### Test 5.2: check-bundle-size.js Script Works
**Steps:**
1. Run: `npm run check-size` or `node tools/check-bundle-size.js`
2. Observe output

**Expected:**
- Script runs without errors
- Shows size for each bundle
- Shows PASS/FAIL status
- Generates report file

**Output:**
```
[Paste output here]
```

**Status:** [ ] PASS [ ] FAIL

---

### Test 5.3: All Bundles Pass Size Limits
**Steps:**
1. Review output from Test 5.2
2. Check each bundle status

**Expected:** All bundles show ✅ PASS

**Bundles:**
- [ ] Core Bundle: PASS
- [ ] Shared Components: PASS
- [ ] SIP Calculator: PASS
- [ ] EMI Calculator: PASS
- [ ] Text Diff: PASS
- [ ] HTML/Markdown: PASS
- [ ] JSON Schema: PASS

**Status:** [ ] PASS [ ] FAIL

---

## Section 6: State Manager (3 tests) [MEDIUM]

**Objective:** Verify unified state management is implemented

### Test 6.1: state-manager.js Exists
**Steps:**
1. Check file: `shared/js/state-manager.js`
2. Verify exports: `StateManager` class, `appState`, `getState`, `setState`

**Expected:** File exists with state management API

**Status:** [ ] PASS [ ] FAIL

---

### Test 6.2: At Least 3 Tools Use State Manager
**Steps:**
1. Search for imports: `grep -rn "state-manager" tools/`
2. Count number of tools importing state manager

**Expected:** At least 3 tool files import and use state manager

**Count:** _____

**Status:** [ ] PASS [ ] FAIL

---

### Test 6.3: State Persistence Works
**Steps:**
1. Open SIP Calculator
2. Enter values: Amount=5000, Rate=12, Years=10
3. If state manager used for form persistence:
   - Refresh page
   - Verify values persist

**Expected:** Form values saved and restored after refresh

**Status:** [ ] PASS [ ] FAIL [ ] N/A (if not implemented)

---

## Test Summary

### Overall Results

**Total Tests:** 35  
**Passed:** _____  
**Failed:** _____  
**Pass Rate:** _____%  

**Target:** ≥95% (33+ tests passing)

**Status:** [ ] MET [ ] NOT MET

---

### Failures Summary

List all failed tests and reasons:

1. Test [#]: [Title]
   - Reason: ___________
   - Severity: CRITICAL/HIGH/MEDIUM

2. Test [#]: [Title]
   - Reason: ___________
   - Severity: CRITICAL/HIGH/MEDIUM

---

### Critical Issues

Any CRITICAL or HIGH severity failures must be addressed before Sprint 2 approval:

[ ] No critical issues
[ ] Critical issues identified (list above)

---

## Grade Assessment

Based on test results, estimate grade improvements:

**Security Grade:**
- Sprint 1: B+ (85/100)
- Sprint 2 Estimated: ____ (____/100)
- Target: A- (90+)
- Status: [ ] MET [ ] NOT MET

**Architecture Grade:**
- Sprint 1: B+ (84/100)
- Sprint 2 Estimated: ____ (____/100)
- Target: A- (90+)
- Status: [ ] MET [ ] NOT MET

---

## Recommendations

Based on test results:

**Strengths:**
- ___________
- ___________

**Areas for Improvement:**
- ___________
- ___________

**Blockers for Sprint 3:**
- ___________
- ___________

---

## Approval

**Sprint 2 Status:** [ ] APPROVED [ ] NEEDS WORK [ ] REJECTED

**Test Specialist:** ___________  
**Date:** ___________  
**Signature:** ___________

**Tech Lead Review:** ___________  
**Date:** ___________  
**Signature:** ___________

---

## Notes

Additional observations:

___________________________________________________________
___________________________________________________________
___________________________________________________________

