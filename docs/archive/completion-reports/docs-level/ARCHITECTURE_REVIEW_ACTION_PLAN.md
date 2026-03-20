# Architecture Review - Action Plan
## DevToolbox Platform - Production Readiness Roadmap

**Created:** March 19, 2026  
**Owner:** Development Team  
**Timeline:** 8-20 days (depending on scope)  
**Status:** 🔴 BLOCKERS IDENTIFIED  

---

## 🎯 Quick Reference

| Metric | Value |
|--------|-------|
| **Critical Blockers** | 3 items |
| **High Priority** | 5 items |
| **Total Effort** | 19 days (full scope) |
| **Minimum to Production** | 8 days (blockers only) |
| **Recommended Path** | 20 days (blockers + high priority) |

---

## 🔴 CRITICAL BLOCKERS (Day 1-8)

### BLOCKER-1: Component Library Not Used
**Status:** ❌ NOT STARTED  
**Priority:** 🔴 CRITICAL  
**Effort:** 3-5 days  
**Owner:** [ASSIGN]  
**Due Date:** [DAY 8]

#### Problem Statement
- Shared components (button, card, input, modal) created but never imported
- All 5 tools recreate UI elements inline
- ~600 lines of duplicate code
- Zero component reusability

#### Evidence
```bash
$ grep -r "import.*createButton" tools/
# Result: 0 matches ❌
```

#### Acceptance Criteria
- [ ] All tools import from `shared/components/`
- [ ] Remove inline button/card creation
- [ ] UI consistency across all tools
- [ ] Zero duplicate component code
- [ ] Documentation updated with examples

#### Implementation Plan

**Step 1: Refactor JSON Schema Tool (Day 1)**
```javascript
// Before (json-schema.js)
const validateBtn = document.getElementById('validate-btn');

// After
import { createButton } from '../../shared/components/button.js';
const validateBtn = createButton({
  label: 'Validate',
  variant: 'primary',
  icon: '✓',
  onClick: handleValidate
});
container.appendChild(validateBtn);
```

**Files to modify:**
- `tools/json-schema/json-schema.js` (12 button instances)
- `tools/json-schema/index.html` (remove hardcoded buttons)

**Step 2: Refactor SIP Calculator (Day 2)**
- `tools/sip-calculator/sip-calculator.js`
- ~15 button instances
- 6 card instances for results display

**Step 3: Refactor EMI Calculator (Day 3-4)**
- `tools/emi-calculator/emi-calculator.js` (761 lines)
- Largest refactor - 20+ buttons
- Complex card layout for amortization table
- Modal for prepayment form

**Step 4: Refactor HTML/Markdown (Day 5)**
- `tools/html-markdown/html-markdown.js`
- 10 toolbar buttons
- Settings panel using card component

**Step 5: Refactor Text Diff (Day 5)**
- `tools/text-diff/text-diff.js`
- 8 buttons
- Result cards

**Step 6: Refactor Home Page (Day 6)**
- `home/home.js`
- Tool cards currently inline HTML
- Should use createCard() for all 6 tools

**Step 7: Testing (Day 7-8)**
- [ ] Visual regression testing
- [ ] Interaction testing for all buttons
- [ ] Theme consistency check
- [ ] Accessibility audit

#### Testing Checklist
```bash
# Test component imports
$ grep -r "from.*components" tools/ | wc -l
# Expected: 20+ matches ✅

# Test inline HTML removal
$ grep -r "createElement('button')" tools/ | wc -l  
# Expected: 0 matches ✅

# Test UI consistency
npm run visual-test  # Compare before/after screenshots
```

#### Rollback Plan
- Keep backup of original files
- Test on staging environment first
- Gradual rollout (1 tool per day)

---

### BLOCKER-2: CSP Headers Unsafe
**Status:** ❌ NOT STARTED  
**Priority:** 🔴 CRITICAL  
**Effort:** 2 days  
**Owner:** [ASSIGN]  
**Due Date:** [DAY 2]

#### Problem Statement
Current CSP allows `unsafe-inline` scripts, defeating security purpose.

```toml
# wrangler.toml - CURRENT (UNSAFE)
Content-Security-Policy = "script-src 'unsafe-inline';"
```

#### Acceptance Criteria
- [ ] Remove `unsafe-inline` from CSP
- [ ] No inline `<script>` tags
- [ ] No onclick/onload handlers
- [ ] All scripts in external files
- [ ] CSP passes browser audit

#### Implementation Plan

**Step 1: Audit Inline Scripts (Day 1 Morning)**
```bash
# Find all inline scripts
$ grep -r "<script>" --include="*.html" .
$ grep -r "onclick=" --include="*.html" .
$ grep -r "onload=" --include="*.html" .
```

**Step 2: Remove Inline Event Handlers (Day 1 Afternoon)**

**Before:**
```html
<button onclick="handleClick()">Click Me</button>
```

**After:**
```html
<button id="my-button">Click Me</button>
<script src="my-tool.js"></script>
```

```javascript
// my-tool.js
document.getElementById('my-button').addEventListener('click', handleClick);
```

**Files to modify:**
- [ ] `tools/json-schema/index.html`
- [ ] `tools/sip-calculator/index.html`
- [ ] `tools/emi-calculator/index.html`
- [ ] `tools/html-markdown/index.html`
- [ ] `tools/text-diff/index.html`
- [ ] `index.html`

**Step 3: Move Inline Scripts to External Files (Day 1)**

Check for any `<script>` tags with code inside HTML files. Move to corresponding `.js` files.

**Step 4: Update CSP Headers (Day 2 Morning)**

```toml
# wrangler.toml - NEW (SECURE)
[[headers]]
for = "/*"
  [headers.values]
  Content-Security-Policy = "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; connect-src 'self' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self';"
  X-Content-Type-Options = "nosniff"
  X-Frame-Options = "DENY"
  Referrer-Policy = "strict-origin-when-cross-origin"
  Permissions-Policy = "geolocation=(), microphone=(), camera=()"
```

**Note:** Keep `'unsafe-inline'` for `style-src` to allow CSS custom properties.

**Step 5: Test CSP (Day 2 Afternoon)**
```bash
# Deploy to staging
$ wrangler pages deploy --branch=staging

# Test CSP in browser
1. Open Chrome DevTools → Security tab
2. Check CSP violations (should be 0)
3. Test all tool interactions
4. Verify external libraries still load
```

#### CSP Testing Checklist
- [ ] No console CSP errors
- [ ] All buttons work (no onclick handlers)
- [ ] External libraries load (Chart.js, DOMPurify)
- [ ] Theme toggle works
- [ ] Copy/download functions work
- [ ] Browser CSP audit passes

---

### BLOCKER-3: External Libraries on CDN
**Status:** ❌ NOT STARTED  
**Priority:** 🔴 CRITICAL  
**Effort:** 1 day  
**Owner:** [ASSIGN]  
**Due Date:** [DAY 3]

#### Problem Statement
All 5 libraries loaded from CDN instead of local `/lib/` folder as specified in architecture.

**Impact:** CDN failure = broken tools

#### Acceptance Criteria
- [ ] All 5 libraries in `/lib/` folder
- [ ] Tools reference local paths
- [ ] SRI hashes added for integrity
- [ ] Bundle size validated <150KB
- [ ] Offline functionality tested

#### Implementation Plan

**Step 1: Download Libraries (Day 1 Morning)**
```bash
# Create lib directory
mkdir -p lib

# Download libraries with version pinning
cd lib

# Chart.js (50KB minified)
curl -o chart.min.js https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js

# DOMPurify (19KB)
curl -o dompurify.min.js https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js

# jsdiff (11KB)
curl -o jsdiff.min.js https://cdn.jsdelivr.net/npm/diff@5.1.0/dist/diff.min.js

# Marked (12KB)
curl -o marked.min.js https://cdn.jsdelivr.net/npm/marked@9.1.6/marked.min.js

# Turndown (9KB)
curl -o turndown.min.js https://cdn.jsdelivr.net/npm/turndown@7.1.2/dist/turndown.min.js

# Verify total size
du -sh lib/
# Expected: ~100KB ✅
```

**Step 2: Generate SRI Hashes (Day 1 Morning)**
```bash
# Generate integrity hashes
for file in lib/*.js; do
  echo "$file:"
  shasum -b -a 384 "$file" | awk '{ print $1 }' | xxd -r -p | base64
done

# Save hashes to docs/SRI_HASHES.md
```

**Step 3: Update Tool References (Day 1 Afternoon)**

**EMI Calculator (emi-calculator.js:L326):**
```javascript
// Before
const CHART_CDN = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';

// After
const CHART_PATH = '/lib/chart.min.js';

// Update loadLibrary calls
await loadLibrary('chart', CHART_PATH);
```

**HTML/Markdown Converter (html-markdown.js:L11-14):**
```javascript
// Before
const TURNDOWN_CDN = 'https://cdn.jsdelivr.net/npm/turndown@7.1.2/dist/turndown.min.js';
const MARKED_CDN = 'https://cdn.jsdelivr.net/npm/marked@9.1.6/marked.min.js';
const DOMPURIFY_CDN = 'https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js';

// After
const TURNDOWN_PATH = '/lib/turndown.min.js';
const MARKED_PATH = '/lib/marked.min.js';
const DOMPURIFY_PATH = '/lib/dompurify.min.js';
```

**Files to modify:**
- [ ] `tools/emi-calculator/emi-calculator.js` (Chart.js)
- [ ] `tools/sip-calculator/sip-calculator.js` (Chart.js)
- [ ] `tools/html-markdown/html-markdown.js` (3 libraries)
- [ ] `tools/text-diff/text-diff.js` (jsdiff)

**Step 4: Add SRI to HTML Script Tags (Day 1 Afternoon)**

For any tools loading libraries via `<script>` tags in HTML:

```html
<!-- Before -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js"></script>

<!-- After -->
<script src="/lib/chart.min.js" 
        integrity="sha384-[HASH_HERE]"
        crossorigin="anonymous"></script>
```

**Step 5: Test Offline Mode (Day 1 Evening)**
```bash
# Serve locally
python3 -m http.server 8080

# Test with network disabled
1. Open Chrome DevTools
2. Network tab → Throttling → Offline
3. Hard refresh (Ctrl+Shift+R)
4. Verify all tools work
```

**Step 6: Validate Bundle Size (Day 1 Evening)**
```bash
# Calculate total bundle size
find . -type f \( -name "*.js" -o -name "*.css" \) \
  ! -path "*/node_modules/*" \
  ! -name "*test*" \
  ! -name "*backup*" \
  -exec du -b {} + | awk '{s+=$1} END {print s/1024 " KB"}'

# Expected: ~130KB ✅ (under 150KB budget)
```

#### Testing Checklist
- [ ] All tools load libraries from /lib/
- [ ] No CDN requests in Network tab
- [ ] Works offline (dev server)
- [ ] SRI hashes validated
- [ ] Total bundle < 150KB
- [ ] Load time unchanged or faster

---

## 🟡 HIGH PRIORITY (Day 9-19)

### HIGH-1: Implement Error Boundaries
**Status:** ❌ NOT STARTED  
**Priority:** 🟡 HIGH  
**Effort:** 2 days  
**Owner:** [ASSIGN]  

#### Quick Implementation
Create `shared/js/tool-container.js`:

```javascript
export class ToolContainer {
  constructor(toolName, mountPoint, toolFactory) {
    this.toolName = toolName;
    this.errorCount = 0;
    this.MAX_ERRORS = 3;
  }
  
  async mount() {
    try {
      this.toolInstance = await this.toolFactory();
      this.setupErrorHandler();
    } catch (error) {
      this.handleMountError(error);
    }
  }
  
  setupErrorHandler() {
    window.addEventListener('error', (event) => {
      if (this.isToolError(event)) {
        event.preventDefault();
        this.handleRuntimeError(event.error);
      }
    });
  }
  
  handleRuntimeError(error) {
    this.errorCount++;
    if (this.errorCount >= this.MAX_ERRORS) {
      this.enterSafeMode();
    } else {
      this.attemptRecovery();
    }
  }
  
  enterSafeMode() {
    console.warn(`Tool ${this.toolName} entering safe mode`);
    // Disable all interactive elements
    // Show error UI
    // Provide reload option
  }
}
```

**Usage in app.js:**
```javascript
async function loadTool(toolName) {
  const container = new ToolContainer(
    toolName,
    document.getElementById('app'),
    () => import(`/tools/${toolName}/${toolName}.js`)
  );
  await container.mount();
}
```

---

### HIGH-2: State Management Pattern
**Status:** ❌ NOT STARTED  
**Priority:** 🟡 HIGH  
**Effort:** 3 days  
**Owner:** [ASSIGN]  

#### Refactor EMI Calculator to use Reducer Pattern

Create `tools/emi-calculator/state-manager.js`:

```javascript
export class EMIStateManager {
  constructor() {
    this.state = this.getInitialState();
    this.listeners = [];
  }
  
  dispatch(action) {
    const newState = this.reduce(this.state, action);
    if (newState !== this.state) {
      this.state = newState;
      this.notifyListeners(action);
    }
  }
  
  reduce(state, action) {
    switch (action.type) {
      case 'UPDATE_LOAN_AMOUNT':
        return { ...state, loanAmount: action.payload };
      case 'CALCULATE_EMI':
        return { ...state, ...this.calculateEMI(state) };
      case 'ADD_PREPAYMENT':
        return { 
          ...state, 
          prepayments: [...state.prepayments, action.payload] 
        };
      default:
        return state;
    }
  }
  
  calculateEMI(state) {
    // Move calculation logic here
    const { loanAmount, interestRate, tenure } = state;
    // ... calculation
    return { monthlyEMI, totalInterest, totalAmount };
  }
}
```

**Refactor EMI Calculator:**
```javascript
import { EMIStateManager } from './state-manager.js';

class EMICalculator {
  constructor() {
    this.stateManager = new EMIStateManager();
    this.stateManager.subscribe((state) => this.updateUI(state));
  }
  
  calculateEMI() {
    this.stateManager.dispatch({
      type: 'CALCULATE_EMI',
      payload: {
        loanAmount: this.loanAmountInput.value,
        interestRate: this.interestRateInput.value,
        tenure: this.loanTenureInput.value
      }
    });
  }
}
```

---

### HIGH-3: Audit & Sanitize innerHTML
**Status:** ❌ NOT STARTED  
**Priority:** 🟡 HIGH  
**Effort:** 2 days  
**Owner:** [ASSIGN]  

#### Action Items
1. Audit all 35 innerHTML usages
2. Categorize: Safe (icons) vs Risky (user content)
3. Sanitize risky usages with DOMPurify
4. Use textContent for plain text

**Script to find all innerHTML:**
```bash
grep -rn "innerHTML" --include="*.js" shared/ tools/ home/ > innerHTML-audit.txt
```

**Fix pattern:**
```javascript
// Before (UNSAFE)
container.innerHTML = userInput;

// After (SAFE - user content)
container.innerHTML = DOMPurify.sanitize(userInput);

// After (SAFE - plain text)
container.textContent = userInput;

// After (SAFE - static icon)
iconElement.innerHTML = '💾';  // OK for static content
```

---

### HIGH-4: Add Component Cleanup
**Status:** ❌ NOT STARTED  
**Priority:** 🟡 HIGH  
**Effort:** 2 days  
**Owner:** [ASSIGN]  

#### Add destroy() methods to all components

**Pattern for button.js:**
```javascript
export function createButton(options) {
  const button = document.createElement('button');
  const listeners = [];
  
  function trackListener(target, event, handler) {
    target.addEventListener(event, handler);
    listeners.push({ target, event, handler });
  }
  
  trackListener(button, 'click', options.onClick);
  
  button.destroy = () => {
    listeners.forEach(({ target, event, handler }) => {
      target.removeEventListener(event, handler);
    });
    button.remove();
  };
  
  return button;
}
```

**Apply to:**
- [ ] button.js
- [ ] card.js
- [ ] input.js
- [ ] modal.js

---

### HIGH-5: Storage Schema Versioning
**Status:** ❌ NOT STARTED  
**Priority:** 🟡 MEDIUM  
**Effort:** 2 days  
**Owner:** [ASSIGN]  

#### Implement Migration System

Create `shared/js/storage-schema.js`:

```javascript
const CURRENT_VERSION = 1;

const MIGRATIONS = {
  0: (data) => {
    // v0 → v1: Rename keys
    return {
      ...data,
      theme: data.currentTheme,
      currentTheme: undefined
    };
  }
};

export class StorageSchemaManager {
  init() {
    const version = storage.get('schema_version', 0);
    if (version < CURRENT_VERSION) {
      this.migrate(version, CURRENT_VERSION);
    }
  }
  
  migrate(from, to) {
    for (let v = from; v < to; v++) {
      if (MIGRATIONS[v]) {
        const data = this.getAllData();
        const migrated = MIGRATIONS[v](data);
        this.saveAllData(migrated);
      }
    }
    storage.set('schema_version', to);
  }
}
```

---

## 📊 Progress Tracking

### Daily Standup Template

**Date:** [DATE]  
**Day:** [N] of 20  

**Yesterday:**
- [Task completed]
- [Blocker resolved]

**Today:**
- [ ] [Task 1]
- [ ] [Task 2]

**Blockers:**
- [Any blockers]

**Testing Status:**
- Unit tests: X/Y passing
- Integration tests: X/Y passing
- Manual testing: [Status]

---

### Weekly Milestones

#### Week 1 (Days 1-7)
- [ ] **Day 1-2:** CSP hardening complete
- [ ] **Day 3:** Local libraries integrated
- [ ] **Day 4-7:** Component refactoring (JSON, SIP, HTML/MD)
- [ ] **End of Week:** 3 tools refactored, 0 CSP violations

#### Week 2 (Days 8-14)
- [ ] **Day 8:** EMI calculator refactored
- [ ] **Day 9:** Text diff refactored
- [ ] **Day 10:** Home page refactored
- [ ] **Day 11-12:** Error boundaries implemented
- [ ] **Day 13-14:** State management refactored
- [ ] **End of Week:** All blockers resolved

#### Week 3 (Days 15-20)
- [ ] **Day 15-16:** innerHTML audit & sanitization
- [ ] **Day 17-18:** Component cleanup methods
- [ ] **Day 19:** Storage schema versioning
- [ ] **Day 20:** Final testing & validation
- [ ] **End of Week:** Production ready ✅

---

## ✅ Definition of Done

### Per Blocker
- [ ] Code implementation complete
- [ ] Unit tests passing
- [ ] Manual testing passed
- [ ] Code review approved
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] Sign-off from reviewer

### Overall Project
- [ ] All 3 blockers resolved
- [ ] All 5 high-priority items complete
- [ ] Security audit passed (CSP, XSS, SRI)
- [ ] Performance tests passing (all <target)
- [ ] Bundle size <150KB
- [ ] Test coverage >90%
- [ ] Documentation complete
- [ ] Production deployment successful

---

## 🚨 Risk Mitigation

### Risk: Refactoring breaks existing functionality
**Mitigation:**
- One tool at a time refactoring
- Extensive testing after each tool
- Keep backups of original code
- Gradual rollout strategy

### Risk: Timeline slips
**Mitigation:**
- Focus on 3 blockers first (8 days minimum)
- High-priority items can be post-launch
- Daily progress tracking
- Clear blocker escalation path

### Risk: CSS conflicts after component refactoring
**Mitigation:**
- Visual regression testing
- Screenshot comparison (before/after)
- Theme consistency audit
- Manual testing on all devices

---

## 📞 Support & Resources

### Documentation
- **Architecture Spec:** `docs/ARCHITECTURE.md`
- **Full Review:** `docs/FINAL_ARCHITECTURE_REVIEW.md`
- **Component Docs:** `docs/INFRASTRUCTURE_COMPLETE.md`

### Testing
- **Manual Tests:** `docs/MANUAL_TESTING_GUIDE.md`
- **Automated Tests:** `tools/*/automated-tests.html`

### Code Examples
- **Component Usage:** `shared/components/*.js`
- **Router Pattern:** `shared/js/router.js`
- **State Management:** Architecture doc Section 5.4

---

## 📝 Daily Checklist Template

```markdown
## Day [N] - [DATE]

### Morning
- [ ] Review yesterday's code
- [ ] Pull latest from main
- [ ] Plan today's work (max 3 tasks)

### Implementation
- [ ] Task 1: [BLOCKER-X]
- [ ] Task 2: [TEST-Y]
- [ ] Task 3: [DOC-Z]

### Testing
- [ ] Unit tests passing
- [ ] Manual testing completed
- [ ] Visual regression check

### Evening
- [ ] Push code to branch
- [ ] Update progress tracker
- [ ] Brief team on status
- [ ] Identify tomorrow's blockers

### Notes
- Key decisions:
- Blockers encountered:
- Questions for team:
```

---

## 🎯 Success Criteria

### Minimum (8 Days)
✅ **Production-ready with technical debt**
- 3 blockers resolved
- Security hardened
- Basic functionality preserved

### Recommended (20 Days)
✅ **Production-ready with clean architecture**
- All blockers + high-priority resolved
- Architecture compliant
- Low technical debt

### Ideal (90 Days)
✅ **Gold standard implementation**
- Zero technical debt
- Automated testing
- PWA support
- Full monitoring

---

**Start Date:** [TO BE DETERMINED]  
**Target Production Date:** [START + 8-20 DAYS]  
**Review Cadence:** Daily standups, weekly milestones  
**Success Metric:** Grade A (90+) architecture compliance
