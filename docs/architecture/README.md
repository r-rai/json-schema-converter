# Architecture Documentation

This directory contains comprehensive architecture documentation for the DevToolbox Platform.

## 📁 Quick Navigation

### Core Architecture Documents
- **[Architecture Overview](./overview.md)** ⭐ - Quick system summary and key architectural decisions
- **[Main Architecture Document](../ARCHITECTURE.md)** 📖 - Complete technical specification (3,500+ words)
- **[Repository Index](./repo-index.md)** 📂 - File structure, organization, and navigation guide
- **[Function Call Graph](./function-call-graph.md)** 🔄 - Execution flow and function dependencies

### Specialized Architecture
- **[Architecture Reviews](./reviews/)** - Technical assessments and validations
- **[Navigation Architecture](./navigation/)** - Routing and UI navigation details

---

## 📋 Document Purposes

### [Architecture Overview](./overview.md)
**Purpose:** Quick reference for system architecture  
**Audience:** All developers, technical leads  
**Length:** ~1,500 words  
**Use When:** Need high-level understanding or refresher

**Contents:**
- System summary and deployment model
- Technology stack at a glance
- Key architectural decisions with rationale
- Component architecture
- Data flow patterns
- Performance characteristics
- Extension points

### [Main Architecture Document](../ARCHITECTURE.md)
**Purpose:** Comprehensive technical specification  
**Audience:** Architects, senior developers, security reviewers  
**Length:** ~3,500 words  
**Use When:** Need detailed technical understanding or designing new features

**Contents:**
- Detailed system design
- Component specifications
- Security architecture
- Performance optimization strategies
- Deployment infrastructure
- Technical constraints and trade-offs

### [Repository Index](./repo-index.md)
**Purpose:** Navigate the codebase structure  
**Audience:** New contributors, developers  
**Length:** ~2,000 words  
**Use When:** Looking for specific files or understanding organization

**Contents:**
- Complete directory structure
- File locations and purposes
- Code organization (index.html breakdown)
- Documentation organization
- Quick navigation tables

### [Function Call Graph](./function-call-graph.md)
**Purpose:** Understand code execution flow  
**Audience:** Developers, debuggers, reviewers  
**Length:** ~3,000 words  
**Use When:** Debugging, understanding feature implementation, or adding functionality

**Contents:**
- Application initialization flow
- Navigation system flows
- Tool-specific execution paths
- Utility function hierarchies
- Error handling patterns
- Performance optimization techniques

### Reviews
Architecture assessments and technical reviews:
- [**final-review.md**](reviews/final-review.md) - Final comprehensive architecture review
- [**solution-architect-review.md**](reviews/solution-architect-review.md) - Solution architect assessment
- [**architecture-review.md**](reviews/architecture-review.md) - Initial architecture review

### Navigation
Navigation system architecture:
- [**diagrams.md**](navigation/diagrams.md) - Navigation architecture diagrams
- [**summary.md**](navigation/summary.md) - Navigation architecture summary
- [**header-architecture.md**](navigation/header-architecture.md) - Header component architecture

## 🎯 Key Architecture Principles

1. **Zero Backend** - All processing happens client-side
2. **Single Page Application** - One HTML file with dynamic routing
3. **Progressive Enhancement** - Works without JavaScript (core content)
4. **Security First** - CSP headers, input sanitization, XSS protection
5. **Performance** - Lazy loading, minimal dependencies, efficient rendering

## 🏗️ System Components

### Core Infrastructure
- **Router** (`shared/router.js`) - Hash-based SPA routing
- **Theme Manager** (`shared/theme.js`) - Dark/light mode with persistence
- **Storage Manager** (`shared/storage.js`) - localStorage wrapper with error handling
- **Error Handler** - Global error boundary and logging

### Tool Architecture
- Each tool in `/tools/{name}/` directory
- Lazy-loaded on demand
- Isolated scope with shared utilities
- Consistent UI patterns via design system

### External Dependencies
- Chart.js (visualizations)
- DiffMatchPatch (text comparison)
- Marked.js (Markdown parsing)
- DOMPurify (XSS protection)
- Turndown (HTML-to-Markdown)

## 📊 Architecture Decisions

See individual review documents for detailed architectural decisions and rationale.

## 🔗 Related Documentation

- [Main Architecture](../ARCHITECTURE.md) - Comprehensive system architecture
- [Developer Guide](../DEVELOPER_GUIDE.md) - Development guidelines
- [Security Policy](../security/security-policy.md) - Security architecture
- [Design System](../design/UX_DESIGN_SYSTEM.md) - UI architecture

---

**Last Updated:** March 20, 2026
