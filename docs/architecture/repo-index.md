# Repository Index

**DevToolbox Platform - File Structure & Organization**

Last Updated: March 20, 2026

---

## 📁 Root Directory

### Essential Files
```
/
├── index.html                    # Main application (3,641 lines)
│                                 # Contains: HTML, CSS, JavaScript
│                                 # All 5 tools embedded
│
├── README.md                     # Project overview & quick start
├── package.json                  # Project metadata, no build process
├── wrangler.toml                 # Cloudflare Pages deployment config
├── performance-budget.json       # Performance thresholds
└── .gitignore                    # Git exclusions
```

### Development Files
```
├── organize-docs.sh              # Documentation organization script
└── manual-testing-checklist.sh  # Manual QA procedures
```

---

## 🔧 Application Structure (index.html)

### index.html Breakdown (3,641 lines)
```
Lines    | Section                  | Description
---------|--------------------------|-----------------------------------
1-50     | HTML Head                | Meta tags, favicon, title
51-1100  | CSS Styles               | Design system, components, themes
1101-2500| HTML Body                | Structure, tool templates
2501-3641| JavaScript               | Business logic, routing, handlers
```

### Key CSS Sections (lines 51-1100)
```
Lines    | Component                | Purpose
---------|--------------------------|-----------------------------------
51-150   | CSS Variables            | Design tokens (colors, spacing, etc.)
151-250  | Reset & Base             | Normalize, typography
251-400  | Layout System            | Grid, flexbox, containers
401-550  | Global Header            | Navigation, breadcrumb, theme toggle
551-650  | Recent Apps Bar          | Quick access chips
651-800  | Home Page                | Tool grid, cards
801-1100 | Tool Components          | Panels, forms, buttons, modals
```

### Key JavaScript Sections (lines 2501-3641)
```
Lines    | Module                   | Functions
---------|--------------------------|-----------------------------------
2501-2600| Configuration            | TOOLS object, constants
2601-2750| Recent Apps              | getRecentApps(), addToRecentApps()
2751-2900| Navigation               | navigateHome(), launchTool()
2901-3000| Theme Management         | toggleTheme(), setTheme()
3001-3150| Search Modal             | openSearch(), handleSearchInput()
3151-3300| JSON Schema Tool         | generateSchema(), validateJSON()
3301-3450| Markdown Converter       | convertFormat(), sanitization
3451-3550| Diff Checker             | compareDiff(), renderDiff()
3551-3641| SIP/EMI Calculators      | calculateSIP(), calculateEMI()
```

---

## 📚 Documentation Structure (docs/)

### Core Documentation
```
docs/
├── README.md                    # Master documentation index
├── ARCHITECTURE.md              # Complete technical architecture
├── DEVELOPER_GUIDE.md           # Contributing guidelines, setup
└── QUICK_START.md               # 5-minute getting started guide
```

### Architecture Documentation
```
docs/architecture/
├── README.md                    # Architecture docs index
├── overview.md                  # System summary (this doc's sibling)
├── repo-index.md                # This file
├── function-call-graph.md       # Execution flow diagrams
│
├── reviews/                     # Technical assessments
│   ├── final-review.md         # Final architecture validation
│   ├── solution-architect-review.md
│   └── architecture-review.md
│
└── navigation/                  # Routing & UI navigation
    ├── diagrams.md             # Navigation flow diagrams
    ├── summary.md              # Navigation architecture summary
    └── header-architecture.md  # Global header design
```

### Product Documentation
```
docs/product/
├── README.md                    # Product docs index
├── roadmap.md                   # Product roadmap & priorities
├── decisions.md                 # Product decisions log
└── prd/                         # Product Requirements Documents
    └── missing-features-prd.md # Recently implemented features PRD
```

### Security Documentation
```
docs/security/
├── README.md                    # Security docs index
├── security-policy.md           # Security & privacy policy
├── csp-migration-plan.md        # CSP implementation plan
│
├── audit/                       # Security assessments
│   ├── security-audit.md       # Comprehensive audit
│   ├── executive-summary.md    # Executive overview
│   └── index.md                # Audit docs index
│
└── guides/                      # Security implementation
    ├── implementation-guide.md # Security feature implementation
    └── checklist.md            # Security validation checklist
```

### Feature Documentation
```
docs/features/
├── 01-json-schema-enhancement.md
├── 02-sip-calculator.md
├── 03-html-markdown-converter.md
├── 04-text-diff-checker.md
├── 05-emi-calculator.md
└── (feature implementation specifications)
```

### Design Documentation
```
docs/design/
├── UX_DESIGN_SYSTEM.md         # Complete design system spec
├── design-tokens.md            # Color, spacing, typography values
└── component-library.md        # Reusable UI components
```

### Testing Documentation
```
docs/testing/
├── INDEX.md                     # Testing docs index
├── guides/                      # Testing procedures
│   ├── manual-testing.md
│   └── regression-testing.md
│
└── reports/                     # Test results
    └── (test execution reports)
```

### User Guides
```
docs/user-guides/
├── VISUAL_WALKTHROUGH.md        # Step-by-step feature tour
└── (user documentation)
```

### Reports & Status
```
docs/reports/
├── current-status.md            # Single source of truth for status
│                                # (Consolidated from 14+ status files)
└── (completion & sprint reports)
```

### Archived Documentation
```
docs/archive/
├── completion-reports/          # Historical status documents
│   ├── root-level/             # 14 files from root directory
│   ├── implementation/         # Feature implementation reports
│   ├── sprints/                # Sprint completion reports
│   └── milestones/             # Milestone reports
│
└── tech-briefs/                 # Technical leadership docs
    └── (historical tech briefs)
```

---

## 🧪 Tests Directory (tests/)

### Test Files
```
tests/
├── README.md                    # Test files index
├── test-all-tools.html         # Comprehensive tool test suite
├── test-json-schema.html       # JSON tool validation
├── test-console.html           # Console output verification
├── test-fixes.html             # Bug fix validation
├── test-platform.html          # Platform integration tests
└── (15 total test files)
```

---

## 🎨 Assets Directory (assets/)

### Static Resources
```
assets/
├── icons/                       # Tool icons, favicons
└── images/                      # Screenshots, diagrams
```

---

## 🏠 Home Directory (home/)

### Legacy/Alternate Implementations
```
home/
└── (potential alternate home page designs)
```

---

## 🔧 Tools Directory (tools/)

### Standalone Tool Versions
```
tools/
├── json-schema/
│   └── index.html              # Standalone JSON tool
│
├── emi-calculator/
│   └── index.html              # Standalone EMI calculator
│
└── (legacy standalone tool implementations)
```

**Note:** These are historical standalone versions. The production app uses the integrated version in `/index.html`.

---

## 📦 lib/ and shared/ Directories

### Shared Libraries (Currently Empty)
```
lib/                             # Placeholder for future shared libraries
shared/                          # Placeholder for shared utilities
```

**Status:** Not currently used. All code is in `index.html`.

---

## 🗂️ .github Directory

### GitHub Configuration
```
.github/
├── agents/                      # AI agent configurations
│   ├── system-architect.agent.md
│   ├── ui-ux-architect.agent.md
│   ├── front-end-developer.agent.md
│   ├── product-owner.agent.md
│   └── (other agent definitions)
│
├── copilot-instructions.md     # GitHub Copilot instructions
└── (GitHub Actions, workflows if any)
```

---

## 📊 File Statistics

### By Type
```
File Type    | Count | Total Size | Notes
-------------|-------|------------|---------------------------
HTML         | 1     | ~180 KB    | Main application
Markdown     | 100+  | ~2 MB      | Documentation
JavaScript   | 0     | -          | Embedded in index.html
CSS          | 0     | -          | Embedded in index.html
JSON         | 2     | ~2 KB      | package.json, perf budget
TOML         | 1     | ~1 KB      | wrangler.toml
```

### By Directory
```
Directory    | Files | Purpose
-------------|-------|------------------------------------------
/            | 18    | Essential project files
docs/        | 80+   | Comprehensive documentation
tests/       | 15    | Manual test suites
assets/      | 10+   | Static resources
tools/       | 5+    | Legacy standalone implementations
.github/     | 10+   | AI agent configurations
```

---

## 🔍 Key File Locations

### For Development
- **Main App:** `/index.html`
- **Developer Guide:** `/docs/DEVELOPER_GUIDE.md`
- **Architecture:** `/docs/ARCHITECTURE.md`
- **Testing Guide:** `/docs/testing/INDEX.md`

### For Deployment
- **Cloudflare Config:** `/wrangler.toml`
- **Performance Budget:** `/performance-budget.json`
- **Production Build:** `/index.html` (no build step needed)

### For Documentation
- **Docs Index:** `/docs/README.md`
- **Current Status:** `/docs/reports/current-status.md`
- **Feature Specs:** `/docs/features/`
- **Security Policy:** `/docs/security/security-policy.md`

### For Testing
- **Test Suite:** `/tests/test-all-tools.html`
- **Manual Checklist:** `/manual-testing-checklist.sh`
- **Test Docs:** `/docs/testing/INDEX.md`

---

## 📝 File Naming Conventions

### Markdown Files
- `UPPERCASE_WITH_UNDERSCORES.md` - Major documentation (ARCHITECTURE.md, README.md)
- `kebab-case.md` - Standard documents (quick-start.md, security-audit.md)
- `01-feature-name.md` - Numbered features (in docs/features/)

### HTML Files
- `index.html` - Main application
- `test-*.html` - Test files (in tests/)
- `infrastructure-*.html` - Build/infrastructure files

### Directories
- `kebab-case/` - All directories (user-guides/, completion-reports/)
- No spaces or special characters

---

## 🚀 Quick Navigation

**Need to find...** | **Look here...**
--------------------|------------------
Main application code | `/index.html` lines 2501-3641 (JavaScript)
CSS styles | `/index.html` lines 51-1100
Tool templates | `/index.html` lines 1101-2500
Architecture docs | `/docs/architecture/`
Security policies | `/docs/security/`
Test files | `/tests/`
Current project status | `/docs/reports/current-status.md`

---

## 📚 Related Documentation

- [Architecture Overview](./overview.md) - System architecture summary
- [Function Call Graph](./function-call-graph.md) - Execution flow
- [Developer Guide](../DEVELOPER_GUIDE.md) - Contributing guidelines
- [Documentation Index](../README.md) - Complete documentation map

---

**This index is maintained as part of the architecture documentation. Update when file structure changes.**
