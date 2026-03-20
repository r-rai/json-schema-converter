# Content Security Policy (CSP) Migration Plan

## Executive Summary

This document outlines the migration strategy for implementing a strict Content Security Policy (CSP) to eliminate `unsafe-inline` directives and enhance security against XSS attacks.

## Audit Results (Completed: March 19, 2026)

### Current State Analysis

**Project-Wide Inline Code Audit:**
- **Inline Styles:** 61 occurrences across all HTML/JS files
- **Inline Event Handlers:** 48 occurrences (onclick, onerror, etc.)
- **Inline Script Tags:** 5 occurrences (mostly in test files)

**Tools-Specific Breakdown:**
- **Inline Styles in Tools:** 29 occurrences
- **Event Handlers in Tools:** 28 occurrences
- **Script Tags in Tools:** 5 occurrences

### Risk Assessment

**Current Security Posture:**
- ⚠️ **HIGH RISK:** Inline event handlers create XSS attack surface
- ⚠️ **MEDIUM RISK:** Inline styles prevent strict CSP adoption
- ⚠️ **MEDIUM RISK:** Dynamic script loading requires CSP exceptions

**Impact of Strict CSP:**
Without migration, strict CSP would break:
1. All inline event handlers (buttons, forms, etc.)
2. Dynamic styling in JavaScript
3. Test automation pages with inline scripts
4. Progress indicators and dynamic UI updates

## Target CSP Policy

### Phase 1 Target (Post-Migration)
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self';
  img-src 'self' data:;
  font-src 'self';
  connect-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
```

### Phase 2 Target (With Nonces - Future)
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-{random}';
  style-src 'self' 'nonce-{random}';
  img-src 'self' data:;
  font-src 'self';
  connect-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
```

## Migration Strategy

### Sprint 2: Inline Styles Migration (Estimated: 6 hours)

**Objective:** Eliminate all inline `style=` attributes

**Approach:**
1. Extract inline styles to CSS classes
2. Create utility CSS classes for common patterns
3. Use CSS variables for dynamic values
4. Update JavaScript to toggle classes instead of inline styles

**Example Migration:**

**Before:**
```html
<div class="progress-fill" style="width: 50%"></div>
```

**After:**
```html
<!-- HTML -->
<div class="progress-fill" data-progress="50"></div>

<!-- CSS -->
.progress-fill {
  width: var(--progress-width, 0%);
}

<!-- JavaScript -->
progressFill.style.setProperty('--progress-width', '50%');
```

**Files Requiring Migration:**
- `tools/sip-calculator/automated-tests.html` - 5 inline styles
- `tools/html-markdown/automated-tests.html` - 8 inline styles
- `tools/json-schema/automated-tests.html` - 3 inline styles
- `index.html` - 10 inline styles (estimated)
- Other tool files - 35 inline styles (estimated)

### Sprint 3: Inline Event Handlers Migration (Estimated: 8 hours)

**Objective:** Replace all inline event handlers with addEventListener

**Approach:**
1. Remove all `onclick=`, `onerror=`, `onload=` attributes
2. Add unique IDs or data attributes for element selection
3. Register event listeners in JavaScript files
4. Use event delegation for dynamic elements

**Example Migration:**

**Before:**
```html
<button class="btn" onclick="runAllTests()">Run Tests</button>
```

**After:**
```html
<!-- HTML -->
<button class="btn" id="run-tests-btn">Run Tests</button>

<!-- JavaScript -->
document.getElementById('run-tests-btn').addEventListener('click', runAllTests);
```

**Files Requiring Migration:**
- `tools/sip-calculator/automated-tests.html` - 6 event handlers
- `tools/html-markdown/automated-tests.html` - 8 event handlers
- `tools/json-schema/automated-tests.html` - 4 event handlers
- Test pages across all tools - 30 event handlers (estimated)

### Sprint 4: Inline Script Extraction (Estimated: 4 hours)

**Objective:** Move all inline `<script>` code to external files

**Approach:**
1. Extract inline scripts to separate `.js` files
2. Load extracted scripts as modules
3. Preserve execution order and dependencies
4. Maintain initialization logic

**Example Migration:**

**Before:**
```html
<script>
  function runTests() {
    // Test code here
  }
  document.addEventListener('DOMContentLoaded', runTests);
</script>
```

**After:**
```html
<!-- HTML -->
<script type="module" src="test-runner.js"></script>

<!-- test-runner.js -->
function runTests() {
  // Test code here
}
document.addEventListener('DOMContentLoaded', runTests);
```

**Files Requiring Migration:**
- `tools/json-schema/automated-tests.html` - 1 inline script block
- Test harness pages - 4 inline scripts (estimated)

### Sprint 5: Dynamic Style Management (Estimated: 4 hours)

**Objective:** Refactor JavaScript that applies inline styles

**Approach:**
1. Replace `element.style.property = value` with CSS classes
2. Use CSS custom properties for dynamic values
3. Implement style state management
4. Use data attributes for conditional styling

**Example Migration:**

**Before:**
```javascript
element.style.display = 'none';
element.style.color = '#ff0000';
element.style.width = '75%';
```

**After:**
```javascript
// CSS
.hidden { display: none; }
.error-text { color: var(--error-color); }
.progress-bar { width: var(--progress, 0%); }

// JavaScript
element.classList.add('hidden');
element.classList.add('error-text');
element.style.setProperty('--progress', '75%');
```

**Files Requiring Refactoring:**
- All `*.js` files that manipulate element.style
- Approximately 25 occurrences to refactor

## Implementation Timeline

### Total Estimated Effort: 22 hours (3 days)

**Day 1 (8 hours):**
- Sprint 2: Inline Styles Migration (6 hours)
- Sprint 4: Inline Script Extraction (2 hours)

**Day 2 (8 hours):**
- Sprint 3: Inline Event Handlers Migration (8 hours)

**Day 3 (6 hours):**
- Sprint 5: Dynamic Style Management (4 hours)
- Testing and validation (2 hours)

## Testing Strategy

### Functional Testing
- [ ] All tools load without console errors
- [ ] All buttons and interactions work correctly
- [ ] All dynamic UI updates function properly
- [ ] No visual regressions

### Security Testing
- [ ] CSP violations logged to console (reporting mode)
- [ ] No unsafe-inline required in CSP
- [ ] No inline script execution
- [ ] External resources blocked appropriately

### Browser Testing
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)

## Rollout Plan

### Phase 1: Migration (Days 1-3)
- Complete code migrations
- Test in development environment
- Fix all CSP violations

### Phase 2: CSP Report-Only (Days 4-5)
- Deploy with CSP in report-only mode:
  ```
  Content-Security-Policy-Report-Only: default-src 'self'; ...
  ```
- Monitor CSP violation reports
- Fix any remaining violations

### Phase 3: CSP Enforcement (Day 6)
- Deploy with enforcing CSP header
- Monitor for runtime errors
- Prepare rollback plan

### Phase 4: Monitoring (Days 7-14)
- Monitor error rates
- Track security metrics
- Collect user feedback

## Acceptance Criteria

### Definition of Done
- [ ] Zero inline style attributes in production HTML
- [ ] Zero inline event handlers in production HTML
- [ ] Zero inline script blocks in production HTML
- [ ] All JavaScript uses addEventListener for events
- [ ] All dynamic styling uses CSS classes or custom properties
- [ ] Strict CSP enforced without unsafe-inline
- [ ] All tools function identically to before migration
- [ ] No console errors or CSP violations
- [ ] Documentation updated
- [ ] Team trained on new patterns

## Risks and Mitigations

### Risk 1: Breaking Changes
**Impact:** High  
**Probability:** Medium  
**Mitigation:** Comprehensive testing, gradual rollout with report-only mode

### Risk 2: Performance Impact
**Impact:** Low  
**Probability:** Low  
**Mitigation:** CSS classes are more performant than inline styles; monitor performance metrics

### Risk 3: Browser Compatibility
**Impact:** Medium  
**Probability:** Low  
**Mitigation:** Test in all target browsers; CSS custom properties supported in all modern browsers

### Risk 4: Developer Learning Curve
**Impact:** Low  
**Probability:** Medium  
**Mitigation:** Create coding guidelines, provide examples, conduct training session

## Success Metrics

### Security Improvements
- **CSP Grade:** Upgrade from F to A+
- **XSS Attack Surface:** 90% reduction
- **External Resource Control:** 100% controlled

### Performance Metrics
- **Page Load Time:** ≤ 5% change (acceptable)
- **Time to Interactive:** ≤ 5% change (acceptable)
- **CSS Cache Hit Rate:** Expected improvement

### Quality Metrics
- **Code Maintainability:** Improved (separation of concerns)
- **Debugging:** Easier (proper event listeners)
- **Browser DevTools:** Better source mapping

## Documentation Updates Required

1. **Developer Guide:** Add CSP best practices
2. **Code Style Guide:** Update with new patterns
3. **Architecture Docs:** Document CSP implementation
4. **Security Audit:** Update with CSP improvements

## Training Requirements

**Team Training Session (1 hour):**
1. CSP fundamentals and benefits
2. New coding patterns (no inline code)
3. Using CSS custom properties
4. addEventListener vs inline handlers
5. Debugging CSP violations

## Post-Migration Monitoring

**Week 1-2 Monitoring:**
- CSP violation reports (should be zero)
- JavaScript error rate
- User-reported issues
- Performance metrics
- Security scan results

## Conclusion

This migration will significantly improve security posture by:
1. ✅ Eliminating XSS attack vectors from inline code
2. ✅ Enabling strict CSP enforcement
3. ✅ Improving code maintainability
4. ✅ Following security best practices

**Next Steps:**
1. Review and approve this migration plan
2. Schedule 3-day implementation window
3. Allocate developer resources
4. Begin Sprint 2 implementation

---

**Document Version:** 1.0  
**Last Updated:** March 19, 2026  
**Status:** Ready for Review  
**Estimated Completion:** March 22-24, 2026 (3 working days)
