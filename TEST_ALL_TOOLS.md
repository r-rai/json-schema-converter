# DevToolbox - Complete Testing Checklist ✅

**Server:** http://localhost:8009  
**Date:** March 23, 2026

## 🎯 Critical Validation (5 minutes)

Test that ALL tools are now working after the urgent fixes.

---

## 1️⃣ Homepage Test

**URL:** http://localhost:8009/

### Visual Check:
- [ ] Tools grid appears IMMEDIATELY (no scrolling needed)
- [ ] All 5 tool cards visible
- [ ] Description/About section at BOTTOM
- [ ] Theme toggle works (dark ↔ light)

### Navigation Check:
- [ ] Click JSON Schema card → Opens tool
- [ ] Click HTML/Markdown card → Opens tool
- [ ] Click Text Diff card → Opens tool
- [ ] Click SIP Calculator card → Opens tool
- [ ] Click EMI Calculator card → Opens tool

**Pass Criteria:** All tools accessible from homepage ✅

---

## 2️⃣ JSON Schema Validator

**URL:** http://localhost:8009/tools/json-schema/

### Functional Test:
1. **Paste this schema in left pane:**
   ```json
   {
     "type": "object",
     "properties": {
       "name": { "type": "string" },
       "age": { "type": "number" }
     }
   }
   ```

2. **Paste this JSON in right pane:**
   ```json
   {
     "name": "John",
     "age": 30
   }
   ```

3. **Click "Validate" button**

### Expected Result:
- [ ] Validation message appears (should show "Valid ✅" or similar)
- [ ] No console errors
- [ ] "Format" button works (indents JSON)
- [ ] "Clear" button works

**Pass Criteria:** Validation works ✅

---

## 3️⃣ HTML ↔ Markdown Converter

**URL:** http://localhost:8009/tools/html-markdown/

### Functional Test:
1. **Paste this HTML in input:**
   ```html
   <h1>Hello World</h1>
   <p>This is a <strong>test</strong>.</p>
   ```

2. **Click "Convert to Markdown" button**

### Expected Result:
- [ ] Markdown output appears: `# Hello World\n\nThis is a **test**.`
- [ ] No console errors
- [ ] Direction toggle works (HTML ↔ Markdown)
- [ ] Copy button works

**Pass Criteria:** Conversion works both directions ✅

---

## 4️⃣ Text Diff Checker

**URL:** http://localhost:8009/tools/text-diff/

### Functional Test:
1. **Paste in Text 1:**
   ```
   Hello World
   This is line 2
   ```

2. **Paste in Text 2:**
   ```
   Hello World
   This is line 2 modified
   New line 3
   ```

3. **Click "Compare" button**

### Expected Result:
- [ ] Diff output appears showing differences
- [ ] Additions highlighted (green/cyan)
- [ ] Deletions highlighted (red/orange)
- [ ] Statistics display (X additions, Y deletions)
- [ ] No console errors

**Pass Criteria:** Diff comparison works ✅

---

## 5️⃣ SIP Calculator (Already Working)

**URL:** http://localhost:8009/tools/sip-calculator/

### Functional Test:
1. **Enter values:**
   - Monthly Investment: 5000
   - Expected Return: 12
   - Time Period: 10

2. **Click "Calculate" button**

### Expected Result:
- [ ] Results display (Total Value, Interest Earned)
- [ ] Chart renders correctly
- [ ] Chart uses Heritage colors
- [ ] No console errors

**Pass Criteria:** Calculation and chart work ✅

---

## 6️⃣ EMI Calculator (Previously Broken - NOW FIXED)

**URL:** http://localhost:8009/tools/emi-calculator/

### Functional Test:
1. **Enter values:**
   - Loan Amount: 500000
   - Interest Rate: 10
   - Tenure: 5

2. **Click "Calculate" button**

### Expected Result:
- [ ] EMI amount displays
- [ ] Breakup chart renders (Principal vs Interest)
- [ ] Amortization table generates
- [ ] Table is scrollable on mobile
- [ ] No console errors

**Pass Criteria:** Calculation, charts, and table work ✅

---

## 7️⃣ Cross-Tool Testing

### Theme Consistency:
- [ ] Toggle theme on homepage → Check persistence
- [ ] Navigate to each tool → Theme persists
- [ ] Refresh page → Theme still correct

### Navigation:
- [ ] Logo on tools → Returns to homepage
- [ ] Breadcrumb "Home" → Returns to homepage
- [ ] Browser back button → Works correctly

### Responsive:
- [ ] Resize browser to mobile width (320px)
- [ ] Tools stack vertically
- [ ] All buttons accessible
- [ ] Text readable

---

## 8️⃣ Console Error Check

**For EACH tool page:**

1. **Open browser DevTools (F12)**
2. **Go to Console tab**
3. **Check for errors**

### Expected:
- [ ] NO red errors in console
- [ ] Only info/debug messages (if any)

**If any errors:** Screenshot and report immediately

---

## ✅ Final Validation

### All Tools Working?
- [ ] JSON Schema Validator ✅
- [ ] HTML/Markdown Converter ✅
- [ ] Text Diff Checker ✅
- [ ] SIP Calculator ✅
- [ ] EMI Calculator ✅

### Homepage Reorganized?
- [ ] Tools visible immediately (no scrolling)
- [ ] Description at bottom
- [ ] All tool cards clickable

### Overall Quality?
- [ ] Zero console errors across all tools
- [ ] Theme toggle works everywhere
- [ ] Navigation works (homepage ↔ tools)
- [ ] All core functionality working

---

## 🚨 If Any Tool Fails

**Report immediately with:**
1. Which tool failed
2. What action was taken
3. What happened (or didn't happen)
4. Console error message (if any)
5. Screenshot of issue

---

## ⏱️ Estimated Testing Time

- Homepage: 1 minute
- Each tool: 2 minutes × 5 = 10 minutes
- Cross-tool: 2 minutes
- **Total: ~15 minutes**

---

**Testing Status:**
- [ ] Homepage ✅
- [ ] JSON Schema ✅
- [ ] HTML/Markdown ✅
- [ ] Text Diff ✅
- [ ] SIP Calculator ✅
- [ ] EMI Calculator ✅
- [ ] Cross-Tool ✅
- [ ] Console Errors ✅

**Result:** All tools functional ✅ / Issues found ⚠️

---

**Next Step:** If all tests pass → Ready for production deployment 🚀
