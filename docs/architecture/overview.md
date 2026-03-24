# Architecture Overview

**Quick Reference:** For complete technical architecture, see [ARCHITECTURE.md](../ARCHITECTURE.md)

---

## System Summary

**DevToolbox Platform** is a client-side-only web application suite comprising 5 developer tools:

1. **JSON Schema Converter & Validator** - JSON schema generation and validation
2. **SIP Calculator** - Systematic Investment Planning calculator
3. **HTML ↔ Markdown Converter** - Bidirectional markup conversion
4. **Text Diff Checker** - Line-by-line text comparison
5. **EMI Calculator** - Loan EMI and prepayment calculator

---

## Architecture at a Glance

### Deployment Model
- **Type:** Multi-Page Static Application (Standalone Pages)
- **Hosting:** Cloudflare Pages
- **Bundle:** Homepage + 5 separate tool pages with shared CSS/JS modules
- **Dependencies:** Zero backend, all computation client-side
- **Distribution:** Global CDN via Cloudflare Edge Network

### Technology Stack
```
Frontend:
├── HTML5 (semantic markup)
├── CSS3 (custom properties, grid, flexbox)
└── Vanilla JavaScript (ES6+, no frameworks)

External Libraries (CDN, lazy-loaded):
├── Chart.js (SIP/EMI visualizations)
├── DOMPurify (HTML sanitization)
├── Marked (Markdown parsing)
├── Turndown (HTML to Markdown)
└── jsdiff (text difference engine)
```

### Application Architecture
```
┌──────────────────────────────────────────────────────┐
│              Browser (Client-Side Only)               │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │           DevToolbox Application                 │ │
│  │                                                  │ │
│  │  Multi-Page Navigation (Direct URLs)            │ │
│  │        ↓                                         │ │
│  │  ┌─────────┬─────────┬─────────┬─────────┬────┐ │ │
│  │  │  JSON   │   HTML  │  Text   │   SIP   │EMI │ │ │
│  │  │ Schema  │   ↔ MD  │  Diff   │  Calc   │Calc│ │ │
│  │  │ /tools/ │ /tools/ │ /tools/ │ /tools/ │/to-│ │ │
│  │  │   json- │  html-  │  text-  │   sip-  │ols/│ │ │
│  │  │  schema │markdown │  diff   │calculat-│emi-│ │ │
│  │  │         │         │         │    or   │calc│ │ │
│  │  └─────────┴─────────┴─────────┴─────────┴────┘ │ │
│  │                                                  │ │
│  │  Shared Resources:                               │ │
│  │  ├── Heritage Design System (CSS)                │ │
│  │  ├── Search Modal (Ctrl+K global shortcuts)      │ │
│  │  ├── Theme Management (localStorage)             │ │
│  │  └── Help System (contextual modals)             │ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

**Decision 1: Multi-Page Architecture (Updated v2.0)**
- **Rationale:** Simpler deployment, better separation of concerns, no routing complexity
- **Trade-off:** Multiple HTTP requests vs cleaner code structure and direct URL access
- **Status:** Successfully migrated from SPA; each tool is now a standalone page

**Decision 2: Shared Design System**
- **Rationale:** Consistent UX across all tools, centralized theme management
- **Trade-off:** Must import shared CSS/JS on every page vs code reusability
- **Status:** Heritage Evolution Design System implemented, 100% consistent

**Decision 3: No Framework/Library**
- **Rationale:** Reduces bundle size, eliminates version dependencies, maximizes control
- **Trade-off:** More manual DOM manipulation vs framework abstractions
- **Status:** Successful, maintenance burden remains low

**Decision 4: Auto-Initialization Pattern**
- **Rationale:** Tools initialize on direct page load without router dependency
- **Trade-off:** Small initialization code per tool vs guaranteed functionality
- **Status:** Implemented post-Heritage migration, all tools now standalone-ready

**Decision 5: Global Search (Ctrl+K)**
- **Rationale:** Fast tool access, better discoverability, keyboard-first navigation
- **Trade-off:** ~6KB additional JS + modal HTML vs improved UX
- **Status:** Implemented v2.0, works across all pages with keyboard shortcuts

**Decision 6: Lazy-Load External Libraries**
- **Rationale:** Charts/diff only needed for specific tools
- **Trade-off:** Small delay on first tool use vs 40% smaller initial bundle
- **Status:** Optimal - most users don't use all tools in a session

---

## Component Architecture

### Global Components
- **Header:** Navigation with logo, search button, theme toggle
- **Search Modal:** Global search (Ctrl+K or "/") with real-time filtering, keyboard navigation
- **Help System:** Contextual help modals on all 5 tools with usage instructions
- **Home Page:** Tool card grid with descriptions and direct links
- **Theme System:** Dark/light mode (Heritage Evolution design) with localStorage persistence

### Tool Components
Each tool follows this pattern:
```
<!DOCTYPE html>
<html>
<head>
  <!-- Heritage Design System CSS -->
  <link rel="stylesheet" href="/shared/css/heritage-design-system.css">
  <link rel="stylesheet" href="/shared/css/utilities.css">
  <link rel="stylesheet" href="/shared/css/themes.css">
  <!-- Material Symbols -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined">
</head>
<body>
  <header>
    <nav>
      <a href="/">Logo</a>
      <div>
        <button id="search-btn">🔍</button>
        <button id="theme-toggle">🌙</button>
      </div>
    </nav>
  </header>
  
  <main>
    <!-- Compact hero section (py-3) -->
    <section class="hero">
      <h1>Tool Name</h1>
      <p>Description</p>
      <button id="help-btn">Help Icon</button>
    </section>
    
    <!-- Tool-specific interface -->
    <section class="tool-interface">
      <!-- Input, buttons, output -->
    </section>
  </main>
  
  <!-- Help Modal -->
  <div id="help-modal" class="hidden">...</div>
  
  <!-- Search Modal -->
  <div id="search-modal" class="hidden">...</div>
  
  <!-- Scripts -->
  <script src="/shared/js/theme-toggle.js"></script>
  <script src="/shared/js/search.js"></script>
  <script src="tool-specific.js"></script>
</body>
</html>
```

**Tool-Specific Features:**
- **JSON Schema:** Dynamic layout (single → split view), multiple validation modes
- **HTML/Markdown:** Bidirectional conversion with DOMPurify sanitization
- **Text Diff:** Line-by-line comparison with highlighting
- **SIP Calculator:** Investment growth chart with Chart.js
- **EMI Calculator:** Amortization schedule + prepayment calculator (reduce tenure/EMI)

### Design System
- **Tokens:** 50+ CSS custom properties (colors, spacing, typography, shadows)
- **Components:** Button, Input, Panel, Card, Chip, Modal, Toast
- **Themes:** Dark (default), Light
- **Responsive:** Mobile-first, 3 breakpoints (480px, 768px, 1100px)

---

## Data Flow

### User Interaction Flow
```
User Action (click, input, keyboard shortcut)
    ↓
Event Handler (onclick, oninput, onkeydown)
    ↓
Business Logic (calculation, validation, conversion)
    ↓
DOM Update (innerHTML, textContent, classList)
    ↓
Visual Feedback (toast, result panel, modal, animation)
```

### Navigation Flow
```
Homepage (/)
    ↓
User searches (Ctrl+K) or clicks tool card
    ↓
Navigate to tool page (/tools/tool-name/)
    ↓
Tool auto-initializes (DOMContentLoaded)
    ↓
User interacts with tool
    ↓
Can search (Ctrl+K) to switch to another tool
```

### State Management
```
Application State:
├── Theme: localStorage → document.documentElement.classList ('dark'/'light')
├── Tool State: In-memory per page (lost on navigation)
└── No global state - each tool manages own state independently

Search State:
├── Modal open/closed: DOM class manipulation
├── Search query: Input value (not persisted)
├── Selected result: Index in results array
└── Tool database: Static array in search.js
```

---

## Security Architecture

### Content Security Policy (CSP)
- **Level:** Strict CSP with nonce-based script execution
- **Inline Scripts:** Prohibited (all scripts externalized)
- **XSS Protection:** DOMPurify for user-generated HTML
- **Data Privacy:** Zero server communication, all computation local

### Input Validation
- JSON Schema: Syntax validation via `JSON.parse()` + schema structure checks
- User Inputs: Type validation, range checks, sanitization
- HTML Content: DOMPurify sanitization before rendering

---

## Performance Characteristics

### Metrics (Lighthouse Score: 96/100)
- **First Contentful Paint:** <0.8s
- **Time to Interactive:** <1.2s
- **Total Bundle Size:** ~150KB (HTML + CSS + JS)
- **External Libraries:** ~180KB (lazy-loaded, cached)

### Optimization Strategies
- Single HTTP request for main app
- CSS/JS minification
- Lazy-load external libraries
- localStorage caching for theme/preferences
- No runtime dependencies or polyfills (modern browsers only)

---

## Navigation & Routing

### Hash-Based Router
```javascript
Routes:
'' or '#home'     → Home page (tool grid)
'#json'           → JSON Schema Converter
'#sip'            → SIP Calculator
'#markdown'       → HTML ↔ Markdown Converter
'#diff'           → Text Diff Checker
'#emi'            → EMI Calculator
```

### Navigation Functions
- `navigateHome()` - Return to home page
- `launchTool(toolId)` - Open specific tool
- `updateBreadcrumb(toolName)` - Update header breadcrumb
- `addToRecentApps(toolId)` - Track recently used tools

---

## Directory Structure

See [Repository Index](./repo-index.md) for complete file structure.

**Key Directories:**
```
/
├── index.html          # Main application file (3,600+ lines)
├── package.json        # Metadata (no build process)
├── wrangler.toml       # Cloudflare Pages config
│
├── docs/               # Documentation (see docs/README.md)
├── tests/              # Manual test files (HTML)
├── assets/             # Images, icons
└── tools/              # Standalone tool versions (legacy)
```

---

## Extension Points

### Adding a New Tool
1. Add tool entry to `TOOLS` object in JavaScript
2. Create tool template HTML in `<body>`
3. Implement tool-specific functions (calculate, validate, etc.)
4. Add route handler in `updatePageVisibility()`
5. Update home page tool grid
6. Add to search index

### Customizing Theme
1. Modify CSS custom properties in `:root` and `[data-theme="light"]`
2. No JavaScript changes required (design tokens drive all theming)

### Integrating External Library
1. Add lazy-load script in tool's initialization function
2. Cache loaded state to avoid re-loading
3. Provide loading indicator during fetch

---

## Related Documentation

- **[Complete Architecture Document](../ARCHITECTURE.md)** - Full technical specification
- **[Repository Index](./repo-index.md)** - File structure and organization
- **[Function Call Graph](./function-call-graph.md)** - Execution flow diagrams
- **[Architecture Reviews](./reviews/)** - Technical assessments and decisions
- **[Navigation Architecture](./navigation/)** - Routing and UI navigation details

---

## Questions?

Refer to:
- [Developer Guide](../DEVELOPER_GUIDE.md) for contributing
- [Quick Start](../QUICK_START.md) for local setup
- [Architecture Reviews](./reviews/final-review.md) for detailed technical analysis
