# Accessibility Testing Plan
## WCAG 2.1 Level AA Compliance Testing Strategy

**Document Version:** 1.0  
**Last Updated:** March 19, 2026  
**Testing Standard:** WCAG 2.1 Level AA  
**Target Browsers:** Chrome 90+, Edge 90+  
**Testing Timeline:** Weeks 3, 7, 9, 10

---

## Overview

This document defines the comprehensive accessibility testing strategy for the Developer Toolset Platform. All 6 tools must achieve WCAG 2.1 Level AA compliance before production launch.

**Commitment:** Zero Level A violations, < 3 Level AA violations at launch

---

## Testing Approach

### Three-Tier Testing Strategy:
1. **Automated Testing** - Fast, repeatable scans with axe-core
2. **Manual Screen Reader Testing** - Real-world assistive technology validation
3. **Keyboard-Only Testing** - Complete workflows without mouse

---

## 1. Automated Accessibility Testing

### Tools:
- **axe DevTools** - Browser extension for manual scans
- **axe-core** - Programmatic testing integration
- **WebAIM Contrast Checker** - Color contrast validation
- **W3C HTML Validator** - ARIA markup verification

### Testing Schedule:

| Week | Activity | Scope |
|------|----------|-------|
| Week 3 | Initial scan | Features 1-2 (JSON Schema, SIP Calculator) |
| Week 5 | Mid-project scan | Features 3-4 (HTML/MD, Diff Checker) |
| Week 7 | Comprehensive scan | All completed features  |
| Week 10 | Final pre-launch scan | Entire platform including home page |

### Automated Test Checklist:

#### Per Tool Scan:
- [ ] Run axe-core automated scan (0 critical issues)
- [ ] Check all interactive elements have accessible names
- [ ] Verify form inputs have associated labels
- [ ] Validate ARIA attributes (no invalid/deprecated)
- [ ] Check heading hierarchy (h1 → h2 → h3, no skips)
- [ ] Verify alt text on all images/icons
- [ ] Check color contrast ratios (4.5:1 text, 3:1 UI components)
- [ ] Validate landmark regions (header, main, nav, footer)
- [ ] Check for empty links or buttons
- [ ] Verify language attribute on html element

### Color Contrast Requirements:

**Text:**
- Normal text (< 18px): 4.5:1 minimum
- Large text (≥ 18px or ≥ 14px bold): 3:1 minimum

**UI Components:**
- Interactive elements: 3:1 minimum
- Focus indicators: 3:1 minimum

**Theme Validation:**
```
Dark Theme:
- Text on bg: #f1f5f9 on #0f172a = 15.8:1 ✅
- Accent on bg: #38bdf8 on #0f172a = 7.2:1 ✅
- Links: #38bdf8 on #1e293b = 6.5:1 ✅

Light Theme:
- Text on bg: #0f172a on #ffffff = 15.8:1 ✅
- Accent on bg: #0284c7 on #f8fafc = 7.5:1 ✅
```

### Automated Testing Integration:

```javascript
// tests/accessibility/axe-test.js
const { configureAxe, toHaveNoViolations } = require('jest-axe');
const axe = configureAxe({
  rules: {
    // Disable rules not applicable
    'color-contrast': { enabled: true },
    'html-has-lang': { enabled: true },
  }
});

describe('Accessibility Tests', () => {
  test('Home page has no accessibility violations', async () => {
    const html = renderHomePage();
    const results = await axe(html);
    expect(results).toHaveNoViolations();
  });
  
  // Similar tests for each tool
});
```

---

## 2. Manual Screen Reader Testing

### Testing Tools:
- **Primary:** NVDA (Windows) - Free, widely used
- **Secondary:** JAWS (Windows) - Industry standard (if available)
- **Tertiary:** VoiceOver (Mac) - Apple's native screen reader

### Testing Schedule:

| Week | Activity | Focus |
|------|----------|-------|
| Week 9 | Initial SR testing | Critical user paths on 2tools |
| Week 10 | Comprehensive SR testing | All 6 tools, full workflows |
| Week 10 | SR bug fixes | Address identified issues |

### Screen Reader Test Protocol:

#### Pre-Test Setup:
1. Close all other applications
2. Start screen reader (NVDA Ctrl+Alt+N)
3. Disable monitor (to test SR-only experience)
4. Use Chrome browser

#### Test Scenarios Per Tool:

**JSON Schema Converter:**
- [ ] Navigate to tool with SR only
- [ ] Hear tool title and description
- [ ] Locate and fill JSON input textarea
- [ ] Activate "Generate Schema" button
- [ ] Hear success/error announcement
- [ ] Navigate generated schema output
- [ ] Activate "Copy" button, hear confirmation

**SIP Calculator:**
- [ ] Navigate form inputs with SR
- [ ] Hear label and current value for each input
- [ ] Fill in monthly investment, rate, duration
- [ ] Activate "Calculate" button
- [ ] Hear calculation results announced
- [ ] Navigate year-wise breakdown table
- [ ] Navigate chart data via table fallback

**EMI Calculator (Complex):**
- [ ] Complete basic EMI calculation
- [ ] Add prepayment entry (SR announces fields)
- [ ] Navigate between prepayment entries
- [ ] Delete prepayment (SR confirms)
- [ ] Hear revised calculation results
- [ ] Navigate comparison table (original vs revised)

**Text Diff Checker:**
- [ ] Enter text in both panels
- [ ] Hear diff mode options
- [ ] Activate "Compare" button
- [ ] Navigate diff results line by line
- [ ] Hear added/removed/modified announcements
- [ ] Toggle options (ignore whitespace)
- [ ] Hear diff statistics

### Screen Reader Announcement Requirements:

**Dynamic Content Updates:**
```html
<!-- Use live regions for announcements -->
<div aria-live="polite" aria-atomic="true" class="sr-only">
  <!-- Calculation complete. EMI: ₹25,000 per month -->
</div>

<!-- Errors use assertive -->
<div aria-live="assertive" aria-atomic="true" class="sr-only">
  <!-- Error: Please enter a valid loan amount -->
</div>
```

**Chart Accessibility:**
```html
<div class="chart-container">
  <canvas id="sipChart" aria-labelledby="chart-title" role="img">
    <!-- Canvas fallback -->
    <p id="chart-title">SIP Growth Chart</p>
    <p>Chart showing investment vs returns over time. Data available in table below.</p>
  </canvas>
  
  <!-- Accessible data table -->
  <table class="sr-only" aria-label="SIP calculation data">
    <thead>
      <tr>
        <th>Year</th>
        <th>Investment</th>
        <th>Returns</th>
        <th>Total Value</th>
      </tr>
    </thead>
    <tbody>
      <!-- Data rows -->
    </tbody>
  </table>
</div>
```

### Screen Reader Testing Checklist:

#### Per Tool Assessment:
- [ ] Tool purpose clearly announced on load
- [ ] All form controls have labels
- [ ] Field validation errors announced immediately
- [ ] Button actions have clear labels ("Calculate SIP", not just "Calculate")
- [ ] Dynamic content updates announced via live regions
- [ ] Charts have text/table alternatives
- [ ] Success/error messages announced
- [ ] Loading states announced ("Calculating EMI...")
- [ ] Modal dialogs trap focus and announce title
- [ ] Can complete primary user story via SR only

---

## 3. Keyboard Navigation Testing

### Testing Requirements:
- Complete all user workflows using keyboard only (no mouse)
- All interactive elements reachable via Tab
- Logical tab order (top-to-bottom, left-to-right)
- Visible focus indicators at all times
- Escape key closes modals/menus
- Enter/Space activates buttons

### Keyboard Navigation Standards:

**Focus Management:**
```css
/* Visible focus indicators (3:1 contrast minimum) */
*:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* Never remove focus outline */
*:focus:not(:focus-visible) {
  /* Only remove for mouse users */
}
```

**Keyboard Shortcuts:**
- `Tab` - Next interactive element
- `Shift + Tab` - Previous interactive element
- `Enter` or `Space` - Activate button
- `Escape` - Close modal, cancel action
- `Arrow keys` - Navigate within component (dropdowns, tabs)

### Keyboard Testing Checklist:

#### Home Page:
- [ ] Tab to first tool card
- [ ] Tab through all tool cards
- [ ] Tab to theme toggle
- [ ] Tab to search input
- [ ] Enter on tool card navigates to tool
- [ ] Focus visible throughout

#### Tool Page Template:
- [ ] Tab to "Home" button
- [ ] Tab to theme toggle
- [ ] Tab to first input field
- [ ] Tab through all form inputs
- [ ] Tab to action buttons
- [ ] Tab to output area (if focusable)
- [ ] Tab to copy/download buttons
- [ ] Shift+Tab reverses order correctly
- [ ] Enter executes primary action
- [ ] Escape closes help modal (if open)

#### JSON Schema Converter:
- [ ] Tab to JSON input textarea
- [ ] Type or paste JSON
- [ ] Tab to draft version dropdown
- [ ] Arrow keys to select draft
- [ ] Tab to "Generate Schema" button
- [ ] Enter to generate
- [ ] Tab to schema output
- [ ] Tab to "Copy Schema" button
- [ ] Tab to "Download" button
- [ ] Complete workflow without mouse

#### SIP Calculator:
- [ ] Tab through 4 input fields (investment, rate, duration, step-up)
- [ ] Enter numbers in each field
- [ ] Tab to "Calculate" button
- [ ] Enter to calculate
- [ ] Tab to results summary
- [ ] Tab to year-wise table (if keyboard navigable)
- [ ] Tab to export button

#### EMI Calculator:
- [ ] Complete basic EMI workflow via keyboard
- [ ] Tab to "Add Prepayment" button
- [ ] Enter to add prepayment entry
- [ ] Tab through prepayment fields
- [ ] Tab to prepayment type dropdown
- [ ] Arrow keys to select type
- [ ] Tab to "Remove" button
- [ ] Tab to "Recalculate" button
- [ ] Navigate comparison tables
- [ ] Complete complex workflow without mouse

#### Text Diff Checker:
- [ ] Tab to original text panel
- [ ] Paste or type text
- [ ] Tab to modified text panel
- [ ] Paste or type text
- [ ] Tab to "Compare" button
- [ ] Enter to compare
- [ ] Tab to view mode toggle
- [ ] Space to toggle
- [ ] Tab to ignore options checkboxes
- [ ] Space to check/uncheck
- [ ] Navigate diff results (if focusable)

### Focus Trap for Modals:

```javascript
// Trap focus within modal
function trapFocus(modalElement) {
  const focusable = modalElement.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusable[0];
  const lastFocusable = focusable[focusable.length - 1];
  
  modalElement.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
    
    if (e.key === 'Escape') {
      closeModal();
    }
  });
  
  firstFocusable.focus();
}
```

---

## 4. Tool-Specific Accessibility Requirements

### F-001: JSON Schema Enhancement
- Input textarea labeled "JSON Input"
- Schema output labeled "Generated Schema"
- Validation errors announced via aria-live
- Success message when schema generated

### F-002: SIP Calculator
- All numeric inputs have labels and units (₹, %, years)
- Chart has data table fallback
- Calculation results announced
- Year-wise table keyboard navigable

### F-003: HTML ↔ Markdown Converter
- Two panels labeled "HTML Input" and "Markdown Input"
- Conversion direction clear to SR users
- Live preview announced in real-time (debounced)
- Format errors announced

### F-004: Text Diff Checker
- Two panels labeled "Original Text" and "Modified Text"
- Diff mode toggle (line-by-line vs character) announced
- Added/removed/modified lines have distinct SR announcements
- Diff statistics announced
- Line numbers available to SR

### F-005: EMI Calculator (Most Complex)
- Basic EMI inputs have clear labels
- Prepayment entries announced when added/removed
- Prepayment type (lumpsum/recurring) announced
- Option (reduce EMI vs reduce tenure) announced
- Original vs revised comparison table keyboard navigable
- Chart has comprehensive data table fallback
- Interest savings announced prominently

### F-006: Home Page
- Tool cards have descriptive labels (not just icons)
- Search input labeled "Search Tools"
- Search results announced
- Recently used section announced
- Tool icons decorative (aria-hidden="true")

---

## 5. Testing Timeline & Milestones

### Week 3: First Tools Validation
**Scope:** JSON Schema, SIP Calculator  
**Activities:**
- Automated axe-core scans
- Color contrast validation
- Basic keyboard navigation test
- **Deliverable:** Accessibility report #1

### Week 5: Mid-Project Validation
**Scope:** HTML/Markdown, Text Diff  
**Activities:**
- Automated scans on new tools
- Keyboard navigation testing
- **Deliverable:** Accessibility report #2

### Week 7: Comprehensive Validation
**Scope:** All 4 completed tools  
**Activities:**
- Full automated scan suite
- Keyboard testing all tools
- Initial screen reader spot checks
- **Deliverable:** Accessibility report #3

### Week 9: Pre-Launch Screen Reader Testing
**Scope:** All 6 tools including home page  
**Activities:**
- Full NVDA testing (2-3 hours per tool)
- Document all SR-specific issues
- **Deliverable:** Screen reader test report

### Week 10: Final Validation & Sign-Off
**Scope:** Entire platform  
**Activities:**
- Retest all fixed issues
- Final automated scan
- Final keyboard navigation test
- Sign-off from Test Specialist
- **Deliverable:** Final accessibility compliance certificate

---

## 6. Bug Tracking & Severity

### Accessibility Bug Severity Levels:

**Critical (Level A Violation):**
- Keyboard trap (can't escape)
- Missing alt text on informative images
- Form inputs without labels
- Color-only information conveyance
- **Response:** Fix immediately, block deployment

**High (Level AA Violation):**
- Insufficient color contrast
- Missing focus indicators
- Incorrect heading hierarchy
- Missing live region announcements
- **Response:** Fix before release

**Medium (Best Practice):**
- Non-semantic HTML
- Missing ARIA landmarks
- Redundant link text
- **Response:** Fix if time permits, document as known issue

**Low (Enhancement):**
- Overly verbose ARIA labels
- Minor tab order issues
- **Response:** Backlog for v2.0

---

## 7. Success Criteria

### Automated Testing:
- ✅ Zero Level A violations across all tools
- ✅ < 3 Level AA violations per tool
- ✅ < 10 Level AAA or best practice warnings per tool
- ✅ 100% color contrast compliance

### Manual Screen Reader Testing:
- ✅ Primary user story completable via NVDA
- ✅ All form interactions understandable
- ✅ All dynamic updates announced
- ✅ Charts have accessible alternatives

### Keyboard Navigation Testing:
- ✅ 100% of features accessible via keyboard
- ✅ Logical tab order on all pages
- ✅ Focus visible at all times
- ✅ No keyboard traps

---

## 8. Responsibility Matrix

| Role | Responsibility |
|------|---------------|
| **Developer** | Implement accessible HTML, ARIA labels, keyboard handlers |
| **Test Specialist** | Execute all accessibility tests, report issues |
| **Product Owner** | Define acceptance criteria, approve compliance |
| **Tech Lead** | Review code for accessibility patterns, mentor team |
| **Security Reviewer** | Validate no security issues introduced by a11y features |

---

## 9. Tools & Resources

### Testing Tools:
- **axe DevTools:** https://www.deque.com/axe/devtools/
- **NVDA Screen Reader:** https://www.nvaccess.org/download/
- **WAVE:** https://wave.webaim.org/
- **WebAIM Contrast Checker:** https://webaim.org/resources/contrastchecker/

### Reference Documentation:
- **WCAG 2.1 Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **ARIA Authoring Practices:** https://www.w3.org/WAI/ARIA/apg/
- **WebAIM Keyboard Testing:** https://webaim.org/articles/keyboard/

### Training Resources:
- NVDA Keyboard Shortcuts: https://webaim.org/resources/shortcuts/nvda
- Accessibility Developer Guide: https://www.accessibility-developer-guide.com/

---

## 10. Reporting Template

### Accessibility Test Report Template:

```markdown
# Accessibility Test Report - [Tool Name]

**Date:** [Date]  
**Tester:** [Name]  
**Tool Version:** [Version]  
**Testing Method:** [Automated/Manual Screen Reader/Keyboard]

## Summary
- Total Issues Found: [#]
- Critical (Level A): [#]
- High (Level AA): [#]
- Medium: [#]
- Low: [#]

## Issues

### Issue #1: [Title]
- **Severity:** [Critical/High/Medium/Low]
- **WCAG SC:** [1.4.3, 2.1.1, etc.]
- **Location:** [Specific element/page]
- **Description:** [What's wrong]
- **Steps to Reproduce:**
  1. [Step 1]
  2. [Step 2]
- **Expected Behavior:** [What should happen]
- **Actual Behavior:** [What happens]
- **Recommendation:** [How to fix]
- **Screenshot:** [If applicable]

[Repeat for each issue]

## Compliance Status
- [ ] Level A Compliant
- [ ] Level AA Compliant
- [ ] Ready for Production

## Sign-Off
- Tester: [Name] - [Date]
- Product Owner: [Name] - [Date]
```

---

**Document Status:** Ready for Implementation  
**Owner:** Test Specialist  
**Review Cycle:** Weekly during Phase 2-4  
**Last Updated:** March 19, 2026
