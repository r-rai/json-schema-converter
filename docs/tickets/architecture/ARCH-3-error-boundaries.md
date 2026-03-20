# TICKET: ARCH-3 - Error Boundaries Implementation

**Priority:** P1 (High Priority Architecture)  
**Effort:** 1 day  
**Owner:** Developer  
**Reviewer:** Tech Lead + Solution Architect  
**Dependencies:** ARCH-1 (component refactoring helps, but not required)  
**Sprint Day:** Day 8  

---

## Problem Statement

Currently, if one tool crashes (throws unhandled exception), it can affect the entire platform:

**Current Behavior:**
1. User navigates to SIP Calculator
2. Tool throws error during initialization
3. **Entire page becomes unresponsive**
4. User must reload page
5. Other tools also inaccessible

**Impact:**
- **No error isolation** - one tool failure breaks all tools
- **Poor user experience** - white screen, no error message
- **No error tracking** - exceptions lost in console
- **Difficult debugging** - unclear which tool failed

**Architecture Review Grade Impact:** Architecture resilience: 60/100 → Target: 90/100

---

## Acceptance Criteria

- [ ] ErrorBoundary class implemented in `shared/js/errorBoundary.js`
- [ ] Router wraps all tool handlers with error boundaries
- [ ] Tool errors display user-friendly error UI
- [ ] Platform remains functional when one tool fails
- [ ] Error recovery mechanism (reload tool or navigate away)
- [ ] Errors logged for debugging
- [ ] All tools tested with injected errors
- [ ] No impact on performance

---

## Architecture Context

### Specified Pattern

**Error Boundary Requirements:**
1. Catch errors in tool initialization
2. Catch errors in tool runtime (async operations)
3. Display fallback UI
4. Allow recovery without page reload
5. Log errors for debugging
6. Prevent error propagation to other tools

**Inspiration from React Error Boundaries:**
```javascript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    logError(error, info);
  }
  
  render() {
    if (this.state.hasError) {
      return <FallbackUI />;
    }
    return this.props.children;
  }
}
```

**Vanilla JavaScript Implementation:**
- Wrap tool loading in try-catch
- Wrap async operations in promise catch
- Provide fallback UI on error
- Isolate error to specific tool container

---

## Implementation Phases

### Phase 1: ErrorBoundary Class (Day 8 Morning - 3 hours)

#### Task 1.1: Create ErrorBoundary Module

**File:** `shared/js/errorBoundary.js` (NEW FILE)

```javascript
/**
 * Error Boundary for Tool Components
 * Isolates errors to prevent cascade failures
 * 
 * @file shared/js/errorBoundary.js
 */

/**
 * ErrorBoundary class - Wraps tool execution with error handling
 */
export class ErrorBoundary {
  /**
   * Create an error boundary
   * @param {HTMLElement} container - DOM container for the tool
   * @param {Object} options - Configuration options
   * @param {Function} options.onError - Error handler callback
   * @param {Function} options.fallbackUI - Custom fallback UI renderer
   * @param {Function} options.logger - Logging function
   * @param {boolean} options.showStack - Show stack trace in UI (dev mode)
   */
  constructor(container, options = {}) {
    if (!(container instanceof HTMLElement)) {
      throw new TypeError('Container must be an HTMLElement');
    }
    
    this.container = container;
    this.options = {
      onError: options.onError || this.defaultErrorHandler.bind(this),
      fallbackUI: options.fallbackUI || this.defaultFallbackUI.bind(this),
      logger: options.logger || console.error,
      showStack: options.showStack ?? (window.location.hostname === 'localhost')
    };
    
    this.hasError = false;
    this.lastError = null;
    
    // Global error handler for this boundary
    this.setupGlobalErrorHandler();
  }
  
  /**
   * Setup global error listener for uncaught errors in this boundary scope
   */
  setupGlobalErrorHandler() {
    // Store original error handler
    this._originalOnError = window.onerror;
    
    // Note: Global handler is tricky - we'll rely on try-catch wrapping instead
    // Just log that boundary is active
    console.log('[ErrorBoundary] Initialized for container:', this.container.id);
  }
  
  /**
   * Wrap a synchronous function with error handling
   * @param {Function} fn - Function to wrap
   * @returns {Function} Wrapped function
   */
  wrap(fn) {
    return (...args) => {
      try {
        return fn(...args);
      } catch (error) {
        this.handleError(error);
        return null;
      }
    };
  }
  
  /**
   * Wrap an async function with error handling
   * @param {Function} fn - Async function to wrap
   * @returns {Function} Wrapped async function
   */
  wrapAsync(fn) {
    return async (...args) => {
      try {
        return await fn(...args);
      } catch (error) {
        this.handleError(error);
        return null;
      }
    };
  }
  
  /**
   * Handle a caught error
   * @param {Error} error - The error that was caught
   * @param {Object} context - Additional context about the error
   */
  handleError(error, context = {}) {
    this.hasError = true;
    this.lastError = error;
    
    // Log error
    this.options.logger('[ErrorBoundary] Caught error:', error, context);
    
    // Show fallback UI
    this.showFallbackUI(error, context);
    
    // Call custom error handler
    this.options.onError(error, context);
  }
  
  /**
   * Display fallback UI in the container
   * @param {Error} error - The error that occurred
   * @param {Object} context - Additional context
   */
  showFallbackUI(error, context = {}) {
    const fallbackHTML = this.options.fallbackUI(error, context);
    this.container.innerHTML = fallbackHTML;
    
    // Attach recovery button handler
    const retryBtn = this.container.querySelector('[data-action="retry"]');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => this.retry(context));
    }
    
    const homeBtn = this.container.querySelector('[data-action="home"]');
    if (homeBtn) {
      homeBtn.addEventListener('click', () => {
        window.location.hash = '#/';
      });
    }
  }
  
  /**
   * Default fallback UI
   * @param {Error} error - The error that occurred
   * @returns {string} HTML string for fallback UI
   */
  defaultFallbackUI(error) {
    const errorMessage = error.message || 'An unknown error occurred';
    const stackTrace = this.options.showStack ? error.stack : '';
    
    return `
      <div class="error-boundary" style="
        padding: 40px 20px;
        text-align: center;
        max-width: 600px;
        margin: 0 auto;
      ">
        <div style="
          font-size: 48px;
          margin-bottom: 20px;
        ">⚠️</div>
        
        <h2 style="
          color: var(--color-error, #d32f2f);
          margin-bottom: 10px;
        ">Something went wrong</h2>
        
        <p style="
          color: var(--color-text-secondary, #666);
          margin-bottom: 20px;
        ">This tool encountered an error and couldn't load properly.</p>
        
        <div style="
          background: var(--color-surface, #f5f5f5);
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: left;
        ">
          <strong>Error:</strong> ${this.escapeHTML(errorMessage)}
        </div>
        
        ${stackTrace ? `
          <details style="
            text-align: left;
            margin-bottom: 20px;
            background: var(--color-surface, #f5f5f5);
            padding: 15px;
            border-radius: 8px;
          ">
            <summary style="cursor: pointer; font-weight: bold;">
              Technical Details
            </summary>
            <pre style="
              margin-top: 10px;
              font-size: 12px;
              overflow-x: auto;
              white-space: pre-wrap;
              word-wrap: break-word;
            ">${this.escapeHTML(stackTrace)}</pre>
          </details>
        ` : ''}
        
        <div style="
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        ">
          <button 
            data-action="retry"
            style="
              padding: 12px 24px;
              background: var(--color-primary, #1976d2);
              color: white;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-size: 16px;
            "
          >
            🔄 Try Again
          </button>
          
          <button 
            data-action="home"
            style="
              padding: 12px 24px;
              background: var(--color-secondary, #9e9e9e);
              color: white;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-size: 16px;
            "
          >
            🏠 Go Home
          </button>
        </div>
      </div>
    `;
  }
  
  /**
   * Default error handler
   * @param {Error} error - The error that occurred
   * @param {Object} context - Additional context
   */
  defaultErrorHandler(error, context) {
    // Could send to logging service here
    console.error('[ErrorBoundary] Tool error:', {
      message: error.message,
      stack: error.stack,
      context: context
    });
    
    // Could trigger analytics event
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false
      });
    }
  }
  
  /**
   * Retry loading the tool
   * @param {Object} context - Context for retry
   */
  retry(context) {
    console.log('[ErrorBoundary] Retrying...');
    
    // Clear error state
    this.hasError = false;
    this.lastError = null;
    
    // Clear container
    this.container.innerHTML = '<p>Loading...</p>';
    
    // Reload page (simple approach)
    window.location.reload();
    
    // Alternative: Re-execute tool initialization if handler stored
    // if (context.retryHandler) {
    //   context.retryHandler();
    // }
  }
  
  /**
   * Reset error boundary
   */
  reset() {
    this.hasError = false;
    this.lastError = null;
  }
  
  /**
   * Escape HTML for safe display in error messages
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
  }
  
  /**
   * Get error status
   * @returns {boolean} Whether boundary has caught an error
   */
  getHasError() {
    return this.hasError;
  }
  
  /**
   * Get last error
   * @returns {Error|null} Last caught error
   */
  getLastError() {
    return this.lastError;
  }
}

/**
 * Factory function for creating error boundaries
 * @param {HTMLElement} container - Container element
 * @param {Object} options - Boundary options
 * @returns {ErrorBoundary} New error boundary instance
 */
export function createErrorBoundary(container, options = {}) {
  return new ErrorBoundary(container, options);
}

export default ErrorBoundary;
```

---

### Phase 2: Integrate with Router (Day 8 Afternoon - 3 hours)

#### Task 2.1: Update Router to Use Error Boundaries

**File:** `shared/js/router.js`

**BEFORE:**
```javascript
class Router {
  registerRoute(path, handler) {
    this.routes.set(path, handler);
  }
  
  async handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const route = hash.split('?')[0];
    const params = this.parseQueryParams(queryString);
    
    const handler = this.routes.get(route);
    if (handler) {
      try {
        await handler(params);
      } catch (error) {
        console.error('Route error:', error);
      }
    }
  }
}
```

**AFTER:**
```javascript
import { createErrorBoundary } from './errorBoundary.js';

class Router {
  constructor() {
    this.routes = new Map();
    this.errorBoundaries = new Map();
    this.contentContainer = null;
  }
  
  /**
   * Register a route with error boundary protection
   * @param {string} path - Route path
   * @param {Function} handler - Route handler function
   * @param {Object} options - Error boundary options
   */
  registerRoute(path, handler, options = {}) {
    // Wrap handler with error boundary
    const wrappedHandler = this.createBoundaryWrappedHandler(path, handler, options);
    this.routes.set(path, wrappedHandler);
  }
  
  /**
   * Create handler wrapped with error boundary
   * @private
   */
  createBoundaryWrappedHandler(path, handler, options) {
    return async (params) => {
      // Get or create content container
      if (!this.contentContainer) {
        this.contentContainer = document.getElementById('content');
      }
      
      // Create error boundary for this route
      const boundary = createErrorBoundary(this.contentContainer, {
        onError: (error) => {
          // Log to analytics or error tracking service
          console.error(`[Router] Error in route ${path}:`, error);
          
          // Optional: Track in analytics
          if (window.gtag) {
            window.gtag('event', 'route_error', {
              route: path,
              error: error.message
            });
          }
        },
        fallbackUI: (error) => {
          return this.createRouteFallbackUI(path, error);
        },
        ...options
      });
      
      // Store boundary for this route
      this.errorBoundaries.set(path, boundary);
      
      // Execute handler within boundary
      try {
        await handler(params);
      } catch (error) {
        boundary.handleError(error, { route: path, params });
      }
    };
  }
  
  /**
   * Create custom fallback UI for route errors
   * @private
   */
  createRouteFallbackUI(path, error) {
    const routeName = this.getRouteDisplayName(path);
    
    return `
      <div class="error-boundary route-error">
        <div class="error-icon">⚠️</div>
        <h2>Error Loading ${routeName}</h2>
        <p>This tool encountered an error and couldn't be loaded.</p>
        
        <div class="error-details">
          <strong>Error:</strong> ${this.escapeHTML(error.message)}
        </div>
        
        <div class="error-actions">
          <button onclick="window.location.reload()" class="btn btn-primary">
            🔄 Reload Tool
          </button>
          <button onclick="window.location.hash='#/'" class="btn btn-secondary">
            🏠 Go Home
          </button>
        </div>
        
        <p class="error-help">
          If this problem persists, try:
        </p>
        <ul class="error-help-list">
          <li>Clearing your browser cache</li>
          <li>Using a different browser</li>
          <li>Checking your internet connection</li>
        </ul>
      </div>
    `;
  }
  
  /**
   * Get display name for route
   * @private
   */
  getRouteDisplayName(path) {
    const names = {
      '/': 'Home',
      '/json-schema': 'JSON Schema Converter',
      '/sip-calculator': 'SIP Calculator',
      '/emi-calculator': 'EMI Calculator',
      '/text-diff': 'Text Diff Checker',
      '/html-markdown': 'HTML/Markdown Converter'
    };
    return names[path] || 'Tool';
  }
  
  /**
   * Escape HTML
   * @private
   */
  escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = String(str || '');
    return div.innerHTML;
  }
  
  /**
   * Handle route change
   */
  async handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const route = hash.split('?')[0];
    const queryString = hash.includes('?') ? hash.split('?')[1] : '';
    const params = this.parseQueryParams(queryString);
    
    const handler = this.routes.get(route);
    
    if (handler) {
      // Handler is already wrapped with error boundary
      await handler(params);
    } else {
      this.handle404(route);
    }
  }
  
  /**
   * Get error boundary for route
   * @param {string} path - Route path
   * @returns {ErrorBoundary|null}
   */
  getBoundary(path) {
    return this.errorBoundaries.get(path) || null;
  }
  
  // ... rest of router code
}
```

---

### Phase 3: Testing & Validation (Day 8 Afternoon - 2 hours)

#### Task 3.1: Inject Errors in Each Tool

Test error boundary by intentionally breaking each tool:

**Test Scenario 1: Initialization Error**

```javascript
// Temporarily add to JSON Schema tool initialization
class JSONSchemaConverter {
  init() {
    throw new Error('Test error: JSON Schema initialization failed');
    // ... rest of init
  }
}
```

**Expected:**
- ✅ Error boundary catches error
- ✅ Fallback UI displays
- ✅ Other tools remain accessible
- ✅ Can navigate to Home
- ✅ Can navigate to other tools

**Test Scenario 2: Runtime Error**

```javascript
// Temporarily add to SIP Calculator
async calculate() {
  // Simulate async error
  await new Promise(resolve => setTimeout(resolve, 100));
  throw new Error('Test error: Calculation failed');
}
```

**Expected:**
- ✅ Error boundary catches async error
- ✅ Fallback UI displays
- ✅ Error logged to console

**Test Scenario 3: API/External Error**

```javascript
// Simulate external resource failure
async loadTool() {
  const response = await fetch('/nonexistent-resource.json');
  if (!response.ok) {
    throw new Error('Failed to load resource');
  }
}
```

**Expected:**
- ✅ Network error caught
- ✅ User-friendly message displayed

#### Task 3.2: Test Error Recovery

**Recovery Test 1: Retry Button**
1. Inject error in tool
2. Tool shows error UI
3. Click "Try Again" button
4. ✅ Page reloads or tool reinitializes
5. ✅ Tool works after reload

**Recovery Test 2: Navigate Away**
1. Tool shows error
2. Click "Go Home" button
3. ✅ Navigate to home page
4. ✅ Home page works normally
5. Navigate to different tool
6. ✅ Different tool works normally

**Recovery Test 3: Browser Back**
1. Tool shows error
2. Use browser back button
3. ✅ Navigate to previous tool
4. ✅ Previous tool works

#### Task 3.3: Test All 6 Tools

For each tool, inject 3 types of errors:

**JSON Schema Converter:**
- [ ] Init error caught
- [ ] Runtime error caught
- [ ] Async error caught
- [ ] Other tools unaffected

**SIP Calculator:**
- [ ] Init error caught
- [ ] Calculation error caught
- [ ] Chart render error caught
- [ ] Other tools unaffected

**EMI Calculator:**
- [ ] Init error caught
- [ ] Calculation error caught
- [ ] Table render error caught
- [ ] Other tools unaffected

**Text Diff:**
- [ ] Init error caught
- [ ] Diff error caught
- [ ] Library load error caught
- [ ] Other tools unaffected

**HTML/Markdown:**
- [ ] Init error caught
- [ ] Conversion error caught
- [ ] Preview error caught
- [ ] Other tools unaffected

**Home Page:**
- [ ] Init error caught (shouldn't happen, but test)
- [ ] Card render error caught
- [ ] Navigation still works

---

## Success Metrics

**Before:**
- ❌ One tool error breaks entire app
- ❌ No error recovery mechanism
- ❌ Errors lost (only in console)
- ❌ Poor user experience on errors
- ⚠️ Architecture resilience: 60/100

**After:**
- ✅ Tool errors isolated to that tool only
- ✅ Error recovery (retry or navigate away)
- ✅ Errors logged and trackable
- ✅ User-friendly error UI
- ✅ Architecture resilience: 90/100 (+30 points)

---

## Documentation Updates

**File:** `docs/ARCHITECTURE.md`

Add section:

```markdown
## Error Handling

### Error Boundaries

All tools are wrapped with error boundaries to prevent cascade failures:

```javascript
// Router automatically wraps tools
router.registerRoute('/my-tool', async () => {
  // If error thrown here, boundary catches it
  const tool = new MyTool();
  await tool.init();
});
```

Error boundaries provide:
- Error isolation (one tool failure doesn't break others)
- User-friendly fallback UI
- Error recovery mechanisms
- Error logging and tracking

### Custom Error Boundaries

Create custom error boundaries for specific needs:

```javascript
import { createErrorBoundary } from './shared/js/errorBoundary.js';

const boundary = createErrorBoundary(container, {
  onError: (error) => {
    // Custom error handling
    logToService(error);
  },
  fallbackUI: (error) => {
    // Custom error UI
    return `<div>Custom error UI</div>`;
  }
});

const wrappedFunction = boundary.wrapAsync(async () => {
  // Protected code
});
```
```

---

## Rollback Plan

**If issues found:**

```bash
# Revert error boundary system
git checkout main -- shared/js/errorBoundary.js shared/js/router.js

# Router falls back to simple try-catch
```

**No impact on tools** - error boundaries are transparent wrapper.

---

## Related Tickets

**Blocked By:**
- None (can be done independently)

**Enhanced By:**
- **ARCH-1:** Component refactoring (cleaner code = fewer errors)

**Enables:**
- Production confidence (graceful error handling)
- Better error tracking and debugging

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Error boundary itself has bugs | LOW | HIGH | Thorough testing, simple implementation |
| Performance overhead | LOW | LOW | Minimal (just try-catch wrapping) |
| Breaks existing tools | LOW | MEDIUM | Transparent wrapper, extensive testing |

---

## Timeline

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Create ErrorBoundary class | 3h | errorBoundary.js complete |
| Integrate with Router | 3h | All routes protected |
| Testing & Validation | 2h | All tools tested |
| **Total** | **8h** | **~1 day** |

---

**Status:** READY FOR IMPLEMENTATION  
**Blocked By:** None  
**Blocking:** None  

**Priority Justification:** High-priority architecture improvement. Significantly improves platform resilience and user experience. Enables production confidence.
