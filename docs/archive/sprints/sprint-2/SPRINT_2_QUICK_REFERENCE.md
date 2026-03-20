# Sprint 2 Quick Reference Card
**Keep this open while implementing** 📌

---

## 🎯 Daily Goals

| Day | Goal | Hours | Key Deliverable |
|-----|------|-------|-----------------|
| **Day 3** (Mar 20) | CSP Hardening | 8h | Zero inline code, strict CSP |
| **Day 4** (Mar 21) | Components & Errors | 8h | 80%+ components, error boundaries |
| **Day 5** (Mar 22) | Security & Perf | 10h | Zero XSS, performance monitoring |

---

## 📁 Files You'll Create

```
✨ NEW FILES (5 total):

shared/css/
  └── tool-styles.css                    # Day 3 - Extracted inline styles

shared/js/
  ├── error-boundary.js                  # Day 4 - Error handling system
  └── state-manager.js                   # Day 5 - Unified state API

/
  ├── performance-budget.json            # Day 5 - Bundle size limits
  └── tools/check-bundle-size.js         # Day 5 - Monitoring script
```

---

## 🔧 Key Commands

```bash
# Find inline styles
grep -rn 'style="' tools/ --include="*.html"

# Find inline event handlers
grep -rn 'on[a-z]*="' tools/ --include="*.html"

# Find innerHTML usage
grep -rn "innerHTML" tools/ --include="*.js"

# Component usage audit
grep -rn "createButton\|createInput" tools/ | wc -l

# Check bundle sizes
npm run check-size

# Run with verbose output
npm run check-size:verbose
```

---

## 🎨 CSS Migration Pattern

```html
<!-- BEFORE -->
<div style="color: red; font-size: 14px;">Error</div>

<!-- AFTER -->
<div class="error-text">Error</div>
```

```css
/* In tool-styles.css */
.error-text {
  color: var(--color-danger, #dc3545);
  font-size: 0.875rem;
}
```

---

## 🎭 Event Handler Pattern

```html
<!-- BEFORE -->
<button onclick="calculate()">Calculate</button>

<!-- AFTER -->
<button id="calculate-btn">Calculate</button>
```

```javascript
// In tool .js file
document.getElementById('calculate-btn')
  .addEventListener('click', calculate);
```

---

## 🧩 Component Usage Pattern

```javascript
// Import
import { createButton } from '/shared/components/button.js';

// Create
const btn = createButton({
  label: 'Calculate',
  variant: 'primary',      // primary, secondary, ghost, danger
  size: 'medium',          // small, medium, large
  icon: '📊',
  onClick: handleCalculate
});

// Append
container.appendChild(btn);
```

**Available Components:**
- `createButton` - button.js
- `createInput` - input.js
- `createCard` - card.js
- `createModal` - modal.js

---

## 🛡️ Error Boundary Pattern

```javascript
// Import
import { ErrorBoundary, setupGlobalErrorHandler } from '/shared/js/error-boundary.js';

// Create
const errorBoundary = new ErrorBoundary('Tool Name');
setupGlobalErrorHandler('Tool Name');

// Wrap functions
const safeCalculate = errorBoundary.wrap(calculate);

// Use
button.addEventListener('click', safeCalculate);
```

---

## 🔒 innerHTML Security Rules

| Scenario | Solution | Example |
|----------|----------|---------|
| **Plain text display** | Use `textContent` | `element.textContent = userInput;` |
| **HTML content (user)** | Use DOMPurify | `element.innerHTML = DOMPurify.sanitize(html);` |
| **Static template** | Safe, add comment | `// SAFE: Static template` |
| **Generated HTML** | Check source safety | Document algorithm |

```javascript
// UNSAFE ❌
element.innerHTML = userInput;

// SAFE ✅ (Option 1: textContent)
element.textContent = userInput;

// SAFE ✅ (Option 2: Sanitize)
import DOMPurify from '/lib/purify.min.js';
element.innerHTML = DOMPurify.sanitize(userInput, {
  ALLOWED_TAGS: ['p', 'strong', 'em'],
  ALLOWED_ATTR: []
});

// SAFE ✅ (Option 3: Static)
// SAFE: Static template, no user input
element.innerHTML = `<div class="header">Title</div>`;
```

---

## 💾 State Manager Pattern

```javascript
// Import
import { appState } from '/shared/js/state-manager.js';

// BEFORE (localStorage)
localStorage.setItem('theme', 'dark');
const theme = localStorage.getItem('theme') || 'light';

// AFTER (State Manager)
appState.set('theme', 'dark');
const theme = appState.get('theme', 'light');

// Subscribe to changes
appState.subscribe('theme', (newTheme) => {
  applyTheme(newTheme);
});
```

---

## ✅ Daily Checklists

### Day 3 EOD
- [ ] `tool-styles.css` created
- [ ] All tools link to new CSS
- [ ] Zero inline `style=` in HTML
- [ ] Zero inline `on*=` handlers
- [ ] CSP meta tags updated (no `unsafe-inline`)
- [ ] Console shows zero CSP violations
- [ ] All tools look identical to Sprint 1

### Day 4 EOD
- [ ] Component adoption ≥80%
- [ ] `error-boundary.js` created
- [ ] All 5 tools have ErrorBoundary
- [ ] Error modal tested and working
- [ ] All functions wrapped correctly

### Day 5 EOD
- [ ] innerHTML audit documented
- [ ] Zero unsafe innerHTML
- [ ] XSS tests pass
- [ ] `performance-budget.json` created
- [ ] `check-bundle-size.js` works
- [ ] `state-manager.js` created
- [ ] 3+ tools use state manager
- [ ] All tests passing

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| CSP violation after migration | Check for missed inline styles/handlers |
| Button not working | Verify event listener registered after DOM load |
| Component not rendering | Check import path: `/shared/components/button.js` |
| Visual looks different | Compare CSS classes to original inline styles |
| Error modal not showing | Ensure function is wrapped: `errorBoundary.wrap()` |
| State not persisting | Check key format: `appState.set('tool.key', value)` |
| Bundle too large | Review largest files with `--verbose` flag |

---

## 📊 Success Metrics

| Metric | Sprint 1 | Sprint 2 Target | How to Check |
|--------|----------|-----------------|--------------|
| CSP Violations | 57 | 0 | DevTools console |
| Inline Styles | 29 | 0 | `grep -rn 'style="' tools/` |
| Inline Handlers | 28 | 0 | `grep -rn 'on[a-z]*="' tools/` |
| Component Adoption | 40% | 80%+ | Run audit script |
| XSS Vulnerabilities | 12 | 0 | Security audit + tests |
| Error Boundaries | 0 | 5 tools | Check imports |
| Security Grade | B+ (85) | A- (90+) | Final assessment |
| Architecture Grade | B+ (84) | A- (90+) | Final assessment |

---

## 🔗 Essential Links

**Documentation:**
- Full Guide: `docs/SPRINT_2_TECHNICAL_IMPLEMENTATION_GUIDE.md`
- CSP Plan: `docs/CSP_MIGRATION_PLAN.md`
- Kickoff Brief: `docs/SPRINT_2_KICKOFF_BRIEF.md`
- Test Checklist: `docs/SPRINT_2_TEST_VALIDATION_CHECKLIST.md`

**Reference Code:**
- Components: `shared/components/*.js`
- Utilities: `shared/css/utilities.css`
- Themes: `shared/css/themes.css`

**Examples:**
- Home page uses components: `index.html`
- Existing error handling: `shared/js/app.js`

---

## 📞 Need Help?

1. ✅ Check this quick reference
2. ✅ Search implementation guide for detailed examples
3. ✅ Look for patterns in existing code (grep is your friend!)
4. ✅ Review component JSDoc comments
5. ✅ Ask Tech Lead if still stuck

---

**Print this or keep it open in a side tab!** 🖨️
