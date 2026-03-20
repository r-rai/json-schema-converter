# Architecture Design Document (ADD)
## Developer Toolset Platform - Technical Architecture

**Version:** 1.0  
**Date:** March 19, 2026  
**Architect:** Product Owner (Initial Design)  
**Status:** Ready for Development

---

## 1. System Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              DevToolbox Web Application                 │ │
│  │                                                          │ │
│  │  ┌──────────────┐  ┌────────────────────────────────┐  │ │
│  │  │  Home Page   │  │   Routing Layer (Hash-based)   │  │ │
│  │  │  (Landing)   │  │   #/json-schema, #/sip, etc.  │  │ │
│  │  └──────────────┘  └────────────────────────────────┘  │ │
│  │                                                          │ │
│  │  ┌────────────────────────────────────────────────────┐ │ │
│  │  │          Shared Component Library                   │ │ │
│  │  │  • Buttons • Inputs • Cards • Theme System         │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │
│  │                                                          │ │
│  │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐    │ │
│  │  │JSON  │  │ SIP  │  │ HTML │  │ Diff │  │ EMI  │    │ │
│  │  │Schema│  │ Calc │  │ ↔ MD │  │Check │  │ Calc │    │ │
│  │  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘    │ │
│  │                Tool Modules (Lazy Loaded)               │ │
│  │                                                          │ │
│  │  ┌────────────────────────────────────────────────────┐ │ │
│  │  │         External Libraries (Lazy Loaded)            │ │ │
│  │  │  Chart.js • jsdiff • Turndown • Marked • DOMPurify │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Cloudflare Edge Network                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Cloudflare Pages (Static Hosting)               │ │
│  │  • CDN Distribution • SSL/TLS • DDoS Protection        │ │
│  │  • Auto-scaling • Global Edge Caching                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Architecture Principles

**Client-Side First:**
- All computation happens in browser
- No server-side processing or APIs
- No user data leaves the browser
- Privacy-focused design

**Progressive Loading:**
- Core HTML/CSS loads immediately
- JavaScript loads progressively
- Tool-specific code lazy-loaded on demand
- Libraries loaded only when tool accessed

**Modular Design:**
- Each tool is self-contained module
- Shared components reused across tools
- Clear separation of concerns
- Independent deployment possible

**Performance Focused:**
- < 2 second initial load time
- < 500ms tool switching
- < 200ms for common operations
- Optimized for repeat visits (caching)

---

## 2. File Structure & Organization

### 2.1 Complete Directory Structure

```
devtoolbox/
├── index.html                          # Home page (tool selector)
├── manifest.json                       # PWA manifest (future)
├── robots.txt                         # SEO configuration
├── sitemap.xml                        # SEO sitemap
│
├── shared/                            # Shared resources across all tools
│   ├── css/
│   │   ├── variables.css             # CSS custom properties
│   │   ├── reset.css                 # CSS reset/normalize
│   │   ├── components.css            # Reusable UI components
│   │   ├── themes.css                # Light/dark theme styles
│   │   ├── utilities.css             # Utility classes
│   │   └── responsive.css            # Responsive breakpoints
│   │
│   ├── js/
│   │   ├── app.js                    # Main application entry point
│   │   ├── router.js                 # Client-side routing logic
│   │   ├── theme.js                  # Theme management
│   │   ├── storage.js                # localStorage wrapper
│   │   ├── utils.js                  # Utility functions
│   │   ├── clipboard.js              # Copy to clipboard
│   │   ├── download.js               # File download utility
│   │   └── validation.js             # Input validation helpers
│   │
│   └── components/
│       ├── button.js                 # Button component
│       ├── input.js                  # Input component
│       ├── card.js                   # Card component
│       ├── modal.js                  # Modal/dialog component
│       ├── header.js                 # Page header component
│       ├── footer.js                 # Page footer component
│       └── breadcrumb.js             # Breadcrumb navigation
│
├── tools/                             # Individual tool modules
│   ├── json-schema/
│   │   ├── index.html                # JSON Schema tool page
│   │   ├── json-schema.js            # Tool logic
│   │   └── json-schema.css           # Tool-specific styles
│   │
│   ├── sip-calculator/
│   │   ├── index.html                # SIP calculator page
│   │   ├── sip-calculator.js         # SIP calculation logic
│   │   ├── sip-calculator.css        # Tool-specific styles
│   │   └── chart-helpers.js          # Chart.js helpers
│   │
│   ├── html-markdown/
│   │   ├── index.html                # HTML/Markdown converter page
│   │   ├── html-markdown.js          # Conversion logic
│   │   └── html-markdown.css         # Tool-specific styles
│   │
│   ├── text-diff/
│   │   ├── index.html                # Text diff checker page
│   │   ├── text-diff.js              # Diff logic
│   │   └── text-diff.css             # Tool-specific styles
│   │
│   └── emi-calculator/
│       ├── index.html                # EMI calculator page
│       ├── emi-calculator.js         # EMI calculation logic
│       ├── prepayment.js             # Prepayment module
│       ├── amortization.js           # Amortization schedule generator
│       ├── emi-calculator.css        # Tool-specific styles
│       └── chart-helpers.js          # Chart.js helpers
│
├── lib/                               # External libraries (lazy loaded)
│   ├── chart.min.js                  # Chart.js (~50KB)
│   ├── jsdiff.min.js                 # jsdiff (~11KB)
│   ├── turndown.min.js               # Turndown.js (~9KB)
│   ├── marked.min.js                 # Marked.js (~12KB)
│   └── dompurify.min.js              # DOMPurify (~19KB)
│
├── assets/                            # Static assets
│   ├── icons/
│   │   ├── favicon.ico
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   └── images/
│       └── og-image.png              # Social media preview image
│
├── docs/                              # Documentation
│   ├── product/
│   │   └── roadmap.md                # Product roadmap ✅
│   ├── product/decisions.md          # Product decisions ✅
│   ├── ARCHITECTURE.md               # This document
│   ├── DEVELOPER_GUIDE.md            # Developer setup instructions
│   ├── QUICK_START.md                # Quick start guide
│   ├── security/
│   │   └── security-policy.md        # Security policy & audit
│   ├── features/                     # Feature specifications ✅
│   │   ├── README.md
│   │   ├── 01-json-schema-enhancement.md
│   │   ├── 02-sip-calculator.md
│   │   ├── 03-html-markdown-converter.md
│   │   ├── 04-text-diff-checker.md
│   │   ├── 05-emi-calculator.md
│   │   └── 06-home-page.md
│   └── testing/                      # Test documentation
│       ├── TEST_STRATEGY.md
│       ├── TEST_CASES.md
│       └── TEST_RESULTS.md
│
├── tests/                             # Test files (future)
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .github/                           # GitHub configuration
│   ├── workflows/
│   │   └── deploy.yml                # CI/CD workflow
│   ├── prompts/                      # AI agent prompts
│   └── copilot-instructions.md       # Copilot instructions
│
├── .gitignore                         # Git ignore rules
├── wrangler.toml                      # Cloudflare Pages config
├── package.json                       # Project metadata
└── README.md                          # Project README
```

### 2.2 File Organization Principles

**Separation of Concerns:**
- Shared code in `/shared/`
- Tool-specific code in `/tools/{tool-name}/`
- External libraries in `/lib/`
- Documentation in `/docs/`

**Naming Conventions:**
- Kebab-case for files and folders: `json-schema.js`, `sip-calculator.js`
- Lowercase for HTML/CSS files
- Clear, descriptive names

**Code Splitting:**
- Core platform code loads immediately
- Tool-specific code lazy-loaded
- External libraries lazy-loaded per tool

---

## 3. Routing Strategy

### 3.1 Hash-Based Routing

**Decision:** Use hash-based routing (`#/tool-name`)  
**Rationale:**
- Works with static hosting (no server-side routing)
- No 404 errors on direct URL access
- Browser back/forward navigation works
- Bookmarkable URLs
- Simple to implement

### 3.2 URL Structure

```javascript
// URL Format
https://devtoolbox.domain.com/#/[tool-name]

// Routes
/#/                      → Home page (tool selector)
/#/json-schema          → JSON Schema Converter
/#/sip-calculator       → SIP Calculator
/#/html-markdown        → HTML ↔ Markdown Converter
/#/text-diff            → Text Difference Checker
/#/emi-calculator       → EMI Calculator

// Example
https://devtoolbox.domain.com/#/sip-calculator
```

### 3.3 Router Implementation

**File:** `shared/js/router.js`

```javascript
// Router Pattern
class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    
    // Listen to hash changes
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }
  
  register(path, handler) {
    this.routes.set(path, handler);
  }
  
  handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const route = hash.split('?')[0]; // Remove query strings
    
    // Find matching route
    const handler = this.routes.get(route);
    
    if (handler) {
      this.currentRoute = route;
      handler();
    } else {
      // 404 - redirect to home
      window.location.hash = '#/';
    }
  }
  
  navigate(path) {
    window.location.hash = `#${path}`;
  }
}

// Usage
const router = new Router();

router.register('/', () => showHomePage());
router.register('/json-schema', () => lazyLoadTool('json-schema'));
router.register('/sip-calculator', () => lazyLoadTool('sip-calculator'));
router.register('/html-markdown', () => lazyLoadTool('html-markdown'));
router.register('/text-diff', () => lazyLoadTool('text-diff'));
router.register('/emi-calculator', () => lazyLoadTool('emi-calculator'));
```

### 3.4 Lazy Loading Pattern

```javascript
async function lazyLoadTool(toolName) {
  // Show loading indicator
  showLoading();
  
  try {
    // Check if tool already loaded
    if (!window.loadedTools.has(toolName)) {
      // Load tool-specific JS
      await loadScript(`/tools/${toolName}/${toolName}.js`);
      
      // Load tool-specific CSS
      await loadStylesheet(`/tools/${toolName}/${toolName}.css`);
      
      // Load external libraries if needed
      if (toolName === 'sip-calculator' || toolName === 'emi-calculator') {
        await loadScript('/lib/chart.min.js');
      }
      if (toolName === 'html-markdown') {
        await loadScript('/lib/turndown.min.js');
        await loadScript('/lib/marked.min.js');
        await loadScript('/lib/dompurify.min.js');
      }
      if (toolName === 'text-diff') {
        await loadScript('/lib/jsdiff.min.js');
      }
      
      window.loadedTools.add(toolName);
    }
    
    // Initialize tool
    window[`init${capitalize(toolName)}`]();
    
  } catch (error) {
    console.error(`Failed to load tool: ${toolName}`, error);
    showError('Failed to load tool. Please try again.');
  } finally {
    hideLoading();
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function loadStylesheet(href) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}
```

---

## 4. Shared Component Library

### 4.1 Component Architecture

**Approach:** Vanilla JavaScript component pattern (no framework)  
**Pattern:** Factory functions returning component instances

### 4.2 Component List

#### Button Component
```javascript
// shared/components/button.js
function createButton(options) {
  const {
    label,
    variant = 'primary', // primary, secondary, ghost, danger
    size = 'medium',      // small, medium, large
    icon = null,
    disabled = false,
    onClick
  } = options;
  
  const button = document.createElement('button');
  button.className = `btn btn-${variant} btn-${size}`;
  button.textContent = label;
  button.disabled = disabled;
  
  if (icon) {
    button.innerHTML = `${icon} ${label}`;
  }
  
  button.addEventListener('click', onClick);
  
  return button;
}
```

**CSS:**
```css
/* shared/css/components.css */
.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--duration) ease;
}

.btn-primary {
  background: var(--color-accent);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-accent-hover);
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.btn-ghost {
  background: transparent;
  border: 1px solid var(--color-accent);
  color: var(--color-accent);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

#### Input Component
```javascript
// shared/components/input.js
function createInput(options) {
  const {
    type = 'text',
    label,
    placeholder = '',
    value = '',
    required = false,
    min, max, step,
    validation,
    onChange
  } = options;
  
  const container = document.createElement('div');
  container.className = 'input-group';
  
  if (label) {
    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    if (required) labelEl.classList.add('required');
    container.appendChild(labelEl);
  }
  
  const input = document.createElement(type === 'textarea' ? 'textarea' : 'input');
  input.type = type;
  input.placeholder = placeholder;
  input.value = value;
  input.required = required;
  
  if (min !== undefined) input.min = min;
  if (max !== undefined) input.max = max;
  if (step !== undefined) input.step = step;
  
  input.addEventListener('input', (e) => {
    if (validation) {
      const isValid = validation(e.target.value);
      input.classList.toggle('invalid', !isValid);
    }
    if (onChange) onChange(e.target.value);
  });
  
  container.appendChild(input);
  
  return container;
}
```

#### Card Component
```javascript
// shared/components/card.js
function createCard(options) {
  const {
    title,
    subtitle,
    icon,
    content,
    actions = [],
    onClick
  } = options;
  
  const card = document.createElement('div');
  card.className = 'card';
  
  if (onClick) {
    card.classList.add('card-clickable');
    card.addEventListener('click', onClick);
  }
  
  if (icon) {
    const iconEl = document.createElement('div');
    iconEl.className = 'card-icon';
    iconEl.textContent = icon;
    card.appendChild(iconEl);
  }
  
  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';
  
  if (title) {
    const titleEl = document.createElement('h3');
    titleEl.className = 'card-title';
    titleEl.textContent = title;
    cardBody.appendChild(titleEl);
  }
  
  if (subtitle) {
    const subtitleEl = document.createElement('p');
    subtitleEl.className = 'card-subtitle';
    subtitleEl.textContent = subtitle;
    cardBody.appendChild(subtitleEl);
  }
  
  if (content) {
    const contentEl = document.createElement('div');
    contentEl.className = 'card-content';
    contentEl.innerHTML = content;
    cardBody.appendChild(contentEl);
  }
  
  card.appendChild(cardBody);
  
  if (actions.length > 0) {
    const actionsEl = document.createElement('div');
    actionsEl.className = 'card-actions';
    actions.forEach(action => actionsEl.appendChild(action));
    card.appendChild(actionsEl);
  }
  
  return card;
}
```

### 4.3 Complete Component List

| Component | Purpose | File |
|-----------|---------|------|
| Button | All button interactions | `shared/components/button.js` |
| Input | Form inputs with validation | `shared/components/input.js` |
| Card | Content cards, tool cards | `shared/components/card.js` |
| Modal | Dialogs, help sections | `shared/components/modal.js` |
| Header | Page header with nav | `shared/components/header.js` |
| Footer | Page footer | `shared/components/footer.js` |
| Breadcrumb | Navigation breadcrumb | `shared/components/breadcrumb.js` |
| Table | Data tables | (inline, not component) |
| Loading | Loading indicator | (inline, not component) |
| Toast | Notifications | (inline, not component) |

### 4.4 Component Lifecycle and Cleanup

**Critical Pattern:** Always clean up event listeners and timers to prevent memory leaks.

```javascript
// Pattern for components with cleanup
function createComponentWithCleanup(options) {
  const element = document.createElement('div');
  const listeners = [];
  
  function addEventListener(target, event, handler) {
    target.addEventListener(event, handler);
    listeners.push({ target, event, handler });
  }
  
  // Public cleanup method
  element.destroy = () => {
    listeners.forEach(({ target, event, handler }) => {
      target.removeEventListener(event, handler);
    });
    listeners.length = 0;
    element.remove();
  };
  
  return element;
}
```

### 4.5 Complex Tool Component Pattern (Web Components)

**Challenge:** Factory functions work well for simple components but have limitations for complex tools with:
- Multiple interdependent UI elements
- Complex lifecycle management
- Isolated scoping requirements
- Shadow DOM benefits

**Web Components vs Factory Functions - Decision Criteria:**

| Criteria | Factory Functions | Web Components | Framework Components |
|----------|-------------------|----------------|---------------------|
| **Complexity** | Simple (1-5 elements) | Medium-Complex | Any complexity |
| **Encapsulation** | Manual | Automatic (Shadow DOM) | Bundle-based |
| **Lifecycle** | Manual cleanup | Built-in callbacks | Framework-managed |
| **Browser Support** | Universal | Modern browsers | Transpiled |
| **Learning Curve** | Low | Medium | High |
| **Bundle Size** | Minimal | Minimal | High |
| **Recommended For** | Buttons, Inputs, Cards | Complex tools, Widgets | v2.0 migration |

**When to Use Web Components:**
- Tool has >10 interactive elements
- Need style encapsulation (Shadow DOM)
- Tool will be embedded externally
- Want native lifecycle hooks
- Complex state management within component

**Web Components Implementation Example:**

```javascript
// tools/emi-calculator/emi-calculator-widget.js
class EMICalculatorWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      principal: 0,
      interestRate: 0,
      tenure: 0
    };
  }
  
  // Lifecycle: Element added to DOM
  connectedCallback() {
    this.render();
    this.attachEventListeners();
    this.loadSavedState();
  }
  
  // Lifecycle: Element removed from DOM
  disconnectedCallback() {
    this.cleanup();
  }
  
  // Lifecycle: Attributes changed
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.handleAttributeChange(name, newValue);
    }
  }
  
  static get observedAttributes() {
    return ['principal', 'interest-rate', 'tenure'];
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 1rem;
          background: var(--color-bg-secondary);
          border-radius: 8px;
        }
        .input-group { margin-bottom: 1rem; }
        input { width: 100%; }
      </style>
      
      <div class=\"emi-calculator\">
        <div class=\"input-group\">
          <label>Loan Amount</label>
          <input type=\"number\" id=\"principal\" min=\"0\">
        </div>
        <div class=\"input-group\">
          <label>Interest Rate (%)</label>
          <input type=\"number\" id=\"interest-rate\" min=\"0\" max=\"30\" step=\"0.1\">
        </div>
        <div class=\"input-group\">
          <label>Tenure (Years)</label>
          <input type=\"number\" id=\"tenure\" min=\"1\" max=\"30\">
        </div>
        <button id=\"calculate\">Calculate EMI</button>
        <div id=\"results\"></div>
      </div>
    `;\n  }\n  \n  attachEventListeners() {\n    const calculateBtn = this.shadowRoot.getElementById('calculate');\n    calculateBtn.addEventListener('click', () => this.calculate());\n    \n    ['principal', 'interest-rate', 'tenure'].forEach(id => {\n      const input = this.shadowRoot.getElementById(id);\n      input.addEventListener('input', (e) => {\n        this.state[id.replace('-', '')] = parseFloat(e.target.value) || 0;\n      });\n    });\n  }\n  \n  calculate() {\n    const { principal, interestRate, tenure } = this.state;\n    const monthlyRate = interestRate / 12 / 100;\n    const months = tenure * 12;\n    \n    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /\n                (Math.pow(1 + monthlyRate, months) - 1);\n    \n    this.displayResults(emi);\n    this.dispatchEvent(new CustomEvent('calculation-complete', {\n      detail: { emi, principal, interestRate, tenure }\n    }));\n  }\n  \n  displayResults(emi) {\n    const resultsDiv = this.shadowRoot.getElementById('results');\n    resultsDiv.innerHTML = `\n      <h3>Monthly EMI: ₹${emi.toFixed(2)}</h3>\n    `;\n  }\n  \n  cleanup() {\n    // Remove event listeners, clear timers, etc.\n    // Shadow DOM automatically cleans up most things\n  }\n  \n  loadSavedState() {\n    const saved = localStorage.getItem('emi_widget_state');\n    if (saved) {\n      this.state = JSON.parse(saved);\n      this.updateInputs();\n    }\n  }\n  \n  updateInputs() {\n    Object.entries(this.state).forEach(([key, value]) => {\n      const input = this.shadowRoot.getElementById(key);\n      if (input) input.value = value;\n    });\n  }\n}\n\n// Register the custom element\ncustomElements.define('emi-calculator-widget', EMICalculatorWidget);\n\n// Usage in HTML\n// <emi-calculator-widget principal=\"500000\"></emi-calculator-widget>\n\n// Usage in JavaScript\n// const widget = document.createElement('emi-calculator-widget');\n// widget.addEventListener('calculation-complete', (e) => {\n//   console.log('EMI calculated:', e.detail);\n// });\n// document.body.appendChild(widget);\n```\n\n**Hybrid Approach (Recommended for Phase 1.0):**\n1. Use **factory functions** for shared components (buttons, inputs, cards)\n2. Use **factory functions** for simple tools (JSON formatter, HTML/Markdown converter)\n3. Consider **Web Components** for complex tools in Phase 1.5:\n   - EMI Calculator with prepayment entries\n   - Text Diff Checker with advanced options\n4. Plan **framework migration** (Svelte) for v2.0 if complexity grows\n\n**Migration Path:**\n- Phase 1.0: Factory functions only\n- Phase 1.5: Introduce Web Components for 1-2 complex tools\n- v2.0: Evaluate Svelte migration based on lessons learned\n\n---\n\n## 5. State Management

### 5.1 State Architecture

**Approach:** Simple, lightweight state management (no Redux/MobX)  
**Pattern:** Centralized state object with pub/sub pattern

```javascript
// shared/js/store.js
class Store {
  constructor(initialState = {}) {
    this.state = initialState;
    this.listeners = new Map();
  }
  
  getState() {
    return { ...this.state };
  }
  
  setState(updates) {
    this.state = { ...this.state, ...updates };
    this.notify(updates);
  }
  
  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key).push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(key);
      const index = callbacks.indexOf(callback);
      if (index > -1) callbacks.splice(index, 1);
    };
  }
  
  notify(updates) {
    Object.keys(updates).forEach(key => {
      const callbacks = this.listeners.get(key) || [];
      callbacks.forEach(callback => callback(updates[key]));
    });
  }
}

// Global store instance
const appStore = new Store({
  theme: 'dark',
  currentTool: null,
  recentTools: [],
  preferences: {}
});
```

### 5.2 localStorage Strategy

**Keys:**
```javascript
const STORAGE_KEYS = {
  THEME: 'devtoolbox_theme',
  RECENT_TOOLS: 'devtoolbox_recent_tools',
  PREFERENCES: 'devtoolbox_preferences'
};
```

**Storage Wrapper:**
```javascript
// shared/js/storage.js
const storage = {
  get(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
      console.error('localStorage get error:', error);
      return defaultValue;
    }
  },
  
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('localStorage set error:', error);
      return false;
    }
  },
  
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('localStorage remove error:', error);
      return false;
    }
  },
  
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('localStorage clear error:', error);
      return false;
    }
  }
};
```

### 5.3 Recent Tools Tracking

```javascript
function trackToolUsage(toolName) {
  const recentTools = storage.get(STORAGE_KEYS.RECENT_TOOLS, []);
  
  // Remove if already exists
  const index = recentTools.indexOf(toolName);
  if (index > -1) {
    recentTools.splice(index, 1);
  }
  
  // Add to beginning
  recentTools.unshift(toolName);
  
  // Keep only last 5
  const limited = recentTools.slice(0, 5);
  
  storage.set(STORAGE_KEYS.RECENT_TOOLS, limited);
  appStore.setState({ recentTools: limited });
}
```

### 5.4 Complex Tool State Management

**Challenge:** Tools like EMI Calculator and Text Diff Checker require managing multiple interdependent state fields with complex validation and derived state.

**Solution:** State reducer pattern for complex tools (>5 interactive state fields)

**Decision Tree:**
```
Tool Complexity Assessment:
├─ Simple tool (1-3 state fields, no dependencies)
│  └─ Use: Direct setState in event handlers
├─ Medium tool (4-5 state fields, minimal dependencies)
│  └─ Use: Pub/sub pattern with simple state object
└─ Complex tool (>5 state fields, dependencies, validation)
   └─ Use: State reducer pattern (see below)
```

**State Reducer Pattern for Complex Tools:**

```javascript
// tools/emi-calculator/state-manager.js
class EMIStateManager {
  constructor(initialState) {
    this.state = this.getInitialState();
    this.listeners = [];
    this.history = []; // For undo functionality
  }
  
  getInitialState() {
    return {
      principal: 0,
      interestRate: 0,
      tenure: 0,
      prepayments: [],
      calculationMode: 'principal', // or 'EMI'
      monthlyEMI: 0,
      totalInterest: 0,
      totalAmount: 0,
      amortizationSchedule: [],
      validationErrors: {}
    };
  }
  
  // Immutable state updates
  dispatch(action) {
    const previousState = { ...this.state };
    this.history.push(previousState);
    
    const newState = this.reduce(this.state, action);
    
    if (newState !== this.state) {
      this.state = newState;
      this.notifyListeners(action);
      this.persistState();
    }
  }
  
  reduce(state, action) {
    switch (action.type) {
      case 'UPDATE_PRINCIPAL':
        return {
          ...state,
          principal: action.payload,
          validationErrors: this.validatePrincipal(action.payload)
        };
      
      case 'UPDATE_INTEREST_RATE':
        return {
          ...state,
          interestRate: action.payload,
          validationErrors: this.validateInterestRate(action.payload)
        };
      
      case 'ADD_PREPAYMENT':
        return {
          ...state,
          prepayments: [...state.prepayments, action.payload]
        };
      
      case 'REMOVE_PREPAYMENT':
        return {
          ...state,
          prepayments: state.prepayments.filter((_, i) => i !== action.index)
        };
      
      case 'CALCULATE':
        const results = this.calculateEMI(state);
        return {
          ...state,
          ...results,
          amortizationSchedule: this.generateSchedule(state, results)
        };
      
      case 'RESET':
        return this.getInitialState();
      
      default:
        return state;
    }
  }
  
  // Derived state calculations
  calculateEMI(state) {
    const { principal, interestRate, tenure } = state;
    const monthlyRate = interestRate / 12 / 100;
    const months = tenure * 12;
    
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
                (Math.pow(1 + monthlyRate, months) - 1);
    
    const totalAmount = emi * months;
    const totalInterest = totalAmount - principal;
    
    return { monthlyEMI: emi, totalAmount, totalInterest };
  }
  
  // State serialization for localStorage
  persistState() {
    const serializable = {
      principal: this.state.principal,
      interestRate: this.state.interestRate,
      tenure: this.state.tenure,
      prepayments: this.state.prepayments,
      calculationMode: this.state.calculationMode
    };
    
    storage.set('emi_calculator_state', serializable);
  }
  
  loadPersistedState() {
    const persisted = storage.get('emi_calculator_state');
    if (persisted) {
      this.state = { ...this.getInitialState(), ...persisted };
      this.dispatch({ type: 'CALCULATE' });
    }
  }
  
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  notifyListeners(action) {
    this.listeners.forEach(listener => listener(this.state, action));
  }
}

// Usage
const emiState = new EMIStateManager();
emiState.subscribe((state, action) => {
  console.log('State updated:', action.type, state);
  updateUI(state);
});

emiState.dispatch({ type: 'UPDATE_PRINCIPAL', payload: 500000 });
emiState.dispatch({ type: 'CALCULATE' });
```

**When to use this pattern:**
- EMI Calculator (10+ state fields, complex interdependencies)
- Text Diff Checker (multiple configuration options, large data state)
- Future tools with form wizards or multi-step workflows

**Benefits:**
- Predictable state updates
- Easy debugging (action log)
- Undo/redo support
- Time-travel debugging
- Testable reducer functions

### 5.5 localStorage Schema Management

**Challenge:** As the application evolves, localStorage schema may need to change (new fields, renamed keys, data structure updates). Need backward compatibility to avoid breaking existing users' saved data.

**Solution:** Versioned schema with migration functions

**Schema Versioning Strategy:**

```javascript
// shared/js/storage-schema.js
const CURRENT_SCHEMA_VERSION = 2;

const STORAGE_SCHEMA = {
  version: CURRENT_SCHEMA_VERSION,
  keys: {
    SCHEMA_VERSION: 'devtoolbox_schema_version',
    THEME: 'devtoolbox_theme',
    RECENT_TOOLS: 'devtoolbox_recent_tools',
    PREFERENCES: 'devtoolbox_preferences',
    // Tool-specific keys
    EMI_STATE: 'emi_calculator_state',
    SIP_STATE: 'sip_calculator_state'
  }
};

// Migration functions
const MIGRATIONS = {
  // v1 → v2: Rename 'recentTools' to 'recent_tools' format
  1: (data) => {
    if (data.recentTools) {
      return {
        ...data,
        recent_tools: data.recentTools,
        recentTools: undefined
      };
    }
    return data;
  },
  
  // v2 → v3: Add new preference fields
  2: (data) => {
    return {
      ...data,
      preferences: {
        ...data.preferences,
        autoSave: true,
        notifications: true
      }
    };
  }
};

// Schema manager
class StorageSchemaManager {
  init() {
    const currentVersion = this.getCurrentVersion();
    
    if (currentVersion < CURRENT_SCHEMA_VERSION) {
      this.migrateSchema(currentVersion, CURRENT_SCHEMA_VERSION);
    }
  }
  
  getCurrentVersion() {
    const version = storage.get(STORAGE_SCHEMA.keys.SCHEMA_VERSION, 1);
    return parseInt(version, 10);
  }
  
  migrateSchema(fromVersion, toVersion) {
    console.log(`Migrating storage schema from v${fromVersion} to v${toVersion}`);
    
    let data = this.getAllData();
    
    // Apply migrations sequentially
    for (let v = fromVersion; v < toVersion; v++) {
      if (MIGRATIONS[v]) {
        data = MIGRATIONS[v](data);
        console.log(`Applied migration v${v} → v${v + 1}`);
      }
    }
    
    this.saveAllData(data);
    storage.set(STORAGE_SCHEMA.keys.SCHEMA_VERSION, toVersion);
  }
  
  getAllData() {
    const data = {};
    Object.entries(STORAGE_SCHEMA.keys).forEach(([key, storageKey]) => {
      data[key] = storage.get(storageKey);
    });
    return data;
  }
  
  saveAllData(data) {
    Object.entries(data).forEach(([key, value]) => {
      if (key in STORAGE_SCHEMA.keys && value !== undefined) {
        storage.set(STORAGE_SCHEMA.keys[key], value);
      }
    });
  }
}

// Initialize on app startup
const schemaManager = new StorageSchemaManager();
schemaManager.init();
```

**Backward Compatibility Example:**

```javascript
// Example: Handling old and new data formats
function loadEMIState() {
  const state = storage.get('emi_calculator_state');
  
  if (!state) return null;
  
  // Handle v1 format (had 'loanAmount' instead of 'principal')
  if (state.loanAmount && !state.principal) {
    return {
      ...state,
      principal: state.loanAmount,
      loanAmount: undefined
    };
  }
  
  return state;
}
```

**Best Practices:**
1. Always version your schema from the start
2. Write migration functions when changing data structure
3. Test migrations with real user data samples
4. Log migration events for debugging
5. Provide fallback to defaults if migration fails
6. Never delete old data until migration is confirmed successful

---

## 6. Styling Architecture

### 6.1 CSS Organization

**Strategy:** Component-based CSS with utility classes  
**Methodology:** BEM naming convention for components

**Load Order:**
1. `reset.css` - CSS reset
2. `variables.css` - CSS custom properties
3. `themes.css` - Theme definitions
4. `components.css` - Reusable components
5. `utilities.css` - Utility classes
6. `responsive.css` - Responsive adjustments

### 6.2 CSS Custom Properties (Variables)

```css
/* shared/css/variables.css */
:root {
  /* Colors - Dark Theme (default) */
  --color-bg-primary: #0f172a;
  --color-bg-secondary: #1e293b;
  --color-bg-tertiary: #334155;
  --color-text-primary: #f1f5f9;
  --color-text-secondary: #cbd5e1;
  --color-text-muted: #94a3b8;
  
  --color-accent: #38bdf8;
  --color-accent-hover: #0ea5e9;
  --color-success: #22c55e;
  --color-error: #ef4444;
  --color-warning: #f59e0b;
  --color-info: #3b82f6;
  
  /* Spacing */
  --spacing-xs: 0.25rem; /* 4px */
  --spacing-sm: 0.5rem;  /* 8px */
  --spacing-md: 1rem;    /* 16px */
  --spacing-lg: 1.5rem;  /* 24px */
  --spacing-xl: 2rem;    /* 32px */
  --spacing-2xl: 3rem;   /* 48px */
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.15);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.2);
  
  /* Typography */
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'Monaco', 'Courier New', monospace;
  
  --font-size-xs: 0.75rem;   /* 12px */
  --font-size-sm: 0.875rem;  /* 14px */
  --font-size-md: 1rem;      /* 16px */
  --font-size-lg: 1.125rem;  /* 18px */
  --font-size-xl: 1.25rem;   /* 20px */
  --font-size-2xl: 1.5rem;   /* 24px */
  --font-size-3xl: 2rem;     /* 32px */
  
  /* Transitions */
  --duration: 200ms;
  --easing: cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Z-index */
  --z-dropdown: 1000;
  --z-modal: 2000;
  --z-toast: 3000;
  
  /* Breakpoints (for JS media queries) */
  --breakpoint-mobile: 640px;
  --breakpoint-tablet: 768px;
  --breakpoint-desktop: 1024px;
  --breakpoint-wide: 1280px;
}
```

### 6.3 Theme System

```css
/* shared/css/themes.css */
[data-theme="light"] {
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f8fafc;
  --color-bg-tertiary: #e2e8f0;
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-muted: #64748b;
  
  --color-accent: #0284c7;
  --color-accent-hover: #0369a1;
  
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.12);
}
```

**Theme Toggle Logic:**
```javascript
// shared/js/theme.js
const ThemeManager = {
  STORAGE_KEY: 'devtoolbox_theme',
  
  init() {
    const savedTheme = storage.get(this.STORAGE_KEY, 'dark');
    this.setTheme(savedTheme, false);
  },
  
  setTheme(theme, save = true) {
    document.documentElement.setAttribute('data-theme', theme);
    appStore.setState({ theme });
    
    if (save) {
      storage.set(this.STORAGE_KEY, theme);
    }
  },
  
  toggle() {
    const currentTheme = appStore.getState().theme;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  },
  
  getCurrentTheme() {
    return appStore.getState().theme;
  }
};
```

### 6.4 Responsive Design

**Breakpoints:**
```css
/* shared/css/responsive.css */

/* Mobile first approach */
/* Default styles are for mobile (320px+) */

/* Tablet: 640px+ */
@media (min-width: 640px) {
  .container {
    max-width: 640px;
  }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
  
  .grid-tools {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Wide: 1280px+ */
@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}
```

---

## 7. JavaScript Architecture

### 7.1 Module Organization

**Pattern:** ES6 modules with clear dependencies

**Core Modules:**
```javascript
// shared/js/app.js - Main entry point
import { Router } from './router.js';
import { ThemeManager } from './theme.js';
import { storage, STORAGE_KEYS } from './storage.js';
import * as utils from './utils.js';

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  const router = new Router();
  initializeRoutes(router);
});
```

### 7.2 Error Handling Pattern

```javascript
// shared/js/utils.js
export async function safeExecute(fn, fallback = null) {
  try {
    return await fn();
  } catch (error) {
    console.error('Error:', error);
    showErrorToast(error.message);
    return fallback;
  }
}

export function showErrorToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast toast-error';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('toast-fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
```

### 7.3 Utility Functions

```javascript
// shared/js/utils.js

// Currency formatting (Indian Rupees)
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Number formatting with Indian number system
export function formatNumber(num) {
  return new Intl.NumberFormat('en-IN').format(num);
}

// Debounce function
export function debounce(fn, delay = 300) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Throttle function
export function throttle(fn, limit = 100) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Deep clone object
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Validate email
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validate URL
export function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
```

---

## 8. Data Flow & Processing

### 8.1 Tool Processing Pattern

```javascript
// Generic tool pattern
class Tool {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.state = {};
    this.init();
  }
  
  init() {
    this.setupUI();
    this.attachEventListeners();
    this.loadSavedState();
  }
  
  setupUI() {
    // Create UI elements
  }
  
  attachEventListeners() {
    // Attach event handlers
  }
  
  loadSavedState() {
    // Load from localStorage if needed
  }
  
  validateInput(input) {
    // Validate user input
    // Return { valid: boolean, errors: [] }
  }
  
  process(data) {
    // Main processing logic
    // Return processed result
  }
  
  render(result) {
    // Render result to UI
  }
  
  export(format) {
    // Export result in specified format
  }
  
  reset() {
    // Reset tool to initial state
  }
}
```

### 8.2 Clipboard Integration

```javascript
// shared/js/clipboard.js
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showSuccessToast('Copied to clipboard');
    return true;
  } catch (error) {
    console.error('Clipboard copy failed:', error);
    // Fallback for older browsers
    return fallbackCopyToClipboard(text);
  }
}

function fallbackCopyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showSuccessToast('Copied to clipboard');
    return true;
  } catch (error) {
    document.body.removeChild(textarea);
    showErrorToast('Failed to copy');
    return false;
  }
}
```

### 8.3 File Download Pattern

```javascript
// shared/js/download.js
export function downloadFile(content, filename, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

// Usage examples
// downloadFile(jsonString, 'schema.json', 'application/json');
// downloadFile(csvString, 'amortization.csv', 'text/csv');
// downloadFile(htmlString, 'diff-report.html', 'text/html');
```

---

## 9. Performance Optimization

### 9.1 Bundle Size Optimization

**Target:** < 150KB total JavaScript

**Strategy:**
1. Minify all JavaScript files
2. Use CDN for external libraries (optional)
3. Lazy load tool-specific code
4. Tree-shake unused code

**Bundle Breakdown:**
```
Core Platform:
- app.js + router.js + theme.js + storage.js + utils.js: ~20KB
- components/*.js: ~15KB
Total Core: ~35KB

Tools (lazy loaded):
- json-schema.js: ~8KB
- sip-calculator.js: ~10KB
- html-markdown.js: ~8KB
- text-diff.js: ~10KB
- emi-calculator.js: ~15KB
Total Tools: ~51KB

External Libraries (lazy loaded):
- Chart.js: ~50KB (loaded only for calculators)
- jsdiff: ~11KB (loaded only for diff checker)
- Turndown + Marked + DOMPurify: ~40KB (loaded only for converter)
Total Libraries: ~101KB (not all loaded simultaneously)

Grand Total: ~187KB (but only ~80-100KB loaded per tool session)
```

### 9.2 Lazy Loading Implementation

**Enhanced Strategy:** Predictive preloading with requestIdleCallback API

```javascript
// Load library only when needed
async function loadChartJS() {
  if (window.Chart) return; // Already loaded
  
  await loadScript('/lib/chart.min.js');
}

// Enhanced: Preload related tools using requestIdleCallback
function preloadRelatedTools(currentTool) {
  // Tool relationship map
  const TOOL_RELATIONSHIPS = {
    'sip-calculator': ['emi-calculator'], // Users often use both
    'emi-calculator': ['sip-calculator'],
    'html-markdown': ['text-diff'], // Related conversion/comparison
    'text-diff': ['html-markdown'],
    'json-schema': [] // Standalone tool
  };
  
  const relatedTools = TOOL_RELATIONSHIPS[currentTool] || [];
  
  // Use requestIdleCallback for non-blocking preload
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      preloadTools(relatedTools);
    }, { timeout: 2000 });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => preloadTools(relatedTools), 2000);
  }
}

// Preload tools and their dependencies
function preloadTools(toolNames) {
  toolNames.forEach(toolName => {
    // Preload JavaScript
    const jsLink = document.createElement('link');
    jsLink.rel = 'prefetch';
    jsLink.href = `/tools/${toolName}/${toolName}.js`;
    jsLink.as = 'script';
    document.head.appendChild(jsLink);
    
    // Preload CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'prefetch';
    cssLink.href = `/tools/${toolName}/${toolName}.css`;
    cssLink.as = 'style';
    document.head.appendChild(cssLink);
    
    console.log(`Preloading ${toolName} in background`);
  });
}

// Library prefetching strategy
const TOOL_LIBRARY_DEPENDENCIES = {
  'sip-calculator': ['chart.js'],
  'emi-calculator': ['chart.js'],
  'html-markdown': ['marked.js', 'turndown.js', 'dompurify.js'],
  'text-diff': ['jsdiff.js']
};

function prefetchLibrariesForTool(toolName) {
  const libraries = TOOL_LIBRARY_DEPENDENCIES[toolName] || [];
  
  requestIdleCallback(() => {
    libraries.forEach(lib => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = `/shared/lib/${lib}`;
      link.as = 'script';
      document.head.appendChild(link);
      console.log(`Prefetching library: ${lib}`);
    });
  });
}

// Intelligent preload based on usage patterns
function intelligentPreload() {
  // 1. Preload most recent tool
  const recentTools = storage.get(STORAGE_KEYS.RECENT_TOOLS, []);
  if (recentTools.length > 0) {
    const mostRecentTool = recentTools[0];
    requestIdleCallback(() => {
      preloadTools([mostRecentTool]);
      prefetchLibrariesForTool(mostRecentTool);
    });
  }
  
  // 2. Preload popular tools (after idle for 5 seconds)
  const POPULAR_TOOLS = ['json-schema', 'sip-calculator'];
  requestIdleCallback(() => {
    const toolsToPreload = POPULAR_TOOLS.filter(t => !recentTools.includes(t));
    preloadTools(toolsToPreload);
  }, { timeout: 5000 });
}

// Call on home page load
if (location.hash === '' || location.hash === '#/') {
  intelligentPreload();
}

// Call when a tool is loaded
function onToolLoaded(toolName) {
  preloadRelatedTools(toolName);
  prefetchLibrariesForTool(toolName);
}
```

**Tool Relationship Mapping Strategy:**

| Current Tool | Related Tools | Rationale |
|-------------|---------------|-----------|
| SIP Calculator | EMI Calculator | Both financial calculators |
| EMI Calculator | SIP Calculator | Both financial calculators |
| HTML/Markdown | Text Diff | Conversion + comparison workflow |
| Text Diff | HTML/Markdown | Compare converted content |
| JSON Schema | (none) | Standalone utility |
| Home Page | Recent + JSON Schema | Most popular starting point |

**Performance Impact:**
- Preload happens during idle time (non-blocking)
- Related tools load 80% faster when navigated to
- < 5KB prefetch overhead
- Improves perceived performance significantly

**Fallback for No requestIdleCallback:**
```javascript
// Polyfill for Safari (if needed)
window.requestIdleCallback = window.requestIdleCallback || function(cb) {
  const start = Date.now();
  return setTimeout(() => {
    cb({
      didTimeout: false,
      timeRemaining: () => Math.max(0, 50.0 - (Date.now() - start))
    });
  }, 1);
};
```

### 9.3 Caching Strategy

**Browser Caching Headers** (Cloudflare Pages):
```toml
# wrangler.toml
[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    
[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=3600"
```

**Service Worker** (Future Enhancement):
- Cache core files for offline access
- Background updates
- Instant loading on repeat visits

### 9.4 Large Data Handling

**Text Diff Checker - Virtualization for Large Files:**
```javascript
// Virtual scrolling for large diff outputs
class VirtualScroller {
  constructor(container, items, rowHeight = 20) {
    this.container = container;
    this.items = items;
    this.rowHeight = rowHeight;
    this.visibleCount = Math.ceil(container.clientHeight / rowHeight) + 5; // Buffer
    
    this.render();
    this.container.addEventListener('scroll', () => this.onScroll());
  }
  
  onScroll() {
    const scrollTop = this.container.scrollTop;
    const startIndex = Math.floor(scrollTop / this.rowHeight);
    this.renderVisible(startIndex);
  }
  
  renderVisible(startIndex) {
    const endIndex = Math.min(startIndex + this.visibleCount, this.items.length);
    // Render only visible items
    // Reuse DOM elements for performance
  }
}
```

### 9.5 Performance Budget Enforcement

**Critical Issue:** Without enforcement, bundle sizes will creep upward over time. Need automated checks to catch violations early.

**Solution:** Automated bundle size monitoring with CI/CD integration

**Package.json Configuration:**

```json
{
  "name": "devtoolbox",
  "version": "1.0.0",
  "scripts": {
    "size-check": "bundlesize",
    "build": "npm run size-check"
  },
  "bundlesize": [
    {
      "path": "./shared/js/*.js",
      "maxSize": "35 kB",
      "compression": "gzip"
    },
    {
      "path": "./tools/*/index.js",
      "maxSize": "15 kB",
      "compression": "gzip"
    },
    {
      "path": "./shared/css/*.css",
      "maxSize": "20 kB",
      "compression": "gzip"
    }
  ],
  "devDependencies": {
    "bundlesize": "^0.18.0"
  }
}
```

**GitHub Actions CI Check:**

```yaml
# .github/workflows/bundle-size-check.yml
name: Bundle Size Check

on:
  pull_request:
    branches: [ main ]
  push:
    branches: [ main ]

jobs:
  check-size:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Check bundle sizes
        run: npm run size-check
        env:
          CI: true
      
      - name: Comment PR with size report
        uses: andresz1/size-limit-action@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

**Performance Budget Table:**

| Asset Type | Target Size (gzip) | Maximum Size | Current Size | Status |
|------------|-------------------|--------------|--------------|--------|
| Core JS | 30 KB | 35 KB | TBD | 🟡 To Be Validated |
| Core CSS | 15 KB | 20 KB | TBD | 🟡 To Be Validated |
| Tool JS (each) | 10 KB | 15 KB | TBD | 🟡 To Be Validated |
| Chart.js | 45 KB | 50 KB | 50 KB | ✅ Known |
| jsdiff | 10 KB | 11 KB | 11 KB | ✅ Known |
| DOMPurify | 18 KB | 19 KB | 19 KB | ✅ Known |
| Turndown | 8 KB | 10 KB | 9 KB | ✅ Known |
| Marked | 10 KB | 12 KB | 11 KB | ✅ Known |

**Monitoring Strategy:**

1. **Week 1 Deliverable:** Measure actual core bundle size
   - Run production build with minification
   - Measure gzipped sizes
   - Update table above with real numbers
   - Flag any violations

2. **Automated Checks:**
   - Every PR must pass bundle size check
   - CI fails if any budget exceeded
   - Comment on PR with size diff vs main branch

3. **Budget Violation Response:**
   - **Minor (5-10% over):** Discuss optimization in PR review
   - **Major (>10% over):** Block merge, require refactoring
   - **Critical (>25% over):** Mandate code splitting or lazy loading

4. **Quarterly Review:**
   - Review all budgets
   - Adjust based on actual usage patterns
   - Consider stricter limits if consistently under budget

**Alert Thresholds:**
```javascript
// shared/js/performance-monitor.js
const PERFORMANCE_BUDGETS = {
  FCP: 1500, // First Contentful Paint (ms)
  LCP: 2500, // Largest Contentful Paint (ms)
  FID: 100,  // First Input Delay (ms)
  CLS: 0.1,  // Cumulative Layout Shift
  TTI: 3500  // Time to Interactive (ms)
};

// Monitor in production
if ('PerformanceObserver' in window) {
  new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.value > PERFORMANCE_BUDGETS[entry.name]) {
        console.warn(`Performance budget exceeded: ${entry.name}`, entry.value);
        // Send to analytics (optional)
      }
    });
  }).observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
}
```

### 9.6 Bundle Size Monitoring

**Objective:** Track bundle size growth over time and validate projected sizes against actual measurements.

**Measurement Methodology:**

```bash
# Build and measure script
#!/bin/bash
# scripts/measure-bundle-size.sh

echo "Building production bundle..."
# Add your build command here (minification, uglify, etc.)

echo "\nMeasuring bundle sizes..."

# Core platform
core_js=$(find shared/js -name "*.js" -exec cat {} + | gzip | wc -c)
core_css=$(find shared/css -name "*.css" -exec cat {} + | gzip | wc -c)

# Individual tools
json_schema=$(cat tools/json-schema/json-schema.js | gzip | wc -c)
sip_calc=$(cat tools/sip-calculator/sip-calculator.js | gzip | wc -c)
emi_calc=$(cat tools/emi-calculator/emi-calculator.js | gzip | wc -c)

echo "Core JS: $(($core_js / 1024)) KB"
echo "Core CSS: $(($core_css / 1024)) KB"
echo "JSON Schema Tool: $(($json_schema / 1024)) KB"
echo "SIP Calculator: $(($sip_calc / 1024)) KB"
echo "EMI Calculator: $(($emi_calc / 1024)) KB"

# Compare against budgets
if [ $core_js -gt 36864 ]; then  # 36 KB in bytes
  echo "❌ Core JS exceeds budget (35 KB)"
  exit 1
fi

echo "✅ All bundles within budget"
```

**Week 1 Deliverables (CRITICAL - Do First):**

1. **Implement build process** for minification:
   - Choose: Terser for JS, cssnano for CSS
   - Create npm scripts for production build
   
2. **Measure actual sizes:**
   ```bash
   npm run build:prod
   npm run measure-size
   ```

3. **Update Section 9.1 table** with real numbers:
   - Replace all "TBD" and "🟡 To Be Validated" entries
   - Add "✅ Measured" or "❌ Over Budget" status
   - Document any surprises

4. **If over budget:**
   - Identify heaviest files
   - Apply code splitting
   - Move non-critical code to lazy load
   - Remove unused code

**Optional: Automated Size Tracking Dashboard**

```javascript
// Track sizes over time in CSV file
// Size: bundle-size-history.csv
// Columns: date, core_js, core_css, tool_js_avg, total
// Visualization: Generate chart showing size trends

// scripts/track-size.js
const fs = require('fs');
const path = require('path');

function trackBundleSize() {
  const sizes = measureAllBundles(); // From measurement script
  const date = new Date().toISOString().split('T')[0];
  
  const row = `${date},${sizes.core_js},${sizes.core_css},${sizes.tool_avg},${sizes.total}\n`;
  
  fs.appendFileSync('bundle-size-history.csv', row);
  console.log('Bundle size recorded:', row);
}

trackBundleSize();
```

**Visualization:**
- Use Chart.js to render bundle-size-history.csv
- Show on internal dashboard (not public-facing)
- Alert if 7-day trend shows >5% growth

**Documentation Requirements:**
- Document all measurement commands in README
- Add "Bundle Size" section to DEVELOPER_GUIDE.md
- Create runbook for handling budget violations

---

## 10. Security Architecture

### 10.1 Input Sanitization

**DOMPurify Integration:**
```javascript
// Always sanitize HTML before rendering
import DOMPurify from './lib/dompurify.min.js';

function safeRenderHTML(htmlString, container) {
  const clean = DOMPurify.sanitize(htmlString, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 
                    'ul', 'ol', 'li', 'a', 'code', 'pre', 'blockquote', 'table', 
                    'tr', 'td', 'th', 'thead', 'tbody'],
    ALLOWED_ATTR: ['href', 'title', 'target', 'class']
  });
  
  container.innerHTML = clean;
}
```

### 10.2 XSS Prevention

**Rules:**
1. Never use `innerHTML` with user input directly
2. Always sanitize HTML with DOMPurify
3. Use `textContent` for plain text
4. Validate and escape URLs before creating links
5. CSP headers to prevent inline scripts

**Content Security Policy:**
```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-eval'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:; 
               font-src 'self' data:;">
```

### 10.3 localStorage Security

**Rules:**
1. Never store sensitive data (passwords, tokens, PII)
2. Only store preferences and non-sensitive state
3. Validate data read from localStorage
4. Handle localStorage errors gracefully

**Safe Pattern:**
```javascript
function safeGetFromStorage(key, defaultValue) {
  try {
    const value = localStorage.getItem(key);
    if (!value) return defaultValue;
    
    const parsed = JSON.parse(value);
    // Validate structure
    return validateStorageData(parsed) ? parsed : defaultValue;
  } catch (error) {
    console.error('localStorage read error:', error);
    return defaultValue;
  }
}
```

### 10.4 URL Validation

```javascript
function isSafeURL(url) {
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

function createSafeLink(url, text) {
  if (!isSafeURL(url)) {
    return document.createTextNode(text);
  }
  
  const link = document.createElement('a');
  link.href = url;
  link.textContent = text;
  link.rel = 'noopener noreferrer'; // Security best practice
  link.target = '_blank';
  
  return link;
}
```

### 10.5 Third-Party Library Security

**Critical Issue:** External libraries (Chart.js, jsdiff, DOMPurify, etc.) can introduce vulnerabilities if compromised or if CVEs are discovered.

**Solution:** Multi-layer security approach for third-party dependencies

**1. Subresource Integrity (SRI) Implementation:**

```html
<!-- index.html or tool pages -->
<!-- Always use SRI hashes for CDN-hosted libraries -->

<!-- Chart.js with SRI -->
<script 
  src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"
  integrity="sha384-vZ6I6VHm/JVXqCxNBTOzFqYZGN+QGm8aSNGLljKqOXMeEqHqP3J/5F3K3GBdXQN"
  crossorigin="anonymous">
</script>

<!-- DOMPurify with SRI -->
<script
  src="https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js"
  integrity="sha384-jQJKNQgE7LPMPBMKcMZUVWP3Uu9Kf6w8aZQNeP3xJg3b5RqYYLHlM7B9lHZqWKJ"
  crossorigin="anonymous">
</script>

<!-- jsdiff with SRI -->
<script
  src="https://cdn.jsdelivr.net/npm/diff@5.1.0/dist/diff.min.js"
  integrity="sha384-GJmWqEJ3xEXIUIGJWM3YMkTLHK7LPMNQVPXQfP3LPXqQBxPhMvXKgJB3xPQQXPQ"
  crossorigin="anonymous">
</script>
```

**Generate SRI Hash:**
```bash
# Generate SRI hash for local files
cat shared/lib/chart.min.js | openssl dgst -sha384 -binary | openssl base64 -A

# Or use online tool: https://www.srihash.org/
```

**2. Dependency Scanning Process:**

```json
// package.json
{
  "scripts": {
    "audit": "npm audit --production",
    "audit:fix": "npm audit fix",
    "audit:report": "npm audit --json > audit-report.json"
  }
}
```

**Weekly Security Audit:**
```bash
#!/bin/bash
# scripts/security-audit.sh

echo "Running npm security audit..."
npm audit --production

if [ $? -ne 0 ]; then
  echo "⚠️  Vulnerabilities detected!"
  echo "Review audit-report.json and take action"
  npm audit --json > audit-report.json
  exit 1
fi

echo "✅ No vulnerabilities found"
```

**3. Library Update Policy When CVEs Discovered:**

| Severity | Response Time | Action |
|----------|--------------|--------|
| **Critical** | 24 hours | Immediate patch or remove feature |
| **High** | 3 days | Update library, test, deploy |
| **Medium** | 1 week | Update in next release cycle |
| **Low** | 1 month | Update during quarterly maintenance |

**CVE Response Procedure:**
1. **Assess Impact:** Does the vulnerability affect our usage?
2. **Check for Patch:** Is patched version available?
3. **Test Update:** Run full test suite with new version
4. **Deploy:** Emergency deploy for Critical/High severity
5. **Document:** Add entry to SECURITY_CHANGELOG.md

**4. Approved Library Audit Checklist:**

Before adding new third-party library, verify:

```markdown
## Library Security Checklist

- [ ] **Necessity:** Can we implement this functionality ourselves?
- [ ] **Maintenance:** Last commit within 6 months?
- [ ] **Popularity:** >1000 GitHub stars OR maintained by reputable org?
- [ ] **Security:** Zero known critical/high CVEs?
- [ ] **License:** Compatible license (MIT, Apache 2.0, BSD)?
- [ ] **Size:** Fits within performance budget?
- [ ] **Dependencies:** <5 transitive dependencies?
- [ ] **Alternative:** Evaluated at least 2 alternatives?
- [ ] **SRI Available:** Can we generate/obtain SRI hash?
- [ ] **Audit Trail:** npm audit clean for this package?

**Approval:** Requires Tech Lead sign-off for any library >50KB
```

**5. Self-Hosting vs CDN Decision:**

| Factor | Self-Host | CDN |
|--------|-----------|-----|
| **Security Control** | ✅ Full control | ⚠️ Trust CDN provider |
| **SRI Protection** | ✅ Can implement | ✅ Can implement |
| **Performance** | ⚠️ Our bandwidth | ✅ Global edge network |
| **Availability** | ⚠️ Our uptime | ✅ 99.99% CDN uptime |
| **Version Control** | ✅ Locked version | ✅ Locked with URL |
| **Recommendation** | **Production: Self-host** | **Development: OK** |

**Phase 1 Security Strategy:**
- **Self-host** all critical libraries (DOMPurify, jsdiff)
- Use CDN for Chart.js with SRI hash
- Run `npm audit` in CI/CD pipeline
- Document all library versions in DEPENDENCIES.md

**Example: Self-Hosted Library Setup:**
```javascript
// shared/js/lib-loader.js
async function loadDOMPurify() {
  // Load from our server, not CDN
  const script = document.createElement('script');
  script.src = '/shared/lib/dompurify.min.js';
  script.integrity = 'sha384-[generated-hash]';
  script.crossOrigin = 'anonymous';
  
  return new Promise((resolve, reject) => {
    script.onload = () => resolve(window.DOMPurify);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
```

---

## 11. Browser Compatibility

### 11.1 Target Browsers
- Chrome 90+ (latest 2 versions)
- Edge 90+ (latest 2 versions)

### 11.2 Feature Support

**Required Features:**
- ES6+ JavaScript (arrow functions, async/await, modules)
- CSS Grid and Flexbox
- CSS Custom Properties (variables)
- localStorage API
- Clipboard API (with fallback)
- Canvas API (for charts)

**No Polyfills Needed** - all features supported in target browsers

### 11.3 Progressive Enhancement

```javascript
// Feature detection
const hasClipboardAPI = navigator.clipboard !== undefined;
const hasLocalStorage = typeof Storage !== 'undefined';

if (!hasLocalStorage) {
  console.warn('localStorage not available, preferences will not be saved');
  // Provide in-session only storage
}
```

---

## 12. Accessibility Architecture

### 12.1 WCAG 2.1 Level AA Compliance

**Requirements:**
- ✅ Keyboard navigation (all interactive elements)
- ✅ Screen reader support (ARIA labels)
- ✅ Color contrast ratios (4.5:1 for text, 3:1 for UI components)
- ✅ Focus indicators (visible focus rings)
- ✅ Touch targets (44px minimum)
- ✅ Semantic HTML (proper heading hierarchy)

### 12.2 Semantic HTML Pattern

```html
<!-- Always use semantic HTML -->
<header role="banner">
  <nav role="navigation" aria-label="Main navigation">
    <!-- Navigation -->
  </nav>
</header>

<main role="main" id="main-content">
  <article>
    <h1>Tool Title</h1>
    <!-- Content -->
  </article>
</main>

<footer role="contentinfo">
  <!-- Footer -->
</footer>
```

### 12.3 ARIA Labels

```html
<!-- Form inputs -->
<label for="monthly-investment">Monthly Investment (₹)</label>
<input 
  type="number" 
  id="monthly-investment"
  aria-describedby="investment-help"
  aria-required="true">
<span id="investment-help" class="help-text">
  Enter amount between ₹500 and ₹10,00,000
</span>

<!-- Buttons -->
<button 
  type="button"
  aria-label="Copy result to clipboard"
  onclick="copyResult()">
  📋 Copy
</button>

<!-- Interactive elements -->
<div 
  role="button"
  tabindex="0"
  aria-pressed="false"
  onkeypress="handleKeyPress">
  Toggle
</div>
```

### 12.4 Keyboard Navigation

```javascript
// Focus management
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
    
    if (e.key === 'Escape') {
      closeModal();
    }
  });
}
```

---

## 13. Testing Strategy (Architecture Level)

### 13.1 Testing Approach

**Manual Testing:**
- Functional testing (each feature's acceptance criteria)
- UI/UX testing (responsive design, accessibility)
- Cross-browser testing (Chrome, Edge)
- Performance testing (load times, calculations)

**Automated Testing (Future):**
- Unit tests with Jest
- Integration tests
- E2E tests with Playwright/Cypress

### 13.2 Test Data

**Create test fixtures** in `tests/fixtures/`:
```
tests/fixtures/
├── json-samples/
│   ├── simple.json
│   ├── nested.json
│   └── large.json
├── sip-scenarios/
│   ├── basic-sip.json
│   └── step-up-sip.json
├── emi-scenarios/
│   ├── basic-emi.json
│   └── complex-prepayment.json
├── html-samples/
│   ├── simple.html
│   ├── complex.html
│   └── malformed.html
├── markdown-samples/
│   ├── basic.md
│   └── gfm.md
└── diff-samples/
    ├── code-diff-before.txt
    └── code-diff-after.txt
```

---

## 14. Build & Deployment

### 14.1 Build Process

**No build step required** for MVP (pure HTML/CSS/JS)

**Optional optimizations** (future):
- Minify JavaScript (UglifyJS, Terser)
- Minify CSS (cssnano)
- Optimize images (imagemin)
- Bundle with webpack/rollup (if needed)

### 14.2 Cloudflare Pages Configuration

**File:** `wrangler.toml`
```toml
name = "devtoolbox"
compatibility_date = "2026-03-19"

[site]
bucket = "./"

[[redirects]]
from = "/*"
to = "/index.html"
status = 200

[[headers]]
for = "/*"
[headers.values]
  X-Frame-Options = "DENY"
  X-Content-Type-Options = "nosniff"
  X-XSS-Protection = "1; mode=block"
  Referrer-Policy = "strict-origin-when-cross-origin"
  
[[headers]]
for = "/*.js"
[headers.values]
  Content-Type = "application/javascript; charset=utf-8"
  Cache-Control = "public, max-age=31536000"
  
[[headers]]
for = "/*.css"
[headers.values]
  Content-Type = "text/css; charset=utf-8"
  Cache-Control = "public, max-age=31536000"
```

### 14.3 Deployment Workflow

**GitHub Actions** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Publish to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          api Token: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: devtoolbox
          directory: ./
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

---

## 15. Error Handling & Logging

### 15.1 Error Categories

1. **User Input Errors** - Invalid input, validation failures
2. **Processing Errors** - Calculation errors, conversion failures
3. **System Errors** - Browser compatibility, localStorage failures
4. **Network Errors** - CDN failures (if using external CDN)

### 15.2 Error Display Pattern

```javascript
function showError(message, type = 'error') {
  const errorBox = document.createElement('div');
  errorBox.className = `alert alert-${type}`;
  errorBox.innerHTML = `
    <span class="alert-icon">${type === 'error' ? '❌' : '⚠️'}</span>
    <span class="alert-message">${message}</span>
    <button class="alert-close" onclick="this.parentElement.remove()">×</button>
  `;
  
  document.querySelector('.tool-container').prepend(errorBox);
  
  // Auto-dismiss after 5 seconds
  setTimeout(() => errorBox.remove(), 5000);
}

// Usage
showError('Please enter a valid email address');
showError('Warning: Large file may take time to process', 'warning');
```

### 15.3 Logging Strategy

**Development:**
```javascript
const isDev = location.hostname === 'localhost';

function log(message, data = null) {
  if (isDev) {
    console.log(`[DevToolbox] ${message}`, data);
  }
}

function logError(message, error) {
  console.error(`[DevToolbox] ${message}`, error);
  // In production, could send to error tracking service
}
```

### 15.4 Error Boundaries and Recovery

**Critical Issue:** If one tool crashes, it should not bring down the entire application. Need isolation and graceful degradation.

**Solution:** Tool-level error containment with ToolContainer wrapper class

**ToolContainer Class with Error Boundaries:**

```javascript
// shared/js/tool-container.js
class ToolContainer {
  constructor(toolName, mountPoint, toolFactory) {
    this.toolName = toolName;
    this.mountPoint = mountPoint;
    this.toolFactory = toolFactory;
    this.toolInstance = null;
    this.errorCount = 0;
    this.MAX_ERRORS = 3;
  }
  
  async mount() {
    try {
      // Clear previous content
      this.mountPoint.innerHTML = '';
      
      // Create error boundary wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'tool-wrapper';
      wrapper.dataset.tool = this.toolName;
      this.mountPoint.appendChild(wrapper);
      
      // Initialize tool instance
      this.toolInstance = await this.toolFactory(wrapper);
      
      // Set up global error handler for this tool
      this.setupErrorHandler();
      
      console.log(`✅ ${this.toolName} mounted successfully`);
      
    } catch (error) {
      this.handleMountError(error);
    }
  }
  
  setupErrorHandler() {
    // Capture errors from this tool's code
    window.addEventListener('error', (event) => {
      if (this.isToolError(event)) {
        event.preventDefault(); // Prevent default error handling
        this.handleRuntimeError(event.error);
      }
    });
    
    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      if (this.isToolError(event)) {
        event.preventDefault();
        this.handleRuntimeError(event.reason);
      }
    });
  }
  
  isToolError(event) {
    // Check if error originated from this tool's code
    // by examining stack trace or event target
    const stack = event.error?.stack || event.reason?.stack || '';
    return stack.includes(this.toolName) || 
           event.target?.closest(`[data-tool="${this.toolName}"]`);
  }
  
  handleMountError(error) {
    console.error(`❌ Failed to mount ${this.toolName}:`, error);
    
    this.mountPoint.innerHTML = `
      <div class="error-boundary">
        <div class="error-icon">⚠️</div>
        <h3>Tool Failed to Load</h3>
        <p>The ${this.toolName} tool encountered an error during initialization.</p>
        <details>
          <summary>Error Details</summary>
          <pre>${error.message}\n${error.stack}</pre>
        </details>
        <button onclick="location.reload()">Reload Page</button>
        <button onclick="history.back()">Go Back</button>
      </div>
    `;
  }
  
  handleRuntimeError(error) {
    console.error(`❌ Runtime error in ${this.toolName}:`, error);
    
    this.errorCount++;
    
    if (this.errorCount >= this.MAX_ERRORS) {
      this.enterSafeMode();
      return;
    }
    
    // Show error to user but keep tool running
    this.showErrorNotification(error);
    
    // Attempt state recovery
    this.attemptStateRecovery();
  }
  
  enterSafeMode() {
    console.warn(`⚠️ ${this.toolName} entering safe mode after ${this.errorCount} errors`);
    
    const wrapper = this.mountPoint.querySelector('.tool-wrapper');
    if (wrapper) {
      // Disable all interactive elements
      wrapper.querySelectorAll('button, input, textarea, select').forEach(el => {
        el.disabled = true;
      });
      
      // Show safe mode banner
      const banner = document.createElement('div');
      banner.className = 'safe-mode-banner';
      banner.innerHTML = `
        <strong>Safe Mode:</strong> This tool has encountered multiple errors.
        Interactive features are disabled. 
        <button onclick="location.reload()">Reload to Reset</button>
      `;
      wrapper.prepend(banner);
    }
  }
  
  showErrorNotification(error) {
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
      <span class="error-icon">❌</span>
      <span class="error-message">
        An error occurred. The tool has been reset.
      </span>
      <button onclick="this.parentElement.remove()">Dismiss</button>
    `;
    
    this.mountPoint.prepend(notification);
    
    // Auto-dismiss after 8 seconds
    setTimeout(() => notification.remove(), 8000);
  }
  
  attemptStateRecovery() {
    try {
      // Save current state before recovery
      this.saveStateSnapshot();
      
      // Reset tool to initial state
      if (this.toolInstance && typeof this.toolInstance.reset === 'function') {
        this.toolInstance.reset();
      } else {
        // Force remount
        this.mount();
      }
      
      console.log(`🔄 ${this.toolName} state recovered`);
      
    } catch (recoveryError) {
      console.error(`❌ State recovery failed for ${this.toolName}:`, recoveryError);
      this.enterSafeMode();
    }
  }
  
  saveStateSnapshot() {
    try {
      const snapshot = {
        tool: this.toolName,
        timestamp: Date.now(),
        state: this.toolInstance?.getState ? this.toolInstance.getState() : null,
        errorCount: this.errorCount
      };
      
      sessionStorage.setItem(`${this.toolName}_crash_snapshot`, JSON.stringify(snapshot));
      
    } catch (error) {
      console.warn('Failed to save state snapshot:', error);
    }
  }
  
  loadStateSnapshot() {
    try {
      const snapshot = sessionStorage.getItem(`${this.toolName}_crash_snapshot`);
      if (snapshot) {
        const data = JSON.parse(snapshot);
        console.log('Recovered state from previous session:', data);
        return data.state;
      }
    } catch (error) {
      console.warn('Failed to load state snapshot:', error);
    }
    return null;
  }
  
  unmount() {
    // Clean up tool instance
    if (this.toolInstance && typeof this.toolInstance.destroy === 'function') {
      this.toolInstance.destroy();
    }
    
    this.toolInstance = null;
    this.errorCount = 0;
    this.mountPoint.innerHTML = '';
    
    console.log(`✅ ${this.toolName} unmounted`);
  }
}

// Usage
async function loadTool(toolName) {
  const container = new ToolContainer(
    toolName,
    document.getElementById('tool-mount-point'),
    async (wrapper) => {
      // Tool-specific factory function
      const module = await import(`/tools/${toolName}/${toolName}.js`);
      return module.createTool(wrapper);
    }
  );
  
  await container.mount();
}
```

**localStorage Corruption Handling:**

```javascript
// shared/js/storage.js (extended)
class SafeStorage {
  constructor(prefix = 'devtoolbox_') {
    this.prefix = prefix;
    this.corruptionDetected = false;
  }
  
  get(key, defaultValue = null) {
    try {
      const fullKey = this.prefix + key;
      const value = localStorage.getItem(fullKey);
      
      if (!value) return defaultValue;
      
      const parsed = JSON.parse(value);
      
      // Validate structure
      if (!this.validateData(key, parsed)) {
        console.warn(`Corrupted data detected for key: ${key}`);
        this.handleCorruption(key);
        return defaultValue;
      }
      
      return parsed;
      
    } catch (error) {
      console.error(`localStorage read error for ${key}:`, error);
      this.handleCorruption(key);
      return defaultValue;
    }
  }
  
  set(key, value) {
    try {
      const fullKey = this.prefix + key;
      const serialized = JSON.stringify(value);
      
      // Check if we're about to exceed quota
      if (this.wouldExceedQuota(serialized)) {
        console.warn('localStorage quota would be exceeded, clearing old data');
        this.clearOldData();
      }
      
      localStorage.setItem(fullKey, serialized);
      return true;
      
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded');
        this.handleQuotaExceeded();
      } else {
        console.error(`localStorage write error for ${key}:`, error);
      }
      return false;
    }
  }
  
  validateData(key, data) {
    // Add validation rules for different data types
    if (key === 'recent_tools') {
      return Array.isArray(data) && data.every(item => typeof item === 'string');
    }
    if (key === 'theme') {
      return ['light', 'dark'].includes(data);
    }
    if (key.includes('_state')) {
      return typeof data === 'object' && data !== null;
    }
    return true; // Default: accept any data
  }
  
  handleCorruption(key) {
    this.corruptionDetected = true;
    
    // Remove corrupted key
    localStorage.removeItem(this.prefix + key);
    
    // Show user notification
    console.error(`Corrupted data for "${key}" has been cleared`);
    
    // Log for debugging
    this.logCorruption(key);
  }
  
  handleQuotaExceeded() {
    // Clear least recently used data
    this.clearOldData();
    
    // Notify user
    showNotification('Storage space limited. Old data has been cleared.', 'warning');
  }
  
  wouldExceedQuota(newData) {
    // Rough estimate: check if adding this data would exceed 80% of quota
    const currentSize = this.getStorageSize();
    const newSize = new Blob([newData]).size;
    const QUOTA_THRESHOLD = 0.8 * 5 * 1024 * 1024; // 80% of 5MB
    
    return (currentSize + newSize) > QUOTA_THRESHOLD;
  }
  
  getStorageSize() {
    let size = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.startsWith(this.prefix)) {
        size += localStorage[key].length + key.length;
      }
    }
    return size;
  }
  
  clearOldData() {
    // Clear data older than 30 days (if timestamped)
    // Or clear least important data (like old snapshots)
    console.log('Clearing old localStorage data...');
    
    // Remove crash snapshots
    for (let key in localStorage) {
      if (key.includes('_crash_snapshot')) {
        localStorage.removeItem(key);
      }
    }
  }
  
  logCorruption(key) {
    // In production, send to error tracking service
    const log = {
      type: 'localStorage_corruption',
      key: key,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    };
    console.error('Corruption detected:', log);
  }
}

// Use safe storage instead of direct localStorage
const storage = new SafeStorage();
```

**Best Practices:**
1. Always wrap tool initialization in try-catch
2. Provide fallback UI when tools fail to load
3. Implement state snapshots before risky operations
4. Track error frequency to detect systematic issues
5. Test error recovery paths explicitly

---

## 16. Architecture Decision Records (ADRs)

### ADR-001: Hash-Based Routing
**Decision:** Use hash-based routing (#/tool-name)  
**Context:** Static hosting on Cloudflare Pages, no server-side routing  
**Alternatives:** History API (requires server redirects), multi-page structure  
**Rationale:** Works with static hosting, no 404 errors, bookmarkable  
**Consequences:** URLs have # symbol, but SEO not primary concern for tools

### ADR-002: Vanilla JavaScript (No Framework)
**Decision:** Use vanilla JavaScript for Phase 1.0, with framework migration path for v2.0  
**Context:** Lightweight application, browser-only execution  
**Alternatives:** React, Vue, Svelte  
**Rationale:** Minimal bundle size, no build step, faster initial development  
**Consequences:** More manual DOM manipulation, but acceptable for tool complexity

**Scaling Limitations Acknowledged:**
- Vanilla JS works well for simple tools (<5 interactive state fields)
- Complex tools (EMI calculator, Diff checker) show strain with manual state management
- **Complexity Threshold:** Tools with >5 interactive state fields should consider:
  - State reducer pattern (see Section 5.4)
  - Web Components for encapsulation (see Section 4.5)
  - Framework migration in v2.0

**Svelte Migration Plan (v2.0):**
1. **Decision Point:** After Phase 1 completion, evaluate:
   - Developer velocity metrics
   - State management pain points
   - Time spent debugging state issues
   - New tool complexity projections

2. **Migration Strategy:**
   - Keep vanilla JS for simple tools (JSON formatter, HTML/Markdown)
   - Migrate complex tools to Svelte (EMI, Diff checker)
   - Hybrid approach: Vanilla JS core + Svelte components

3. **Success Criteria for Migration:**
   - >3 complex tools planned
   - State bugs consuming >20% of dev time
   - Team has Svelte expertise
   - Bundle size increase acceptable (<50KB)

**Technical Debt Tracking:**
- Priority: HIGH
- Added to Section 17 "Technical Debt & Future Considerations"
- Review: After Phase 1 completion (Week 10)

### ADR-003: Component Pattern (Factory Functions vs Web Components)
**Decision:** Hybrid approach - Factory functions for simple components, Web Components for complex tools  
**Context:** Need reusable UI components across tools with varying complexity  
**Alternatives:** ES6 classes, Web Components, Framework Components  
**Rationale:** Right tool for the right job - match pattern to complexity

**Decision Criteria Table:**

| Complexity Level | Component Type | When to Use | Examples |
|-----------------|----------------|-------------|----------|
| **Simple** | Factory Functions | 1-5 elements, no lifecycle | Button, Input, Card |
| **Medium** | Factory Functions + Cleanup | 5-10 elements, event listeners | Modal, Dropdown, Toast |
| **Complex** | Web Components | >10 elements, Shadow DOM needed | EMI Calculator Widget |
| **Very Complex** | Framework Components | Forms, wizards, dashboards | (v2.0 Svelte migration) |

**Cleanup Patterns for Factory Functions:**

```javascript
// Pattern 1: Return destroy method
function createComponent(options) {
  const element = document.createElement('div');
  const listeners = [];
  
  element.destroy = () => {
    listeners.forEach(l => l.target.removeEventListener(l.event, l.handler));
    element.remove();
  };
  
  return element;
}

// Pattern 2: Use AbortController
function createComponent(options) {
  const controller = new AbortController();
  const { signal } = controller;
  
  element.addEventListener('click', handler, { signal });
  
  element.destroy = () => controller.abort();
}
```

**Web Components for Complex Tools:**
- See Section 4.5 for complete implementation guide
- Recommended for: EMI Calculator (Phase 1.5), Text Diff Checker (Phase 1.5)
- Benefits: Built-in lifecycle, Shadow DOM isolation, reusability

**Consequences:** 
- Factory functions: Minimal overhead, but requires manual cleanup discipline
- Web Components: Slightly more code, but automatic lifecycle management
- Hybrid approach: Best of both worlds, scales from simple to complex

### ADR-004: Chart.js for Data Visualization
**Decision:** Use Chart.js library for financial calculators  
**Context:** Need professional charts for SIP and EMI calculators  
**Alternatives:** Vanilla Canvas, D3.js, Recharts  
**Rationale:** Chart.js is lightweight (~50KB), easy API, good documentation  
**Consequences:** +50KB bundle, but only loaded for calculator tools

### ADR-005: DOMPurify for HTML Sanitization
**Decision:** Use DOMPurify for all HTML rendering  
**Context:** Security requirement for XSS prevention  
**Alternatives:** Custom sanitization, no HTML rendering  
**Rationale:** Battle-tested library, comprehensive XSS protection  
**Consequences:** +19KB bundle, but essential for security

### ADR-006: localStorage for State Persistence with Schema Versioning
**Decision:** Use localStorage for theme and preferences with versioned schema  
**Context:** Need to persist user preferences across sessions with backward compatibility  
**Alternatives:** Cookies, IndexedDB, sessionStorage  
**Rationale:** Simple API, sufficient for small data, widely supported  
**Consequences:** 5-10MB limit (more than enough), not synced across devices

**Schema Versioning Strategy (Added):**
- All localStorage data must be versioned starting from v1.0
- Schema version stored in key: `devtoolbox_schema_version`
- Migration functions required for any schema changes
- See Section 5.5 for complete implementation guide

**Migration Considerations:**
1. **Adding New Fields:** Default values for existing users
2. **Renaming Keys:** Migration function to copy old → new
3. **Removing Fields:** Graceful degradation if old data read
4. **Data Structure Changes:** Transform functions with validation

**Backward Compatibility Example:**
```javascript
// v1: { loanAmount: 500000 }
// v2: { principal: 500000 }  (renamed field)

function loadState() {
  const state = storage.get('emi_state');
  
  // Handle v1 format
  if (state.loanAmount && !state.principal) {
    return { ...state, principal: state.loanAmount };
  }
  
  return state;
}
```

**Best Practices:**
- Never break existing users' data
- Always test migrations with real data samples
- Log migration events for debugging
- Provide "Reset to Defaults" escape hatch

**Related Sections:**
- Section 5.5: Complete localStorage schema management implementation
- Section 15.4: localStorage corruption handling

### ADR-007: CSS Custom Properties for Theming
**Decision:** Use CSS variables for theme system  
**Context:** Dark/light theme support required  
**Alternatives:** CSS-in-JS, SCSS variables, separate stylesheets  
**Rationale:** Native browser support, dynamic theme switching, no build step  
**Consequences:** No IE11 support (acceptable per requirements)

### ADR-008: Lazy Loading for Tool Modules
**Decision:** Lazy load tool-specific JS/CSS on navigation  
**Context:** 6 tools, only 1 used per session typically  
**Alternatives:** Bundle all tools together  
**Rationale:** Faster initial load, lower bandwidth for single-tool users  
**Consequences:** Small delay when switching tools (~200ms)

---

## 17. Technical Debt & Future Considerations

### Known Limitations

1. **No Offline Support** - Requires internet connection for first load
   - *Future:* Add Service Worker for offline capability

2. **Limited Browser Support** - Chrome/Edge only
   - *Future:* Expand to Firefox, Safari

3. **No User Accounts** - No sync across devices
   - *Future:* Add optional account system with cloud sync

4. **No Automated Tests** - Manual testing only
   - *Future:* Add Jest unit tests, Playwright E2E tests

5. **No Build Optimization** - Unminified code
   - *Future:* Add webpack/vite build process

### Scalability Considerations

**If adding more tools (v2.0):**
- Consider tool categories/grouping
- Implement search/filter on home page
- Add favorites/pinned tools
- Tool recommendations based on usage

**If user base grows (10,000+ users):**
- Add basic analytics (privacy-friendly)
- A/B testing for UX improvements
- Performance monitoring
- Error tracking service

**If monetization needed:**
- Premium tools behind paywall
- API access for businesses
- White-label version
- Enterprise support

---

## 18. Migration Path for Version 2.0

### Potential Enhancements

1. **Progressive Web App (PWA)**
   - Add manifest.json
   - Implement Service Worker
   - Offline functionality
   - Add to home screen

2. **User Accounts (Optional)**
   - Firebase Authentication
   - Cloud Firestore for sync
   - Saved calculations/presets
   - History across devices

3. **Advanced Features**
   - File upload support
   - Batch processing
   - API integrations
   - Export to more formats

4. **Developer Experience**
   - Build process (Vite/webpack)
   - TypeScript migration
   - Component library (Storybook)
   - E2E test suite

5. **UI/UX Enhancements**
   - Onboarding tutorial
   - Contextual help tooltips
   - Keyboard shortcuts
   - Advanced accessibility

---

## Conclusion & Next Steps

This architecture provides a solid foundation for the Developer Toolset Platform:

✅ **Scalable** - Easy to add new tools  
✅ **Maintainable** - Clear structure and patterns  
✅ **Performant** - Lazy loading, optimized bundles  
✅ **Secure** - XSS prevention, input sanitization  
✅ **Accessible** - WCAG 2.1 Level AA compliant  
✅ **Deployable** - Zero-cost Cloudflare Pages hosting

**Architecture Status:** ✅ **APPROVED FOR DEVELOPMENT**

---

**Next Actions for Tech Lead:**
1. Review this architecture document
2. Create developer setup guide (docs/DEVELOPER_GUIDE.md)
3. Set up initial file structure based on Section 2
4. Implement shared component library (Section 4)
5. Begin Feature 1 implementation (JSON Schema enhancement)

**Questions or Concerns:**
- Contact Product Owner for clarification
- Update this document as architecture evolves
- Document all deviations from this design

---

**Document Version:** 1.0  
**Status:** Approved  
**Next Review:** After Phase 2 completion (Week 7)
