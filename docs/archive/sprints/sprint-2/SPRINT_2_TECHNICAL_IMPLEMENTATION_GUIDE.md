# Sprint 2: Technical Implementation Guide
## CSP Hardening & Component Adoption

**Sprint:** 2 of 4 (Days 3-5)  
**Timeline:** March 20-22, 2026  
**Developer Effort:** 26 hours (3 days)  
**Test Validation:** 7 hours  

---

## Executive Summary

Sprint 2 focuses on security hardening and UI consistency by:
1. **Eliminating CSP inline violations** (29 styles + 28 event handlers)
2. **Increasing component adoption** (40% → 80%+)
3. **Adding error boundaries** for graceful failure handling
4. **Auditing innerHTML** for XSS vulnerabilities
5. **Implementing performance budgets** and monitoring
6. **Standardizing state management** patterns

**Success Criteria:**
- Zero CSP violations with strict policy
- 80%+ shared component adoption
- All tools have error boundaries
- Zero unsafe innerHTML usage
- Architecture grade: B+ → A-
- Security grade: B+ → A-

---

## Pre-Implementation Setup

### 1. Verify Sprint 1 Foundation

Ensure these are in place from Sprint 1:
- [ ] All 5 libraries in `/lib/` directory (287 KB)
- [ ] Zero CDN dependencies in HTML files
- [ ] SRI hashes on all library script tags
- [ ] `docs/CSP_MIGRATION_PLAN.md` exists and complete
- [ ] Local testing environment working
- [ ] All Sprint 1 tests passed (15/15)

### 2. Read Reference Documentation

Before starting implementation:
- [ ] Read `docs/CSP_MIGRATION_PLAN.md` (audit results on lines 1-250)
- [ ] Review existing components in `shared/components/`
- [ ] Review existing utilities in `shared/css/utilities.css`
- [ ] Understand Sprint 2 scope in this document

### 3. Development Environment

```bash
# Verify you're in the project root
cd /home/ravi/projects/json-schema-converter

# Check current structure
ls -la shared/components/  # Should see: button.js, card.js, input.js, modal.js
ls -la shared/css/         # Should see: utilities.css, variables.css, themes.css, etc.
ls -la tools/              # Should see: 5 tool directories

# Start local development server (if needed)
# npx serve . -p 8080
```

---

## Day 3 (March 20) - CSP Critical Work

**Goal:** Eliminate all inline styles and event handlers to enable strict CSP

---

### Task 3.1: Extract Inline Styles to CSS (4 hours)

**Objective:** Remove all 29 inline `style=` attributes from tools

#### Step 1: Create Tool-Specific CSS File

**File:** `shared/css/tool-styles.css`

```css
/**
 * Tool-Specific Styles
 * Extracted inline styles for strict CSP compliance
 * 
 * @file shared/css/tool-styles.css
 * Sprint 2 - Day 3 - Task 3.1
 */

/* ========================================
   ERROR STATES
   ======================================== */

.error-text {
  color: var(--color-danger, #dc3545);
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.error-border {
  border-color: var(--color-danger, #dc3545) !important;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.error-message {
  background-color: rgba(220, 53, 69, 0.1);
  border-left: 3px solid var(--color-danger, #dc3545);
  padding: 0.75rem 1rem;
  margin: 0.5rem 0;
  border-radius: 4px;
}

/* ========================================
   RESULT DISPLAYS
   ======================================== */

.result-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-primary, #007bff);
  margin: 0.5rem 0;
}

.result-label {
  font-size: 0.875rem;
  color: var(--color-text-muted, #6c757d);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.result-secondary {
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--color-text-secondary, #495057);
}

.result-card {
  background: var(--color-surface, #f8f9fa);
  border: 1px solid var(--color-border, #dee2e6);
  border-radius: 8px;
  padding: 1.25rem;
  margin: 1rem 0;
}

/* ========================================
   PROGRESS INDICATORS
   ======================================== */

.progress-bar-container {
  width: 100%;
  height: 8px;
  background: var(--color-surface, #e9ecef);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.progress-bar-fill {
  height: 100%;
  background: var(--color-success, #28a745);
  width: var(--progress-width, 0%);
  transition: width 0.3s ease;
}

/* ========================================
   TEST STATUS INDICATORS
   ======================================== */

.test-status-pass {
  color: var(--color-success, #28a745);
  font-weight: 600;
}

.test-status-fail {
  color: var(--color-danger, #dc3545);
  font-weight: 600;
}

.test-status-pending {
  color: var(--color-warning, #ffc107);
  font-weight: 600;
}

/* ========================================
   LAYOUT UTILITIES (CSP-Safe)
   ======================================== */

.grid-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.grid-3col {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ========================================
   CHART & VISUALIZATION STYLES
   ======================================== */

.chart-container {
  position: relative;
  width: 100%;
  height: var(--chart-height, 300px);
  margin: 1.5rem 0;
}

.chart-legend {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.chart-legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.chart-legend-color {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  background-color: var(--legend-color, #ccc);
}

/* ========================================
   DYNAMIC WIDTH UTILITIES
   Use CSS custom properties for dynamic values
   ======================================== */

.dynamic-width {
  width: var(--element-width, auto);
}

.dynamic-height {
  height: var(--element-height, auto);
}

/* ========================================
   ACCESSIBILITY ENHANCEMENTS
   ======================================== */

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Focus visible for keyboard navigation */
.focusable:focus-visible {
  outline: 2px solid var(--color-primary, #007bff);
  outline-offset: 2px;
}
```

#### Step 2: Link CSS in All Tool HTML Files

Add this line to the `<head>` section of each tool's `index.html`:

**Files to Update:**
- `tools/sip-calculator/index.html`
- `tools/emi-calculator/index.html`
- `tools/text-diff/index.html`
- `tools/html-markdown/index.html`
- `tools/json-schema/index.html`
- `index.html` (home page)

**Add After Existing CSS Links:**
```html
<link rel="stylesheet" href="/shared/css/tool-styles.css">
```

#### Step 3: Migrate Inline Styles to Classes

**Search Strategy:**
```bash
# Find all inline style attributes
grep -rn 'style="' tools/ --include="*.html" --include="*.js"
```

**Common Patterns to Migrate:**

**Pattern 1: Hidden Elements**
```html
<!-- BEFORE -->
<div id="results" style="display: none;">...</div>

<!-- AFTER -->
<div id="results" class="hidden">...</div>
```

**Pattern 2: Error Messages**
```html
<!-- BEFORE -->
<span style="color: red; font-size: 14px;">Invalid input</span>

<!-- AFTER -->
<span class="error-text">Invalid input</span>
```

**Pattern 3: Result Values**
```html
<!-- BEFORE -->
<div style="font-size: 24px; font-weight: bold; color: #007bff;">₹12,345</div>

<!-- AFTER -->
<div class="result-value">₹12,345</div>
```

**Pattern 4: Dynamic Widths (Progress Bars)**
```html
<!-- BEFORE (in JavaScript) -->
progressBar.style.width = '75%';

<!-- AFTER -->
progressBar.style.setProperty('--progress-width', '75%');
progressBar.classList.add('progress-bar-fill');
```

#### Step 4: Update JavaScript Style Manipulation

**Search for Dynamic Styles:**
```bash
grep -rn '\.style\.' tools/ --include="*.js" | grep -v "setProperty"
```

**Migration Examples:**

```javascript
// BEFORE: Direct style manipulation
element.style.display = 'none';
element.style.display = 'block';
element.style.color = '#dc3545';

// AFTER: Class-based approach
element.classList.add('hidden');
element.classList.remove('hidden');
element.classList.add('error-text');

// BEFORE: Dynamic numeric values
element.style.width = `${percentage}%`;

// AFTER: CSS custom properties
element.style.setProperty('--element-width', `${percentage}%`);
element.classList.add('dynamic-width');
```

#### Step 5: Test Visual Consistency

**Testing Checklist:**
- [ ] Open each tool in browser
- [ ] Check all UI elements render correctly
- [ ] Verify error states display properly
- [ ] Test show/hide functionality
- [ ] Check responsive layout (resize browser)
- [ ] Verify dark/light theme compatibility
- [ ] Ensure no visual regressions

**Validation Command:**
```bash
# Check for remaining inline styles
grep -rn 'style="' tools/ --include="*.html" | wc -l
# Expected: 0
```

**Acceptance Criteria:**
- [ ] `shared/css/tool-styles.css` created with all extracted styles
- [ ] All 6 tool HTML files link to tool-styles.css
- [ ] Zero inline `style=` attributes in tool HTML files
- [ ] JavaScript uses CSS classes or custom properties
- [ ] All tools render identically to before migration
- [ ] No console errors or warnings

---

### Task 3.2: Extract Inline Event Handlers (4 hours)

**Objective:** Remove all 28 inline event handlers (`onclick`, `onerror`, etc.)

#### Step 1: Audit Current Inline Handlers

```bash
# Find all inline event handlers
grep -rn 'on[a-z]*="' tools/ --include="*.html"
```

**Expected Patterns:**
- `onclick="functionName()"`
- `onerror="handleError()"`
- `onchange="updateValue()"`
- `onsubmit="return validateForm()"`

#### Step 2: Add IDs or Data Attributes to Elements

**Before Migration (HTML):**
```html
<button class="btn btn-primary" onclick="calculateSIP()">Calculate</button>
<form onsubmit="return handleSubmit()">...</form>
<img src="logo.png" onerror="this.src='fallback.png'">
```

**After Migration (HTML):**
```html
<button class="btn btn-primary" id="calculate-btn">Calculate</button>
<form id="sip-form">...</form>
<img src="logo.png" id="logo-img" alt="Logo">
```

#### Step 3: Register Event Listeners in JavaScript

**Create/Update Tool JavaScript Files:**

**Example: SIP Calculator**

**File:** `tools/sip-calculator/sip-calculator.js`

Add at the end of initialization:

```javascript
/**
 * Event Listeners Setup
 * Migrated from inline handlers for CSP compliance
 */
function setupEventListeners() {
  // Calculate button
  const calculateBtn = document.getElementById('calculate-btn');
  if (calculateBtn) {
    calculateBtn.addEventListener('click', handleCalculate);
  }
  
  // Form submission
  const form = document.getElementById('sip-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSubmit();
    });
  }
  
  // Input validation on change
  const amountInput = document.getElementById('amount-input');
  if (amountInput) {
    amountInput.addEventListener('input', validateAmount);
  }
  
  // Reset button
  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetForm);
  }
}

// Call setup after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initializeSIPCalculator();
  setupEventListeners();
});
```

#### Step 4: Handle Special Cases

**Case 1: Image Error Handling**
```javascript
// BEFORE (inline)
<img src="logo.png" onerror="this.src='fallback.png'">

// AFTER (JavaScript)
document.querySelectorAll('img[data-fallback]').forEach(img => {
  img.addEventListener('error', function() {
    this.src = this.dataset.fallback || '/assets/images/fallback.png';
  });
});
```

**Case 2: Dynamic Element Event Delegation**
```javascript
// For dynamically created elements, use event delegation
document.getElementById('parent-container').addEventListener('click', (e) => {
  if (e.target.matches('.delete-btn')) {
    handleDelete(e.target.dataset.id);
  }
  
  if (e.target.matches('.edit-btn')) {
    handleEdit(e.target.dataset.id);
  }
});
```

**Case 3: Form Validation**
```javascript
// BEFORE (inline)
<form onsubmit="return validateForm()">

// AFTER (JavaScript)
document.getElementById('my-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return false;
  }
  
  handleSubmit();
});
```

#### Step 5: Update CSP Meta Tag

**Remove `unsafe-inline` from CSP policy:**

**File:** All tool `index.html` files

**BEFORE:**
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data:;">
```

**AFTER:**
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self'; 
               style-src 'self'; 
               img-src 'self' data:;">
```

#### Step 6: Test CSP Enforcement

**Testing Steps:**
1. Open browser DevTools console
2. Load each tool
3. Verify NO CSP violation errors
4. Test all interactive elements:
   - Buttons click correctly
   - Forms submit correctly
   - Input validation works
   - Dynamic elements respond to events

**Validation Commands:**
```bash
# Check for remaining inline event handlers
grep -rn 'on[a-z]*="' tools/ --include="*.html" | wc -l
# Expected: 0

# Check CSP meta tag has no unsafe-inline
grep -rn "unsafe-inline" tools/ --include="*.html"
# Expected: 0 matches (or only in comments)
```

**Acceptance Criteria:**
- [ ] Zero inline event handlers in HTML
- [ ] All event listeners registered in JavaScript files
- [ ] CSP meta tags updated (no `unsafe-inline`)
- [ ] Zero CSP violation errors in console
- [ ] All tool functionality works identically
- [ ] All 6 tools tested and validated

---

**End of Day 3 Deliverables:**
- ✅ `shared/css/tool-styles.css` created and integrated
- ✅ Zero inline styles in tools
- ✅ Zero inline event handlers in tools
- ✅ Strict CSP policy active (no unsafe-inline)
- ✅ Zero CSP violations in browser console
- ✅ All tools functionally identical to Sprint 1

---

## Day 4 (March 21) - Component Adoption & Error Boundaries

**Goal:** Increase component adoption to 80%+ and implement graceful error handling

---

### Task 4.1: Audit and Increase Component Adoption (4 hours)

**Objective:** Migrate UI elements to use shared components (40% → 80%+)

#### Step 1: Measure Current Component Adoption

**Create Audit Script:** `tools/audit-components.sh`

```bash
#!/bin/bash
# Component adoption audit
# Sprint 2 - Day 4 - Task 4.1

echo "=== Component Adoption Audit ==="
echo ""

for tool in tools/*/; do
  echo "Tool: $(basename $tool)"
  
  # Count total buttons
  total_buttons=$(grep -c '<button' "$tool"index.html "$tool"*.js 2>/dev/null || echo "0")
  
  # Count component buttons (createButton usage)
  component_buttons=$(grep -c 'createButton' "$tool"*.js 2>/dev/null || echo "0")
  
  # Count total inputs
  total_inputs=$(grep -c '<input' "$tool"index.html "$tool"*.js 2>/dev/null || echo "0")
  
  # Count component inputs
  component_inputs=$(grep -c 'createInput' "$tool"*.js 2>/dev/null || echo "0")
  
  echo "  Buttons: $component_buttons / $total_buttons using components"
  echo "  Inputs: $component_inputs / $total_inputs using components"
  echo ""
done
```

**Run Audit:**
```bash
chmod +x tools/audit-components.sh
./tools/audit-components.sh
```

#### Step 2: Understand Available Components

**Existing Components:**

1. **Button Component** (`shared/components/button.js`)
```javascript
import { createButton } from '/shared/components/button.js';

const btn = createButton({
  label: 'Calculate',
  variant: 'primary',       // primary, secondary, ghost, danger
  size: 'medium',           // small, medium, large
  icon: '🧮',               // Optional emoji/icon
  disabled: false,
  loading: false,
  onClick: handleCalculate,
  type: 'button'
});

document.querySelector('.button-container').appendChild(btn);
```

2. **Input Component** (`shared/components/input.js`)
```javascript
import { createInput } from '/shared/components/input.js';

const input = createInput({
  type: 'number',
  label: 'Monthly Investment',
  placeholder: 'Enter amount',
  value: '',
  required: true,
  min: 500,
  max: 1000000,
  step: 500,
  helpText: 'Minimum ₹500',
  error: '',                // Set to show error
  onChange: handleInputChange,
  onBlur: validateInput
});

document.querySelector('.form-group').appendChild(input);
```

3. **Card Component** (`shared/components/card.js`)
```javascript
import { createCard } from '/shared/components/card.js';

const card = createCard({
  title: 'Investment Summary',
  content: '<p>Your results here...</p>',
  footer: '<small>Updated just now</small>',
  variant: 'default',       // default, primary, success, warning, danger
  elevated: true            // Shadow effect
});

document.querySelector('.results-container').appendChild(card);
```

4. **Modal Component** (`shared/components/modal.js`)
```javascript
import { createModal } from '/shared/components/modal.js';

const modal = createModal({
  title: 'Confirm Action',
  content: '<p>Are you sure you want to proceed?</p>',
  size: 'medium',           // small, medium, large
  closeOnOverlay: true,
  actions: [
    {
      label: 'Cancel',
      variant: 'secondary',
      onClick: () => modal.hide()
    },
    {
      label: 'Confirm',
      variant: 'primary',
      onClick: handleConfirm
    }
  ]
});

// Show modal
modal.show();

// Hide modal
modal.hide();
```

#### Step 3: Migrate SIP Calculator to Components

**File:** `tools/sip-calculator/index.html`

**BEFORE (Traditional HTML buttons):**
```html
<div class="button-group">
  <button id="calculate-btn" class="btn btn-primary">Calculate SIP</button>
  <button id="reset-btn" class="btn btn-secondary">Reset</button>
</div>
```

**AFTER (Component-based approach):**

**File:** `tools/sip-calculator/sip-calculator.js`

```javascript
import { createButton } from '/shared/components/button.js';
import { createInput } from '/shared/components/input.js';
import { createCard } from '/shared/components/card.js';

/**
 * Initialize UI Components
 * Sprint 2 - Component Migration
 */
function initializeComponents() {
  // Create Calculate button
  const calculateBtn = createButton({
    label: 'Calculate SIP',
    variant: 'primary',
    size: 'large',
    icon: '📊',
    onClick: handleCalculate,
    type: 'submit'
  });
  
  // Create Reset button
  const resetBtn = createButton({
    label: 'Reset',
    variant: 'secondary',
    size: 'large',
    onClick: resetForm
  });
  
  // Replace button container
  const buttonContainer = document.querySelector('.button-group');
  buttonContainer.innerHTML = '';
  buttonContainer.appendChild(calculateBtn);
  buttonContainer.appendChild(resetBtn);
  
  // Create input components (example)
  const amountInput = createInput({
    type: 'number',
    label: 'Monthly Investment (₹)',
    placeholder: '5000',
    required: true,
    min: 500,
    max: 1000000,
    step: 500,
    helpText: 'Minimum investment: ₹500',
    onChange: (e) => {
      validateAmount(e.target.value);
    }
  });
  
  // Replace input container
  const amountContainer = document.querySelector('#amount-input-container');
  if (amountContainer) {
    amountContainer.innerHTML = '';
    amountContainer.appendChild(amountInput);
  }
}

// Call during initialization
document.addEventListener('DOMContentLoaded', () => {
  initializeComponents();
  setupEventListeners();
});
```

#### Step 4: Migrate EMI Calculator to Components

**Focus Areas:**
- All buttons (Calculate, Reset, Add Prepayment)
- All numeric inputs (Loan Amount, Interest Rate, Tenure)
- Result cards for displaying EMI breakdown
- Chart container cards

**File:** `tools/emi-calculator/emi-calculator.js`

```javascript
import { createButton } from '/shared/components/button.js';
import { createInput } from '/shared/components/input.js';
import { createCard } from '/shared/components/card.js';

function initializeEMIComponents() {
  // Migrate all buttons
  const buttons = [
    {
      id: 'calculate-emi-btn',
      label: 'Calculate EMI',
      variant: 'primary',
      icon: '💰',
      onClick: calculateEMI
    },
    {
      id: 'reset-emi-btn',
      label: 'Reset',
      variant: 'secondary',
      onClick: resetEMIForm
    },
    {
      id: 'add-prepayment-btn',
      label: 'Add Prepayment',
      variant: 'ghost',
      icon: '➕',
      onClick: showPrepaymentModal
    }
  ];
  
  buttons.forEach(config => {
    const container = document.querySelector(`#${config.id}`).parentElement;
    const btn = createButton(config);
    container.innerHTML = '';
    container.appendChild(btn);
  });
  
  // Migrate inputs
  // ... similar pattern
  
  // Create result cards
  const resultsCard = createCard({
    title: 'EMI Breakdown',
    content: '<div id="emi-results-content"></div>',
    elevated: true
  });
  
  document.querySelector('#results-container').appendChild(resultsCard);
}
```

#### Step 5: Migrate Text Diff and HTML/Markdown Tools

**Text Diff:** Focus on buttons and output cards
- Compare button → component
- Clear button → component
- Diff output container → card component

**HTML/Markdown:** Focus on converter buttons and modals
- Convert button → component
- Copy button → component
- Preview errors → modal component

#### Step 6: Measure Final Component Adoption

```bash
# Run audit again
./tools/audit-components.sh

# Calculate adoption percentage
# Target: 80%+ of UI elements use shared components
```

**Acceptance Criteria:**
- [ ] Component adoption ≥ 80% across all tools
- [ ] All primary action buttons use createButton
- [ ] All form inputs use createInput (where applicable)
- [ ] Result displays use createCard (where applicable)
- [ ] No visual regressions
- [ ] All functionality preserved

---

### Task 4.2: Implement Error Boundaries (4 hours)

**Objective:** Add graceful error handling to prevent entire tool crashes

#### Step 1: Create Error Boundary Module

**File:** `shared/js/error-boundary.js`

```javascript
/**
 * Error Boundary System
 * Provides graceful error handling for tool failures
 * 
 * @file shared/js/error-boundary.js
 * Sprint 2 - Day 4 - Task 4.2
 */

import { createModal } from '/shared/components/modal.js';

/**
 * Error Boundary Class
 * Wraps functions to catch and handle errors gracefully
 */
export class ErrorBoundary {
  /**
   * @param {string} toolName - Name of the tool (for logging)
   * @param {Object} options - Configuration options
   */
  constructor(toolName, options = {}) {
    this.toolName = toolName;
    this.options = {
      logToConsole: true,
      showUserModal: true,
      onError: null,           // Custom error handler
      ...options
    };
    
    this.errorCount = 0;
    this.lastError = null;
  }
  
  /**
   * Wrap a synchronous function with error handling
   * @param {Function} fn - Function to wrap
   * @returns {Function} Wrapped function
   */
  wrap(fn) {
    return (...args) => {
      try {
        return fn(...args);
      } catch (error) {
        this.handleError(error, fn.name);
      }
    };
  }
  
  /**
   * Wrap an async function with error handling
   * @param {Function} fn - Async function to wrap
   * @returns {Function} Wrapped async function
   */
  wrapAsync(fn) {
    return async (...args) => {
      try {
        return await fn(...args);
      } catch (error) {
        this.handleError(error, fn.name);
      }
    };
  }
  
  /**
   * Handle caught errors
   * @param {Error} error - The error object
   * @param {string} functionName - Name of function where error occurred
   */
  handleError(error, functionName = 'unknown') {
    this.errorCount++;
    this.lastError = {
      error,
      functionName,
      timestamp: new Date().toISOString(),
      toolName: this.toolName
    };
    
    // Log to console
    if (this.options.logToConsole) {
      console.error(`[ErrorBoundary:${this.toolName}] Error in ${functionName}:`, error);
      console.error('Stack trace:', error.stack);
    }
    
    // Call custom error handler
    if (this.options.onError) {
      try {
        this.options.onError(error, functionName);
      } catch (handlerError) {
        console.error('[ErrorBoundary] Error in custom error handler:', handlerError);
      }
    }
    
    // Show user-friendly modal
    if (this.options.showUserModal) {
      this.showErrorModal(error, functionName);
    }
  }
  
  /**
   * Display user-friendly error modal
   * @param {Error} error - The error object
   * @param {string} functionName - Name of function where error occurred
   */
  showErrorModal(error, functionName) {
    const modal = createModal({
      title: '⚠️ Oops! Something Went Wrong',
      content: `
        <div class="error-boundary-modal">
          <p>We encountered an unexpected error while processing your request.</p>
          
          <div class="error-details">
            <strong>Error:</strong> ${this.sanitizeErrorMessage(error.message)}
          </div>
          
          <p class="error-help-text">
            This error has been logged. Please try:
          </p>
          <ul class="error-suggestions">
            <li>Refreshing the page</li>
            <li>Checking your input values</li>
            <li>Clearing your browser cache</li>
          </ul>
          
          <details class="error-technical-details">
            <summary>Technical Details (for developers)</summary>
            <pre><code>Tool: ${this.toolName}
Function: ${functionName}
Time: ${new Date().toLocaleString()}
Error: ${error.toString()}
Stack: ${error.stack || 'No stack trace available'}</code></pre>
          </details>
        </div>
      `,
      size: 'medium',
      closeOnOverlay: false,
      actions: [
        {
          label: 'Refresh Page',
          variant: 'primary',
          onClick: () => window.location.reload()
        },
        {
          label: 'Close',
          variant: 'secondary',
          onClick: () => modal.hide()
        }
      ]
    });
    
    modal.show();
  }
  
  /**
   * Sanitize error messages to avoid exposing sensitive info
   * @param {string} message - Raw error message
   * @returns {string} Sanitized message
   */
  sanitizeErrorMessage(message) {
    // Remove file paths
    message = message.replace(/\/[^\s]+/g, '[path]');
    
    // Remove potential sensitive data patterns
    message = message.replace(/\b\d{10,}\b/g, '[number]');
    
    return message;
  }
  
  /**
   * Get error statistics
   * @returns {Object} Error stats
   */
  getStats() {
    return {
      toolName: this.toolName,
      errorCount: this.errorCount,
      lastError: this.lastError
    };
  }
  
  /**
   * Reset error tracking
   */
  reset() {
    this.errorCount = 0;
    this.lastError = null;
  }
}

/**
 * Global error handler for uncaught errors
 */
export function setupGlobalErrorHandler(toolName) {
  const boundary = new ErrorBoundary(toolName, {
    logToConsole: true,
    showUserModal: true
  });
  
  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    boundary.handleError(event.error || new Error(event.message), 'global');
    event.preventDefault();
  });
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    boundary.handleError(
      event.reason instanceof Error ? event.reason : new Error(event.reason),
      'promise'
    );
    event.preventDefault();
  });
  
  return boundary;
}

/**
 * Helper: Wrap all methods of an object
 * @param {Object} obj - Object with methods to wrap
 * @param {ErrorBoundary} boundary - Error boundary instance
 * @returns {Object} Object with wrapped methods
 */
export function wrapObject(obj, boundary) {
  const wrapped = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'function') {
      wrapped[key] = boundary.wrap(value);
    } else {
      wrapped[key] = value;
    }
  }
  
  return wrapped;
}
```

#### Step 2: Add Error Boundaries to Each Tool

**Example: SIP Calculator**

**File:** `tools/sip-calculator/sip-calculator.js`

```javascript
import { ErrorBoundary, setupGlobalErrorHandler } from '/shared/js/error-boundary.js';

// Create error boundary for this tool
const errorBoundary = new ErrorBoundary('SIP Calculator', {
  logToConsole: true,
  showUserModal: true,
  onError: (error, functionName) => {
    // Custom logging or analytics
    console.log(`SIP Calculator error logged: ${functionName}`);
  }
});

// Setup global handler for uncaught errors
setupGlobalErrorHandler('SIP Calculator');

// Wrap critical functions
const handleCalculate = errorBoundary.wrap(function calculateSIP() {
  // Original calculation logic
  const amount = parseFloat(document.getElementById('amount').value);
  const rate = parseFloat(document.getElementById('rate').value);
  const years = parseFloat(document.getElementById('years').value);
  
  // Validation
  if (isNaN(amount) || isNaN(rate) || isNaN(years)) {
    throw new Error('Invalid input: Please enter valid numbers');
  }
  
  if (amount <= 0 || rate <= 0 || years <= 0) {
    throw new Error('Invalid input: Values must be positive');
  }
  
  // Perform calculation
  const result = performSIPCalculation(amount, rate, years);
  displayResults(result);
});

// Wrap async functions
const fetchHistoricalData = errorBoundary.wrapAsync(async function() {
  const response = await fetch('/api/historical-data');
  
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.status}`);
  }
  
  return await response.json();
});

// Initialize with error handling
document.addEventListener('DOMContentLoaded', errorBoundary.wrap(() => {
  initializeComponents();
  setupEventListeners();
  loadSavedData();
}));
```

#### Step 3: Apply to All Tools

**Tools to Update:**
1. `tools/sip-calculator/sip-calculator.js` ✅
2. `tools/emi-calculator/emi-calculator.js`
3. `tools/text-diff/text-diff.js`
4. `tools/html-markdown/html-markdown.js`
5. `tools/json-schema/json-schema.js`

**Standard Pattern for Each:**
```javascript
// Import at top
import { ErrorBoundary, setupGlobalErrorHandler } from '/shared/js/error-boundary.js';

// Create boundary early in file
const errorBoundary = new ErrorBoundary('[Tool Name]');
setupGlobalErrorHandler('[Tool Name]');

// Wrap initialization
document.addEventListener('DOMContentLoaded', errorBoundary.wrap(initialize));

// Wrap event handlers
button.addEventListener('click', errorBoundary.wrap(handleClick));

// Wrap critical business logic
const processData = errorBoundary.wrap(function(data) {
  // Processing logic
});
```

#### Step 4: Add Error Boundary CSS

**File:** `shared/css/components.css` (add section)

```css
/* ========================================
   ERROR BOUNDARY MODAL STYLES
   ======================================== */

.error-boundary-modal {
  padding: 0.5rem 0;
}

.error-details {
  background: rgba(220, 53, 69, 0.1);
  border-left: 3px solid var(--color-danger, #dc3545);
  padding: 0.75rem 1rem;
  margin: 1rem 0;
  border-radius: 4px;
  font-size: 0.9rem;
}

.error-help-text {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.error-suggestions {
  margin-left: 1.5rem;
  line-height: 1.8;
}

.error-technical-details {
  margin-top: 1.5rem;
  padding: 0.75rem;
  background: var(--color-surface, #f8f9fa);
  border-radius: 4px;
  font-size: 0.85rem;
}

.error-technical-details summary {
  cursor: pointer;
  font-weight: 500;
  user-select: none;
}

.error-technical-details summary:hover {
  color: var(--color-primary, #007bff);
}

.error-technical-details pre {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: var(--color-background, #fff);
  border: 1px solid var(--color-border, #dee2e6);
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.8rem;
  line-height: 1.5;
}

.error-technical-details code {
  font-family: 'Courier New', monospace;
  color: var(--color-text-primary, #212529);
}
```

#### Step 5: Test Error Scenarios

**Manual Testing:**

1. **Inject Calculation Error:**
```javascript
// Temporarily add to test error boundary
function testError() {
  throw new Error('Test error for validation');
}
testError();
```

2. **Invalid Input:**
- Enter text in number field
- Enter negative values
- Leave required fields empty
- Enter extremely large numbers

3. **Async Errors:**
- Simulate network failure
- Test timeout scenarios

**Validation:**
- [ ] Error modal appears with friendly message
- [ ] Console logs error details
- [ ] Refresh button works
- [ ] Close button works
- [ ] Technical details are hidden by default
- [ ] Tool doesn't crash or become unusable

**Acceptance Criteria:**
- [ ] `shared/js/error-boundary.js` created and tested
- [ ] All 5 tools import and use ErrorBoundary
- [ ] Global error handlers set up in each tool
- [ ] Critical functions wrapped with error handling
- [ ] Error modal displays user-friendly messages
- [ ] Errors are logged with full context
- [ ] Tools remain functional after error
- [ ] No infinite error loops

---

**End of Day 4 Deliverables:**
- ✅ Component adoption ≥ 80%
- ✅ Error boundaries implemented in all tools
- ✅ User-friendly error UI active
- ✅ Comprehensive error logging
- ✅ No tool crashes from unhandled errors

---

## Day 5 (March 22) - Security Audit & Performance

**Goal:** Eliminate XSS vulnerabilities and implement performance monitoring

---

### Task 5.1: innerHTML XSS Security Audit (3 hours)

**Objective:** Audit and fix all 17 innerHTML usages for XSS vulnerabilities

#### Step 1: Locate All innerHTML Usage

```bash
# Find all innerHTML occurrences
grep -rn "innerHTML" tools/ --include="*.js" > innerHTML-audit.txt

# Also check HTML files
grep -rn "innerHTML" tools/ --include="*.html" >> innerHTML-audit.txt

# Review the audit file
cat innerHTML-audit.txt
```

**Current Known Locations (from earlier grep):**
- text-diff.js: 4 occurrences
- emi-calculator.js: 4 occurrences
- html-markdown.js: 2 occurrences
- sip-calculator.js: 7 occurrences

#### Step 2: Categorize Each Usage

**Create Audit Document:** `docs/INNERHTML_SECURITY_AUDIT.md`

```markdown
# innerHTML Security Audit
Sprint 2 - Day 5 - Task 5.1

## Audit Summary
- **Total innerHTML usage:** 17
- **Safe (static templates):** X
- **Unsafe (user input):** Y
- **Fixed:** Z

## Detailed Audit

### File: tools/text-diff/text-diff.js

#### Line 265: UNSAFE - User Input
```javascript
this.diffOutput.innerHTML = `<div class="diff-result">${userContent}</div>`;
```
**Risk:** High - Directly inserts user-provided diff content  
**Fix:** Use textContent or DOMPurify.sanitize()  
**Status:** ❌ Needs Fix

#### Line 314: SAFE - Generated HTML
```javascript
this.diffOutput.innerHTML = `<div class="diff-unified">${generatedHtml}</div>`;
```
**Risk:** Low - HTML generated by internal diff algorithm  
**Fix:** Document why it's safe  
**Status:** ✅ Safe (add comment)

[Continue for all occurrences...]
```

#### Step 3: Fix Unsafe innerHTML Usage

**Pattern 1: User Text Content (NOT HTML)**

```javascript
// BEFORE (UNSAFE)
element.innerHTML = userInput;

// AFTER (SAFE)
element.textContent = userInput;
```

**When to use:** When displaying plain text user input

**Pattern 2: User HTML Content (Needs Sanitization)**

First, ensure DOMPurify is available:
```html
<!-- In tool index.html -->
<script src="/lib/purify.min.js" integrity="sha384-..." crossorigin="anonymous"></script>
```

```javascript
// BEFORE (UNSAFE)
previewElement.innerHTML = userMarkdown;

// AFTER (SAFE)
previewElement.innerHTML = DOMPurify.sanitize(userMarkdown, {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'code', 'pre'],
  ALLOWED_ATTR: ['class']
});
```

**When to use:** When user input is expected to contain HTML (like markdown preview)

**Pattern 3: Static Templates (Safe)**

```javascript
// SAFE: No user input, only static template
modal.innerHTML = `
  <div class="modal-header">
    <h3>Static Title</h3>
  </div>
  <div class="modal-body">
    <p>Static content</p>
  </div>
`;

// Add comment documenting safety
// SAFE: Static template with no user input
modal.innerHTML = `...`;
```

**When to use:** When innerHTML contains only static content

#### Step 4: Fix Each Tool

**Tool 1: text-diff.js**

```javascript
// Line 265 - BEFORE (UNSAFE)
this.diffOutput.innerHTML = `
  <div class="diff-stats">
    Lines: ${lineCount}, Additions: ${additions}, Deletions: ${deletions}
  </div>
`;

// Line 265 - AFTER (SAFE)
// Create elements programmatically
const statsDiv = document.createElement('div');
statsDiv.className = 'diff-stats';
statsDiv.textContent = `Lines: ${lineCount}, Additions: ${additions}, Deletions: ${deletions}`;
this.diffOutput.innerHTML = ''; // Clear first
this.diffOutput.appendChild(statsDiv);

// OR: Use template literal with sanitized values
this.diffOutput.innerHTML = `
  <div class="diff-stats">
    Lines: ${parseInt(lineCount)}, 
    Additions: ${parseInt(additions)}, 
    Deletions: ${parseInt(deletions)}
  </div>
`;
// SAFE: All values are numbers, no user content
```

**Tool 2: html-markdown.js**

```javascript
// Line 305 - BEFORE (UNSAFE)
outputPreview.innerHTML = html;  // html comes from user markdown input

// Line 305 - AFTER (SAFE)
import DOMPurify from '/lib/purify.min.js';

outputPreview.innerHTML = DOMPurify.sanitize(html, {
  ALLOWED_TAGS: [
    'p', 'br', 'div', 'span',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'strong', 'em', 'u', 'strike',
    'ul', 'ol', 'li',
    'blockquote', 'code', 'pre',
    'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td'
  ],
  ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id']
});
// SAFE: User HTML sanitized with DOMPurify
```

**Tool 3: emi-calculator.js**

```javascript
// Line 288 - BEFORE (UNSAFE if user data)
this.amortizationTbody.innerHTML = html;

// Line 288 - AFTER (SAFE)
// If 'html' is generated from validated numeric data:
this.amortizationTbody.innerHTML = html;
// SAFE: HTML generated from validated numeric calculations, no user string content

// OR: Use createElement approach for extra safety
this.amortizationTbody.innerHTML = '';
rows.forEach(rowData => {
  const tr = document.createElement('tr');
  rowData.forEach(cellData => {
    const td = document.createElement('td');
    td.textContent = cellData;  // Always use textContent for data
    tr.appendChild(td);
  });
  this.amortizationTbody.appendChild(tr);
});
```

**Tool 4: sip-calculator.js**

```javascript
// Line 556 - BEFORE (UNSAFE)
elements.formErrors.innerHTML = errors.map(err => `• ${err}`).join('<br>');

// Line 556 - AFTER (SAFE - Option 1: createElement)
elements.formErrors.innerHTML = '';
errors.forEach(err => {
  const p = document.createElement('p');
  p.className = 'error-text';
  p.textContent = `• ${err}`;  // textContent escapes HTML
  elements.formErrors.appendChild(p);
});

// OR AFTER (SAFE - Option 2: Sanitize)
import DOMPurify from '/lib/purify.min.js';
elements.formErrors.innerHTML = DOMPurify.sanitize(
  errors.map(err => `• ${err}`).join('<br>')
);
// SAFE: Sanitized error messages
```

#### Step 5: Document Safe innerHTML Usage

**For any innerHTML that remains after audit, add comments:**

```javascript
// SAFE: Static template, no user input
modal.innerHTML = `<div class="modal-header">...</div>`;

// SAFE: Numeric values only, validated and cast to Number
resultDiv.innerHTML = `<span class="result">${Number(value).toFixed(2)}</span>`;

// SAFE: User content sanitized with DOMPurify
preview.innerHTML = DOMPurify.sanitize(userHtml, {
  ALLOWED_TAGS: ['p', 'strong', 'em'],
  ALLOWED_ATTR: []
});

// SAFE: HTML generated by trusted library (e.g., Chart.js, diff library)
container.innerHTML = trustedLibrary.generateHTML(data);
```

#### Step 6: Add DOMPurify to Library if Not Present

```bash
# Check if DOMPurify exists
ls -lh lib/ | grep -i purify

# If not present, download it
cd lib/
wget https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.6/purify.min.js

# Generate SRI hash
cat purify.min.js | openssl dgst -sha384 -binary | openssl base64 -A

# Add to tools that need it
```

**Update tool index.html:**
```html
<script src="/lib/purify.min.js" 
        integrity="sha384-[GENERATED_HASH]" 
        crossorigin="anonymous"></script>
```

#### Step 7: Security Testing

**XSS Attack Tests:**

1. **Script Injection Test:**
```javascript
// Test input
const maliciousInput = '<script>alert("XSS")</script>';

// In text diff tool:
// Paste maliciousInput in left/right text area
// Click Compare
// Expected: Script does NOT execute, displayed as text

// In HTML/Markdown tool:
// Paste maliciousInput in input
// Convert to preview
// Expected: Script does NOT execute (sanitized or escaped)
```

2. **Event Handler Injection:**
```javascript
const maliciousInput = '<img src=x onerror="alert(\'XSS\')">';

// Test in all tools that display user input
// Expected: onerror handler does NOT execute
```

3. **HTML Injection:**
```javascript
const maliciousInput = '<div onclick="alert(1)">Click me</div>';

// Expected: onclick does NOT execute when clicked
```

**Validation Checklist:**
- [ ] All innerHTML usages audited and categorized
- [ ] Unsafe innerHTML fixed (textContent or sanitized)
- [ ] Safe innerHTML documented with comments
- [ ] DOMPurify integrated where needed
- [ ] XSS tests pass (no script execution)
- [ ] No console warnings about unsafe practices

**Acceptance Criteria:**
- [ ] `docs/INNERHTML_SECURITY_AUDIT.md` created
- [ ] Zero unsafe innerHTML with user input
- [ ] All user content uses textContent or DOMPurify
- [ ] Safe static templates documented
- [ ] XSS attack tests pass
- [ ] All tools tested with malicious input

---

### Task 5.2: Performance Budget & Monitoring (2 hours)

**Objective:** Implement automated bundle size monitoring

#### Step 1: Create Performance Budget Configuration

**File:** `performance-budget.json`

```json
{
  "version": "1.0.0",
  "budgets": [
    {
      "name": "Core Bundle",
      "description": "Shared core JavaScript (router, theme, utils, etc.)",
      "files": [
        "shared/js/router.js",
        "shared/js/theme.js",
        "shared/js/utils.js",
        "shared/js/app.js",
        "shared/js/storage.js",
        "shared/js/clipboard.js"
      ],
      "maxSize": "35KB",
      "priority": "high"
    },
    {
      "name": "Shared Components",
      "description": "Reusable UI components",
      "files": [
        "shared/components/button.js",
        "shared/components/input.js",
        "shared/components/card.js",
        "shared/components/modal.js"
      ],
      "maxSize": "20KB",
      "priority": "medium"
    },
    {
      "name": "Shared CSS",
      "description": "Shared stylesheets",
      "files": [
        "shared/css/*.css"
      ],
      "maxSize": "50KB",
      "priority": "medium"
    },
    {
      "name": "SIP Calculator",
      "description": "SIP Calculator tool bundle",
      "files": [
        "tools/sip-calculator/*.js",
        "tools/sip-calculator/*.css"
      ],
      "maxSize": "15KB",
      "priority": "high"
    },
    {
      "name": "EMI Calculator",
      "description": "EMI Calculator tool bundle",
      "files": [
        "tools/emi-calculator/*.js",
        "tools/emi-calculator/*.css"
      ],
      "maxSize": "15KB",
      "priority": "high"
    },
    {
      "name": "Text Diff",
      "description": "Text Diff tool bundle",
      "files": [
        "tools/text-diff/*.js",
        "tools/text-diff/*.css"
      ],
      "maxSize": "12KB",
      "priority": "medium"
    },
    {
      "name": "HTML/Markdown Converter",
      "description": "HTML/Markdown tool bundle",
      "files": [
        "tools/html-markdown/*.js",
        "tools/html-markdown/*.css"
      ],
      "maxSize": "10KB",
      "priority": "medium"
    },
    {
      "name": "JSON Schema Validator",
      "description": "JSON Schema tool bundle",
      "files": [
        "tools/json-schema/*.js",
        "tools/json-schema/*.css"
      ],
      "maxSize": "18KB",
      "priority": "high"
    }
  ]
}
```

#### Step 2: Create Bundle Size Checker Script

**File:** `tools/check-bundle-size.js`

```javascript
#!/usr/bin/env node
/**
 * Performance Budget Checker
 * Validates bundle sizes against configured budgets
 * 
 * Usage: node tools/check-bundle-size.js
 * CI Mode: node tools/check-bundle-size.js --ci
 * 
 * @file tools/check-bundle-size.js
 * Sprint 2 - Day 5 - Task 5.2
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');  // npm install glob

// Configuration
const BUDGET_FILE = 'performance-budget.json';
const REPORT_FILE = 'performance-report.json';
const CI_MODE = process.argv.includes('--ci');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

/**
 * Parse size string to bytes
 * @param {string} sizeStr - Size string (e.g., "35KB", "1.5MB")
 * @returns {number} Size in bytes
 */
function parseSizeToBytes(sizeStr) {
  const match = sizeStr.match(/^(\d+(?:\.\d+)?)\s*(KB|MB|B)?$/i);
  if (!match) {
    throw new Error(`Invalid size format: ${sizeStr}`);
  }
  
  const value = parseFloat(match[1]);
  const unit = (match[2] || 'B').toUpperCase();
  
  const multipliers = {
    'B': 1,
    'KB': 1024,
    'MB': 1024 * 1024
  };
  
  return value * multipliers[unit];
}

/**
 * Format bytes to human-readable size
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size
 */
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
}

/**
 * Calculate total size of files matching glob patterns
 * @param {string[]} patterns - Glob patterns
 * @returns {Promise<Object>} Total size and file list
 */
async function calculateSize(patterns) {
  let totalSize = 0;
  const files = [];
  
  for (const pattern of patterns) {
    const matches = await glob(pattern, { nodir: true });
    
    for (const file of matches) {
      try {
        const stats = fs.statSync(file);
        totalSize += stats.size;
        files.push({
          path: file,
          size: stats.size,
          sizeFormatted: formatBytes(stats.size)
        });
      } catch (err) {
        console.warn(`Warning: Could not stat file ${file}: ${err.message}`);
      }
    }
  }
  
  return { totalSize, files };
}

/**
 * Check a single budget
 * @param {Object} budget - Budget configuration
 * @returns {Promise<Object>} Check result
 */
async function checkBudget(budget) {
  const { totalSize, files } = await calculateSize(budget.files);
  const maxBytes = parseSizeToBytes(budget.maxSize);
  
  const passed = totalSize <= maxBytes;
  const percentUsed = (totalSize / maxBytes) * 100;
  
  return {
    name: budget.name,
    description: budget.description,
    maxSize: budget.maxSize,
    maxBytes,
    actualSize: formatBytes(totalSize),
    actualBytes: totalSize,
    percentUsed: percentUsed.toFixed(1),
    passed,
    status: passed ? 'PASS' : 'FAIL',
    priority: budget.priority,
    files: files.sort((a, b) => b.size - a.size)
  };
}

/**
 * Print results to console
 * @param {Object[]} results - Check results
 */
function printResults(results) {
  console.log(`\n${colors.bold}${colors.cyan}Performance Budget Report${colors.reset}`);
  console.log('='.repeat(80));
  console.log('');
  
  let totalPassed = 0;
  let totalFailed = 0;
  
  results.forEach((result, index) => {
    // Status icon and color
    const statusIcon = result.passed ? '✅' : '❌';
    const statusColor = result.passed ? colors.green : colors.red;
    
    console.log(`${statusIcon} ${colors.bold}${result.name}${colors.reset}`);
    console.log(`   ${result.description}`);
    console.log(`   Size: ${statusColor}${result.actualSize}${colors.reset} / ${result.maxSize} (${result.percentUsed}% used)`);
    console.log(`   Status: ${statusColor}${result.status}${colors.reset}`);
    console.log(`   Priority: ${result.priority}`);
    
    // Show top 3 largest files if failed or verbose
    if (!result.passed || process.argv.includes('--verbose')) {
      console.log(`   Largest files:`);
      result.files.slice(0, 3).forEach(file => {
        console.log(`     - ${file.path} (${file.sizeFormatted})`);
      });
    }
    
    console.log('');
    
    if (result.passed) totalPassed++;
    else totalFailed++;
  });
  
  console.log('='.repeat(80));
  console.log(`${colors.bold}Summary:${colors.reset} ${colors.green}${totalPassed} passed${colors.reset}, ${totalFailed > 0 ? colors.red : colors.green}${totalFailed} failed${colors.reset}`);
  console.log('');
}

/**
 * Generate JSON report
 * @param {Object[]} results - Check results
 */
function generateReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: results.length,
      passed: results.filter(r => r.passed).length,
      failed: results.filter(r => r.failed).length
    },
    results
  };
  
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  console.log(`Report saved to ${REPORT_FILE}`);
}

/**
 * Main execution
 */
async function main() {
  try {
    // Load budget configuration
    const budgetData = JSON.parse(fs.readFileSync(BUDGET_FILE, 'utf8'));
    
    console.log(`Checking ${budgetData.budgets.length} performance budgets...`);
    
    // Check each budget
    const results = [];
    for (const budget of budgetData.budgets) {
      const result = await checkBudget(budget);
      results.push(result);
    }
    
    // Print results
    printResults(results);
    
    // Generate report
    generateReport(results);
    
    // Exit with error code if any budget failed (in CI mode)
    const hasFailures = results.some(r => !r.passed);
    if (CI_MODE && hasFailures) {
      console.error(`${colors.red}${colors.bold}❌ Performance budget check failed!${colors.reset}`);
      process.exit(1);
    }
    
    if (hasFailures) {
      console.warn(`${colors.yellow}⚠️  Some budgets exceeded. Consider optimizing.${colors.reset}`);
    } else {
      console.log(`${colors.green}${colors.bold}✅ All performance budgets passed!${colors.reset}`);
    }
    
  } catch (error) {
    console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
    if (!CI_MODE) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { checkBudget, parseSizeToBytes, formatBytes };
```

#### Step 3: Update package.json Scripts

**File:** `package.json`

Add scripts section if not present:

```json
{
  "name": "json-schema-converter",
  "version": "1.0.0",
  "scripts": {
    "check-size": "node tools/check-bundle-size.js",
    "check-size:verbose": "node tools/check-bundle-size.js --verbose",
    "check-size:ci": "node tools/check-bundle-size.js --ci",
    "precommit": "npm run check-size",
    "test": "echo \"No tests yet\" && exit 0"
  },
  "devDependencies": {
    "glob": "^10.3.10"
  }
}
```

#### Step 4: Install Dependencies

```bash
# Install glob for pattern matching
npm install --save-dev glob

# Test the script
npm run check-size
```

#### Step 5: Integrate with Development Workflow

**Create Git Pre-commit Hook (Optional):**

**File:** `.git/hooks/pre-commit`

```bash
#!/bin/bash
# Pre-commit hook to check performance budgets

echo "Running performance budget check..."
npm run check-size

if [ $? -ne 0 ]; then
  echo "❌ Performance budget check failed!"
  echo "   Review the report and optimize bundle sizes."
  echo "   Or commit with --no-verify to skip this check."
  exit 1
fi

echo "✅ Performance budget check passed!"
exit 0
```

```bash
# Make executable
chmod +x .git/hooks/pre-commit
```

#### Step 6: Test Performance Monitoring

```bash
# Run the checker
npm run check-size

# Expected output:
# ✅ Core Bundle: 28.5KB / 35KB (81.4% used) [PASS]
# ✅ Shared Components: 15.2KB / 20KB (76.0% used) [PASS]
# ✅ SIP Calculator: 12.8KB / 15KB (85.3% used) [PASS]
# ...

# Run in verbose mode to see all files
npm run check-size:verbose

# Simulate failure by temporarily lowering budget
# Edit performance-budget.json, change Core Bundle maxSize to "10KB"
npm run check-size
# Should show: ❌ Core Bundle: 28.5KB / 10KB (285.0% used) [FAIL]
```

**Acceptance Criteria:**
- [ ] `performance-budget.json` created with all budgets
- [ ] `tools/check-bundle-size.js` script works
- [ ] npm scripts configured (check-size, check-size:ci)
- [ ] Script runs successfully and shows results
- [ ] All current bundles pass budget limits
- [ ] Report generated (performance-report.json)
- [ ] Documentation added to README

---

### Task 5.3: State Management Standardization (3 hours)

**Objective:** Create unified state manager to replace inconsistent localStorage usage

#### Step 1: Create State Manager Module

**File:** `shared/js/state-manager.js`

```javascript
/**
 * State Management System
 * Unified API for application state persistence
 * 
 * Features:
 * - Namespaced localStorage
 * - Type-safe getters/setters
 * - Subscription/observer pattern
 * - Automatic serialization
 * 
 * @file shared/js/state-manager.js
 * Sprint 2 - Day 5 - Task 5.3
 */

/**
 * StateManager class
 * Manages application state with localStorage persistence
 */
export class StateManager {
  /**
   * @param {string} namespace - Namespace for localStorage keys
   */
  constructor(namespace = 'app') {
    this.namespace = namespace;
    this.subscribers = new Map();
    this.cache = new Map();
    
    // Listen for storage changes from other tabs
    window.addEventListener('storage', this.handleStorageEvent.bind(this));
  }
  
  /**
   * Generate namespaced key
   * @param {string} key - Key name
   * @returns {string} Namespaced key
   */
  _getKey(key) {
    return `${this.namespace}:${key}`;
  }
  
  /**
   * Get value from state
   * @param {string} key - Key name
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*} Stored value or default
   */
  get(key, defaultValue = null) {
    // Check cache first
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    try {
      const item = localStorage.getItem(this._getKey(key));
      
      if (item === null) {
        return defaultValue;
      }
      
      const parsed = JSON.parse(item);
      this.cache.set(key, parsed);
      return parsed;
      
    } catch (error) {
      console.error(`[StateManager] Error getting key "${key}":`, error);
      return defaultValue;
    }
  }
  
  /**
   * Set value in state
   * @param {string} key - Key name
   * @param {*} value - Value to store
   * @returns {boolean} Success status
   */
  set(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this._getKey(key), serialized);
      
      // Update cache
      this.cache.set(key, value);
      
      // Notify subscribers
      this.notify(key, value);
      
      return true;
      
    } catch (error) {
      console.error(`[StateManager] Error setting key "${key}":`, error);
      
      // Check if quota exceeded
      if (error.name === 'QuotaExceededError') {
        console.warn('[StateManager] localStorage quota exceeded');
        this.handleQuotaExceeded();
      }
      
      return false;
    }
  }
  
  /**
   * Remove value from state
   * @param {string} key - Key name
   * @returns {boolean} Success status
   */
  remove(key) {
    try {
      localStorage.removeItem(this._getKey(key));
      this.cache.delete(key);
      this.notify(key, null);
      return true;
    } catch (error) {
      console.error(`[StateManager] Error removing key "${key}":`, error);
      return false;
    }
  }
  
  /**
   * Clear all state in namespace
   * @returns {boolean} Success status
   */
  clear() {
    try {
      // Remove all keys with this namespace
      const keysToRemove = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(`${this.namespace}:`)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Clear cache
      this.cache.clear();
      
      // Notify all subscribers
      this.subscribers.forEach((callbacks, key) => {
        this.notify(key, null);
      });
      
      return true;
      
    } catch (error) {
      console.error('[StateManager] Error clearing state:', error);
      return false;
    }
  }
  
  /**
   * Subscribe to state changes
   * @param {string} key - Key to watch
   * @param {Function} callback - Callback function(newValue, oldValue)
   * @returns {Function} Unsubscribe function
   */
  subscribe(key, callback) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, []);
    }
    
    this.subscribers.get(key).push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(key);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }
  
  /**
   * Notify subscribers of state change
   * @param {string} key - Changed key
   * @param {*} newValue - New value
   */
  notify(key, newValue) {
    const callbacks = this.subscribers.get(key);
    
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(newValue, this.get(key));
        } catch (error) {
          console.error(`[StateManager] Error in subscriber callback for "${key}":`, error);
        }
      });
    }
  }
  
  /**
   * Handle storage events from other tabs
   * @param {StorageEvent} event - Storage event
   */
  handleStorageEvent(event) {
    if (!event.key?.startsWith(`${this.namespace}:`)) {
      return;
    }
    
    // Extract our key from namespaced key
    const key = event.key.replace(`${this.namespace}:`, '');
    
    // Update cache
    if (event.newValue === null) {
      this.cache.delete(key);
    } else {
      try {
        this.cache.set(key, JSON.parse(event.newValue));
      } catch (error) {
        console.error('[StateManager] Error parsing storage event value:', error);
      }
    }
    
    // Notify subscribers
    const newValue = event.newValue ? JSON.parse(event.newValue) : null;
    this.notify(key, newValue);
  }
  
  /**
   * Handle localStorage quota exceeded
   */
  handleQuotaExceeded() {
    console.warn('[StateManager] Attempting to free up space...');
    
    // Strategy: Remove oldest items (this is basic, can be improved)
    // In production, you might want to remove items by priority or age
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`${this.namespace}:`)) {
        keys.push(key);
      }
    }
    
    // Remove 10% of items
    const removeCount = Math.ceil(keys.length * 0.1);
    for (let i = 0; i < removeCount && i < keys.length; i++) {
      localStorage.removeItem(keys[i]);
    }
  }
  
  /**
   * Get all keys in namespace
   * @returns {string[]} Array of keys
   */
  keys() {
    const keys = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`${this.namespace}:`)) {
        keys.push(key.replace(`${this.namespace}:`, ''));
      }
    }
    
    return keys;
  }
  
  /**
   * Check if key exists
   * @param {string} key - Key name
   * @returns {boolean} True if exists
   */
  has(key) {
    return localStorage.getItem(this._getKey(key)) !== null;
  }
  
  /**
   * Get size of stored data (approximate)
   * @returns {Object} Size info
   */
  getSize() {
    let totalSize = 0;
    const keys = this.keys();
    
    keys.forEach(key => {
      const item = localStorage.getItem(this._getKey(key));
      if (item) {
        totalSize += item.length * 2; // Approximate (UTF-16)
      }
    });
    
    return {
      bytes: totalSize,
      kilobytes: (totalSize / 1024).toFixed(2),
      keyCount: keys.length
    };
  }
}

/**
 * Create global app state manager
 */
export const appState = new StateManager('devtoolbox');

/**
 * Convenience methods
 */
export const getState = (key, defaultValue) => appState.get(key, defaultValue);
export const setState = (key, value) => appState.set(key, value);
export const removeState = (key) => appState.remove(key);
export const subscribeToState = (key, callback) => appState.subscribe(key, callback);
```

#### Step 2: Migrate Tool State to State Manager

**Tool 1: SIP Calculator**

**BEFORE (Direct localStorage):**
```javascript
// In sip-calculator.js
function saveFormData() {
  localStorage.setItem('sip-amount', amountInput.value);
  localStorage.setItem('sip-rate', rateInput.value);
  localStorage.setItem('sip-years', yearsInput.value);
}

function loadFormData() {
  const amount = localStorage.getItem('sip-amount') || '';
  const rate = localStorage.getItem('sip-rate') || '';
  const years = localStorage.getItem('sip-years') || '';
  
  amountInput.value = amount;
  rateInput.value = rate;
  yearsInput.value = years;
}
```

**AFTER (State Manager):**
```javascript
import { appState } from '/shared/js/state-manager.js';

function saveFormData() {
  appState.set('sip.formData', {
    amount: amountInput.value,
    rate: rateInput.value,
    years: yearsInput.value
  });
}

function loadFormData() {
  const formData = appState.get('sip.formData', {
    amount: '',
    rate: '',
    years: ''
  });
  
  amountInput.value = formData.amount;
  rateInput.value = formData.rate;
  yearsInput.value = formData.years;
}

// Optional: Auto-save on input
amountInput.addEventListener('input', () => {
  const current = appState.get('sip.formData', {});
  current.amount = amountInput.value;
  appState.set('sip.formData', current);
});
```

**Tool 2: Theme System**

**BEFORE:**
```javascript
// In shared/js/theme.js
function setTheme(theme) {
  localStorage.setItem('theme', theme);
  applyTheme(theme);
}

function getTheme() {
  return localStorage.getItem('theme') || 'light';
}
```

**AFTER:**
```javascript
import { appState } from '/shared/js/state-manager.js';

function setTheme(theme) {
  appState.set('theme', theme);
  applyTheme(theme);
}

function getTheme() {
  return appState.get('theme', 'light');
}

// Subscribe to theme changes (applies across tabs!)
appState.subscribe('theme', (newTheme) => {
  applyTheme(newTheme);
});
```

**Tool 3: User Preferences**

```javascript
import { appState } from '/shared/js/state-manager.js';

// Save user preferences
function savePreferences(prefs) {
  appState.set('user.preferences', {
    ...appState.get('user.preferences', {}),
    ...prefs
  });
}

// Get preference with default
function getPreference(key, defaultValue) {
  const prefs = appState.get('user.preferences', {});
  return prefs[key] !== undefined ? prefs[key] : defaultValue;
}

// Examples
savePreferences({ decimalPlaces: 2, currency: 'INR' });
const decimalPlaces = getPreference('decimalPlaces', 2);
```

#### Step 3: Add State Manager to All Tools

**Standard Pattern:**

1. Import at top of tool JS file:
```javascript
import { appState } from '/shared/js/state-manager.js';
```

2. Replace all `localStorage.setItem`:
```javascript
// BEFORE
localStorage.setItem('key', value);

// AFTER
appState.set('tool.key', value);
```

3. Replace all `localStorage.getItem`:
```javascript
// BEFORE
const value = localStorage.getItem('key') || defaultValue;

// AFTER
const value = appState.get('tool.key', defaultValue);
```

4. Use subscriptions for reactive updates:
```javascript
appState.subscribe('tool.key', (newValue) => {
  updateUI(newValue);
});
```

#### Step 4: Test State Management

**Test Cases:**

1. **Persistence Test:**
```javascript
// Set a value
appState.set('test.value', { foo: 'bar' });

// Refresh page
location.reload();

// Get value (should persist)
const value = appState.get('test.value');
console.log(value);  // { foo: 'bar' }
```

2. **Subscription Test:**
```javascript
// Subscribe to changes
appState.subscribe('theme', (newTheme) => {
  console.log('Theme changed to:', newTheme);
});

// Change theme
appState.set('theme', 'dark');  
// Console: "Theme changed to: dark"
```

3. **Cross-tab Test:**
```javascript
// Tab 1: Subscribe
appState.subscribe('shared.counter', (value) => {
  console.log('Counter updated:', value);
});

// Tab 2: Change value
appState.set('shared.counter', 42);

// Tab 1 console: "Counter updated: 42"
```

4. **Clear Test:**
```javascript
// Add some state
appState.set('test1', 'value1');
appState.set('test2', 'value2');

// Clear all
appState.clear();

// Verify cleared
console.log(appState.get('test1'));  // null
console.log(appState.keys());        // []
```

**Acceptance Criteria:**
- [ ] `shared/js/state-manager.js` created
- [ ] At least 3 tools migrated to use state manager
- [ ] Theme system uses state manager
- [ ] Form data persistence uses state manager
- [ ] Subscriptions work correctly
- [ ] Cross-tab synchronization works
- [ ] All state manager tests pass

---

**End of Day 5 Deliverables:**
- ✅ innerHTML security audit complete
- ✅ Zero XSS vulnerabilities
- ✅ Performance budgets configured
- ✅ Bundle size monitoring active
- ✅ State manager implemented
- ✅ Consistent state management across tools

---

## Sprint 2 Validation Checklist

### Technical Validation

**CSP Compliance (10 tests):**
- [ ] Zero inline styles in HTML
- [ ] Zero inline event handlers
- [ ] CSP meta tags enforce strict policy
- [ ] No `unattractive-inline` in CSP
- [ ] Zero CSP violations in console
- [ ] All 5 tools load without errors
- [ ] Dark/light theme works
- [ ] All interactive elements functional
- [ ] Responsive layout preserved
- [ ] Visual appearance identical to Sprint 1

**Component Adoption (8 tests):**
- [ ] Component usage calculated (≥80%)
- [ ] SIP Calculator uses shared components
- [ ] EMI Calculator uses shared components
- [ ] Text Diff uses shared components
- [ ] HTML/Markdown uses shared components
- [ ] JSON Schema uses shared components
- [ ] No visual regressions
- [ ] No functionality regressions

**Error Boundaries (6 tests):**
- [ ] ErrorBoundary module exists
- [ ] All 5 tools implement error boundaries
- [ ] Simulated errors show user-friendly modal
- [ ] Error modal has actionable buttons
- [ ] Errors logged to console with details
- [ ] Tools remain functional after errors

**innerHTML Security (5 tests):**
- [ ] All innerHTML usage audited
- [ ] No unsafe innerHTML with user input
- [ ] User content sanitized or escaped
- [ ] XSS injection tests pass
- [ ] Security audit documented

**Performance Budget (3 tests):**
- [ ] performance-budget.json exists
- [ ] check-bundle-size.js script works
- [ ] All bundles within budget

**State Manager (3 tests):**
- [ ] State manager module exists
- [ ] At least 3 tools use state manager
- [ ] Subscriptions and persistence work

**Total: 35 tests**

---

## Sprint 2 Completion Report

**Upon completion, create:** `docs/SPRINT_2_COMPLETION_REPORT.md`

```markdown
# Sprint 2 Completion Report
CSP Hardening & Component Adoption

## Summary
- **Sprint:** 2 of 4
- **Duration:** March 20-22, 2026 (3 days)
- **Status:** ✅ COMPLETE
- **Tests Passed:** XX / 35

## Achievements

### Critical Issues Resolved (2)
1. ✅ CSP unsafe-inline removed (29 styles + 28 handlers migrated)
2. ✅ Component adoption increased (40% → XX%)

### High Priority Issues Resolved (2)
3. ✅ Error boundaries implemented (all 5 tools)
4. ✅ innerHTML XSS audit complete (0 vulnerabilities)

### Medium Priority Issues Resolved (2)
5. ✅ Performance budget enforced
6. ✅ State management standardized

## Deliverables

### New Files Created (5)
- `shared/css/tool-styles.css` (extracted styles)
- `shared/js/error-boundary.js` (error handling)
- `shared/js/state-manager.js` (state persistence)
- `performance-budget.json` (budget configuration)
- `tools/check-bundle-size.js` (monitoring script)

### Files Modified
- All 5 tool HTML files (CSP meta tags, CSS links)
- All 5 tool JS files (event listeners, components, error boundaries)
- `package.json` (scripts added)

### Documentation
- `docs/INNERHTML_SECURITY_AUDIT.md`
- `docs/SPRINT_2_COMPLETION_REPORT.md` (this file)

## Metrics

### Security
- CSP violations: 57 → 0
- XSS vulnerabilities: 12 → 0
- Security grade: B+ (85) → A- (XX)

### Architecture
- Component adoption: 40% → XX%
- Error boundaries: 0 → 5 tools
- State management: Inconsistent → Standardized
- Architecture grade: B+ (84) → A- (XX)

### Performance
- Total bundle size: XXX KB
- All budgets passed: YES/NO
- Largest bundle: XXX (XX KB / YY KB limit)

## Testing Results

[Test pass/fail summary]

## Challenges & Solutions

[Document any issues encountered and how they were resolved]

## Next Steps

Sprint 3 will focus on:
- Test automation framework
- CI/CD pipeline
- Production deployment preparation

---

**Approved by:** [Tech Lead Name]  
**Date:** March 22, 2026
```

---

## Developer Support

### Getting Help

**Questions during implementation:**
1. Review relevant documentation section
2. Check similar patterns in existing code
3. Search for examples in shared/ directory
4. Ask Tech Lead for clarification

**Common Issues:**

| Issue | Solution |
|-------|----------|
| CSP violation after migration | Check for missed inline styles/handlers |
| Visual regression | Verify CSS classes match styling |
| Component not rendering | Check import path and module type |
| Error boundary not catching | Ensure function is wrapped correctly |
| State not persisting | Verify namespace and key format |
| Bundle size exceeded | Audit largest files, optimize |

### Resources

- CSP Migration Plan: `docs/CSP_MIGRATION_PLAN.md`
- Component API: `shared/components/*.js` (JSDoc comments)
- Existing patterns: Look at home page (`index.html`)
- Browser DevTools for testing and debugging

---

**Ready to begin Sprint 2 implementation!**

This guide provides complete implementation details for all 6 tickets across 3 days of work. Follow the day-by-day structure, complete each task's acceptance criteria, and coordinate with the Test Specialist for validation.

Good luck! 🚀
