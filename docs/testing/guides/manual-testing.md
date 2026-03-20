# 🧪 MANUAL TESTING GUIDE
## Quick Reference for Final Validation

**Purpose**: This guide provides step-by-step instructions for manually testing the features that require browser interaction.

**Time Required**: ~30 minutes

---

## 🚀 SETUP

### Prerequisites
- HTTP server running on port 8080
- Modern browser (Chrome, Firefox, or Safari)
- Internet connection (for CDN dependencies)

### Start Server
```bash
cd /home/ravi/projects/json-schema-converter
python3 -m http.server 8080
```

### Access URLs
- **Home Page**: http://localhost:8080/
- **Text Diff**: http://localhost:8080/tools/text-diff/
- **EMI Calculator**: http://localhost:8080/tools/emi-calculator/
- **Automated Tests**: http://localhost:8080/test-final-validation.html

---

## 📝 FEATURE 4: TEXT DIFF CHECKER

### Test 1: Basic Diff Comparison
1. Navigate to http://localhost:8080/tools/text-diff/
2. In "Original Text" box, enter:
   ```
   Line 1
   Line 2
   Line 3
   ```
3. In "Modified Text" box, enter:
   ```
   Line 1
   Line 2 Modified
   Line 3
   ```
4. Click "Compare" button
5. **Expected**: Line 2 shows as changed (red on left, green on right)

✅ **Pass Criteria**: Differences clearly visible with color coding

---

### Test 2: Copy to Clipboard
1. Perform any diff comparison (use Test 1 data)
2. Click "Copy" button
3. Open a text editor (Notepad, VSCode, etc.)
4. Paste (Ctrl+V / Cmd+V)
5. **Expected**: Diff output appears in readable format

✅ **Pass Criteria**: Clipboard contains diff results

---

### Test 3: Download HTML Export
1. Perform any diff comparison
2. Click "Download as HTML" button
3. **Expected**: File downloads (e.g., `text-diff-2026-03-19.html`)
4. Open downloaded file in browser
5. **Expected**: Diff displays correctly with styling

✅ **Pass Criteria**: HTML file contains formatted diff

---

### Test 4: Character-Level Diff
1. Click "Character-Level Diff" checkbox
2. In "Original Text": `The quick brown fox`
3. In "Modified Text": `The fast brown fox`
4. Click "Compare"
5. **Expected**: Only "quick" vs "fast" highlighted

✅ **Pass Criteria**: Character-level highlighting works

---

### Test 5: Ignore Options
1. **Ignore Case**:
   - Original: `Hello World`
   - Modified: `hello world`
   - Check "Ignore Case"
   - Click "Compare"
   - **Expected**: No differences shown

2. **Ignore Whitespace**:
   - Original: `Hello  World` (2 spaces)
   - Modified: `Hello World` (1 space)
   - Check "Ignore Whitespace"
   - Click "Compare"
   - **Expected**: No differences shown

✅ **Pass Criteria**: Options work as expected

---

## 🏠 FEATURE 5: EMI CALCULATOR

### Test 1: Basic EMI Calculation
1. Navigate to http://localhost:8080/tools/emi-calculator/
2. Enter values:
   - Loan Amount: `10,00,000`
   - Interest Rate: `10`
   - Tenure: `10` years
3. Click "Calculate EMI"
4. **Expected**: 
   - Monthly EMI: ~₹13,215
   - Results section displays
   - Amortization table shows 120 rows (10 years × 12 months)
   - Chart appears

✅ **Pass Criteria**: EMI = ₹13,215 (±₹50 acceptable)

---

### Test 2: Accuracy Verification
Use an external EMI calculator (e.g., bankbazaar.com) to verify:

**Test Case**:
- Loan: ₹50,00,000
- Rate: 8.5%
- Tenure: 20 years

**Expected EMI**: ~₹43,391

1. Enter values in DevToolbox EMI Calculator
2. Click "Calculate EMI"
3. Compare result with external calculator
4. **Expected**: Variance <₹50

✅ **Pass Criteria**: Results match external calculator

---

### Test 3: One-Time Prepayment
1. Calculate basic EMI (use Test 1 values)
2. Click "+ Add Prepayment" button
3. Select:
   - Type: `One-time`
   - Amount: `1,00,000`
   - After Month: `12`
4. Click "Add Prepayment"
5. Click "Recalculate with Prepayments"
6. **Expected**:
   - Revised schedule shows
   - Tenure reduced OR EMI reduced
   - Savings calculated and displayed

✅ **Pass Criteria**: Prepayment applied, savings shown

---

### Test 4: Recurring Prepayment
1. Calculate basic EMI
2. Click "+ Add Prepayment"
3. Select:
   - Type: `Monthly`
   - Amount: `5,000`
   - Start Month: `1`
4. Click "Add Prepayment"
5. Click "Recalculate with Prepayments"
6. **Expected**:
   - Every month shows ₹5,000 prepayment
   - Significant tenure reduction
   - High savings displayed

✅ **Pass Criteria**: Recurring prepayment works correctly

---

### Test 5: Copy Amortization Table
1. Calculate EMI with any values
2. Scroll to amortization table
3. Click "Copy Table" button
4. Paste into Excel or text editor
5. **Expected**: Table data appears in tab-separated format

✅ **Pass Criteria**: Table copied successfully

---

### Test 6: Export CSV
1. Calculate EMI
2. Click "Download CSV" button
3. **Expected**: CSV file downloads (e.g., `emi-amortization-2026-03-19.csv`)
4. Open in Excel/Google Sheets
5. **Expected**: Data formatted correctly with headers

✅ **Pass Criteria**: CSV file contains amortization data

---

### Test 7: Chart Visualization
1. Calculate EMI
2. Scroll to chart section
3. **Expected**:
   - Chart.js chart displays
   - Shows principal vs interest over time
   - Legend visible
   - Hover tooltips work

✅ **Pass Criteria**: Chart renders and is interactive

---

## 🏡 FEATURE 6: HOME PAGE

### Test 1: Page Load
1. Navigate to http://localhost:8080/
2. **Expected**:
   - Hero section with "DevToolbox" heading
   - Search bar visible
   - 5 tool cards displayed
   - Footer with links

✅ **Pass Criteria**: All elements visible

---

### Test 2: Search Functionality
1. Type `json` in search box
2. **Expected**: Only JSON Schema tool visible
3. Type `financial`
4. **Expected**: SIP and EMI calculators visible
5. Type `xyz123invalid`
6. **Expected**: "No tools found" message

✅ **Pass Criteria**: Search filters correctly

---

### Test 3: Tool Navigation
1. Click "Launch Tool" on any tool card
2. **Expected**: Tool page loads
3. Click home/back
4. **Expected**: Returns to homepage

✅ **Pass Criteria**: Navigation works smoothly

---

### Test 4: Category Filter
1. Click "Financial" category button
2. **Expected**: Only SIP and EMI visible
3. Click "Developer" category
4. **Expected**: Only JSON Schema and Text Diff visible
5. Click "All" category
6. **Expected**: All 5 tools visible

✅ **Pass Criteria**: Filtering works correctly

---

### Test 5: Responsive Design
1. **Desktop** (1920px):
   - **Expected**: 3-column grid, all elements spaced well

2. **Tablet** (768px):
   - Resize browser to ~768px width
   - **Expected**: 2-column grid, readable text

3. **Mobile** (375px):
   - Resize browser to ~375px width
   - **Expected**: 1-column stacked cards, touch-friendly buttons

✅ **Pass Criteria**: Layout adapts to screen size

---

### Test 6: Recently Used
1. Click and use 3 different tools
2. Return to homepage
3. **Expected**: "Recently Used" section shows last 3 tools

✅ **Pass Criteria**: Recently used tracking works

---

## 🔗 INTEGRATION TESTING

### Test 1: Cross-Tool Navigation
1. Homepage → JSON Schema → SIP Calculator → EMI Calculator → Text Diff → Home
2. **Expected**: All transitions smooth, no errors

✅ **Pass Criteria**: Navigation flow seamless

---

### Test 2: Theme Toggle
1. Click theme toggle button (🌙/☀️)
2. **Expected**: Theme changes (dark ↔ light)
3. Navigate to a tool
4. **Expected**: Theme persists
5. Click theme toggle on tool page
6. **Expected**: Theme changes
7. Return to homepage
8. **Expected**: Theme still matches

✅ **Pass Criteria**: Theme consistent across platform

---

### Test 3: Browser Navigation
1. Homepage → Tool A → Tool B
2. Click browser Back button
3. **Expected**: Returns to Tool A
4. Click browser Back button
5. **Expected**: Returns to Homepage
6. Click browser Forward button
7. **Expected**: Goes to Tool A

✅ **Pass Criteria**: Browser back/forward works

---

### Test 4: Direct URL Access
Test these URLs directly (paste in address bar):
- http://localhost:8080/#/json-schema
- http://localhost:8080/#/sip-calculator
- http://localhost:8080/#/emi-calculator
- http://localhost:8080/#/text-diff
- http://localhost:8080/#/html-markdown

**Expected**: Each tool loads correctly from direct URL

✅ **Pass Criteria**: All direct URLs work

---

### Test 5: Console Error Check
1. Open DevTools (F12)
2. Go to Console tab
3. Navigate through platform (home, tools, etc.)
4. **Expected**: No red errors in console

✅ **Pass Criteria**: Console clean (warnings OK)

---

## 📊 PERFORMANCE TESTING

### Test 1: Load Time
1. Clear browser cache (Ctrl+Shift+Delete)
2. Open DevTools → Network tab
3. Navigate to http://localhost:8080/
4. Look at "Load" time (bottom of Network tab)
5. **Expected**: <2 seconds

✅ **Pass Criteria**: Page loads quickly

---

### Test 2: Text Diff Performance
1. Open http://localhost:8080/tools/text-diff/
2. Generate large text:
   ```javascript
   // Paste in browser console:
   const lines = Array.from({length: 10000}, (_, i) => `Line ${i+1}`).join('\n');
   document.getElementById('original-text').value = lines;
   document.getElementById('modified-text').value = lines.replace(/Line 5000/, 'Line 5000 Modified');
   ```
3. Click "Compare"
4. Measure time (should complete in <2 seconds)

✅ **Pass Criteria**: Large diff completes quickly

---

### Test 3: EMI Calculation Performance
1. Open http://localhost:8080/tools/emi-calculator/
2. Enter:
   - Loan: ₹1,00,00,000 (1 crore)
   - Rate: 9%
   - Tenure: 30 years
3. Click "Calculate EMI"
4. **Expected**: Results appear instantly (<100ms)

✅ **Pass Criteria**: Calculation fast, no lag

---

## ♿ ACCESSIBILITY TESTING

### Test 1: Keyboard Navigation
1. Use Tab key to navigate through page
2. **Expected**: Focus indicator visible on all interactive elements
3. Press Enter/Space on buttons
4. **Expected**: Buttons activate

✅ **Pass Criteria**: Full keyboard accessibility

---

### Test 2: Screen Reader (Optional)
If you have a screen reader:
1. Enable screen reader (NVDA, JAWS, VoiceOver)
2. Navigate through pages
3. **Expected**: All elements announced correctly
4. Check form labels are read

✅ **Pass Criteria**: Screen reader compatible

---

## 📋 CHECKLIST SUMMARY

### Feature 4: Text Diff Checker
- [ ] Basic diff comparison works
- [ ] Copy to clipboard works
- [ ] Download HTML works
- [ ] Character-level diff works
- [ ] Ignore options work

### Feature 5: EMI Calculator
- [ ] Basic EMI calculation accurate
- [ ] Prepayments work correctly
- [ ] Copy table works
- [ ] Export CSV works
- [ ] Chart displays correctly

### Feature 6: Home Page
- [ ] All elements display
- [ ] Search works
- [ ] Category filter works
- [ ] Tool navigation works
- [ ] Responsive design works

### Integration
- [ ] Cross-tool navigation smooth
- [ ] Theme toggle consistent
- [ ] Browser navigation works
- [ ] Direct URLs work
- [ ] No console errors

### Performance
- [ ] Pages load <2s
- [ ] Calculations fast
- [ ] No lag or freezing

### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen readable

---

## ✅ PASS CRITERIA

**Overall**: 25+ tests passed

**Required for Production Approval**:
- ✅ All core features functional
- ✅ No critical bugs blocking usage
- ✅ Performance acceptable
- ✅ Accessibility baseline met

---

## 📝 RECORDING RESULTS

For each test:
1. Mark [ ] → [✅] if passed
2. Mark [ ] → [❌] if failed
3. Note any issues found

**Report Template**:
```
Test: [Name]
Status: [PASS/FAIL]
Notes: [Any observations]
Time: [How long it took]
```

---

## 🚀 NEXT STEPS AFTER TESTING

1. If all tests pass → **APPROVE FOR PRODUCTION**
2. If issues found → Document and prioritize
3. Review automated test results at: http://localhost:8080/test-final-validation.html
4. Check comprehensive reports:
   - FINAL_VALIDATION_REPORT.md
   - FINAL_VALIDATION_SUMMARY.md

---

**Happy Testing! 🧪**

_Manual Testing Guide - Test Specialist_
