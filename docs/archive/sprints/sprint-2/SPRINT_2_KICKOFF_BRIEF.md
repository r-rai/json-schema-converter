# Sprint 2 Kickoff Brief
**CSP Hardening & Component Adoption**

**Sprint:** 2 of 4 | **Timeline:** March 20-22, 2026 (3 days) | **Status:** 🚀 STARTING NOW

---

## Quick Context

**Sprint 1 Results:**
- ✅ 15/15 tests passed
- ✅ All libraries migrated to /lib/ (zero CDN dependencies)
- ✅ Security: C+ → B+ (85/100)
- ✅ Architecture: B+ (84/100)

**Sprint 2 Goals:**
- 🎯 Remove CSP `unsafe-inline` (enable strict policy)
- 🎯 Increase component adoption (40% → 80%+)
- 🎯 Add error boundaries (graceful failure handling)
- 🎯 Eliminate XSS vulnerabilities (innerHTML audit)
- 🎯 Target grades: A- (90+) for both Security and Architecture

---

## 📋 Your Tasks (26 hours over 3 days)

### Day 3 (March 20) - CSP Critical Work [8 hours]

**Morning:**
1. Create `shared/css/tool-styles.css` with extracted inline styles
2. Link new CSS in all 6 tool HTML files
3. Replace 29 inline `style=` attributes with CSS classes
4. Test visual consistency

**Afternoon:**
5. Extract 28 inline event handlers to JavaScript
6. Use `addEventListener` patterns in all tools
7. Remove `unsafe-inline` from CSP meta tags
8. Validate zero CSP violations in console

**✅ End of Day 3:** Zero inline styles, zero inline handlers, strict CSP active

---

### Day 4 (March 21) - Components & Error Handling [8 hours]

**Morning:**
1. Run component adoption audit script
2. Migrate SIP Calculator to use `createButton`, `createInput`
3. Migrate EMI Calculator to use components + `createCard`
4. Migrate Text Diff and HTML/Markdown to use components
5. Verify 80%+ component adoption

**Afternoon:**
6. Create `shared/js/error-boundary.js` module
7. Import ErrorBoundary in all 5 tool JS files
8. Wrap critical functions with `errorBoundary.wrap()`
9. Test error scenarios (show user-friendly modal)

**✅ End of Day 4:** 80%+ components, error boundaries active

---

### Day 5 (March 22) - Security & Performance [10 hours]

**Morning:**
1. Find all 17 innerHTML usages (`grep -rn "innerHTML" tools/`)
2. Categorize: safe vs unsafe (user input)
3. Fix unsafe innerHTML (use `textContent` or `DOMPurify.sanitize()`)
4. Document safe usages with comments
5. Test XSS injection attempts (should fail safely)

**Afternoon:**
6. Create `performance-budget.json` configuration
7. Create `tools/check-bundle-size.js` monitoring script
8. Create `shared/js/state-manager.js` module
9. Migrate 3 tools to use state manager (replace localStorage)
10. Run bundle size checks and ensure all pass

**✅ End of Day 5:** Zero XSS risks, performance monitoring, unified state management

---

## 📚 Essential Reading

**Before you start:**
1. Read [docs/CSP_MIGRATION_PLAN.md](CSP_MIGRATION_PLAN.md) (lines 1-250)
2. Review existing components: `shared/components/button.js`, `input.js`, `card.js`, `modal.js`
3. Check [SPRINT_2_TECHNICAL_IMPLEMENTATION_GUIDE.md](SPRINT_2_TECHNICAL_IMPLEMENTATION_GUIDE.md) for detailed code examples

**Main implementation guide:**
- **Full guide:** `/docs/SPRINT_2_TECHNICAL_IMPLEMENTATION_GUIDE.md` (your step-by-step playbook)

---

## 🎯 Success Criteria (35 tests total)

| Category | Tests | Priority |
|----------|-------|----------|
| CSP Compliance | 10 tests | CRITICAL |
| Component Adoption | 8 tests | HIGH |
| Error Boundaries | 6 tests | HIGH |
| innerHTML Security | 5 tests | CRITICAL |
| Performance Budget | 3 tests | MEDIUM |
| State Manager | 3 tests | MEDIUM |

**Pass Rate Target:** ≥95% (33+ tests passing)

---

## 📦 Deliverables

### New Files You'll Create (5)
1. `shared/css/tool-styles.css` - Extracted inline styles
2. `shared/js/error-boundary.js` - Error handling system
3. `shared/js/state-manager.js` - Unified state persistence
4. `performance-budget.json` - Bundle size limits
5. `tools/check-bundle-size.js` - Size monitoring script

### Files You'll Modify
- All 5 tool `index.html` files (CSP tags, CSS links)
- All 5 tool `.js` files (event listeners, components, error boundaries)
- `package.json` (add scripts)

### Documentation
- `docs/INNERHTML_SECURITY_AUDIT.md` (create)
- `docs/SPRINT_2_COMPLETION_REPORT.md` (create at end)

---

## 🚀 Getting Started

```bash
# 1. Verify Sprint 1 foundation
cd /home/ravi/projects/json-schema-converter
ls -la lib/          # Should see 5 libraries (287 KB total)
grep -r "cdn" tools/ # Should return 0 CDN references

# 2. Check current structure
ls -la shared/components/  # button.js, input.js, card.js, modal.js
ls -la shared/css/         # utilities.css, themes.css, etc.
ls -la tools/              # 5 tool directories

# 3. Open implementation guide
# Read: docs/SPRINT_2_TECHNICAL_IMPLEMENTATION_GUIDE.md

# 4. Start Day 3 work
# Begin with Task 3.1: Create shared/css/tool-styles.css
```

---

## ⚠️ Critical Notes

**CSP Migration (Day 3):**
- Test THOROUGHLY after each change - visual regressions are easy to introduce
- Use browser DevTools console - CSP violations will show as errors
- Don't remove `unsafe-inline` until ALL styles/handlers are migrated

**Component Adoption (Day 4):**
- Components use module imports: `import { createButton } from '/shared/components/button.js';`
- Review existing component JSDoc for API documentation
- Measure adoption with audit script before/after

**innerHTML Security (Day 5):**
- **NEVER** use `innerHTML` with unsanitized user input
- Use `textContent` for plain text
- Use `DOMPurify.sanitize()` for HTML content
- Document why each remaining innerHTML is safe

**Error Boundaries (Day 4):**
- Wrap ALL event handlers: `element.addEventListener('click', errorBoundary.wrap(handler))`
- Wrap initialization: `document.addEventListener('DOMContentLoaded', errorBoundary.wrap(init))`
- Test error scenarios - modal should appear, tool should stay functional

---

## 🆘 Getting Help

**If you're stuck:**
1. Check the detailed implementation guide (SPRINT_2_TECHNICAL_IMPLEMENTATION_GUIDE.md)
2. Look for similar patterns in `index.html` (home page uses components)
3. Review existing shared code in `shared/components/` and `shared/js/`
4. Search for examples: `grep -rn "createButton" .` to see usage patterns

**Common issues:**
- **CSP violation:** Check for missed inline styles or handlers
- **Component not working:** Verify import path and module type
- **Visual regression:** Compare CSS classes to original inline styles
- **Error boundary not catching:** Ensure function is wrapped correctly

---

## 📊 Progress Tracking

Track your progress daily:

**Day 3 Checklist:**
- [ ] tool-styles.css created
- [ ] All tools link to tool-styles.css
- [ ] Zero inline styles remain
- [ ] Zero inline handlers remain
- [ ] CSP strict policy active
- [ ] No console errors
- [ ] All tools visually identical

**Day 4 Checklist:**
- [ ] Component adoption ≥80%
- [ ] SIP Calculator uses components
- [ ] EMI Calculator uses components
- [ ] Text Diff uses components
- [ ] HTML/Markdown uses components
- [ ] error-boundary.js created
- [ ] All tools have error boundaries
- [ ] Error modal tested

**Day 5 Checklist:**
- [ ] innerHTML audit complete
- [ ] Zero unsafe innerHTML
- [ ] XSS tests pass
- [ ] performance-budget.json created
- [ ] check-bundle-size.js works
- [ ] state-manager.js created
- [ ] 3 tools use state manager
- [ ] All tests run successfully

---

## 🎉 Sprint 2 Completion

**When done:**
1. Run all 35 validation tests (coordinate with Test Specialist)
2. Create `docs/SPRINT_2_COMPLETION_REPORT.md` using template in implementation guide
3. Calculate final metrics:
   - Component adoption percentage
   - Bundle sizes vs budgets
   - Security grade improvement
   - Architecture grade improvement
4. Get Tech Lead approval

**Expected outcomes:**
- 🔒 Security: B+ (85) → A- (90+)
- 🏗️ Architecture: B+ (84) → A- (90+)
- 🧪 Tests: 33+/35 passing (≥95%)
- 📦 All bundles within budget
- 🎯 Production-ready security posture

---

**Questions?** Review the implementation guide or ask for clarification before starting.

**Ready to begin?** Start with Day 3, Task 3.1 in the implementation guide!

Good luck! 🚀🎯
