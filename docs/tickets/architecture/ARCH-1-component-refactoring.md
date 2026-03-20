# TICKET: ARCH-1 - Component Library Refactoring

**Priority:** P0 (Critical Architecture Violation)  
**Effort:** 3-5 days  
**Owner:** Developer  
**Reviewer:** Tech Lead + Solution Architect  
**Dependencies:** BOTH-1 (CSP hardening should be done first)  
**Sprint Days:** Day 3-6  

---

## Problem Statement

The architecture specification mandated a shared component library using factory functions for reusable UI elements. Component library **exists** in `shared/components/` but is **completely unused** - all tools recreate UI elements inline, resulting in:

1. **~600 lines of duplicate code** across 6 tools
2. **Inconsistent UI patterns** (buttons styled differently)
3. **Maintenance nightmare** (change requires editing 6 files)
4. **Bundle size bloat** (~15KB unnecessary weight)
5. **Untestable components** (no isolation, no unit tests)

**Architecture Grade Impact:** F (40/100) on component architecture → Target: A (90/100)

**Evidence:**
```bash
# Search for component imports - ZERO RESULTS
grep -r "from.*components" --include="*.js" tools/ home/
# Result: 0 matches

# Meanwhile, duplicate button creation everywhere:
grep -rn "createElement('button')" tools/ home/
# Result: 30+ instances
```

---

## Acceptance Criteria

- [ ] All 6 tools import from `shared/components/`
- [ ] 0 lines of duplicate `createElement('button')` or `createElement('div')` for UI
- [ ] Consistent UI patterns across all tools
- [ ] 100% test pass rate maintained (52/52)
- [ ] No performance regression
- [ ] Code review approved
- [ ] Documentation updated with component usage examples

---

## Architecture Context

### Specified Pattern (from architecture review)

**Factory Function Pattern:**
```javascript
// shared/components/button.js
export function createButton(options) {
  const button = document.createElement('button');
  button.className = `btn btn-${options.variant}`;
  button.textContent = options.label;
  
  if (options.onClick) {
    button.addEventListener('click', options.onClick);
  }
  
  return button;
}
```

**Expected Usage:**
```javascript
// In tool file
import { createButton } from '../../shared/components/button.js';

const saveBtn = createButton({
  label: 'Save',
  variant: 'primary',
  onClick: () => this.save()
});

container.appendChild(saveBtn);
```

### Available Components

Located in `shared/components/`:

1. **button.js** - Buttons with variants (primary, secondary, ghost, danger)
2. **card.js** - Card containers with headers, content, footers
3. **input.js** - Form inputs with labels and validation
4. **modal.js** - Modal dialogs with overlay

**APIs already designed and working** - just need to be imported and used.

---

## Implementation Strategy

### Approach: Incremental Tool-by-Tool Refactoring

**Why incremental:**
- Reduces risk of breaking everything
- Allows testing after each tool
- Easy rollback if issues found
- Builds confidence progressively

**Order (Simple → Complex):**
1. JSON Schema Converter (simplest, 3 components needed)
2. Home Page (4 components, UI-focused)
3. SIP Calculator (6 components, forms + charts)
4. Text Diff (5 components, diff UI)
5. EMI Calculator (8 components, most complex)
6. HTML/Markdown (4 components, editor UI)

**After Each Tool:**
- Run tool's automated tests
- Manual functional testing
- Performance check
- Git commit
- Move to next tool

---

## Phase 1: JSON Schema Converter (Day 3 PM - 4 hours)

### Current State Analysis

**File:** `tools/json-schema/json-schema.js` (~680 lines)

**Duplicate Code to Replace:**
```javascript
// Button creation (appears 5+ times)
const button = document.createElement('button');
button.className = 'btn btn-primary';
button.textContent = 'Generate Schema';
button.addEventListener('click', () => this.generateSchema());
container.appendChild(button);

// Card creation for results
const card = document.createElement('div');
card.className = 'card';
const header = document.createElement('div');
header.className = 'card-header';
// ... 20 more lines
```

### Refactoring Tasks

**Task 1.1: Add Component Imports**

```javascript
// Add to top of json-schema.js
import { createButton } from '../../shared/components/button.js';
import { createCard } from '../../shared/components/card.js';
import { createModal } from '../../shared/components/modal.js';
```

**Task 1.2: Replace Button Creation**

**BEFORE (5 instances):**
```javascript
const generateBtn = document.createElement('button');
generateBtn.className = 'btn btn-primary';
generateBtn.textContent = 'Generate Schema';
generateBtn.addEventListener('click', () => this.generateSchema());

const validateBtn = document.createElement('button');
validateBtn.className = 'btn btn-primary';
validateBtn.textContent = 'Validate JSON';
validateBtn.addEventListener('click', () => this.validateJSON());

const loadSampleBtn = document.createElement('button');
loadSampleBtn.className = 'btn btn-secondary';
loadSampleBtn.textContent = 'Load Sample';
loadSampleBtn.addEventListener('click', () => this.loadSample());

const copyBtn = document.createElement('button');
copyBtn.className = 'btn btn-secondary btn-small';
copyBtn.textContent = 'Copy';
copyBtn.addEventListener('click', () => this.copy());

const downloadBtn = document.createElement('button');
downloadBtn.className = 'btn btn-secondary btn-small';
downloadBtn.textContent = 'Download';
downloadBtn.addEventListener('click', () => this.download());
```

**AFTER (5 instances replaced):**
```javascript
const generateBtn = createButton({
  label: 'Generate Schema',
  variant: 'primary',
  onClick: () => this.generateSchema()
});

const validateBtn = createButton({
  label: 'Validate JSON',
  variant: 'primary',
  onClick: () => this.validateJSON()
});

const loadSampleBtn = createButton({
  label: 'Load Sample',
  variant: 'secondary',
  onClick: () => this.loadSample()
});

const copyBtn = createButton({
  label: 'Copy',
  variant: 'secondary',
  size: 'small',
  onClick: () => this.copy()
});

const downloadBtn = createButton({
  label: 'Download',
  variant: 'secondary',
  size: 'small',
  onClick: () => this.download()
});
```

**Lines Saved:** ~25 lines → ~15 lines (40% reduction)

**Task 1.3: Replace Result Display Cards**

**BEFORE:**
```javascript
showResult(title, message, type) {
  const card = document.createElement('div');
  card.className = `card card-${type}`;
  
  const header = document.createElement('div');
  header.className = 'card-header';
  
  const titleEl = document.createElement('h3');
  titleEl.textContent = title;
  header.appendChild(titleEl);
  
  const content = document.createElement('div');
  content.className = 'card-content';
  content.textContent = message;
  
  card.appendChild(header);
  card.appendChild(content);
  
  this.resultContainer.appendChild(card);
}
```

**AFTER:**
```javascript
showResult(title, message, type) {
  const card = createCard({
    title: title,
    content: message,
    className: `card-${type}`
  });
  
  this.resultContainer.appendChild(card);
}
```

**Lines Saved:** ~20 lines → ~7 lines (65% reduction)

**Task 1.4: Replace Modal/Alert Dialogs**

If any custom alert/confirm dialogs exist, replace with modal component.

**BEFORE:**
```javascript
showError(message) {
  // Custom modal creation (30+ lines)
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  const modal = document.createElement('div');
  modal.className = 'modal';
  // ... 25 more lines
}
```

**AFTER:**
```javascript
import { createModal } from '../../shared/components/modal.js';

showError(message) {
  const modal = createModal({
    title: 'Error',
    content: message,
    actions: [
      createButton({ label: 'OK', onClick: () => modal.close() })
    ]
  });
  
  modal.show();
}
```

### Testing JSON Schema Converter

**Automated Tests:**
```bash
# Run existing automated tests
# Should be: tools/json-schema/automated-tests.html
# Open in browser and verify all tests pass
```

**Manual Tests:**
- [ ] Load sample JSON
- [ ] Generate schema (button works)
- [ ] Validate JSON (button works)
- [ ] Copy output (button works)
- [ ] Download schema (button works)
- [ ] Error messages display correctly
- [ ] No console errors
- [ ] UI looks identical to before

**Performance:**
- Tool initialization: Should be ~unchanged
- Button clicks: Should be ~unchanged

**Commit:**
```bash
git add tools/json-schema/
git commit -m "refactor(json-schema): use shared component library

- Replace 5 button createElement with createButton()
- Replace card creation with createCard()
- Reduce code by ~80 lines
- All tests passing"
```

---

## Phase 2: Home Page (Day 4 Morning - 4 hours)

### Current State Analysis

**File:** `home/home.js` (~935 lines)

**Duplicate Code:**
- Tool cards (6 instances, ~20 lines each = 120 lines)
- Feature cards (~40 lines)
- Navigation buttons

### Refactoring Tasks

**Task 2.1: Import Components**

```javascript
// Add to home/home.js
import { createCard } from '../shared/components/card.js';
import { createButton } from '../shared/components/button.js';
```

**Task 2.2: Refactor Tool Cards**

**BEFORE (appears 6 times):**
```javascript
const toolCard = document.createElement('div');
toolCard.className = 'card card-hover card-clickable';

const icon = document.createElement('div');
icon.className = 'card-icon';
icon.textContent = '🔧';

const header = document.createElement('div');
header.className = 'card-header';

const title = document.createElement('h3');
title.textContent = 'JSON Schema Converter';

header.appendChild(icon);
header.appendChild(title);

const content = document.createElement('div');
content.className = 'card-content';
content.textContent = 'Convert JSON to schema...';

toolCard.appendChild(header);
toolCard.appendChild(content);

toolCard.addEventListener('click', () => {
  window.location.hash = '#/json-schema';
});

container.appendChild(toolCard);
```

**AFTER:**
```javascript
const toolCard = createCard({
  icon: '🔧',
  title: 'JSON Schema Converter',
  content: 'Convert JSON to schema and validate JSON against schemas',
  hover: true,
  clickable: true,
  onClick: () => window.location.hash = '#/json-schema'
});

container.appendChild(toolCard);
```

**Lines Saved:** ~25 lines × 6 tools = 150 lines → ~8 lines × 6 = 48 lines (**68% reduction**)

**Task 2.3: Create Tool Card Factory**

Extract tool card creation to helper method:

```javascript
// home/home.js
class HomePage {
  createToolCard(tool) {
    return createCard({
      icon: tool.icon,
      title: tool.title,
      content: tool.description,
      hover: true,
      clickable: true,
      onClick: () => window.location.hash = tool.route
    });
  }
  
  renderTools() {
    const tools = [
      { 
        icon: '🔧', 
        title: 'JSON Schema Converter',
        description: 'Convert JSON to schema and validate',
        route: '#/json-schema'
      },
      {
        icon: '💰',
        title: 'SIP Calculator',
        description: 'Calculate SIP returns and track growth',
        route: '#/sip-calculator'
      },
      // ... other tools
    ];
    
    tools.forEach(tool => {
      const card = this.createToolCard(tool);
      this.toolsContainer.appendChild(card);
    });
  }
}
```

**Benefits:**
- Single source of truth for tool metadata
- Easy to add new tools
- Data-driven rendering
- ~100 lines saved

### Testing Home Page

**Manual Tests:**
- [ ] All 6 tool cards display
- [ ] Cards have hover effect
- [ ] Clicking card navigates to tool
- [ ] Icons and descriptions correct
- [ ] No layout issues
- [ ] No console errors

**Performance:**
- Page load: Should be slightly **faster** (less code)

**Commit:**
```bash
git add home/
git commit -m "refactor(home): use shared component library

- Replace 6 tool card createElement with createCard()
- Extract tool metadata to data structure
- Reduce code by ~120 lines
- Data-driven tool rendering"
```

---

## Phase 3: SIP Calculator (Day 4 Afternoon - 4 hours)

### Current State Analysis

**File:** `tools/sip-calculator/sip-calculator.js` (~1,458 lines)

**Duplicate Code:**
- Form input containers (~15 instances)
- Buttons (~8 instances)
- Result cards (~3 instances)
- Error messages

### Refactoring Tasks

**Task 3.1: Import Components**

```javascript
// Add to sip-calculator.js
import { createButton } from '../../shared/components/button.js';
import { createInput } from '../../shared/components/input.js';
import { createCard } from '../../shared/components/card.js';
```

**Task 3.2: Refactor Form Buttons**

**BEFORE:**
```javascript
this.calculateBtn = document.getElementById('calculate-btn');
this.resetBtn = document.getElementById('reset-btn');
this.exportBtn = document.getElementById('export-btn');

this.calculateBtn.addEventListener('click', () => this.calculate());
this.resetBtn.addEventListener('click', () => this.reset());
this.exportBtn.addEventListener('click', () => this.export());
```

**AFTER:**

If buttons are created in JS (not HTML), replace with:
```javascript
this.calculateBtn = createButton({
  label: 'Calculate',
  variant: 'primary',
  onClick: () => this.calculate()
});

this.resetBtn = createButton({
  label: 'Reset',
  variant: 'secondary',
  onClick: () => this.reset()
});

this.exportBtn = createButton({
  label: 'Export CSV',
  variant: 'secondary',
  icon: '📊',
  onClick: () => this.export()
});
```

**If buttons are in HTML:** Keep getElementById, just improve handler attachment.

**Task 3.3: Refactor Result Display**

**BEFORE:**
```javascript
showResults(data) {
  const card = document.createElement('div');
  card.className = 'card card-results';
  
  const header = document.createElement('div');
  header.className = 'card-header';
  header.innerHTML = `<h3>Investment Summary</h3>`;
  
  const content = document.createElement('div');
  content.className = 'card-content';
  content.innerHTML = `
    <div class="result-row">
      <span>Total Investment:</span>
      <span>${data.totalInvestment}</span>
    </div>
    <div class="result-row">
      <span>Future Value:</span>
      <span>${data.futureValue}</span>
    </div>
  `;
  
  card.appendChild(header);
  card.appendChild(content);
  this.resultsContainer.appendChild(card);
}
```

**AFTER:**
```javascript
showResults(data) {
  const resultHTML = `
    <div class="result-row">
      <span>Total Investment:</span>
      <span>${this.formatCurrency(data.totalInvestment)}</span>
    </div>
    <div class="result-row">
      <span>Future Value:</span>
      <span>${this.formatCurrency(data.futureValue)}</span>
    </div>
    <div class="result-row">
      <span>Returns:</span>
      <span class="positive">${this.formatCurrency(data.returns)}</span>
    </div>
  `;
  
  const card = createCard({
    title: 'Investment Summary',
    content: resultHTML
  });
  
  this.resultsContainer.appendChild(card);
}
```

**Lines Saved:** ~20 lines → ~18 lines (minor, but cleaner)

**Task 3.4: Keep Chart.js as-is**

**DON'T refactor:**
- Chart rendering logic (specialized, not in component library)
- Table generation (custom to this tool)
- CSV export logic (business logic, not UI)

**DO refactor:**
- Buttons that trigger these actions
- Cards that contain charts/tables
- Form input wrappers

### Testing SIP Calculator

**Automated Tests:**
```bash
# Run: tools/sip-calculator/automated-tests.html
# Should have 30 tests - all must pass
```

**Manual Tests:**
- [ ] Enter monthly investment (e.g., 5000)
- [ ] Set expected return (e.g., 12%)
- [ ] Set time period (e.g., 10 years)
- [ ] Enable step-up (10%)
- [ ] Click Calculate
- [ ] ✅ Chart renders
- [ ] ✅ Year-wise table displays
- [ ] ✅ Summary card shows correct values
- [ ] Click Export CSV
- [ ] ✅ CSV downloads
- [ ] Click Reset
- [ ] ✅ Form clears
- [ ] No console errors

**Performance:**
- Calculation time: Should be unchanged (~15ms)
- Chart render: Should be unchanged

**Commit:**
```bash
git add tools/sip-calculator/
git commit -m "refactor(sip-calculator): use shared component library

- Replace button creation with createButton()
- Replace result cards with createCard()
- Reduce code by ~60 lines
- All 30 tests passing"
```

---

## Phase 4: Text Diff Checker (Day 5 Morning - 4 hours)

### Current State Analysis

**File:** `tools/text-diff/text-diff.js` (~1,229 lines)

**Duplicate Code:**
- Control buttons (~5 instances)
- Settings panel cards
- Mode toggle buttons

### Refactoring Tasks

**Task 4.1: Import Components**

```javascript
import { createButton } from '../../shared/components/button.js';
import { createCard } from '../../shared/components/card.js';
```

**Task 4.2: Refactor Control Buttons**

**BEFORE:**
```javascript
const compareBtn = document.createElement('button');
compareBtn.className = 'btn btn-primary';
compareBtn.textContent = 'Compare';
compareBtn.addEventListener('click', () => this.compare());

const clearBtn = document.createElement('button');
clearBtn.className = 'btn btn-secondary';
clearBtn.textContent = 'Clear';
clearBtn.addEventListener('click', () => this.clear());

const swapBtn = document.createElement('button');
swapBtn.className = 'btn btn-secondary';
swapBtn.textContent = '↔️ Swap';
swapBtn.addEventListener('click', () => this.swap());

const copyBtn = document.createElement('button');
copyBtn.className = 'btn btn-secondary';
copyBtn.textContent = 'Copy Diff';
copyBtn.addEventListener('click', () => this.copyDiff());
```

**AFTER:**
```javascript
const compareBtn = createButton({
  label: 'Compare',
  variant: 'primary',
  onClick: () => this.compare()
});

const clearBtn = createButton({
  label: 'Clear',
  variant: 'secondary',
  onClick: () => this.clear()
});

const swapBtn = createButton({
  label: 'Swap',
  variant: 'secondary',
  icon: '↔️',
  onClick: () => this.swap()
});

const copyBtn = createButton({
  label: 'Copy Diff',
  variant: 'secondary',
  onClick: () => this.copyDiff()
});
```

**Lines Saved:** ~16 lines → ~12 lines

**Task 4.3: Refactor Settings Panel**

**BEFORE:**
```javascript
createSettingsPanel() {
  const card = document.createElement('div');
  card.className = 'card';
  
  const header = document.createElement('div');
  header.className = 'card-header';
  header.innerHTML = '<h3>Settings</h3>';
  
  const content = document.createElement('div');
  content.className = 'card-content';
  
  // Settings controls...
  
  card.appendChild(header);
  card.appendChild(content);
  return card;
}
```

**AFTER:**
```javascript
createSettingsPanel() {
  const settingsHTML = this.renderSettingsControls();
  
  return createCard({
    title: 'Settings',
    content: settingsHTML
  });
}
```

**Task 4.4: Keep Diff Rendering as-is**

**DON'T refactor:**
- Diff algorithm output (uses jsdiff library)
- Color-coded diff display (custom CSS)
- Line number rendering

**DO refactor:**
- Buttons that control diffing
- Settings cards
- Error message displays

### Testing Text Diff

**Manual Tests:**
- [ ] Enter text in left panel
- [ ] Enter modified text in right panel
- [ ] Click Compare
- [ ] ✅ Diff displays with colors
- [ ] Toggle between diff modes (unified, split, side-by-side)
- [ ] ✅ All modes work
- [ ] Click Swap
- [ ] ✅ Texts swap positions
- [ ] Click Copy Diff
- [ ] ✅ Diff copies to clipboard
- [ ] Click Clear
- [ ] ✅ Both panels clear
- [ ] No console errors

**Performance:**
- Diff calculation: Should be unchanged
- Rendering: Should be unchanged

**Commit:**
```bash
git add tools/text-diff/
git commit -m "refactor(text-diff): use shared component library

- Replace button creation with createButton()
- Replace settings card with createCard()
- Reduce code by ~40 lines
- All functionality working"
```

---

## Phase 5: EMI Calculator (Day 5 Afternoon - Day 6 Morning - 6 hours)

### Current State Analysis

**File:** `tools/emi-calculator/emi-calculator.js` (~1,623 lines)

**This is the MOST COMPLEX tool** - many forms, buttons, charts, tables.

**Duplicate Code:**
- Form buttons (~10 instances)
- Result cards (~5 instances)
- Prepayment list items
- Modal dialogs

### Refactoring Tasks

**Task 5.1: Import Components**

```javascript
import { createButton } from '../../shared/components/button.js';
import { createCard } from '../../shared/components/card.js';
import { createInput } from '../../shared/components/input.js';
import { createModal } from '../../shared/components/modal.js';
```

**Task 5.2: Refactor Primary Buttons**

**BEFORE:**
```javascript
this.calculateBtn = document.getElementById('calculate-btn');
this.resetBtn = document.getElementById('reset-btn');
this.addPrepaymentBtn = document.getElementById('add-prepayment-btn');
this.exportBtn = document.getElementById('export-btn');
this.printBtn = document.getElementById('print-btn');

// Multiple addEventListener calls...
```

Similar pattern as SIP calculator.

**Task 5.3: Refactor Result Cards**

**BEFORE:**
```javascript
showEMIResult(emi, totalPayment, totalInterest) {
  const card = document.createElement('div');
  card.className = 'card card-results';
  
  // 30+ lines of card building...
  
  return card;
}
```

**AFTER:**
```javascript
showEMIResult(emi, totalPayment, totalInterest) {
  const resultHTML = `
    <div class="emi-summary">
      <div class="result-item">
        <span class="label">Monthly EMI:</span>
        <span class="value">${this.formatCurrency(emi)}</span>
      </div>
      <div class="result-item">
        <span class="label">Total Payment:</span>
        <span class="value">${this.formatCurrency(totalPayment)}</span>
      </div>
      <div class="result-item">
        <span class="label">Total Interest:</span>
        <span class="value">${this.formatCurrency(totalInterest)}</span>
      </div>
    </div>
  `;
  
  return createCard({
    title: 'EMI Summary',
    content: resultHTML,
    actions: [
      createButton({ label: 'Export Schedule', onClick: () => this.exportSchedule() }),
      createButton({ label: 'Print', variant: 'secondary', onClick: () => window.print() })
    ]
  });
}
```

**Task 5.4: Refactor Prepayment Modal**

**BEFORE:**
```javascript
showPrepaymentModal() {
  // 50+ lines creating modal manually
  const overlay = document.createElement('div');
  // ... lots of DOM creation
}
```

**AFTER:**
```javascript
showPrepaymentModal() {
  const formHTML = `
    <div class="prepayment-form">
      <label>
        Year:
        <input type="number" id="prepayment-year" min="1" max="30">
      </label>
      <label>
        Amount:
        <input type="number" id="prepayment-amount" min="1000" step="1000">
      </label>
    </div>
  `;
  
  const modal = createModal({
    title: 'Add Prepayment',
    content: formHTML,
    actions: [
      createButton({ 
        label: 'Add', 
        variant: 'primary', 
        onClick: () => {
          this.addPrepayment();
          modal.close();
        }
      }),
      createButton({ 
        label: 'Cancel', 
        variant: 'secondary', 
        onClick: () => modal.close()
      })
    ]
  });
  
  modal.show();
}
```

**Lines Saved:** ~50 lines → ~30 lines

**Task 5.5: Keep Complex Logic as-is**

**DON'T refactor:**
- EMI calculation algorithm
- Amortization schedule generation
- Chart.js integration
- CSV export logic

**DO refactor:**
- All button creation
- All card creation
- Modal dialogs
- Form input wrappers (if time permits)

### Testing EMI Calculator

**This tool has the most features - test thoroughly:**

**Automated Tests:**
```bash
# If automated tests exist, run them
```

**Manual Tests:**
- [ ] Enter loan amount (e.g., 1,000,000)
- [ ] Set interest rate (e.g., 8.5%)
- [ ] Set loan tenure (e.g., 20 years)
- [ ] Click Calculate EMI
- [ ] ✅ EMI displays correctly
- [ ] ✅ Chart renders (principal vs interest)
- [ ] ✅ Amortization table displays
- [ ] Click Add Prepayment
- [ ] ✅ Modal opens
- [ ] Add prepayment (Year: 5, Amount: 100,000)
- [ ] ✅ Table updates with prepayment
- [ ] Click Export Schedule
- [ ] ✅ CSV downloads
- [ ] Click Reset
- [ ] ✅ Form clears
- [ ] Test with different combinations
- [ ] No console errors

**Performance:**
- Calculation: Should be unchanged
- Table rendering: Should be unchanged
- Chart rendering: Should be unchanged

**Commit:**
```bash
git add tools/emi-calculator/
git commit -m "refactor(emi-calculator): use shared component library

- Replace 10 button createElement with createButton()
- Replace 5 card createElement with createCard()
- Replace prepayment modal with createModal()
- Reduce code by ~150 lines
- All functionality working"
```

---

## Phase 6: HTML/Markdown Converter (Day 6 Afternoon - 4 hours)

### Current State Analysis

**File:** `tools/html-markdown/html-markdown.js` (~881 lines)

**Duplicate Code:**
- Toolbar buttons (~6 instances)
- Preview cards
- Error messages

### Refactoring Tasks

**Task 6.1: Import Components**

```javascript
import { createButton } from '../../shared/components/button.js';
import { createCard } from '../../shared/components/card.js';
```

**Task 6.2: Refactor Toolbar Buttons**

**BEFORE:**
```javascript
const convertToMdBtn = document.createElement('button');
convertToMdBtn.className = 'btn btn-primary';
convertToMdBtn.textContent = 'Convert to Markdown';
convertToMdBtn.addEventListener('click', () => this.convertToMarkdown());

const convertToHtmlBtn = document.createElement('button');
convertToHtmlBtn.className = 'btn btn-primary';
convertToHtmlBtn.textContent = 'Convert to HTML';
convertToHtmlBtn.addEventListener('click', () => this.convertToHTML());

const copyBtn = document.createElement('button');
copyBtn.className = 'btn btn-secondary';
copyBtn.textContent = 'Copy';
copyBtn.addEventListener('click', () => this.copy());

const clearBtn = document.createElement('button');
clearBtn.className = 'btn btn-secondary';
clearBtn.textContent = 'Clear';
clearBtn.addEventListener('click', () => this.clear());
```

**AFTER:**
```javascript
const convertToMdBtn = createButton({
  label: 'Convert to Markdown',
  variant: 'primary',
  onClick: () => this.convertToMarkdown()
});

const convertToHtmlBtn = createButton({
  label: 'Convert to HTML',
  variant: 'primary',
  onClick: () => this.convertToHTML()
});

const copyBtn = createButton({
  label: 'Copy',
  variant: 'secondary',
  onClick: () => this.copy()
});

const clearBtn = createButton({
  label: 'Clear',
  variant: 'secondary',
  onClick: () => this.clear()
});
```

**Task 6.3: Refactor Preview Cards**

**BEFORE:**
```javascript
updatePreview(html) {
  const card = document.createElement('div');
  card.className = 'card preview-card';
  
  const header = document.createElement('div');
  header.className = 'card-header';
  header.innerHTML = '<h3>Preview</h3>';
  
  const content = document.createElement('div');
  content.className = 'card-content preview-content';
  content.innerHTML = html; // Sanitized by DOMPurify
  
  card.appendChild(header);
  card.appendChild(content);
  
  this.previewContainer.innerHTML = '';
  this.previewContainer.appendChild(card);
}
```

**AFTER:**
```javascript
updatePreview(html) {
  const card = createCard({
    title: 'Preview',
    content: html, // Will be sanitized by card component if needed
    className: 'preview-card'
  });
  
  this.previewContainer.innerHTML = '';
  this.previewContainer.appendChild(card);
}
```

**Task 6.4: Keep Conversion Logic as-is**

**DON'T refactor:**
- Turndown.js integration (HTML → Markdown)
- Marked.js integration (Markdown → HTML)
- DOMPurify sanitization
- Editor/textarea handling

**DO refactor:**
- Toolbar buttons
- Preview cards
- Error/success messages

### Testing HTML/Markdown

**Manual Tests:**
- [ ] Enter HTML in left editor
- [ ] Click Convert to Markdown
- [ ] ✅ Markdown displays in right editor
- [ ] ✅ Preview renders (sanitized)
- [ ] Enter Markdown in left editor
- [ ] Click Convert to HTML
- [ ] ✅ HTML displays in right editor
- [ ] ✅ Preview renders safely
- [ ] Click Copy
- [ ] ✅ Output copied to clipboard
- [ ] Test with various HTML/Markdown
- [ ] No console errors
- [ ] No XSS vulnerabilities (test with `<script>alert('xss')</script>`)

**Security:**
- [ ] XSS test: `<img src=x onerror=alert(1)>` should be sanitized
- [ ] All 10 XSS vectors from security audit should be blocked

**Performance:**
- Conversion speed: Should be unchanged

**Commit:**
```bash
git add tools/html-markdown/
git commit -m "refactor(html-markdown): use shared component library

- Replace button creation with createButton()
- Replace preview cards with createCard()
- Reduce code by ~50 lines
- All functionality and security working"
```

---

## Final Integration & Validation (Day 6 Evening - 2 hours)

### Task: Full Platform Testing

**Test All 6 Tools in Sequence:**

1. **Navigate between tools** (test router)
   - [ ] Home → JSON Schema
   - [ ] JSON Schema → SIP Calculator
   - [ ] SIP Calculator → EMI Calculator
   - [ ] EMI Calculator → Text Diff
   - [ ] Text Diff → HTML/Markdown
   - [ ] HTML/Markdown → Home
   - [ ] All transitions smooth
   - [ ] No console errors

2. **Test theme switching** (shared infrastructure)
   - [ ] Toggle dark/light mode
   - [ ] All tools render correctly in both themes
   - [ ] Component styles consistent

3. **Test browser refresh**
   - [ ] Refresh on each tool
   - [ ] Tool state preserved (if using localStorage)
   - [ ] No errors on reload

4. **Run all automated tests**
   ```bash
   # Run entire test suite
   # Target: 52/52 passing (100%)
   ```

5. **Performance benchmarks**
   - [ ] Page load: <1s
   - [ ] Tool load: <500ms
   - [ ] No memory leaks (use Chrome DevTools)

### Success Criteria Check

- [ ] All 6 tools use shared components
- [ ] 0 instances of `createElement('button')` for UI buttons
- [ ] 0 instances of manual card creation
- [ ] Code reduced by ~600 lines total
- [ ] All tests passing (52/52)
- [ ] No performance regression
- [ ] No console errors

---

## Code Review Checklist

**Before Requesting Review:**

- [ ] All 6 tools refactored
- [ ] Component imports added to each tool
- [ ] Old DOM creation code removed
- [ ] All tools tested manually
- [ ] All automated tests passing
- [ ] Performance benchmarks met
- [ ] No console errors or warnings
- [ ] Git commits for each tool
- [ ] Documentation updated

**Reviewer Checklist:**

- [ ] Consistent component usage across all tools
- [ ] No duplicate DOM creation code
- [ ] Component APIs used correctly
- [ ] Event handlers properly attached
- [ ] Error handling preserved
- [ ] Accessibility maintained
- [ ] Code more readable and maintainable
- [ ] Tests confirm functionality

---

## Metrics & Success Validation

### Code Metrics

**Before:**
```
Total Lines: 6,806 (all tools)
Duplicate Code: ~600 lines
Component Imports: 0
Button createElement: 35+ instances
Card createElement: 25+ instances
```

**After:**
```
Total Lines: ~6,200 (9% reduction)
Duplicate Code: 0 lines
Component Imports: 6 (all tools)
Button createElement: 0 instances (for UI)
Card createElement: 0 instances
Lines Saved: ~600 lines
```

### Architecture Grade Impact

**Before:**
- Component Architecture: F (40/100)
- Reason: Components exist but unused

**After:**
- Component Architecture: A (90/100)
- Reason: Consistent component usage, DRY principle
- Overall Architecture Grade: B+ → A- (+6 points)

### Maintainability Impact

**Before:**
- Change button style: Edit 6 files
- Add new button variant: Copy-paste code
- Test button component: Can't isolate

**After:**
- Change button style: Edit 1 file (`button.js`)
- Add new button variant: Update `createButton()` factory
- Test button component: Unit test in isolation

---

## Rollback Plan

### Per-Tool Rollback

If a specific tool has issues:
```bash
# Rollback just that tool
git checkout main -- tools/[tool-name]/
git commit -m "rollback: Revert [tool-name] component refactoring"

# Other tools keep refactored components
```

### Full Rollback

If system-wide issues:
```bash
# Revert all tools
git checkout main -- tools/ home/
git commit -m "rollback: Revert all component refactoring"
```

**Note:** Rollback is easy - all old code is in git history.

---

## Documentation Updates

After implementation:

**1. Update docs/DEVELOPER_GUIDE.md:**

```markdown
## Component Library

All tools use shared components from `shared/components/`:

### Button Component
```javascript
import { createButton } from '../../shared/components/button.js';

const btn = createButton({
  label: 'Click Me',
  variant: 'primary', // primary, secondary, ghost, danger
  size: 'medium',     // small, medium, large
  onClick: () => console.log('clicked')
});
```

### Card Component
```javascript
import { createCard } from '../../shared/components/card.js';

const card = createCard({
  title: 'Card Title',
  content: 'Card content here',
  hover: true,
  clickable: true,
  onClick: () => console.log('card clicked')
});
```

[More examples...]
```

**2. Update docs/ARCHITECTURE.md:**

```markdown
## Component Pattern Implementation

✅ All 6 tools use shared component library
✅ 0 lines of duplicate UI code
✅ Consistent patterns across platform
✅ Factory function pattern per specification

Benefits achieved:
- 600 lines of code reduced
- Single source of truth for UI components
- Testable components in isolation
- Easy to maintain and extend
```

---

## Related Tickets

**Blocked By:**
- **BOTH-1:** CSP hardening (should be done first for clean codebase)

**Enables:**
- **ARCH-3:** Error boundaries (easier with clean component structure)

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Break tool functionality | MEDIUM | HIGH | Incremental approach, test after each tool |
| Introduce regressions | MEDIUM | HIGH | Comprehensive testing, automated tests |
| Performance degradation | LOW | MEDIUM | Benchmark after each tool |
| Inconsistent implementation | LOW | MEDIUm | Code review, clear patterns |
| Timeline overrun | MEDIUM | MEDIUM | Start with simple tools, pair on complex |

---

## Timeline Breakdown

| Day | Tool | Complexity | Hours | Cumulative |
|-----|------|-----------|-------|------------|
| 3 PM | JSON Schema | Simple | 4h | 4h |
| 4 AM | Home Page | Simple | 4h | 8h |
| 4 PM | SIP Calculator | Medium | 4h | 12h |
| 5 AM | Text Diff | Medium | 4h | 16h |
| 5 PM | EMI Calculator | Complex | 4h | 20h |
| 6 AM | EMI (cont.) | Complex | 2h | 22h |
| 6 PM | HTML/Markdown | Medium | 4h | 26h |
| 6 Eve | Integration Test | - | 2h | 28h |
| **Total** | | | **28h** | **3.5 days** |

**Buffer:** Planned for 4 days (Day 3-6), giving 4h buffer for unforeseen issues.

---

**Status:** READY FOR IMPLEMENTATION  
**Blocked By:** BOTH-1 (CSP hardening - preferred but not required)  
**Blocking:** None (can be done in parallel with other tickets)  

**Priority Justification:** Critical architecture violation. Solves core maintainability and code quality issues. Foundation for scalable platform.
