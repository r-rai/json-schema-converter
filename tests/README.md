# Test Files

This directory contains HTML test files and test scripts used during development and debugging.

## Contents

### Platform Tests
- **test-platform.html** - Core platform functionality tests
- **test-all-tools.html** - Comprehensive test suite for all tools
- **test-ux-implementation.html** - UX/UI implementation tests
- **test-router-fix.js** - Router functionality test script

### Feature-Specific Tests
- **test-json-schema.html** - JSON Schema Generator & Validator tests
- **test-json-tool-integration.html** - JSON tool integration tests

### Fix Validation Tests
- **test-complete-fix.html** - Complete fix validation
- **test-critical-fix.html** - Critical bug fix validation
- **test-fixes.html** - General bug fix tests
- **test-urgent-fix.html** - Urgent fix validation (if present)

### Sprint Tests
- **test-final-sprint.html** - Final sprint validation
- **test-final-validation.html** - Final production validation

### Debugging Tests
- **test-console.html** - Console output testing
- **test-console-output.html** - Console debugging
- **visual-test.html** - Visual regression testing

## Running Tests

### Local Testing
```bash
# Start local server
python3 -m http.server 8000

# Open test files in browser
open http://localhost:8000/tests/test-all-tools.html
```

### Manual Testing
For comprehensive manual testing procedures, see [Manual Testing Guide](../docs/testing/guides/manual-testing.md).

## Test Organization

- **Feature tests** - Validate individual tool functionality
- **Integration tests** - Test cross-tool interactions
- **Fix validation** - Verify bug fixes work correctly
- **Platform tests** - Test core infrastructure (router, theme, storage)
- **UX tests** - Validate user experience implementation

## Notes

- These are HTML-based manual tests, not automated test suites
- Tests are run by opening HTML files in a browser
- Console logs and visual inspection are used for validation
- For automated testing strategy, see [Testing Documentation](../docs/testing/INDEX.md)

---

**Last Updated:** March 20, 2026
