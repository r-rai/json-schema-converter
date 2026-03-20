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
- **Type:** Static Single-Page Application (SPA)
- **Hosting:** Cloudflare Pages
- **Bundle:** Single HTML file (index.html) with embedded CSS and JavaScript
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
│  │  Navigation Layer (Hash-based Router)           │ │
│  │        ↓                                         │ │
│  │  ┌─────────┬─────────┬─────────┬─────────┐      │ │
│  │  │  JSON   │   SIP   │   HTML  │  Diff   │      │ │
│  │  │ Schema  │  Calc   │   ↔ MD  │ Checker │      │ │
│  │  └─────────┴─────────┴─────────┴─────────┘      │ │
│  │                                                  │ │
│  │  Design System (CSS Variables, Components)      │ │
│  │  State Management (localStorage for theme/prefs)│ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

**Decision 1: Single-File Architecture**
- **Rationale:** Simplifies deployment, maximizes performance (single HTTP request)
- **Trade-off:** Larger initial bundle (~150KB) vs no subsequent requests
- **Status:** Validated via 96 Lighthouse score, <1s load time

**Decision 2: No Framework/Library**
- **Rationale:** Reduces bundle size, eliminates version dependencies, maximizes control
- **Trade-off:** More manual DOM manipulation vs framework abstractions
- **Status:** Successful, maintenance burden remains low

**Decision 3: Template-Based Tool Rendering**
- **Rationale:** Each tool is self-contained HTML template activated on route
- **Trade-off:** Some code duplication vs cleaner separation
- **Status:** Scales well to 5 tools, no performance issues

**Decision 4: Hash-Based Routing**
- **Rationale:** No server-side routing needed, works on static hosting
- **Trade-off:** URLs less clean (#json vs /json) vs zero config
- **Status:** User-accepted, no SEO requirements for tools

**Decision 5: Lazy-Load External Libraries**
- **Rationale:** Charts/diff only needed for specific tools
- **Trade-off:** Small delay on first tool use vs 40% smaller initial bundle
- **Status:** Optimal - most users don't use all tools in a session

---

## Component Architecture

### Global Components
- **Header:** Navigation, theme toggle, search modal
- **Recent Apps Bar:** Quick access to last 5 used tools
- **Home Page:** Tool grid/dashboard
- **Search Modal:** Fuzzy tool search (Ctrl+K)
- **Theme System:** Dark/light mode with localStorage persistence

### Tool Components
Each tool follows this pattern:
```
<div id="tool-{name}" class="tool-container">
  <div class="tool-header">...</div>
  <div class="tool-content">
    <!-- Tool-specific UI -->
  </div>
  <div class="action-buttons">...</div>
</div>
```

### Design System
- **Tokens:** 50+ CSS custom properties (colors, spacing, typography, shadows)
- **Components:** Button, Input, Panel, Card, Chip, Modal, Toast
- **Themes:** Dark (default), Light
- **Responsive:** Mobile-first, 3 breakpoints (480px, 768px, 1100px)

---

## Data Flow

### User Interaction Flow
```
User Action (click, input)
    ↓
Event Handler (onclick, oninput)
    ↓
Business Logic (calculation, validation, conversion)
    ↓
DOM Update (innerHTML, textContent, classList)
    ↓
Visual Feedback (toast, result panel, animation)
```

### State Management
```
Application State:
├── Theme: localStorage → document.documentElement[data-theme]
├── Recent Apps: localStorage → rendered in header bar
└── Tool State: In-memory (lost on navigation/reload)

No global state management library - each tool manages own state.
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
