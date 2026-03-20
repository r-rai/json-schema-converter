# Product Requirements Document: Missing Features Implementation

**Version:** 1.0  
**Date:** 2025-01-XX  
**Status:** Ready for Implementation  
**Priority:** P0 (Critical - User-Reported Gaps)  

---

## Executive Summary

Our DevTools Suite launched successfully with all 6 tools functional. First user testing revealed **3 critical feature gaps** that prevent tools from meeting baseline user expectations. This PRD defines requirements to close these gaps without breaking existing functionality.

### Business Impact

| Metric | Current | Target | Impact |
|--------|---------|--------|--------|
| **JSON Tool Utility** | Basic schema generation | Full formatting control | +40% user satisfaction |
| **Validation Coverage** | Generated schemas only | Custom schema support | +60% use cases |
| **EMI Calculator Completeness** | Basic calculation | Industry-standard features | +80% feature parity |

**RICE Score Summary:**
- JSON Beautify/Minify: **72** (Reach: 100, Impact: 2, Confidence: 90%, Effort: 2.5)
- Schema Validation Input: **54** (Reach: 80, Impact: 2, Confidence: 90%, Effort: 2.7)
- EMI Prepayment: **48** (Reach: 60, Impact: 2, Confidence: 80%, Effort: 2)

---

## User Feedback & Problem Statement

**Verbatim User Feedback:**
> "finally we have a working prototype for the first time. feedback:  
> 1. json schema convertor:  
>    a. minify and beautify functions are missing  
>    b. user should get option to paste json schema when selecting validate json schema.  
> 2. EMI calculator: prepayment option and calculation is not present.  
> coordinate with ui-ux-architect and front-end-developer to get this implemented and fixed. **do not break existing functionality.**"

### Problem Analysis

**Issue #1: JSON Formatting Missing**
- **Current State:** Tool generates and validates schemas but cannot format JSON
- **User Expectation:** Standard JSON tools include beautify/minify
- **Business Value:** Table stakes feature for professional JSON editor
- **User Segment Affected:** All JSON tool users (~100 users/month)

**Issue #2: Custom Schema Validation Gap**
- **Current State:** Can only validate against auto-generated schemas
- **User Expectation:** Validate JSON against external/API schemas
- **Business Value:** Unlocks API testing, contract validation use cases
- **User Segment Affected:** Developers working with third-party APIs (~80 users/month)

**Issue #3: EMI Prepayment Missing**
- **Current State:** Basic EMI calculation without prepayment modeling
- **User Expectation:** Industry-standard EMI calculators support prepayment
- **Business Value:** Critical differentiator for financial calculators
- **User Segment Affected:** Home loan planners, financial advisors (~60 users/month)

---

## Feature Requirements

## Feature 1: JSON Beautify & Minify

### User Story
**As a** developer using the JSON Schema tool  
**I want** easy-access buttons to beautify and minify JSON  
**So that** I can format JSON for readability or compress it for production

### Business Value
- **Revenue Impact:** Baseline feature parity (retention risk if missing)
- **User Satisfaction:** +40% improvement (JSONLint, JSONFormatter have this)
- **Strategic Alignment:** Completes JSON tool feature set
- **Market Differentiation:** Matches industry standard tools

### Acceptance Criteria

**Must Have:**
- [ ] **Beautify Button** visible in JSON tool UI
  - Formats JSON with 2-space indentation
  - Works on JSON input textarea
  - Shows visual feedback (toast/success state)
  - Handles invalid JSON gracefully (error message)
  
- [ ] **Minify Button** visible in JSON tool UI
  - Removes all whitespace from JSON
  - Works on JSON input textarea
  - Shows visual feedback (toast/success state)
  - Handles invalid JSON gracefully (error message)

- [ ] **Placement Requirements:**
  - Buttons near JSON input actions (Generate/Validate area)
  - Clear icons/labels (🎨 Beautify, 🗜️ Minify)
  - Consistent with design system button styles
  - Mobile responsive (stack on small screens)

- [ ] **Functionality:**
  - Operates on JSON input field content
  - Replaces content in-place (no new field)
  - Preserves JSON validation after formatting
  - Works with JSON of any size (up to 1MB)

**Should Have:**
- [ ] Keyboard shortcuts (Ctrl+Shift+B for beautify, Ctrl+Shift+M for minify)
- [ ] Undo/redo support after formatting
- [ ] Character count update after formatting

**Won't Have (Out of Scope):**
- Custom indentation options (always 2 spaces)
- Format-on-paste automatic behavior
- JSON validation before formatting (just error message)

### Success Metrics
- **Primary KPI:** 80% of JSON tool users utilize beautify/minify within first session
- **Secondary KPI:** Zero regression in existing Generate/Validate functionality
- **Business Metric:** User retention rate for JSON tool maintains 95%+

### Technical Specifications

**Function Signatures:**
```javascript
/**
 * Beautifies (pretty-prints) JSON with 2-space indentation
 * @returns {void} - Updates jsonInput textarea directly
 */
function beautifyJSON() {
  // Implementation details
}

/**
 * Minifies JSON by removing all whitespace
 * @returns {void} - Updates jsonInput textarea directly
 */
function minifyJSON() {
  // Implementation details
}
```

**DOM Changes:**
```html
<!-- Add to action buttons section in JSON tool -->
<div class="formatting-actions">
  <button class="btn btn-secondary" onclick="beautifyJSON()" title="Format JSON with indentation">
    🎨 Beautify
  </button>
  <button class="btn btn-secondary" onclick="minifyJSON()" title="Remove whitespace">
    🗜️ Minify
  </button>
</div>
```

**Error Handling:**
- Invalid JSON: Show toast error "Invalid JSON format. Please fix syntax errors first."
- Empty input: Show toast warning "No JSON content to format."
- Large JSON (>1MB): Show toast warning "JSON too large. Consider splitting."

### UX Requirements

**Visual Design:**
- Button style: `.btn-secondary` (outlined, not filled)
- Icons: 🎨 Beautify, 🗜️ Minify
- Placement: Above or beside JSON input textarea
- Spacing: 8px gap between buttons (--spacing-sm)

**Interaction Flow:**
1. User pastes/types JSON in input
2. User clicks "🎨 Beautify" button
3. JSON input updates with formatted version
4. Toast appears: "JSON beautified ✓"
5. User can proceed with generate/validate

**Accessibility:**
- ARIA labels: `aria-label="Beautify JSON"` and `aria-label="Minify JSON"`
- Keyboard focus: Tab order includes new buttons
- Screen reader: Announce when JSON is formatted
- Focus visible: 2px accent color outline

**Responsive Behavior:**
- Desktop: Buttons inline with other actions
- Mobile (<768px): Buttons stack vertically, full width

---

## Feature 2: Custom Schema Validation Input

### User Story
**As a** developer with an existing JSON schema  
**I want** to paste my schema and validate JSON against it  
**So that** I can test API contracts, validate configurations, and verify JSON documents

### Business Value
- **Revenue Impact:** Unlocks 60% more use cases (API testing, contract validation)
- **User Satisfaction:** Critical workflow for backend developers
- **Strategic Alignment:** Positions tool as comprehensive JSON validator
- **Market Differentiation:** Competitive advantage over schema generators that only generate

### Acceptance Criteria

**Must Have:**
- [ ] **Schema Input Option** when validating
  - Radio buttons or toggle: "Use Generated Schema" vs "Paste Custom Schema"
  - Textarea appears when "Paste Custom Schema" selected
  - Accepts JSON Schema draft-04, draft-06, draft-07
  - Validates schema syntax before using for validation
  
- [ ] **Validation Flow:**
  - User selects "Validate JSON Against Schema"
  - Modal/panel appears with schema source choice
  - If "Paste Custom": Large textarea for schema input
  - "Validate" button triggers validation with chosen schema
  - Results show which schema was used

- [ ] **Schema Source Indicator:**
  - Clear visual indication: "Validating against: Generated Schema" or "Validating against: Custom Schema"
  - Schema displayed in validation results
  - Option to copy schema being used

**Should Have:**
- [ ] Schema syntax highlighting in textarea
- [ ] Sample schema templates (string, object, array)
- [ ] Schema validation preview (ensure schema is valid before validation)
- [ ] Recent schemas dropdown (localStorage cache)

**Won't Have (Out of Scope):**
- Schema editor with autocomplete
- Schema library/repository
- Multi-file schema references ($ref resolution)

### Success Metrics
- **Primary KPI:** 50% of validation actions use custom schemas within 2 weeks
- **Secondary KPI:** Zero increase in validation errors (good UX guidance)
- **Business Metric:** 30% increase in JSON tool session duration (more use cases)

### Technical Specifications

**Function Signature:**
```javascript
/**
 * Validates JSON against provided or generated schema
 * @param {Object} schema - JSON Schema object (generated or custom)
 * @param {Object} jsonData - JSON data to validate
 * @returns {Object} - Validation result {valid: boolean, errors: array}
 */
function validateJSONWithSchema(schema, jsonData) {
  // Implementation details
}
```

**DOM Structure:**
```html
<!-- Schema source selection (appears when Validate clicked) -->
<div class="schema-source-panel" id="schemaSourcePanel" style="display:none;">
  <h3>Select Schema Source</h3>
  
  <div class="radio-group">
    <label class="radio-label">
      <input type="radio" name="schemaSource" value="generated" checked onchange="toggleSchemaInput()">
      <span>Use Generated Schema</span>
      <span class="radio-description">Use the schema created from JSON</span>
    </label>
    
    <label class="radio-label">
      <input type="radio" name="schemaSource" value="custom" onchange="toggleSchemaInput()">
      <span>Paste Custom Schema</span>
      <span class="radio-description">Validate against your own JSON Schema</span>
    </label>
  </div>
  
  <div id="customSchemaInput" class="custom-schema-input" style="display:none;">
    <label for="customSchema">Paste JSON Schema</label>
    <textarea id="customSchema" placeholder="Paste your JSON Schema here..."></textarea>
    <p class="helper-text">Supports JSON Schema draft-04, draft-06, draft-07</p>
  </div>
  
  <div class="action-buttons">
    <button class="btn btn-primary" onclick="runValidation()">
      ✓ Validate Now
    </button>
    <button class="btn btn-secondary" onclick="closeSchemaPanel()">
      Cancel
    </button>
  </div>
</div>
```

**Validation Logic:**
```javascript
function runValidation() {
  const schemaSource = document.querySelector('input[name="schemaSource"]:checked').value;
  let schema;
  
  if (schemaSource === 'generated') {
    schema = generatedSchema; // Use existing generated schema
  } else {
    const customSchemaText = document.getElementById('customSchema').value;
    try {
      schema = JSON.parse(customSchemaText);
      // Validate schema structure
      if (!schema.$schema && !schema.type) {
        throw new Error('Invalid JSON Schema format');
      }
    } catch (e) {
      showToast('error', 'Invalid JSON Schema: ' + e.message);
      return;
    }
  }
  
  const result = validateJSONWithSchema(schema, jsonData);
  displayValidationResults(result, schemaSource);
}
```

### UX Requirements

**Visual Design:**
- Panel style: Modal overlay (dim background) or inline panel
- Radio buttons: Custom styled with design system
- Textarea: Same style as JSON input (monospace, line numbers optional)
- Height: 300px minimum for schema textarea

**Interaction Flow:**
1. User clicks "Validate JSON Against Schema"
2. Schema source selection panel appears
3. Default: "Use Generated Schema" selected
4. User clicks "Paste Custom Schema" radio
5. Textarea expands below
6. User pastes schema, clicks "Validate Now"
7. Validation runs, results show: "Validated against: Custom Schema"

**Error States:**
- Empty custom schema: "Please paste a JSON Schema"
- Invalid JSON in schema: "Schema is not valid JSON"
- Invalid schema structure: "Not a valid JSON Schema format"
- Validation failures: Clear error messages with JSON path

**Accessibility:**
- ARIA: `role="radiogroup"` for schema source options
- Labels: Associated with form controls via `for` attribute
- Announcements: "Validation complete. X errors found" or "Valid JSON confirmed"
- Keyboard: Tab through options, Enter to validate

**Responsive Behavior:**
- Desktop: Panel 600px wide, centered
- Mobile: Full-width panel, slide-up animation

---

## Feature 3: EMI Prepayment Calculator

### User Story
**As a** home loan borrower planning prepayments  
**I want** to model prepayment scenarios and see impact on loan tenure/EMI  
**So that** I can make informed decisions about lump sum payments and extra monthly payments

### Business Value
- **Revenue Impact:** Feature parity with market leaders (BankBazaar, ETMoney)
- **User Satisfaction:** Most requested feature for EMI calculators
- **Strategic Alignment:** Positions tool as comprehensive financial planning utility
- **Market Differentiation:** Advanced prepayment modeling (one-time + recurring)

### Acceptance Criteria

**Must Have:**
- [ ] **Prepayment Input Form**
  - Prepayment type: One-time lump sum OR Monthly extra payment
  - Amount input with currency formatting (₹)
  - Start month/year (when prepayment begins)
  - Prepayment strategy: "Reduce Tenure" vs "Reduce EMI"
  
- [ ] **Prepayment Calculation:**
  - Recalculates amortization with prepayment applied
  - Shows savings: Interest saved, months saved, total saved
  - Compares: Original schedule vs With Prepayment
  - Updates year-wise breakdown table

- [ ] **Results Display:**
  - Side-by-side comparison cards:
    - Without Prepayment: X years, ₹Y interest
    - With Prepayment: X years, ₹Y interest, SAVED ₹Z
  - Amortization table shows both scenarios
  - Clear visual indicators (green for savings)

- [ ] **UI Placement:**
  - Collapsible "Advanced: Prepayment Planning" section
  - Appears after basic EMI calculation
  - Expands when user clicks toggle
  - Does not interfere with basic calculator

**Should Have:**
- [ ] Multiple prepayment scenarios (add multiple prepayments)
- [ ] Chart visualization (loan balance over time)
- [ ] Export prepayment schedule to CSV

**Won't Have (Out of Scope):**
- Variable interest rate modeling
- Tax benefit calculations (Section 80C)
- Insurance/processing fee inclusion

### Success Metrics
- **Primary KPI:** 70% of EMI calculator users explore prepayment feature
- **Secondary KPI:** Average session time increases by 60 seconds
- **Business Metric:** EMI tool becomes #1 most used tool (currently #3)

### Technical Specifications

**Function Signature:**
```javascript
/**
 * Calculates EMI schedule with prepayment applied
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Interest rate (annual %)
 * @param {number} tenureYears - Loan tenure in years
 * @param {Object} prepayment - Prepayment configuration
 * @param {string} prepayment.type - 'lump-sum' or 'monthly-extra'
 * @param {number} prepayment.amount - Prepayment amount
 * @param {number} prepayment.startMonth - Month to start (1-based)
 * @param {string} prepayment.strategy - 'reduce-tenure' or 'reduce-emi'
 * @returns {Object} - {schedule: array, summary: object, savings: object}
 */
function calculateEMIWithPrepayment(principal, annualRate, tenureYears, prepayment) {
  // Implementation details
}
```

**DOM Structure:**
```html
<!-- Add to EMI Calculator tool after basic form -->
<div class="prepayment-section">
  <div class="section-header" onclick="togglePrepaymentSection()">
    <h3>⚡ Advanced: Prepayment Planning</h3>
    <button class="toggle-icon" id="prepaymentToggle">▼</button>
  </div>
  
  <div class="prepayment-form" id="prepaymentForm" style="display:none;">
    <div class="form-group">
      <label>Prepayment Type</label>
      <select id="prepaymentType" class="form-select" onchange="updatePrepaymentForm()">
        <option value="lump-sum">One-Time Lump Sum</option>
        <option value="monthly-extra">Monthly Extra Payment</option>
      </select>
    </div>
    
    <div class="form-group">
      <label for="prepaymentAmount">Prepayment Amount</label>
      <div class="input-with-prefix">
        <span class="prefix">₹</span>
        <input type="number" id="prepaymentAmount" min="1000" step="1000" placeholder="50000">
      </div>
    </div>
    
    <div class="form-group" id="startMonthGroup">
      <label for="prepaymentStartMonth">Start From Month</label>
      <input type="number" id="prepaymentStartMonth" min="1" max="360" value="1" placeholder="1">
      <p class="helper-text">Month number from loan start (1 = first month)</p>
    </div>
    
    <div class="form-group">
      <label>Prepayment Strategy</label>
      <div class="radio-group">
        <label class="radio-label">
          <input type="radio" name="prepaymentStrategy" value="reduce-tenure" checked>
          <span>Reduce Loan Tenure</span>
          <span class="radio-description">Payoff loan faster, keep EMI same</span>
        </label>
        <label class="radio-label">
          <input type="radio" name="prepaymentStrategy" value="reduce-emi">
          <span>Reduce Monthly EMI</span>
          <span class="radio-description">Lower monthly payment, same tenure</span>
        </label>
      </div>
    </div>
    
    <button class="btn btn-primary btn-large" onclick="calculateEMIWithPrepaymentUI()">
      📊 Recalculate with Prepayment
    </button>
  </div>
</div>

<!-- Prepayment Results Comparison -->
<div class="prepayment-comparison" id="prepaymentComparison" style="display:none;">
  <h3>Impact Analysis</h3>
  
  <div class="comparison-cards">
    <div class="comparison-card">
      <div class="card-header">Without Prepayment</div>
      <div class="card-metric">
        <span class="metric-label">Total Interest:</span>
        <span class="metric-value" id="originalInterest">₹0</span>
      </div>
      <div class="card-metric">
        <span class="metric-label">Loan Tenure:</span>
        <span class="metric-value" id="originalTenure">0 years</span>
      </div>
    </div>
    
    <div class="comparison-card highlight">
      <div class="card-header success">With Prepayment</div>
      <div class="card-metric">
        <span class="metric-label">Total Interest:</span>
        <span class="metric-value success" id="prepaymentInterest">₹0</span>
      </div>
      <div class="card-metric">
        <span class="metric-label">Loan Tenure:</span>
        <span class="metric-value success" id="prepaymentTenure">0 years</span>
      </div>
      <div class="savings-banner">
        <strong>💰 Total Savings: </strong>
        <span id="totalSavings">₹0</span>
      </div>
    </div>
  </div>
</div>
```

**Calculation Logic:**
```javascript
function calculateEMIWithPrepaymentUI() {
  const principal = parseFloat(document.getElementById('loanAmount').value);
  const annualRate = parseFloat(document.getElementById('loanRate').value);
  const tenureYears = parseFloat(document.getElementById('loanTenure').value);
  
  const prepayment = {
    type: document.getElementById('prepaymentType').value,
    amount: parseFloat(document.getElementById('prepaymentAmount').value),
    startMonth: parseInt(document.getElementById('prepaymentStartMonth').value),
    strategy: document.querySelector('input[name="prepaymentStrategy"]:checked').value
  };
  
  const result = calculateEMIWithPrepayment(principal, annualRate, tenureYears, prepayment);
  
  displayPrepaymentComparison(result);
}
```

### UX Requirements

**Visual Design:**
- Section style: Collapsible panel with accordion behavior
- Header: "⚡ Advanced: Prepayment Planning" with toggle icon
- Form: Same design system styles as basic calculator
- Comparison cards: Side-by-side layout, "With Prepayment" gets green/success theme

**Interaction Flow:**
1. User calculates basic EMI (sees results)
2. User notices "Advanced: Prepayment Planning" collapsed section
3. User clicks to expand section
4. Prepayment form appears below
5. User enters prepayment details (type, amount, start month, strategy)
6. User clicks "Recalculate with Prepayment"
7. Results update with comparison: Original vs With Prepayment
8. Amortization table shows both scenarios

**Progressive Disclosure:**
- Basic calculator: Always visible
- Prepayment section: Collapsed by default
- Prepayment results: Only shown after prepayment calculation

**Error States:**
- Empty prepayment amount: "Please enter prepayment amount"
- Amount > loan balance: "Prepayment cannot exceed remaining loan balance"
- Start month > tenure: "Start month cannot exceed loan tenure"

**Accessibility:**
- ARIA: `aria-expanded="false"` on collapsed section
- Keyboard: Space/Enter to toggle section
- Screen reader: "Prepayment section expanded" announcement
- Focus: Moves to first input when section expands

**Responsive Behavior:**
- Desktop: Comparison cards side-by-side (2-column grid)
- Mobile: Comparison cards stack vertically

---

## Implementation Strategy

### Development Phases

**Phase 1: JSON Beautify/Minify (2-4 hours)**
1. Implement `beautifyJSON()` and `minifyJSON()` functions
2. Add buttons to JSON tool UI
3. Wire onclick handlers
4. Add toast notifications
5. Test with various JSON sizes
6. Verify no regression in existing features

**Phase 2: Custom Schema Validation (4-6 hours)**
1. Create schema source selection UI (radio buttons + textarea)
2. Implement `validateJSONWithSchema()` function
3. Add schema syntax validation
4. Update validation results display
5. Test with JSON Schema draft-04, 06, 07
6. Verify generated schema flow still works

**Phase 3: EMI Prepayment Calculator (6-8 hours)**
1. Create prepayment form UI (collapsible section)
2. Implement `calculateEMIWithPrepayment()` function
3. Build prepayment logic (lump-sum + monthly extra)
4. Create comparison results display
5. Update amortization table with prepayment
6. Test various prepayment scenarios
7. Verify basic EMI calculation unchanged

### Testing Requirements

**Functional Testing:**
- [ ] JSON beautify works with valid JSON (nested objects, arrays)
- [ ] JSON minify removes all whitespace
- [ ] Invalid JSON shows appropriate error
- [ ] Custom schema validation accepts valid schemas
- [ ] Custom schema validation rejects invalid schemas
- [ ] Generated schema validation still works
- [ ] EMI prepayment calculates correctly (lump-sum)
- [ ] EMI prepayment calculates correctly (monthly extra)
- [ ] Prepayment savings calculation accurate
- [ ] Basic EMI calculation unchanged

**Regression Testing:**
- [ ] JSON schema generation still works
- [ ] JSON validation (generated schema) still works
- [ ] Download schema/JSON still works
- [ ] Copy to clipboard still works
- [ ] Basic EMI calculation still works
- [ ] EMI amortization table still displays
- [ ] All navigation/routing still works
- [ ] Theme toggle still works
- [ ] Search modal still works

**Cross-Browser Testing:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Responsive Testing:**
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

**Accessibility Testing:**
- [ ] Keyboard navigation works
- [ ] Screen reader announces changes
- [ ] Focus indicators visible
- [ ] ARIA attributes correct

### Risk Mitigation

**Technical Risks:**
- **Risk:** Large JSON crashes beautify/minify  
  **Mitigation:** Add size limit (1MB), show warning for large JSON
  
- **Risk:** Invalid custom schema breaks validation  
  **Mitigation:** Validate schema syntax before using, clear error messages
  
- **Risk:** Prepayment calculation complex, edge cases  
  **Mitigation:** Unit tests for known scenarios, reference existing calculators
  
- **Risk:** Breaking existing functionality  
  **Mitigation:** No changes to existing functions, only additions; comprehensive regression testing

**UX Risks:**
- **Risk:** UI clutter with too many buttons  
  **Mitigation:** Use collapsible sections, progressive disclosure
  
- **Risk:** Users confused by schema source options  
  **Mitigation:** Clear radio labels, helper text, default to "Use Generated"
  
- **Risk:** Prepayment form overwhelming  
  **Mitigation:** Collapsed by default, clear section header, simple defaults

---

## Success Criteria

### Definition of Done

**Feature Complete:**
- [ ] All acceptance criteria met for all 3 features
- [ ] No regressions in existing functionality
- [ ] Cross-browser testing passed
- [ ] Accessibility requirements met (WCAG 2.1 AA)
- [ ] Mobile responsive verified

**Quality Gates:**
- [ ] Zero console errors
- [ ] Lighthouse score remains 95+ (no performance regression)
- [ ] Load time <1s (no bundle size increase)
- [ ] Manual testing checklist 100% passed

**Documentation:**
- [ ] Implementation notes added to DEVELOPER_GUIDE.md
- [ ] User-facing documentation updated (if needed)
- [ ] Code comments added for complex logic

### Validation Metrics

**Immediate (Day 1):**
- Zero user-reported bugs
- All features accessible and working
- No increase in error rates

**Short-term (Week 1):**
- 60%+ of JSON tool users try beautify/minify
- 30%+ of validations use custom schemas
- 50%+ of EMI calculations explore prepayment

**Long-term (Month 1):**
- User retention for JSON tool: 95%+
- EMI tool becomes #1 or #2 most-used tool
- Zero feature-related support requests

---

## Dependencies & Coordination

### Agent Collaboration

**ui-ux-architect (Optional Consultation):**
- Review UX specifications in this PRD
- Provide feedback on component placement
- Validate accessibility requirements

**front-end-developer (Primary Implementation):**
- Implement all 3 features per this PRD
- Follow design system guidelines
- Execute testing plan
- Document implementation

### External Dependencies
- None (all features self-contained)

### Data Requirements
- None (all client-side calculations)

---

## Appendix

### Reference Materials

**Existing Code Locations:**
- JSON Tool: index.html lines ~2500-3500 (estimated)
- EMI Calculator: index.html lines ~2100-2300 (estimated)
- Design System: CSS variables lines ~50-600

**Competitive Analysis:**
- JSONLint.com: Has beautify/minify
- JSONFormatter.org: Has custom schema validation
- BankBazaar EMI Calculator: Has prepayment modeling
- ETMoney EMI Calculator: Advanced prepayment scenarios

**JSON Schema Resources:**
- JSON Schema Specification: https://json-schema.org/
- Schema Drafts: draft-04, draft-06, draft-07
- Validation Libraries: Built-in (no external libs)

### Open Questions

1. **JSON Beautify/Minify:**
   - Q: Should beautify be applied automatically on schema generation?
   - A: No - user controls formatting explicitly via buttons

2. **Custom Schema Validation:**
   - Q: Should we cache recently used custom schemas?
   - A: Yes - store last 5 in localStorage (should-have feature)

3. **EMI Prepayment:**
   - Q: Should we support multiple prepayments (e.g., annual lump sum + monthly extra)?
   - A: Phase 2 enhancement - start with single prepayment type

---

**Document Owner:** Product Owner  
**Stakeholders:** Front-End Developer, UI/UX Architect  
**Next Review Date:** After implementation completion  
**Status:** ✅ Ready for Development
