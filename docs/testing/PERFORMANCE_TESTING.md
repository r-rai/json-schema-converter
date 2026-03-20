# Performance Testing Plan## Developer Toolset Platform Performance Validation

**Document Version:** 1.0  
**Last Updated:** March 19, 2026  
**Performance Budget:** <2s load, <500ms interactions, <150KB total bundle  
**Testing Timeline:** Weeks 1, 3, 7, 10

---

## Overview

This document defines the performance testing strategy, metrics, benchmarks, and acceptance criteria for the Developer Toolset Platform. All performance targets must be met before production launch.

**Performance Commitment:** Fast, responsive tools that work efficiently on mid-range hardware

---

## Performance Targets

### 1. Load Time Metrics

| Metric | Target | Acceptable | Unacceptable |
|--------|--------|------------|--------------|
| **Initial Page Load** (Home) | < 1.5s | < 2s | > 2s |
| **Tool Load** (First Visit) | < 2s | < 3s | > 3s |
| **Tool Switch** (Cached) | < 300ms | < 500ms | > 500ms |
| **First Contentful Paint (FCP)** | < 1s | < 1.5s | > 1.5s |
| **Time to Interactive (TTI)** | < 2s | < 3s | > 3s |
| **Largest Contentful Paint (LCP)** | < 2.5s | < 4s | > 4s |

**Test Environment:**
- Network: Fast 3G (1.5 Mbps down, 750 Kbps up, 562ms RTT)
- Device: Mid-range laptop (8GB RAM, Core i5)
- Browser: Chrome 90+, Edge 90+

---

### 2. Bundle Size Budget

| Asset Type | Target | Max Acceptable | Current Projection |
|------------|--------|----------------|-------------------|
| **Core Platform JS** | 25KB | 35KB | ~30KB ✅ |
| **Shared Components** | 10KB | 15KB | ~15KB ⚠️ |
| **Per-Tool JS** | 8KB | 15KB | ~8-15KB ✅ |
| **Chart.js** (lazy) | 45KB | 50KB | ~50KB ✅ |
| **jsdiff** (lazy) | 10KB | 15KB | ~11KB ✅ |
| **Turndown + Marked + DOMPurify** | 35KB | 40KB | ~40KB ✅ |
| **Total CSS** | 20KB | 30KB | ~25KB ✅ |
| **Grand Total JS** | 120KB | 150KB | ~TBD ⚠️ |

**Status Key:**
- ✅ Projected within budget
- ⚠️ To be validated with actual measurements
- 🔴 Exceeds budget

**Enforcement:** Automated bundlesize checks in CI pipeline

---

### 3. Runtime Performance

| Operation | Target | Acceptable | Unacceptable |
|-----------|--------|------------|--------------|
| **JSON Schema Generation** (10KB) | < 100ms | < 200ms | > 200ms |
| **JSON Minify/Beautify** (100KB) | < 50ms | < 100ms | > 100ms |
| **SIP Calculation** (30 years) | < 50ms | < 100ms | > 100ms |
| **EMI Recalculation** | < 100ms | < 200ms | > 200ms |
| **Prepayment Amortization** | < 200ms | < 500ms | > 500ms |
| **HTML → Markdown** (50KB) | < 200ms | < 500ms | > 500ms |
| **Text Diff** (1,000 lines) | < 500ms | < 1s | > 1s |
| **Text Diff** (10,000 lines) | < 2s | < 5s | > 5s |
| **Chart Rendering** | < 300ms | < 500ms | > 500ms |

---

### 4. Memory Usage

| Scenario | Target | Acceptable | Unacceptable |
|----------|--------|------------|--------------|
| **Home Page Idle** | < 30MB | < 50MB | > 50MB |
| **Single Tool Active** | < 50MB | < 75MB | > 75MB |
| **3 Tools Loaded** | < 100MB | < 150MB | > 150MB |
| **Memory Leak** (30 min use) | < 10MB growth | < 25MB growth | > 25MB growth |

---

## Testing Methodology

### 1. Load Time Testing

**Tool:** Chrome DevTools Performance Tab + Lighthouse

**Test Procedure:**
1. Clear browser cache and storage
2. Open Chrome DevTools
3. Set network throttling to "Fast 3G"
4. Set CPU throttling to "4x slowdown"
5. Record performance profile
6. Navigate to target page
7. Stop recording when fully interactive
8. Measure FCP, LCP, TTI

**Automated Lighthouse Testing:**
```bash
# Run Lighthouse CI
npx lighthouse https://devtoolbox.com --preset=desktop --view
npx lighthouse https://devtoolbox.com --preset=mobile --view
```

**Acceptance Criteria:**
- Lighthouse Performance Score: > 90 (desktop), > 85 (mobile)
- All Core Web Vitals in "Good" range

---

### 2. Bundle Size Monitoring

**Tool:** bundlesize npm package + GitHub Actions

**Configuration:**
```json
// package.json
{
  "bundlesize": [
    {
      "path": "./shared/js/app.js",
      "maxSize": "15 KB"
    },
    {
      "path": "./shared/js/router.js",
      "maxSize": "5 KB"
    },
    {
      "path": "./shared/js/theme.js",
      "maxSize": "3 KB"
    },
    {
      "path": "./shared/js/storage.js",
      "maxSize": "3 KB"
    },
    {
      "path": "./shared/js/utils.js",
      "maxSize": "5 KB"
    },
    {
      "path": "./shared/components/*.js",
      "maxSize": "15 KB"
    },
    {
      "path": "./tools/json-schema/json-schema.js",
      "maxSize": "10 KB"
    },
    {
      "path": "./tools/sip-calculator/sip-calculator.js",
      "maxSize": "12 KB"
    },
    {
      "path": "./tools/html-markdown/html-markdown.js",
      "maxSize": "10 KB"
    },
    {
      "path": "./tools/text-diff/text-diff.js",
      "maxSize": "12 KB"
    },
    {
      "path": "./tools/emi-calculator/emi-calculator.js",
      "maxSize": "15 KB"
    },
    {
      "path": "./lib/chart.min.js",
      "maxSize": "55 KB"
    },
    {
      "path": "./lib/jsdiff.min.js",
      "maxSize": "15 KB"
    },
    {
      "path": "./shared/css/**/*.css",
      "maxSize": "30 KB"
    }
  ]
}
```

**GitHub Actions Integration:**
```yaml
# .github/workflows/performance.yml
name: Performance Checks

on: [push, pull_request]

jobs:
  bundle-size:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Check Bundle Size
        run: npx bundlesize
        env:
          CI: true
          
      - name: Comment PR with Results
        uses: actions/github-script@v6
        with:
          script: |
            // Post bundle size results to PR
```

**Manual Measurement:**
```bash
# Measure actual file sizes
du -sh shared/js/**/*.js
du -sh tools/**/*.js
du -sh lib/**/*.js
du -sh shared/css/**/*.css

# Gzipped sizes (closer to real-world)
gzip -c shared/js/app.js | wc -c
```

**Acceptance Criteria:**
- Total JS < 150KB (uncompressed)
- Total JS < 50KB (gzipped)
- All individual files within budget
- PR blocked if budget exceeded

---

### 3. Runtime Performance Testing

**Tool:** Chrome DevTools Performance Panel + Performance API

**Test Procedure:**
1. Open Chrome DevTools
2. Go to Performance tab
3. Click "Record"
4. Execute operation (e.g., calculate EMI)
5. Stop recording
6. Measure task duration in timeline

**Automated Performance Monitoring:**
```javascript
// Wrap expensive operations with performance markers
function performCalculation() {
  performance.mark('calc-start');
  
  const result = expensiveCalculation();
  
  performance.mark('calc-end');
  performance.measure('calculation', 'calc-start', 'calc-end');
  
  const measure = performance.getEntriesByName('calculation')[0];
  console.log(`Calculation took ${measure.duration}ms`);
  
  if (measure.duration > 200) {
    logPerformanceWarning('Calculation too slow', measure.duration);
  }
  
  return result;
}
```

**Test Cases Per Tool:**

**F-001: JSON Schema Enhancement**
- Parse and beautify 100KB JSON: < 100ms ✅
- Parse and minify 100KB JSON: < 50ms ✅
- Generate schema from 50KB JSON: < 200ms ✅
- Large file (1MB JSON): < 1s ✅

**F-002: SIP Calculator**
- Calculate 30-year SIP: < 50ms ✅
- Generate year-wise table (30 rows): < 100ms ✅
- Render Chart.js SIP chart: < 300ms ✅
- Recalculate on input change (debounced): < 100ms ✅

**F-003: HTML ↔ Markdown Converter**
- HTML → Markdown (10KB): < 100ms ✅
- Markdown → HTML (10KB): < 100ms ✅
- Large document (100KB): < 500ms ✅
- Live preview update (debounced): < 200ms ✅

**F-004: Text Diff Checker**
- Diff 100 lines: < 50ms ✅
- Diff 1,000 lines: < 500ms ✅
- Diff 10,000 lines: < 2s ⚠️ (virtualization required)
- Render diff output (virtualized): < 300ms ✅
- Toggle diff mode: < 100ms ✅

**F-005: EMI Calculator (Performance Critical)**
- Basic EMI calculation: < 100ms ✅
- Generate 20-year amortization (240 rows): < 200ms ✅
- Add prepayment entry: < 50ms ✅
- Recalculate with 1 lumpsum prepayment: < 200ms ✅
- Recalculate with 5 recurring prepayments: < 500ms ⚠️
- Render comparison chart: < 300ms ✅
- Export 30-year amortization to CSV: < 200ms ✅

**F-006: Home Page**
- Render tool grid (6 cards): < 100ms ✅
- Search filter (6 tools): < 50ms ✅
- Theme toggle: < 50ms ✅

---

### 4. Memory Leak Testing

**Tool:** Chrome DevTools Memory Panel

**Test Procedure:**
1. Open Chrome DevTools Memory tab
2. Take heap snapshot (baseline)
3. Use application for 30 minutes:
   - Switch between tools 10+ times
   - Perform calculations in each tool
   - Toggle theme multiple times
4. Take second heap snapshot
5. Compare heap sizes
6. Look for detached DOM nodes
7. Check event listener count

**Memory Leak Indicators:**
- Heap size growth > 25MB after 30 min
- Detached DOM nodes accumulating
- Event listeners not cleaned up
- Timer functions not cleared

**Prevention Patterns:**
```javascript
// Cleanup pattern for tool components
class ToolInstance {
  constructor() {
    this.timers = [];
    this.listeners = [];
  }
  
  setTimeout(fn, delay) {
    const id = setTimeout(fn, delay);
    this.timers.push(id);
    return id;
  }
  
  addEventListener(element, event, handler) {
    element.addEventListener(event, handler);
    this.listeners.push({ element, event, handler });
  }
  
  destroy() {
    // Clear all timers
    this.timers.forEach(id => clearTimeout(id));
    this.timers = [];
    
    // Remove all listeners
    this.listeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.listeners = [];
    
    // Clear any stored data
    this.data = null;
  }
}
```

**Acceptance Criteria:**
- Heap growth < 25MB after 30 minutes of use
- Zero detached DOM nodes after tool switch
- Event listener count stable (not growing)

---

### 5. Large Data Handling Testing

**Purpose:** Validate performance with edge-case large inputs

**Test Cases:**

**JSON Schema Converter:**
- 1MB JSON file: < 2s parse + schema generation
- 5MB JSON file: < 10s (acceptable with user warning)
- 10MB+ JSON file: Show size warning before processing

**Text Diff Checker:**
- 1,000 lines: < 500ms
- 10,000 lines: < 5s with virtualization
- 50,000 lines: Display warning, optional processing
- 100,000+ lines: Block and suggest alternative tool

**File Size Warnings:**
```javascript
function validateInputSize(input, maxSize = 5 * 1024 * 1024) {
  const size = new Blob([input]).size;
  
  if (size > maxSize) {
    return {
      valid: false,
      message: `Input too large (${formatBytes(size)}). Maximum ${formatBytes(maxSize)} recommended.`,
      proceed: confirm('Process anyway? This may take a while.')
    };
  }
  
  if (size > maxSize * 0.5) {
    showWarning(`Large input detected (${formatBytes(size)}). Processing may take 10-30 seconds.`);
  }
  
  return { valid: true };
}
```

---

## Testing Timeline

### Week 1: Baseline Measurement
**Activities:**
- Measure actual bundle sizes of core platform
- Validate projections vs reality
- Set up bundlesize CI checks
- Establish baseline metrics

**Deliverables:**
- Actual bundle size report
- Performance baseline document
- CI pipeline configured

---

### Week 3: First Tools Validation
**Scope:** JSON Schema, SIP Calculator

**Activities:**
- Load time testing (Lighthouse)
- Runtime performance testing (calculation speed)
- Bundle size validation
- Memory leak basic check

**Acceptance Criteria:**
- Both tools meet load time targets
- Calculations within performance budget
- No memory leaks detected
- Bundle size within budget

---

### Week 7: Mid-Project Comprehensive Test
**Scope:** All 4 completed tools

**Activities:**
- Full Lighthouse audit (all tools)
- Runtime performance suite (all calculations)
- Bundle size verification
- 30-minute memory leak test
- Large data handling validation

**Acceptance Criteria:**
- All tools pass Lighthouse (score > 90)
- All calculations meet performance targets
- Total bundle < 140KB (leaving 10KB buffer)
- No memory leaks across any tool

---

### Week 10: Final Performance Validation
**Scope:** Complete platform (6 tools + home)

**Activities:**
- Final Lighthouse audit (all pages)
- Complete runtime performance suite
- Final bundle size check
- Extended memory leak test (1 hour)
- Real-world usage simulation
- Performance regression testing

**Acceptance Criteria:**
- Platform-wide Lighthouse score > 85
- All performance targets met
- Bundle size < 150KB total
- No performance regressions from Week 7
- Memory stable over 1 hour use

---

## Performance Optimization Strategies

### 1. Code Splitting & Lazy Loading
```javascript
// Load heavy libraries only when needed
async function lazyLoadChartJS() {
  if (window.Chart) return;
  await loadScript('/lib/chart.min.js');
}

// Use tool when calculator loads, not on home page
```

### 2. Debouncing Expensive Operations
```javascript
const debouncedRecalculate = debounce(() => {
  recalculateEMI();
}, 300);

inputElement.addEventListener('input', debouncedRecalculate);
```

### 3. Virtualization for Large Lists
```javascript
// Only render visible rows in large tables
class VirtualTable {
  renderVisibleRows(startIndex, endIndex) {
    // Render only rows visible in viewport
  }
}
```

### 4. Web Workers for Heavy Computation
```javascript
// Move expensive diff calculation to worker
const worker = new Worker('diff-worker.js');
worker.postMessage({ original, modified });
worker.onmessage = (e) => {
  renderDiff(e.data.result);
};
```

### 5. Caching Expensive Results
```javascript
const memoizedFunction = memoize((input) => {
  return expensiveCalculation(input);
});
```

---

## Performance Budget Violations

### Response Process:

**1. Detection:**
- CI build fails on bundlesize check
- Lighthouse score drops below 85
- Manual testing reveals slow operation

**2. Investigation:**
- Identify which change caused regression
- Measure performance of specific operation
- Use Chrome DevTools profiler to find bottleneck

**3. Resolution Options:**
- **Optimize code:** Refactor slow algorithm
- **Lazy load:** Move code to separate bundle
- **Use Web Worker:** Offload to background thread
- **Add warning:** Notify user of slow operation
- **Increase budget:** If justified and approved

**4. Verification:**
- Re-run performance tests
- Confirm fix resolves issue
- Update test cases if needed

---

## Performance Reporting Template

### Performance Test Report

```markdown
# Performance Test Report - Week [X]

**Date:** [Date]  
**Tester:** [Name]  
**Tools Tested:** [List]

## Summary
- ✅ Pass: [#] tests
- ⚠️ Warning: [#] tests
- 🔴 Fail: [#] tests

## Load Time Results

| Page/Tool | FCP | LCP | TTI | Status |
|-----------|-----|-----|-----|--------|
| Home | 0.8s | 1.2s | 1.5s | ✅ Pass |
| JSON Schema | 1.1s | 1.8s | 2.1s | ⚠️ Warning |
| ... | ... | ... | ... | ... |

## Bundle Size Results

| Asset | Size | Budget | Status |
|-------|------|--------|--------|
| Core JS | 32KB | 35KB | ✅ Pass |
| ... | ... | ... | ... |

## Runtime Performance Results

| Operation | Duration | Target | Status |
|-----------|----------|--------|--------|
| EMI Calc | 85ms | <100ms | ✅ Pass |
| ... | ... | ... | ... |

## Issues Found

### Issue #1: [Title]
- **Severity:** [Critical/High/Medium/Low]
- **Metric Affected:** [Load time/Bundle size/Runtime]
- **Current Value:** [e.g., 2.5s]
- **Target Value:** [e.g., 2s]
- **Root Cause:** [Analysis]
- **Recommendation:** [Optimization approach]

## Recommendations
1. [Optimization 1]
2. [Optimization 2]

## Next Steps
- [ ] Fix critical issues
- [ ] Retest optimizations
- [ ] Update baselines if needed

## Sign-Off
- Tester: [Name] - [Date]
- Tech Lead: [Name] - [Date]
```

---

## Tools & Resources

### Testing Tools:
- **Chrome DevTools:** Built-in performance profiling
- **Lighthouse:** Automated performance audits
- **bundlesize:** Bundle size checking (https://github.com/siddharthkp/bundlesize)
- **WebPageTest:** Real-world performance testing
- **Performance API:** Runtime performance monitoring

### Monitoring Dashboards:
- Lighthouse CI: Trend tracking over time
- GitHub Actions: Automated checks on every commit

---

## Responsibility Matrix

| Role | Responsibility |
|------|---------------|
| **Developer** | Write performant code, follow best practices |
| **Tech Lead** | Review code for performance anti-patterns |
| **Test Specialist** | Execute performance tests, report issues |
| **Product Owner** | Define performance budgets, approve trade-offs |
| **Solution Architect** | Design performance-optimized architecture |

---

**Document Status:** Ready for Implementation  
**Owner:** Test Specialist (with Tech Lead support)  
**Review Cycle:** Weekly during Phase 2-4  
**Last Updated:** March 19, 2026
