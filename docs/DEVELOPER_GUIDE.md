# Developer Guide - DevToolbox Platform

**Version:** 1.0  
**Last Updated:** March 19, 2026  
**Audience:** Developers contributing to the DevToolbox platform

---

## 1. Development Environment Setup

### 1.1 Prerequisites

**Required:**
- Modern web browser (Chrome 90+, Edge 90+, Firefox 88+, Safari 14+)
- Local web server (Python, Node.js http-server, or VS Code Live Server)
- Git for version control
- Text editor/IDE (VS Code recommended)

**Optional:**
- Browser DevTools extensions (React DevTools, Vue DevTools not needed - vanilla JS)
- Lighthouse for performance testing
- axe DevTools for accessibility testing

### 1.2 Initial Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/json-schema-converter.git
   cd json-schema-converter
   ```

2. **Start local web server:**
   
   **Option A: Python 3**
   ```bash
   python -m http.server 8000
   ```
   
   **Option B: Node.js http-server**
   ```bash
   npx http-server -p 8000
   ```
   
   **Option C: VS Code Live Server**
   - Install "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"

3. **Open in browser:**
   ```
   http://localhost:8000
   ```

4. **Verify installation:**
   - Home page loads without console errors
   - Theme toggle works
   - Navigation between tools functions

### 1.3 File Structure Overview

```
devtoolbox/
├── index.html                  # Home page (tool selector)
├── shared/                     # Shared resources across all tools
│   ├── css/                   # Global stylesheets
│   │   ├── variables.css     # CSS custom properties
│   │   ├── reset.css         # CSS reset/normalize
│   │   ├── components.css    # Reusable UI components
│   │   ├── themes.css        # Light/dark theme styles
│   │   ├── utilities.css     # Utility classes
│   │   └── responsive.css    # Responsive breakpoints
│   ├── js/                    # Core JavaScript modules
│   │   ├── app.js            # Main application entry point
│   │   ├── router.js         # Client-side routing logic
│   │   ├── theme.js          # Theme management
│   │   ├── storage.js        # localStorage wrapper
│   │   ├── utils.js          # Utility functions
│   │   ├── clipboard.js      # Copy to clipboard
│   │   └── download.js       # File download utility
│   └── components/            # Reusable UI components
│       ├── button.js         # Button component factory
│       ├── input.js          # Input component factory
│       ├── card.js           # Card component factory
│       └── modal.js          # Modal/dialog component
├── tools/                     # Individual tool modules
│   ├── json-schema/          # JSON Schema tool
│   │   ├── index.html
│   │   ├── json-schema.js
│   │   └── json-schema.css
│   └── sip-calculator/       # SIP Calculator tool
│       ├── index.html
│       ├── sip-calculator.js
│       └── sip-calculator.css
├── lib/                       # External libraries (CDN fallbacks)
└── assets/                    # Static assets
    ├── icons/
    └── images/
```

---

## 2. Architecture Overview

### 2.1 Client-Side Architecture

**Design Philosophy:**
- **Pure client-side processing** - No server-side code, all computation in browser
- **Privacy-first** - User data never leaves the browser
- **Progressive loading** - Lazy load tools on-demand
- **Modular design** - Independent, self-contained tool modules

### 2.2 Routing System (Hash-Based)

The platform uses hash-based routing for client-side navigation without server requests.

**URL Pattern:**
```
https://devtoolbox.com/           → Home page
https://devtoolbox.com/#/json-schema     → JSON Schema tool
https://devtoolbox.com/#/sip-calculator  → SIP Calculator tool
```

**Router Implementation:**
```javascript
// shared/js/router.js
class Router {
  constructor() {
    this.routes = new Map();
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }
  
  register(path, handler) {
    this.routes.set(path, handler);
  }
  
  navigate(path) {
    window.location.hash = `#${path}`;
  }
}
```

### 2.3 Component Patterns

**Factory Functions (Recommended for simple components):**
```javascript
// shared/components/button.js
export function createButton(options) {
  const { label, variant = 'primary', onClick } = options;
  const button = document.createElement('button');
  button.className = `btn btn-${variant}`;
  button.textContent = label;
  button.addEventListener('click', onClick);
  return button;
}
```

**Web Components (For complex, stateful components):**
```javascript
// For complex tools with lifecycle management
class MyToolComponent extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  
  disconnectedCallback() {
    this.cleanup();
  }
}
```

### 2.4 State Management

**Simple Tools (1-3 state fields):**
- Direct DOM manipulation
- Event handlers update UI

**Medium Tools (4-5 state fields):**
- Simple pub/sub pattern
- Central state object

**Complex Tools (>5 state fields):**
- State reducer pattern (see Architecture.md Section 5.4)
- Immutable state updates
- Derived state calculations

### 2.5 Theme System

Dark theme is default. Theme preference stored in localStorage.

```javascript
// shared/js/theme.js
const ThemeManager = {
  init() {
    const savedTheme = storage.get('devtoolbox_theme', 'dark');
    this.setTheme(savedTheme);
  },
  
  toggle() {
    const current = this.getCurrentTheme();
    this.setTheme(current === 'dark' ? 'light' : 'dark');
  }
};
```

---

## 3. Coding Standards

### 3.1 JavaScript Style Guide

**General Rules:**
- Use ES6+ syntax (const/let, arrow functions, destructuring)
- Prefer async/await over promises
- Use template literals for string concatenation
- Always use semicolons
- Use 2-space indentation

**Naming Conventions:**
```javascript
// Variables and functions: camelCase
const userName = 'John';
function calculateTotal() {}

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const STORAGE_KEY = 'devtoolbox_data';

// Classes: PascalCase
class UserManager {}
class RouterService {}

// Private methods: underscore prefix
_validateInput() {}
```

**Function Documentation:**
```javascript
/**
 * Calculate SIP returns based on investment parameters
 * @param {number} monthlyInvestment - Monthly SIP amount in INR
 * @param {number} annualReturn - Expected annual return rate (percentage)
 * @param {number} years - Investment period in years
 * @returns {Object} Calculated returns with invested, returns, and total
 */
function calculateSIP(monthlyInvestment, annualReturn, years) {
  // Implementation
}
```

### 3.2 CSS Organization (BEM-like)

**Component Structure:**
```css
/* Block */
.card {}

/* Element */
.card__title {}
.card__content {}

/* Modifier */
.card--highlighted {}
.card--compact {}
```

**Example:**
```html
<div class="card card--highlighted">
  <h3 class="card__title">Tool Name</h3>
  <p class="card__content">Description</p>
</div>
```

### 3.3 File Organization

**Tool Module Structure:**
```
tools/my-tool/
├── index.html           # Tool page (loads tool-specific resources)
├── my-tool.js           # Tool logic and functionality
├── my-tool.css          # Tool-specific styles
└── helpers.js           # Optional: tool-specific helpers
```

**Shared Module Structure:**
```
shared/
├── js/
│   └── module-name.js   # Export functions/classes
├── css/
│   └── module-name.css  # Scoped styles
└── components/
    └── component.js     # Component factory or Web Component
```

### 3.4 Code Documentation Standards

**File Headers:**
```javascript
/**
 * Router Module
 * Handles client-side hash-based routing for tool navigation
 * 
 * @module shared/js/router
 * @requires shared/js/utils
 */
```

**Complex Logic Comments:**
```javascript
// Calculate monthly interest rate from annual percentage
// Formula: monthly = (annual / 100) / 12
const monthlyRate = annualRate / 100 / 12;
```

**Avoid Obvious Comments:**
```javascript
// BAD: Set theme to dark
setTheme('dark');

// GOOD: Restore user's theme preference or default to dark
setTheme(storedTheme || 'dark');
```

---

## 4. Component Development

### 4.1 Creating New Components

**Step 1: Create component file**
```bash
touch shared/components/my-component.js
```

**Step 2: Implement factory function**
```javascript
// shared/components/my-component.js

/**
 * Create a custom component
 * @param {Object} options - Component configuration
 * @returns {HTMLElement} Component DOM element
 */
export function createMyComponent(options) {
  const { title, content, onAction } = options;
  
  // Create container
  const component = document.createElement('div');
  component.className = 'my-component';
  
  // Build structure
  const titleEl = document.createElement('h3');
  titleEl.textContent = title;
  
  const contentEl = document.createElement('p');
  contentEl.textContent = content;
  
  component.appendChild(titleEl);
  component.appendChild(contentEl);
  
  // Attach events
  if (onAction) {
    component.addEventListener('click', onAction);
  }
  
  return component;
}
```

**Step 3: Add component styles**
```css
/* shared/css/components.css */

.my-component {
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}

.my-component h3 {
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}
```

**Step 4: Use component**
```javascript
import { createMyComponent } from './shared/components/my-component.js';

const component = createMyComponent({
  title: 'Hello World',
  content: 'This is my component',
  onAction: () => console.log('Clicked!')
});

document.getElementById('container').appendChild(component);
```

### 4.2 Component Lifecycle and Cleanup

**For components with event listeners or timers:**
```javascript
export function createComponent(options) {
  const component = document.createElement('div');
  const listeners = [];
  
  // Add event listener with cleanup tracking
  function addListener(element, event, handler) {
    element.addEventListener(event, handler);
    listeners.push({ element, event, handler });
  }
  
  // Component-specific listeners
  addListener(button, 'click', handleClick);
  
  // Cleanup function
  component.cleanup = () => {
    listeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
  };
  
  return component;
}
```

### 4.3 Shared Component Usage

**Available Components:**
- `createButton()` - Button with variants (primary, secondary, ghost, danger)
- `createInput()` - Input field with validation
- `createCard()` - Content card with title and actions
- `createModal()` - Modal dialog with focus trap

**Example:**
```javascript
import { createButton } from './shared/components/button.js';

const saveButton = createButton({
  label: 'Save',
  variant: 'primary',
  size: 'medium',
  onClick: handleSave
});
```

---

## 5. Tool Development

### 5.1 How to Create a New Tool

**Step 1: Create tool directory**
```bash
mkdir -p tools/my-tool
cd tools/my-tool
```

**Step 2: Create tool files**
```bash
touch index.html my-tool.js my-tool.css
```

**Step 3: Implement index.html**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Tool - DevToolbox</title>
  
  <!-- Shared styles -->
  <link rel="stylesheet" href="/shared/css/variables.css">
  <link rel="stylesheet" href="/shared/css/reset.css">
  <link rel="stylesheet" href="/shared/css/components.css">
  <link rel="stylesheet" href="/shared/css/themes.css">
  
  <!-- Tool-specific styles -->
  <link rel="stylesheet" href="my-tool.css">
</head>
<body>
  <div id="app">
    <!-- Tool UI goes here -->
  </div>
  
  <!-- Shared scripts -->
  <script type="module" src="/shared/js/theme.js"></script>
  <script type="module" src="/shared/js/storage.js"></script>
  <script type="module" src="/shared/js/utils.js"></script>
  
  <!-- Tool script -->
  <script type="module" src="my-tool.js"></script>
</body>
</html>
```

**Step 4: Implement tool logic (my-tool.js)**
```javascript
/**
 * My Tool - Tool description
 */

import { storage } from '/shared/js/storage.js';
import { createButton } from '/shared/components/button.js';

class MyTool {
  constructor() {
    this.container = document.getElementById('app');
    this.state = this.getInitialState();
    this.init();
  }
  
  getInitialState() {
    return {
      // Tool state
    };
  }
  
  init() {
    this.render();
    this.attachEventListeners();
    this.loadSavedState();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="tool-container">
        <h1>My Tool</h1>
        <!-- Tool UI -->
      </div>
    `;
  }
  
  attachEventListeners() {
    // Event handlers
  }
  
  loadSavedState() {
    const saved = storage.get('my_tool_state');
    if (saved) {
      this.state = saved;
      this.updateUI();
    }
  }
  
  saveState() {
    storage.set('my_tool_state', this.state);
  }
}

// Initialize tool when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new MyTool();
});
```

**Step 5: Add tool-specific styles (my-tool.css)**
```css
.tool-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}
```

**Step 6: Register tool route**
```javascript
// In shared/js/app.js
router.register('/my-tool', () => lazyLoadTool('my-tool'));
```

**Step 7: Add tool to home page**
Update `index.html` to include tool card.

### 5.2 Tool State Management Patterns

**Pattern Selection:**
```
Tool Complexity:
├─ Simple (JSON Schema) → Direct setState
├─ Medium (SIP Calc) → Pub/sub pattern
└─ Complex (EMI Calc) → Reducer pattern
```

**Simple Pattern:**
```javascript
handleInput(event) {
  this.state.value = event.target.value;
  this.updateUI();
  this.saveState();
}
```

**Reducer Pattern (Complex Tools):**
See [Architecture.md Section 5.4](../ARCHITECTURE.md) for full implementation.

### 5.3 Lazy Loading Integration

Tools are lazy-loaded to improve initial page load time.

**Lazy load function:**
```javascript
async function lazyLoadTool(toolName) {
  if (!window.loadedTools.has(toolName)) {
    await loadScript(`/tools/${toolName}/${toolName}.js`);
    await loadStylesheet(`/tools/${toolName}/${toolName}.css`);
    window.loadedTools.add(toolName);
  }
  window[`init${capitalize(toolName)}`]();
}
```

---

## 6. Testing Procedures

### 6.1 Manual Testing Checklist

**Functional Testing:**
- [ ] All tool features work as specified
- [ ] Input validation prevents invalid data
- [ ] Error messages are clear and helpful
- [ ] Results are accurate and formatted correctly
- [ ] State persists across page refreshes (if applicable)

**UI/UX Testing:**
- [ ] Layout is responsive (mobile, tablet, desktop)
- [ ] Theme toggle works (dark/light)
- [ ] All interactive elements have hover states
- [ ] Loading states display during async operations
- [ ] Success/error messages are visible

**Cross-Browser Testing:**
- [ ] Chrome (latest)
- [ ] Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest, if on macOS)

### 6.2 Performance Validation

**Key Metrics:**
- Initial load: < 2 seconds
- Tool switch: < 500ms
- Calculation: < 200ms
- Bundle size: < 150KB initial

**Tools:**
- Lighthouse (Chrome DevTools)
- Network tab for bundle size
- Performance tab for timing

### 6.3 Accessibility Testing

**Keyboard Navigation:**
- [ ] Tab through all interactive elements
- [ ] Enter/Space activate buttons
- [ ] Escape closes modals
- [ ] Arrow keys work in appropriate contexts

**Screen Reader:**
- [ ] ARIA labels on form inputs
- [ ] Button labels are descriptive
- [ ] Error messages announced
- [ ] Headings structure is logical

**Color Contrast:**
- [ ] Text meets WCAG AA (4.5:1 for normal text)
- [ ] Interactive elements have focus indicators

**Tools:**
- axe DevTools (browser extension)
- Lighthouse accessibility audit
- NVDA or JAWS screen reader

### 6.4 Browser Testing Matrix

| Browser | Version | Platform | Status |
|---------|---------|----------|--------|
| Chrome | Latest | Windows/Mac | ✅ Required |
| Edge | Latest | Windows | ✅ Required |
| Firefox | Latest | Windows/Mac | ⚠️ Nice to have |
| Safari | Latest | macOS | ⚠️ Nice to have |

---

## 7. Git Workflow

### 7.1 Branch Naming Conventions

```
feature/<tool-name>-<description>
fix/<issue-description>
hotfix/<critical-fix>
docs/<documentation-update>
```

**Examples:**
```
feature/sip-calculator-implementation
fix/json-schema-validation-error
hotfix/theme-toggle-crash
docs/update-developer-guide
```

### 7.2 Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(sip-calculator): add projection chart visualization

Implement Chart.js integration to display SIP growth over time.
Includes line chart with invested amount and returns.

Closes #42
```

```
fix(json-schema): handle empty input validation

Prevent JavaScript error when validating empty JSON input.
Show user-friendly error message instead.

Fixes #67
```

### 7.3 Pull Request Process

1. **Create feature branch:**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Commit changes:**
   ```bash
   git add .
   git commit -m "feat(tool): implement feature"
   ```

3. **Push to remote:**
   ```bash
   git push origin feature/my-feature
   ```

4. **Create pull request:**
   - Descriptive title
   - Link to related issue/feature spec
   - Screenshots for UI changes
   - Testing evidence

5. **Code review:**
   - Address reviewer feedback
   - Update PR with changes
   - Re-request review

6. **Merge:**
   - Squash and merge (keep history clean)
   - Delete feature branch after merge

### 7.4 Code Review Checklist

**Reviewer Responsibilities:**
- [ ] Code follows architecture patterns
- [ ] Shared components reused where possible
- [ ] Error handling is comprehensive
- [ ] Performance considerations addressed
- [ ] Accessibility requirements met
- [ ] Documentation/comments are clear
- [ ] No console errors or warnings
- [ ] Tests pass (if applicable)

---

## 8. Common Tasks

### 8.1 Adding a New Tool to Platform

**Full Process:**

1. **Create specification** (docs/features/)
2. **Create tool directory** (tools/my-tool/)
3. **Implement tool files** (index.html, .js, .css)
4. **Register route** (shared/js/app.js)
5. **Add to home page** (index.html)
6. **Test thoroughly**
7. **Create pull request**
8. **Deploy**

**Time Estimate:** 3-6 days depending on complexity

### 8.2 Updating Shared Components

**When to update:**
- Bug fixes affecting all tools
- New variant or feature needed across tools
- Performance optimizations

**Process:**
1. Update component file (shared/components/)
2. Update component styles (shared/css/components.css)
3. Test in all tools using the component
4. Update documentation
5. Create PR with testing evidence

### 8.3 Theme Customization

**Adding a new color:**
```css
/* shared/css/variables.css */
:root {
  --color-my-new-color: #ff6b6b;
}

[data-theme="light"] {
  --color-my-new-color: #ee5555;
}
```

**Using the color:**
```css
.my-element {
  color: var(--color-my-new-color);
}
```

### 8.4 Performance Optimization

**Bundle Size:**
- Use lazy loading for large libraries
- Minify CSS/JS in production
- Use CDN for external libraries with local fallback

**Runtime Performance:**
- Debounce expensive calculations
- Use requestAnimationFrame for animations
- Virtualize large lists (>1000 items)

**Caching:**
- Set appropriate cache headers
- Use service worker for offline support (future)

---

## 9. Troubleshooting Guide

### 9.1 Common Issues

**Issue: Tool not loading**
- Check browser console for errors
- Verify file paths are correct
- Ensure tool is registered in router

**Issue: Theme toggle not working**
- Check localStorage is enabled
- Verify ThemeManager is initialized
- Check CSS variables are defined

**Issue: State not persisting**
- Verify localStorage quota not exceeded
- Check storage key is correct
- Ensure saveState() is called

**Issue: Route not found (404)**
- Check route is registered in router
- Verify hash format (#/tool-name)
- Ensure handler function is defined

### 9.2 Debugging Tips

**Browser DevTools:**
- Console: Check for JavaScript errors
- Network: Verify resources load correctly
- Application: Inspect localStorage
- Performance: Profile expensive operations

**Logging:**
```javascript
// Add debug logging
console.log('[MyTool] State:', this.state);
console.log('[MyTool] Input:', inputValue);
```

**Breakpoints:**
- Set breakpoints in DevTools Sources tab
- Step through code execution
- Inspect variable values

### 9.3 Getting Help

**Resources:**
- Architecture documentation: `docs/ARCHITECTURE.md`
- Feature specifications: `docs/features/`
- Solution architect review: `docs/SOLUTION_ARCHITECT_REVIEW.md`

**Escalation:**
- Technical lead for architecture questions
- Product owner for feature clarifications
- Test specialist for testing guidance

---

## 10. Release Process

### 10.1 Development Workflow

```
Development → Testing → Staging → Production
```

**Development:**
- Local development and testing
- Feature branches
- Pull requests

**Testing:**
- Manual functional testing
- Accessibility testing
- Performance validation
- Browser compatibility

**Staging:**
- Deploy to Cloudflare Pages preview
- Final validation
- Product owner approval

**Production:**
- Merge to main branch
- Automatic deployment via Cloudflare Pages
- Post-deployment smoke testing

### 10.2 Deployment Checklist

- [ ] All tests passing
- [ ] No console errors
- [ ] Performance metrics met
- [ ] Accessibility validated
- [ ] Cross-browser tested
- [ ] Documentation updated
- [ ] Product owner approval

---

## 11. Best Practices

### 11.1 Code Quality

**Write Clean Code:**
- Single Responsibility Principle
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple, Stupid)
- Meaningful variable/function names

**Error Handling:**
```javascript
// Always handle errors gracefully
try {
  const result = await performOperation();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  showErrorToast('Operation failed. Please try again.');
  return null;
}
```

**Validation:**
```javascript
// Validate inputs before processing
function calculateSIP(monthly, rate, years) {
  if (!monthly || monthly <= 0) {
    throw new Error('Monthly investment must be positive');
  }
  if (!rate || rate < 0) {
    throw new Error('Interest rate must be non-negative');
  }
  if (!years || years <= 0) {
    throw new Error('Investment period must be positive');
  }
  
  // Proceed with calculation
}
```

### 11.2 Performance

**Debounce User Input:**
```javascript
import { debounce } from '/shared/js/utils.js';

const handleInput = debounce((value) => {
  performExpensiveOperation(value);
}, 300);
```

**Lazy Load Large Libraries:**
```javascript
// Only load when needed
if (!window.Chart) {
  await loadScript('/lib/chart.min.js');
}
```

### 11.3 Accessibility

**Always Include ARIA Labels:**
```html
<button aria-label="Close modal">×</button>
<input aria-label="Monthly investment amount" type="number">
```

**Keyboard Navigation:**
```javascript
// Handle keyboard events
element.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});
```

**Focus Management:**
```javascript
// Trap focus in modal
modal.querySelector('button').focus();
```

---

## 12. FAQ

**Q: Can I use React/Vue/Angular?**
A: No. This project uses vanilla JavaScript for simplicity and minimal bundle size. Framework overhead is not justified for our use cases.

**Q: Should I use TypeScript?**
A: Not required. JSDoc comments provide type hints without build step complexity.

**Q: How do I add external libraries?**
A: Use CDN with local fallback in /lib/. Lazy load when tool is accessed.

**Q: What about unit tests?**
A: Manual testing is sufficient for MVP. Automated testing may be added in future phases.

**Q: How do I handle large datasets?**
A: Use virtualization (see Architecture.md Section 9.4) or pagination for >1000 items.

**Q: Can tools communicate with each other?**
A: No direct communication. Tools are isolated modules. Use URL parameters for data passing if needed.

---

## 13. Additional Resources

**Documentation:**
- [Architecture Design Document](ARCHITECTURE.md)
- [Product Roadmap](product/roadmap.md)
- [Architecture Reviews](architecture/reviews/)
- [Feature Specifications](features/)
- [Security Policy](security/security-policy.md)

**External Resources:**
- [MDN Web Docs](https://developer.mozilla.org/)
- [Web.dev](https://web.dev/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)

**Tools:**
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [BundlePhobia](https://bundlephobia.com/)

---

## Changelog

**v1.0 - March 19, 2026**
- Initial developer guide created
- Core development workflows documented
- Testing procedures established
- Architecture patterns explained

---

**Need Help?** Contact the Technical Lead or Product Owner with questions.

**Happy Coding! 🚀**
