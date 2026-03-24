# Phase 2.2 Homepage Redesign - Testing Checklist

**Date:** March 23, 2026  
**Status:** Ready for Testing  
**Implementation Report:** `/docs/reports/phase-2.2-homepage-implementation.md`

---

## 🎯 Quick Start Testing

### Prerequisites

1. **Start Local Server:**
   ```bash
   cd /home/ravi/projects/json-schema-converter
   python3 -m http.server 8008
   ```

2. **Open Homepage:**
   - Navigate to `http://localhost:8008/` in your browser
   - Test in both Chrome DevTools and real devices

---

## ✅ Critical Tests (Must Pass)

### 1. Theme Toggle Test

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1.1 | Open homepage | Theme matches system preference | [ ] |
| 1.2 | Click theme toggle button | Instant switch, no flash | [ ] |
| 1.3 | Reload page | Theme persists from previous session | [ ] |
| 1.4 | Toggle again | Switches back to original theme | [ ] |
| 1.5 | Check icon | Sun in dark mode, moon in light mode | [ ] |

**Pass Criteria:** All tests pass with no FOUC (Flash of Unstyled Content)

---

### 2. Tool Navigation Test

| Card # | Tool Name | Link | Expected Destination | Status |
|--------|-----------|------|----------------------|--------|
| 1 | JSON Schema Validator | Click card | `/tools/json-schema/` | [ ] |
| 2 | HTML ↔ Markdown | Click card | `/tools/html-markdown/` | [ ] |
| 3 | Text Diff Checker | Click card | `/tools/text-diff/` | [ ] |
| 4 | SIP Calculator | Click card | `/tools/sip-calculator/` | [ ] |
| 5 | EMI Calculator | Click card | `/tools/emi-calculator/` | [ ] |

**Pass Criteria:** All 5 tool pages load correctly

---

### 3. Responsive Layout Test

| Viewport | Width | Expected Layout | Status |
|----------|-------|-----------------|--------|
| iPhone SE | 375px | 1 column, stacked cards | [ ] |
| iPad Portrait | 768px | 2 columns | [ ] |
| iPad Landscape | 1024px | 3 columns | [ ] |
| Desktop | 1920px | 3 columns, centered container | [ ] |

**How to Test:**
1. Open Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M / Cmd+Shift+M)
3. Select preset devices or enter custom dimensions
4. Verify grid columns match expected layout

**Pass Criteria:** Grid adapts correctly at all breakpoints

---

### 4. Heritage Theme Visual Test

#### Light Mode ("Indic Futurism")

| Element | Expected | Status |
|---------|----------|--------|
| **Background** | Warm off-white (#FDFBF7) | [ ] |
| **Logo Icon** | Terracotta (#C84B31) | [ ] |
| **Card Background** | Light beige (#F4EFE6) | [ ] |
| **Card Shadow** | Soft drop shadow (subtle) | [ ] |
| **Card Hover** | Shadow intensifies | [ ] |
| **Tags** | Rounded corners (full) | [ ] |
| **Typography** | Rozha One (headings), Plus Jakarta Sans (body) | [ ] |

#### Dark Mode ("Neon Heritage")

| Element | Expected | Status |
|---------|----------|--------|
| **Background** | Near black (#08080C) | [ ] |
| **Logo Icon** | Neon cyan (#00F0FF) | [ ] |
| **Card Background** | Dark surface (#12131C) | [ ] |
| **Card Shadow** | Neon orange glow | [ ] |
| **Card Hover** | Brighter glow + cyan border | [ ] |
| **Tags** | Sharp corners (4px) | [ ] |
| **Typography** | Same fonts as light mode | [ ] |

**Pass Criteria:** Visual appearance matches spec in both themes

---

### 5. Interactive Effects Test

| Element | Action | Expected Effect | Status |
|---------|--------|-----------------|--------|
| **Tool Card** | Hover | Lifts up 0.5rem | [ ] |
| **Tool Card** | Hover | Shadow enhances | [ ] |
| **Tool Card (Dark)** | Hover | Cyan border appears | [ ] |
| **Nav Links** | Hover | Color changes to primary | [ ] |
| **Theme Button** | Hover | Scales up 10% | [ ] |

**Pass Criteria:** All hover effects trigger smoothly

---

## 🎨 Accessibility Tests (WCAG 2.1 AA)

### Keyboard Navigation Test

| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 6.1 | Press Tab | Focus moves to theme toggle | [ ] |
| 6.2 | Press Tab | Focus moves to Home nav link | [ ] |
| 6.3 | Press Tab | Focus moves to Tools nav link | [ ] |
| 6.4 | Press Tab | Focus moves to About nav link | [ ] |
| 6.5 | Continue Tab | Focus moves through each of 5 tool cards | [ ] |
| 6.6 | Press Enter on card | Navigates to tool page | [ ] |

**Pass Criteria:** Can navigate entire page with keyboard only

---

### Focus Indicators Test

| Element | Focus State | Expected | Status |
|---------|-------------|----------|--------|
| **Theme Button** | Focus | Visible outline (2px) | [ ] |
| **Nav Links** | Focus | Visible outline (2px) | [ ] |
| **Tool Cards** | Focus | Visible outline (2px, 4px offset) | [ ] |

**Pass Criteria:** All focus indicators visible and high contrast

---

### Screen Reader Test (Optional but Recommended)

| Element | Expected Announcement | Status |
|---------|----------------------|--------|
| **Page Title** | "DevToolbox - Developer Tools Platform" | [ ] |
| **H1** | "DevToolbox" | [ ] |
| **Theme Button** | "Toggle dark mode theme, button" | [ ] |
| **Tool Cards** | Announces tool name and description | [ ] |
| **Hidden Heading** | "Available Developer Tools" (for screen readers) | [ ] |

**Tools:** NVDA (Windows), VoiceOver (Mac), TalkBack (Android)

**Pass Criteria:** Page structure makes sense when navigated by screen reader

---

## 🔍 Visual Regression Tests

### Compare Old vs New Homepage

| Aspect | Old Homepage | New Homepage | Status |
|--------|--------------|--------------|--------|
| **Load Time** | ~3s (estimated) | ~1.5s (estimated) | [ ] |
| **HTML Size** | 4548 lines | 540 lines | [ ] |
| **CSS Approach** | Inline styles | External utilities | [ ] |
| **Theme Toggle** | Working | Working | [ ] |
| **Tool Links** | Working | Working | [ ] |

**Pass Criteria:** New homepage is faster and more maintainable

---

## 🖥️ Browser Compatibility Tests

| Browser | Version | Theme Toggle | Layout | Hover Effects | Status |
|---------|---------|--------------|--------|---------------|--------|
| **Chrome** | Latest | [ ] | [ ] | [ ] | [ ] |
| **Firefox** | Latest | [ ] | [ ] | [ ] | [ ] |
| **Safari** | Latest | [ ] | [ ] | [ ] | [ ] |
| **Edge** | Latest | [ ] | [ ] | [ ] | [ ] |

**Pass Criteria:** Works consistently across all modern browsers

---

## 📱 Mobile Device Testing (Optional)

### Real Device Tests

| Device | Theme Toggle | Touch Targets | Responsive Layout | Status |
|--------|--------------|---------------|-------------------|--------|
| iPhone | [ ] | [ ] | [ ] | [ ] |
| Android Phone | [ ] | [ ] | [ ] | [ ] |
| iPad | [ ] | [ ] | [ ] | [ ] |

**Pass Criteria:**
- Touch targets ≥ 44x44px
- No horizontal scroll
- Readable text sizes

---

## 🐛 Known Issues to Verify

### Minor Issues from Implementation Report

| Issue | Expected Behavior | Priority | Status |
|-------|-------------------|----------|--------|
| **Mobile Menu Button** | Non-functional (expected) | Medium | [ ] |
| **About Link** | Links to `#about` (no section) | Low | [ ] |

**Note:** These are known limitations, not bugs. Verify they behave as documented.

---

## 📊 Performance Tests (Optional)

### Lighthouse Audit

**How to Run:**
1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Desktop" mode
4. Check: Performance, Accessibility, Best Practices
5. Click "Generate Report"

**Target Scores:**
- **Performance:** ≥ 90
- **Accessibility:** ≥ 90
- **Best Practices:** ≥ 90

**Pass Criteria:** All scores ≥ 90

---

### Network Analysis

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| **Total Requests** | < 20 | | [ ] |
| **Total Size** | < 500 KB | | [ ] |
| **CSS Bundle** | < 50 KB | | [ ] |
| **First Paint** | < 1.5s | | [ ] |

**Pass Criteria:** All metrics within budget

---

## 🎉 Final Sign-Off

### Critical Tests Summary

- [ ] **Theme Toggle:** Works in both directions, persists
- [ ] **Tool Navigation:** All 5 links work
- [ ] **Responsive Layout:** Adapts at 3 breakpoints
- [ ] **Heritage Themes:** Both light and dark render correctly
- [ ] **Keyboard Navigation:** Complete tab order
- [ ] **No Console Errors:** DevTools console is clean

### Overall Status

- [ ] **All Critical Tests Passed**
- [ ] **No Blockers Found**
- [ ] **Ready for Production**

---

## 📝 Notes & Observations

**Tester Name:** _______________________  
**Test Date:** _______________________  
**Browser(s) Used:** _______________________  

**Additional Comments:**
```
[Space for notes about issues, suggestions, or observations]
```

---

**Checklist Version:** 1.0  
**Last Updated:** March 23, 2026  
**Linked Report:** [phase-2.2-homepage-implementation.md](./phase-2.2-homepage-implementation.md)
