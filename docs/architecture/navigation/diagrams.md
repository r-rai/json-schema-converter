# Navigation System Architecture - Visual Diagrams

## 1. Component Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                         index.html                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Persistent Header Component              │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐    │  │
│  │  │  Home +  │  │ DevTools │  │  Search | Theme  │    │  │
│  │  │ Dropdown │  │  Title   │  │                  │    │  │
│  │  └──────────┘  └──────────┘  └──────────────────┘    │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  Main Content Area                     │  │
│  │                                                        │  │
│  │  ┌──────────────────────────────────────────┐        │  │
│  │  │  Home Page (route: /)                     │        │  │
│  │  │  - Tool Grid                              │        │  │
│  │  │  - Search Bar                             │        │  │
│  │  │  - Category Filters                       │        │  │
│  │  └──────────────────────────────────────────┘        │  │
│  │                     OR                                 │  │
│  │  ┌──────────────────────────────────────────┐        │  │
│  │  │  Tool Page (route: /tool-name)            │        │  │
│  │  │  - Tool Interface                         │        │  │
│  │  │  - Breadcrumb: Home > Tool                │        │  │
│  │  └──────────────────────────────────────────┘        │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│               Search Modal (overlay, hidden)                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  [X Close]                                            │  │
│  │  ┌─────────────────────────────────────────────┐     │  │
│  │  │ 🔍 Search tools...                          │     │  │
│  │  └─────────────────────────────────────────────┘     │  │
│  │                                                       │  │
│  │  [Search Results - List]                             │  │
│  │                                                       │  │
│  │  Keyboard hints: ↑↓ Navigate | Enter Select | Esc Close  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Header Layout - Desktop

```
┌──────────────────────────────────────────────────────────────────┐
│                     Persistent Header (60px)                     │
├──────────────┬───────────────────────────────┬──────────────────┤
│   LEFT       │          CENTER               │      RIGHT       │
│              │                               │                  │
│  ┌────────┐  │                               │  ┌────┐  ┌────┐ │
│  │ 🏠  ▼  │  │       DevTools                │  │ 🔍 │  │ 🌙 │ │
│  └────────┘  │                               │  └────┘  └────┘ │
│  Home +      │       Branding                │  Search  Theme   │
│  Dropdown    │                               │  Button  Toggle  │
└──────────────┴───────────────────────────────┴──────────────────┘
      │
      ├─ Dropdown (opens on click)
      │
      ▼
┌──────────────────────────────────┐
│  Recent Tools                    │
├──────────────────────────────────┤
│  📋 JSON Schema Validator        │
│  📊 SIP Calculator               │
│  🔀 HTML ↔ Markdown              │
│  📝 Text Diff Checker            │
│  🏠 EMI Calculator               │
└──────────────────────────────────┘
```

---

## 3. Header Layout - Mobile (<768px)

```
┌───────────────────────────────────────┐
│   Persistent Header (56px)            │
├──────┬──────────────────────┬─────────┤
│ LEFT │      CENTER          │  RIGHT  │
│      │                      │         │
│ 🏠▼  │    DevTools          │ 🔍  🌙  │
│      │                      │         │
└──────┴──────────────────────┴─────────┘
   │
   └─ Dropdown (full width)
      │
      ▼
┌───────────────────────────────────────┐
│  Recent Tools                         │
├───────────────────────────────────────┤
│  📋 JSON Schema                       │
│  📊 SIP Calculator                    │
│  🔀 HTML ↔ Markdown                   │
└───────────────────────────────────────┘
```

---

## 4. Navigation Flow

```
       ┌──────────────┐
       │  Home Page   │
       │    (root)    │
       └──────┬───────┘
              │
      ┌───────┴────────┐
      │                │
      ▼                ▼
┌──────────┐    ┌────────────┐
│ Click    │    │ Click      │
│ Tool     │    │ Search     │
│ Card     │    │ Button     │
└─────┬────┘    └──────┬─────┘
      │                │
      │                ▼
      │         ┌──────────────┐
      │         │ Search Modal │
      │         │   Opens      │
      │         └──────┬───────┘
      │                │
      │                │ Type Query
      │                │ Arrow Keys
      │                │ Press Enter
      │                │
      │                ▼
      │         ┌──────────────┐
      │         │ Select Tool  │
      │         └──────┬───────┘
      │                │
      └────────────────┘
                       │
                       ▼
               ┌───────────────┐
               │  Tool Page    │
               │  (loaded)     │
               └───────┬───────┘
                       │
                  ┌────┴────┐
                  │         │
                  ▼         ▼
           ┌──────────┐  ┌─────────┐
           │ Click    │  │ Click   │
           │ Home     │  │ Recent  │
           │ Button   │  │ Tool    │
           └────┬─────┘  └────┬────┘
                │             │
                │             │
                ▼             ▼
           Back to       Different
            Home          Tool Page
```

---

## 5. State Management Flow

```
┌─────────────────────────────────────────────────┐
│          NavigationStateManager                 │
│                                                 │
│  State:                                         │
│  ┌───────────────────────────────────────┐    │
│  │ currentTool: 'json-schema'            │    │
│  │ previousTool: 'sip-calculator'        │    │
│  │ recentTools: ['json', 'sip', 'emi']   │    │
│  │ theme: 'dark'                         │    │
│  └───────────────────────────────────────┘    │
│                                                 │
│  Methods:                                       │
│  • setCurrentTool(toolId)                      │
│  • addToRecent(toolId)                         │
│  • getRecentTools()                            │
│  • subscribe(key, callback)                    │
│  • save() → localStorage                       │
└─────────────────┬───────────────────────────────┘
                  │
          ┌───────┴────────┐
          │                │
          ▼                ▼
    ┌──────────┐    ┌─────────────┐
    │  Router  │    │   Header    │
    │Middleware│    │  Component  │
    └────┬─────┘    └──────┬──────┘
         │                 │
         │ Route Change    │ User Click
         │                 │
         ▼                 ▼
    Update State      Read State
         │                 │
         └────────┬────────┘
                  │
                  ▼
         ┌────────────────┐
         │  localStorage  │
         │  (persisted)   │
         └────────────────┘
```

---

## 6. Router Middleware Pattern

```
User Navigates → window.location.hash = '#/json-schema'
                            │
                            ▼
                  ┌─────────────────┐
                  │  Router Detects │
                  │   Hash Change   │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ BEFORE          │
                  │ Middleware      │
                  │ - Track Nav     │
                  │ - Update BreadC │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  Load Tool      │
                  │  Handler        │
                  │  (user code)    │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ AFTER           │
                  │ Middleware      │
                  │ - Add to Recent │
                  │ - Save State    │
                  │ - Analytics     │
                  └────────┬────────┘
                           │
                           ▼
                  Tool Page Rendered
```

---

## 7. Search Modal Interaction Flow

```
User Clicks Search Button (🔍)
         │
         ▼
┌────────────────────┐
│ SearchModal.open() │
└────────┬───────────┘
         │
         ├─ Show modal overlay
         ├─ Focus search input
         ├─ Trap keyboard focus
         └─ Show all tools (initial state)
         │
         ▼
User Types "calc"
         │
         ▼
┌─────────────────────────────┐
│ SearchModal.handleSearch()  │
└────────┬────────────────────┘
         │
         ├─ searchTools('calc')
         │  ├─ Score each tool
         │  ├─ Filter score > 0
         │  └─ Sort by score
         │
         ├─ Update this.results
         │
         └─ renderResults()
             │
             ▼
    Display Matched Tools:
    - SIP Calculator (score: 50)
    - EMI Calculator (score: 50)
         │
         ▼
User Presses ↓ Arrow Key
         │
         ▼
┌──────────────────────────┐
│ handleKeyboard('ArrowDown') │
└────────┬─────────────────┘
         │
         ├─ selectedIndex++
         └─ Highlight next result
         │
         ▼
User Presses Enter
         │
         ▼
┌─────────────────────────┐
│ navigateToTool(selected) │
└────────┬────────────────┘
         │
         ├─ window.location.hash = tool.route
         ├─ close()
         └─ Router handles navigation
```

---

## 8. Recent Tools Tracking

```
User Opens Tool (e.g., JSON Schema)
         │
         ▼
┌──────────────────────────────┐
│ Router Middleware (AFTER)    │
│ - navState.setCurrentTool()  │
└────────┬─────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ NavigationStateManager              │
│                                     │
│ Current: recentTools = []           │
│                                     │
│ addToRecent('json-schema')          │
│  ├─ Remove if exists                │
│  ├─ Add to front of array           │
│  ├─ Limit to 5 tools                │
│  └─ Save to localStorage            │
│                                     │
│ New: recentTools = ['json-schema']  │
└────────┬────────────────────────────┘
         │
         ▼
┌────────────────────────────┐
│ Notify Subscribers         │
│ - persistentHeader         │
│ - analyticsTracker         │
└────────┬───────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ PersistentHeader             │
│ - updateRecentTools()        │
│ - Render dropdown with tools │
└──────────────────────────────┘

EXAMPLE PROGRESSION:
Visit 1: JSON Schema    → ['json-schema']
Visit 2: SIP Calc       → ['sip-calculator', 'json-schema']
Visit 3: EMI Calc       → ['emi-calculator', 'sip-calculator', 'json-schema']
Visit 4: JSON Schema    → ['json-schema', 'emi-calculator', 'sip-calculator']
                           (moved to front, no duplicate)
```

---

## 9. Responsive Breakpoints

```
Mobile (< 768px)
┌─────────────────────┐
│ 🏠▼ DevTools  🔍 🌙 │ 56px
├─────────────────────┤
│                     │
│   Full Width        │
│   Content           │
│                     │
└─────────────────────┘

Tablet (768px - 1023px)
┌──────────────────────────────┐
│ 🏠▼  DevTools        🔍  🌙  │ 60px
├──────────────────────────────┤
│                              │
│     Constrained Width        │
│         Content              │
│                              │
└──────────────────────────────┘

Desktop (>= 1024px)
┌────────────────────────────────────────┐
│  🏠▼    DevTools           🔍    🌙    │ 60px
├────────────────────────────────────────┤
│                                        │
│      Max Width: 1280px                 │
│      Centered Container                │
│                                        │
└────────────────────────────────────────┘
```

---

## 10. Data Flow Architecture

```
┌────────────────────────────────────────────────────────┐
│                    User Interaction                     │
│  (Click, Type, Navigate)                                │
└────────────────────┬───────────────────────────────────┘
                     │
        ┌────────────┴─────────────┐
        │                          │
        ▼                          ▼
┌───────────────┐          ┌──────────────┐
│  UI Component │          │   Router     │
│  - Header     │          │   - Hash     │
│  - Search     │          │   - Route    │
│  - Dropdown   │          │   - Handler  │
└───────┬───────┘          └──────┬───────┘
        │                         │
        │ Action                  │ Navigation
        ▼                         ▼
┌─────────────────────────────────────────┐
│     NavigationStateManager              │
│  • In-Memory State (reactive)           │
│  • Pub/Sub Pattern (notify subscribers) │
│  • Debounced Persistence                │
└───────┬───────────────────┬─────────────┘
        │                   │
        │ Save              │ Notify
        ▼                   ▼
┌──────────────┐    ┌──────────────────┐
│ localStorage │    │   Subscribers    │
│  (persisted) │    │  - Header        │
│              │    │  - Analytics     │
│              │    │  - Breadcrumb    │
└──────────────┘    └────────┬─────────┘
                             │
                             │ Update
                             ▼
                    ┌─────────────────┐
                    │   UI Re-render  │
                    │  (if needed)    │
                    └─────────────────┘
```

---

## 11. Bundle Size Breakdown

```
Current Bundle: ~138KB

New Components:
┌──────────────────────────┬─────────┬────────────┐
│ Component                │ Size    │ Percentage │
├──────────────────────────┼─────────┼────────────┤
│ Header Component         │  3 KB   │   2.2%     │
│ Search Modal Component   │  5 KB   │   3.6%     │
│ Nav State Manager        │  4 KB   │   2.9%     │
├──────────────────────────┼─────────┼────────────┤
│ Total New Code           │ 12 KB   │   8.7%     │
└──────────────────────────┴─────────┴────────────┘

New Total: ~150KB (within budget ✅)
```

---

## 12. Performance Timeline

```
User Action: Click Search Button
                 │
  t=0ms          ▼
                 Event Handler
                 │
  t=50ms         ▼
                 Modal DOM Render
                 │
  t=100ms        ▼
                 CSS Animation (fade in)
                 │
  t=150ms        ▼
                 Focus Search Input
                 │
                 READY FOR INPUT
                 
User Action: Type "calc"
                 │
  t=0ms          ▼
                 Input Event
                 │
  t=300ms        ▼ (debounced)
                 searchTools('calc')
                 │
  t=305ms        ▼
                 Filter & Sort (6 tools)
                 │
  t=310ms        ▼
                 Render Results
                 │
  t=350ms        ▼
                 Animation Complete
                 │
                 RESULTS VISIBLE

Target: All interactions < 150ms
Status: ✅ Achieved
```

---

**These diagrams complement the full architecture specification in [NAVIGATION_HEADER_ARCHITECTURE.md](./NAVIGATION_HEADER_ARCHITECTURE.md)**
