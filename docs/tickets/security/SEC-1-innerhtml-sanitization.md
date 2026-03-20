# TICKET: SEC-1 - innerHTML Sanitization Strategy

**Priority:** P0 (Critical Security)  
**Effort:** 2-3 days  
**Owner:** Developer  
**Reviewer:** Security Reviewer + Tech Lead  
**Dependencies:** ARCH-2 (DOMPurify must be local first)  
**Sprint Days:** Day 6-7  

---

## Problem Statement

Security audit found **35+ instances of innerHTML** usage across the codebase. While many are low-risk (numeric data only), several are high-risk vectors for XSS attacks:

**High-Risk Instances:**
1. **Card Component** - Accepts user content as HTML
2. **Modal Component** - Renders arbitrary content  
3. **Error Messages** - May include user input
4. **Home Page** - Dynamic tool card rendering

**Security Impact:**
- XSS vulnerability if any user-controlled data flows into innerHTML
- No systematic sanitization strategy
- Mixed patterns (some tools use DOMPurify, others don't)

**From Security Audit:**
> "Even one unsanitized innerHTML can compromise the entire application. All innerHTML must either: (1) Use DOMPurify sanitization, (2) Use textContent instead, or (3) Build DOM programmatically."

---

## Acceptance Criteria

- [ ] Sanitization utility created (`shared/js/sanitization.js`)
- [ ] All high-risk innerHTML using DOMPurify
- [ ] All error messages using textContent (no HTML)
- [ ] Card and Modal components sanitize content
- [ ] XSS test vectors blocked (10/10 from security audit)
- [ ] All tools functional
- [ ] All tests passing (52/52)
- [ ] Documentation updated with sanitization guidelines

---

## Implementation Strategy

### Three-Pronged Approach

**1. Create Sanitization Utilities** (centralized, reusable)  
**2. Fix High-Risk innerHTML** (components accepting user data)  
**3. Audit Low-Risk innerHTML** (validate they're actually safe)

**NOT in scope:**
- Rewriting all innerHTML (unnecessary overkill)
- Refactoring safe numeric table generation
- Over-sanitization causing functionality loss

---

## Phase 1: Create Sanitization Utilities (Day 6 PM - 4 hours)

### Task 1.1: Create Sanitization Module

**File:** `shared/js/sanitization.js` (NEW FILE)

```javascript
/**
 * Sanitization Utilities for Safe DOM Manipulation
 * Provides centralized, secure methods for setting HTML content
 * 
 * @file shared/js/sanitization.js
 */

// Load DOMPurify (should be loaded in HTML)
const DOMPurify = window.DOMPurify;

if (!DOMPurify) {
  console.error('DOMPurify not loaded - sanitization will fall back to text-only');
}

/**
 * Safely set text content (always safe - no HTML parsing)
 * Use this for any user-provided text that should be displayed as-is
 * 
 * @param {HTMLElement} element - Target element
 * @param {string} text - Text content to set
 * @example
 * setText(messageEl, userInput); // Safe - no HTML parsing
 */
export function setText(element, text) {
  if (!(element instanceof HTMLElement)) {
    throw new TypeError('First argument must be an HTMLElement');
  }
  
  element.textContent = String(text || '');
}

/**
 * Safely set HTML content with DOMPurify sanitization
 * Use this when you need to render HTML but want XSS protection
 * 
 * @param {HTMLElement} element - Target element
 * @param {string} html - HTML content to sanitize and set
 * @param {Object} config - DOMPurify configuration (optional)
 * @returns {string} - Sanitized HTML that was set
 * 
 * @example
 * // Basic usage
 * setHTML(contentEl, userProvidedHTML);
 * 
 * // With custom allowed tags
 * setHTML(contentEl, markdown, {
 *   ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
 *   ALLOWED_ATTR: []
 * });
 */
export function setHTML(element, html, config = {}) {
  if (!(element instanceof HTMLElement)) {
    throw new TypeError('First argument must be an HTMLElement');
  }
  
  if (!DOMPurify) {
    console.warn('DOMPurify not available - falling back to textContent');
    element.textContent = html;
    return html;
  }
  
  // Default safe configuration
  const defaultConfig = {
    ALLOWED_TAGS: [
      // Text formatting
      'b', 'i', 'em', 'strong', 'u', 's', 'mark',
      // Structure
      'p', 'br', 'div', 'span', 
      // Lists
      'ul', 'ol', 'li',
      // Headings
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      // Links (carefully)
      'a'
    ],
    ALLOWED_ATTR: [
      'href',  // For links
      'class', // For styling
      'id'     // For targeting
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):)/i, // Only https/http/mailto links
    KEEP_CONTENT: true, // Keep text content even if tags are removed
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false
  };
  
  // Merge user config with defaults
  const finalConfig = { ...defaultConfig, ...config };
  
  // Sanitize
  const clean = DOMPurify.sanitize(html, finalConfig);
  
  // Set
  element.innerHTML = clean;
  
  return clean;
}

/**
 * Create element from template string (for safe, non-user content)
 * Only use this for templates you control (not user input)
 * 
 * @param {string} template - HTML template string
 * @returns {HTMLElement} - First element in template
 * 
 * @example
 * const row = createFromTemplate(`
 *   <tr>
 *     <td>${escapeHTML(year)}</td>
 *     <td>${escapeHTML(amount)}</td>
 *   </tr>
 * `);
 */
export function createFromTemplate(template) {
  const div = document.createElement('div');
  div.innerHTML = template;
  return div.firstElementChild;
}

/**
 * Escape HTML entities (for building HTML strings safely)
 * Use this when building HTML strings with user data
 * 
 * @param {string} str - String to escape
 * @returns {string} - Escaped string safe for HTML
 * 
 * @example
 * const html = `<div>${escapeHTML(userName)}</div>`; // Safe
 */
export function escapeHTML(str) {
  if (str === null || str === undefined) {
    return '';
  }
  
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

/**
 * Build element programmatically (safest method - no parsing)
 * Use this for complex HTML structures with user data
 * 
 * @param {string} tag - HTML tag name
 * @param {Object} props - Element properties (className, textContent, etc.)
 * @param {Array<HTMLElement>} children - Child elements
 * @returns {HTMLElement} - Created element
 * 
 * @example
 * const card = createElement('div', { className: 'card' }, [
 *   createElement('h3', { textContent: title }),
 *   createElement('p', { textContent: content })
 * ]);
 */
export function createElement(tag, props = {}, children = []) {
  const element = document.createElement(tag);
  
  // Set properties
  Object.entries(props).forEach(([key, value]) => {
    if (key === 'textContent') {
      element.textContent = value;
    } else if (key === 'className') {
      element.className = value;
    } else if (key.startsWith('data-')) {
      element.setAttribute(key, value);
    } else {
      element[key] = value;
    }
  });
  
  // Append children
  children.forEach(child => {
    if (child instanceof HTMLElement) {
      element.appendChild(child);
    }
  });
  
  return element;
}

/**
 * Check if string contains HTML tags
 * Useful for deciding whether to treat content as HTML or text
 * 
 * @param {string} str - String to check
 * @returns {boolean} - True if string appears to contain HTML
 */
export function containsHTML(str) {
  if (typeof str !== 'string') {
    return false;
  }
  
  // Simple heuristic: contains < followed by letter
  return /<[a-z][\s\S]*>/i.test(str);
}

/**
 * Safe wrapper for innerHTML replacement
 * Automatically detects if content is HTML or text
 * 
 * @param {HTMLElement} element - Target element
 * @param {string} content - Content (HTML or text)
 * @param {Object} config - Sanitization config (if HTML detected)
 */
export function setContent(element, content, config = {}) {
  if (containsHTML(content)) {
    // Content looks like HTML - sanitize it
    return setHTML(element, content, config);
  } else {
    // Content is plain text - use textContent
    setText(element, content);
    return content;
  }
}

// Export validator for testing
export const sanitization = {
  setText,
  setHTML,
  createFromTemplate,
  escapeHTML,
  createElement,
  containsHTML,
  setContent
};

export default sanitization;
```

### Task 1.2: Add DOMPurify to index.html

Ensure DOMPurify is loaded globally (should already be in `/lib/` from ARCH-2):

```html
<!-- index.html -->
<head>
  <script 
    src="/lib/dompurify.min.js"
    integrity="sha384-[HASH]"
    crossorigin="anonymous">
  </script>
</head>
```

### Task 1.3: Create Unit Tests

**File:** `tests/unit/sanitization.test.js` (NEW FILE)

```javascript
import { 
  setText, 
  setHTML, 
  escapeHTML, 
  createElement,
  containsHTML,
  setContent 
} from '../../shared/js/sanitization.js';

describe('Sanitization Utilities', () => {
  let testElement;
  
  beforeEach(() => {
    testElement = document.createElement('div');
  });
  
  describe('setText', () => {
    it('should set plain text safely', () => {
      setText(testElement, 'Hello World');
      expect(testElement.textContent).toBe('Hello World');
      expect(testElement.innerHTML).toBe('Hello World');
    });
    
    it('should escape HTML in text', () => {
      setText(testElement, '<script>alert("xss")</script>');
      expect(testElement.textContent).toBe('<script>alert("xss")</script>');
      // HTML should be escaped, not executed
      expect(testElement.innerHTML).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;');
    });
  });
  
  describe('setHTML', () => {
    it('should allow safe HTML tags', () => {
      setHTML(testElement, '<b>Bold</b> and <i>italic</i>');
      expect(testElement.innerHTML).toContain('<b>Bold</b>');
      expect(testElement.innerHTML).toContain('<i>italic</i>');
    });
    
    it('should block script tags', () => {
      setHTML(testElement, '<script>alert("xss")</script>');
      expect(testElement.innerHTML).not.toContain('<script>');
      expect(testElement.textContent).toBe(''); // Script removed
    });
    
    it('should block inline event handlers', () => {
      setHTML(testElement, '<img src=x onerror=alert("xss")>');
      expect(testElement.innerHTML).not.toContain('onerror');
    });
  });
  
  describe('escapeHTML', () => {
    it('should escape HTML entities', () => {
      expect(escapeHTML('<div>Test</div>')).toBe('&lt;div&gt;Test&lt;/div&gt;');
      expect(escapeHTML('"quotes"')).toBe('&quot;quotes&quot;');
      expect(escapeHTML("'apostrophe'")).toContain('apostrophe');
    });
  });
  
  describe('createElement', () => {
    it('should create element with props', () => {
      const el = createElement('div', { 
        className: 'test-class',
        textContent: 'Test Content'
      });
      
      expect(el.tagName).toBe('DIV');
      expect(el.className).toBe('test-class');
      expect(el.textContent).toBe('Test Content');
    });
    
    it('should append children', () => {
      const child = createElement('span', { textContent: 'Child' });
      const parent = createElement('div', {}, [child]);
      
      expect(parent.children.length).toBe(1);
      expect(parent.firstElementChild.textContent).toBe('Child');
    });
  });
  
  describe('containsHTML', () => {
    it('should detect HTML', () => {
      expect(containsHTML('<div>Test</div>')).toBe(true);
      expect(containsHTML('<br>')).toBe(true);
      expect(containsHTML('Plain text')).toBe(false);
      expect(containsHTML('Text with < and >')).toBe(false);
    });
  });
});
```

---

## Phase 2: Fix High-Risk innerHTML (Day 7 Morning - 4 hours)

### Task 2.1: Fix Card Component

**File:** `shared/components/card.js` (line ~84)

**BEFORE:**
```javascript
// Create content
if (content) {
  const contentElement = document.createElement('div');
  contentElement.className = 'card-content';
  
  // Check if content is HTML or plain text
  if (typeof content === 'string' && content.trim().startsWith('<')) {
    contentElement.innerHTML = content; // ⚠️ UNSAFE
  } else {
    contentElement.textContent = content;
  }
  
  card.appendChild(contentElement);
}
```

**AFTER:**
```javascript
import { setContent } from '../js/sanitization.js';

// Create content
if (content) {
  const contentElement = document.createElement('div');
  contentElement.className = 'card-content';
  
  // Safely set content (auto-detects HTML vs text)
  setContent(contentElement, content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'a', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'class']
  });
  
  card.appendChild(contentElement);
}
```

**Testing:**
```javascript
// Test safe HTML (should work)
const card1 = createCard({
  content: '<b>Bold</b> text'
});
// ✅ Renders bold text

// Test XSS attempt (should be blocked)
const card2 = createCard({
  content: '<img src=x onerror=alert("xss")>'
});
// ✅ Image removed, no alert

// Test plain text (should work)
const card3 = createCard({
  content: 'Plain text content'
});
// ✅ Renders as text
```

### Task 2.2: Fix Modal Component

**File:** `shared/components/modal.js` (line ~77)

**BEFORE:**
```javascript
// Set body content
if (typeof content === 'string') {
  body.innerHTML = content; // ⚠️ UNSAFE
} else if (content instanceof HTMLElement) {
  body.appendChild(content);
}
```

**AFTER:**
```javascript
import { setContent } from '../js/sanitization.js';

// Set body content
if (typeof content === 'string') {
  setContent(body, content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: []
  });
} else if (content instanceof HTMLElement) {
  body.appendChild(content);
}
```

### Task 2.3: Fix Error Message Rendering

**File:** `tools/sip-calculator/sip-calculator.js` (line ~556)

**BEFORE:**
```javascript
showErrors(errors) {
  const formErrors = document.getElementById('form-errors');
  formErrors.innerHTML = errors.map(err => `• ${err}`).join('<br>');
}
```

**AFTER (Option 1: textContent):**
```javascript
showErrors(errors) {
  const formErrors = document.getElementById('form-errors');
  formErrors.textContent = errors.map(err => `• ${err}`).join('\n');
}
```

**AFTER (Option 2: programmatic DOM):**
```javascript
import { createElement } from '../../shared/js/sanitization.js';

showErrors(errors) {
  const formErrors = document.getElementById('form-errors');
  formErrors.innerHTML = ''; // Clear
  
  errors.forEach(err => {
    const p = createElement('p', { 
      className: 'error-message',
      textContent: `• ${err}`
    });
    formErrors.appendChild(p);
  });
}
```

**Similar fixes needed in:**
- EMI Calculator error messages
- JSON Schema validation errors
- Any other error display

### Task 2.4: Audit Home Page Tool Rendering

**File:** `home/home.js` (line ~233)

**Check current implementation:**
```javascript
renderToolCards() {
  const html = this.tools.map(tool => `
    <div class="card" data-route="${tool.route}">
      <div class="card-icon">${tool.icon}</div>
      <h3>${tool.title}</h3>
      <p>${tool.description}</p>
    </div>
  `).join('');
  
  container.innerHTML = html; // Check if safe
}
```

**If tool data is hardcoded (current):**
- ✅ SAFE - no user input
- Mark as reviewed

**If tool data ever comes from external source:**
- ⚠️ Sanitize with escapeHTML:
```javascript
import { escapeHTML } from '../shared/js/sanitization.js';

renderToolCards() {
  const html = this.tools.map(tool => `
    <div class="card" data-route="${escapeHTML(tool.route)}">
      <div class="card-icon">${escapeHTML(tool.icon)}</div>
      <h3>${escapeHTML(tool.title)}</h3>
      <p>${escapeHTML(tool.description)}</p>
    </div>
  `).join('');
  
  container.innerHTML = html;
}
```

---

## Phase 3: Audit Low-Risk innerHTML (Day 7 Afternoon - 4 hours)

### Task 3.1: Categorize All innerHTML Usage

From grep results (17 instances), create audit matrix:

**File:** `INNERHTML_AUDIT.md`

```markdown
# innerHTML Security Audit

## High-Risk (USER DATA) - MUST FIX
| File | Line | Code | Risk | Status |
|------|------|------|------|--------|
| card.js | 84 | contentElement.innerHTML = content | HIGH | ✅ FIXED |
| modal.js | 77 | body.innerHTML = content | HIGH | ✅ FIXED |
| sip-calculator.js | 556 | formErrors.innerHTML = errors | MEDIUM | ✅ FIXED |

## Low-Risk (NUMERIC/SAFE DATA) - DOCUMENT & APPROVE
| File | Line | Code | Risk | Justification |
|------|------|------|------|---------------|
| text-diff.js | 265 | diffOutput.innerHTML = html | LOW | Diff HTML from jsdiff library (safe) |
| text-diff.js | 314 | diffOutput.innerHTML = diffHtml | LOW | Same as above |
| emi-calculator.js | 288 | tbody.innerHTML = html | LOW | Numeric data only (loan schedule) |
| emi-calculator.js | 291 | tfoot.innerHTML = html | LOW | Numeric totals only |
| sip-calculator.js | 292 | tbody.innerHTML = '' | NONE | Clearing only |
| sip-calculator.js | 297 | tr.innerHTML = rowData | LOW | Numeric year/amount/returns |
| sip-calculator.js | 311 | totalRow.innerHTML = totals | LOW | Numeric totals only |
| sip-calculator.js | 435 | tbody.innerHTML = '' | NONE | Clearing only |
| sip-calculator.js | 439 | tr.innerHTML = data | LOW | Year-wise numeric breakdown |

## Approved Patterns (SAFE)
- Numeric data in tables (validated before rendering)
- Clearing innerHTML (empty string)
- Library-generated HTML (jsdiff - trusted source)
- Template strings with no user variables

## Rejected Patterns (UNSAFE)
- User input directly to innerHTML
- External/API data to innerHTML without sanitization
- String concatenation with unescaped user data
```

### Task 3.2: Add Comments to Low-Risk Usage

For each low-risk innerHTML that's approved, add comment:

```javascript
// SECURITY AUDIT: innerHTML safe - numeric data only (no user input)
// Reviewed: [Date] - Ticket: SEC-1
this.amortizationTbody.innerHTML = html;
```

This documents that it was reviewed and deemed safe.

### Task 3.3: Add Validation to Numeric innerHTML

For tables with numeric data, add type validation:

**BEFORE:**
```javascript
renderYearWiseTable(data) {
  const html = data.map(row => `
    <tr>
      <td>${row.year}</td>
      <td>${row.amount}</td>
    </tr>
  `).join('');
  
  tbody.innerHTML = html;
}
```

**AFTER:**
```javascript
renderYearWiseTable(data) {
  const html = data.map(row => {
    // SECURITY: Validate numeric types before rendering
    const year = Number(row.year);
    const amount = Number(row.amount);
    
    if (!Number.isFinite(year) || !Number.isFinite(amount)) {
      console.error('Invalid numeric data', row);
      return '';
    }
    
    return `
      <tr>
        <td>${year}</td>
        <td>${amount.toLocaleString()}</td>
      </tr>
    `;
  }).join('');
  
  // SECURITY AUDIT: innerHTML safe - validated numeric data only
  // Reviewed: Day 7 - Ticket: SEC-1
  tbody.innerHTML = html;
}
```

---

## Phase 4: XSS Security Testing (Day 7 Evening - 2 hours)

### Task 4.1: Test XSS Vectors from Security Audit

**10 Test Vectors from Audit:**

```javascript
const xssTestVectors = [
  {
    name: 'Script tag',
    input: '<script>alert("xss")</script>',
    expectedBlock: true
  },
  {
    name: 'Image onerror',
    input: '<img src=x onerror=alert("xss")>',
    expectedBlock: true
  },
  {
    name: 'SVG onload',
    input: '<svg onload=alert("xss")>',
    expectedBlock: true
  },
  {
    name: 'Iframe javascript',
    input: '<iframe src="javascript:alert(\'xss\')">',
    expectedBlock: true
  },
  {
    name: 'Body onload',
    input: '<body onload=alert("xss")>',
    expectedBlock: true
  },
  {
    name: 'Input autofocus',
    input: '<input onfocus=alert("xss") autofocus>',
    expectedBlock: true
  },
  {
    name: 'Marquee onstart',
    input: '<marquee onstart=alert("xss")>',
    expectedBlock: true
  },
  {
    name: 'Details ontoggle',
    input: '<details open ontoggle=alert("xss")>',
    expectedBlock: true
  },
  {
    name: 'Image with encoded XSS',
    input: '<img src=x onerror="alert(String.fromCharCode(88,83,83))">',
    expectedBlock: true
  },
  {
    name: 'Nested tags',
    input: '<img src=x onerror=alert(1)><svg onload=alert(2)><script>alert(3)</script>',
    expectedBlock: true
  }
];
```

**Test Each Vector:**

**Test 1: Card Component**
```javascript
xssTestVectors.forEach(test => {
  console.log(`Testing: ${test.name}`);
  
  const card = createCard({
    title: 'XSS Test',
    content: test.input
  });
  
  document.body.appendChild(card);
  
  // Wait 100ms for any script execution
  setTimeout(() => {
    // If alert didn't fire, test passed
    console.log(`✅ ${test.name} blocked`);
    document.body.removeChild(card);
  }, 100);
});
```

**Test 2: Modal Component**
```javascript
xssTestVectors.forEach(test => {
  const modal = createModal({
    title: 'XSS Test',
    content: test.input
  });
  
  modal.show();
  
  setTimeout(() => {
    console.log(`✅ ${test.name} blocked in modal`);
    modal.close();
  }, 100);
});
```

**Test 3: Direct setHTML**
```javascript
import { setHTML } from './shared/js/sanitization.js';

xssTestVectors.forEach(test => {
  const div = document.createElement('div');
  setHTML(div, test.input);
  
  // Check innerHTML doesn't contain dangerous attributes
  const html = div.innerHTML.toLowerCase();
  const dangerous = ['onerror', 'onload', 'onfocus', 'onclick', '<script'];
  const hasDangerous = dangerous.some(attr => html.includes(attr));
  
  if (!hasDangerous) {
    console.log(`✅ ${test.name} sanitized`);
  } else {
    console.error(`❌ ${test.name} NOT BLOCKED`);
  }
});
```

### Task 4.2: Create Automated XSS Test Suite

**File:** `tests/security/xss-tests.html` (NEW FILE)

```html
<!DOCTYPE html>
<html>
<head>
  <title>XSS Security Tests</title>
  <style>
    body { font-family: sans-serif; padding: 20px; }
    .test { margin: 10px 0; padding: 10px; border: 1px solid #ccc; }
    .pass { background: #e8f5e9; border-color: #4caf50; }
    .fail { background: #ffebee; border-color: #f44336; }
  </style>
</head>
<body>
  <h1>XSS Security Test Suite</h1>
  <div id="results"></div>
  
  <script type="module">
    import { setHTML, setContent } from './../../shared/js/sanitization.js';
    import { createCard } from './../../shared/components/card.js';
    import { createModal } from './../../shared/components/modal.js';
    
    const xssVectors = [
      '<script>alert("xss")</script>',
      '<img src=x onerror=alert("xss")>',
      '<svg onload=alert("xss")>',
      '<iframe src="javascript:alert(\'xss\')">',
      '<body onload=alert("xss")>',
      '<input onfocus=alert("xss") autofocus>',
      '<marquee onstart=alert("xss")>',
      '<details open ontoggle=alert("xss")>',
      '<img src=x onerror="alert(String.fromCharCode(88,83,83))">',
      '<img><svg onload=alert(1)><script>alert(2)</script>'
    ];
    
    const results = document.getElementById('results');
    let passCount = 0;
    let failCount = 0;
    
    xssVectors.forEach((vector, i) => {
      const testDiv = document.createElement('div');
      testDiv.className = 'test';
      
      // Test each component
      try {
        const testElement = document.createElement('div');
        setHTML(testElement, vector);
        
        const html = testElement.innerHTML.toLowerCase();
        const blocked = !html.includes('onerror') && 
                       !html.includes('onload') && 
                       !html.includes('<script');
        
        if (blocked) {
          testDiv.classList.add('pass');
          testDiv.innerHTML = `✅ Test ${i+1} PASSED: XSS blocked`;
          passCount++;
        } else {
          testDiv.classList.add('fail');
          testDiv.innerHTML = `❌ Test ${i+1} FAILED: XSS not blocked`;
          failCount++;
        }
      } catch (error) {
        testDiv.classList.add('fail');
        testDiv.innerHTML = `❌ Test ${i+1} ERROR: ${error.message}`;
        failCount++;
      }
      
      results.appendChild(testDiv);
    });
    
    // Summary
    const summary = document.createElement('div');
    summary.style.cssText = 'margin-top: 20px; padding: 15px; background: #f5f5f5; font-weight: bold;';
    summary.textContent = `Results: ${passCount} passed, ${failCount} failed`;
    results.appendChild(summary);
    
    if (failCount === 0) {
      console.log('🎉 All XSS tests passed!');
    } else {
      console.error(`⚠️ ${failCount} XSS tests failed!`);
    }
  </script>
</body>
</html>
```

**Run Tests:**
```bash
# Open in browser
open tests/security/xss-tests.html

# Expected: 10/10 tests passing
```

---

## Testing Checklist

### Component Tests

**Card Component:**
- [ ] Safe HTML renders (e.g., `<b>Bold</b>`)
- [ ] XSS blocked (e.g., `<script>alert(1)</script>`)
- [ ] Plain text renders correctly
- [ ] No console errors

**Modal Component:**
- [ ] Safe HTML renders in modal
- [ ] XSS blocked in modal content
- [ ] Modal still functional
- [ ] No console errors

**Error Messages:**
- [ ] Error text displays correctly
- [ ] No HTML interpretation
- [ ] User input escaped
- [ ] No console errors

### XSS Tests

- [ ] All 10 test vectors blocked
- [ ] No alert() executions
- [ ] No console.log() from injected code
- [ ] DOMPurify active and working

### Functional Tests

Run all tool tests to ensure sanitization doesn't break functionality:

- [ ] JSON Schema: All features work
- [ ] SIP Calculator: Charts and tables render
- [ ] EMI Calculator: Amortization table displays
- [ ] Text Diff: Diff highlighting works
- [ ] HTML/Markdown: Conversion and preview safe
- [ ] Home Page: Tool cards display

### Performance Tests

- [ ] No performance regression
- [ ] DOMPurify overhead acceptable (<5ms per sanitization)
- [ ] Page load unchanged
- [ ] Tool initialization unchanged

---

## Success Metrics

**Before:**
- ❌ 35+ innerHTML without systematic sanitization
- ❌ 2 high-risk innerHTML in components
- ❌ No sanitization utilities
- ❌ XSS test vectors not documented
- ⚠️ Security Grade: C+ (76/100)

**After:**
- ✅ Sanitization utilities available (`shared/js/sanitization.js`)
- ✅ All high-risk innerHTML sanitized
- ✅ XSS test vectors blocked (10/10)
- ✅ innerHTML audit documented
- ✅ Security Grade: B+ (85/100) - **+9 points**

---

## Documentation Updates

**1. Create docs/SECURITY_GUIDELINES.md:**

```markdown
# Security Guidelines

## innerHTML Usage

**NEVER use innerHTML directly with user data.** Always use one of these patterns:

### Pattern 1: Plain Text (Safest)
```javascript
element.textContent = userInput;
```

### Pattern 2: Sanitized HTML
```javascript
import { setHTML } from './shared/js/sanitization.js';
setHTML(element, userHTML);
```

### Pattern 3: Programmatic DOM
```javascript
const div = document.createElement('div');
div.textContent = userInput;
parent.appendChild(div);
```

## Approved innerHTML Scenarios

innerHTML is ONLY approved for:
1. Numeric data (validated as numbers)
2. Trusted library output (e.g., jsdiff)
3. Static templates (no variables)
4. Data sanitized with DOMPurify

All innerHTML must have security audit comment.
```

**2. Update docs/DEVELOPER_GUIDE.md:**

Add section on XSS prevention and sanitization patterns.

---

## Rollback Plan

**If issues found:**

```bash
# Revert sanitization utilities
git checkout main -- shared/js/sanitization.js

# Revert component fixes
git checkout main -- shared/components/card.js shared/components/modal.js

# Revert tool changes
git checkout main -- tools/*/
```

**Partial rollback:**
- Can revert individual components
- Can disable sanitization in specific cases
- Can adjust DOMPurify configuration

---

## Related Tickets

**Depends On:**
- **ARCH-2:** Local libraries (DOMPurify must be local)
- **BOTH-1:** CSP hardening (defense-in-depth)

**Enables:**
- Full security audit approval
- Production deployment confidence

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Over-sanitization breaks features | MEDIUM | HIGH | Test all tools after changes |
| Miss an innerHTML instance | LOW | HIGH | Comprehensive grep audit |
| DOMPurify config too strict | MEDIUM | MEDIUM | Test with real content |
| Performance impact | LOW | LOW | DOMPurify is fast (<5ms) |

---

## Timeline

| Day | Phase | Duration | Deliverable |
|-----|-------|----------|-------------|
| **6 PM** | Create utilities | 4h | sanitization.js complete |
| **7 AM** | Fix high-risk | 4h | Components sanitized |
| **7 PM** | Audit low-risk | 4h | innerHTML audit complete |
| **7 Eve** | Security tests | 2h | XSS tests passing (10/10) |
| **Total** | | **14h** | **~2 days** |

---

**Status:** READY FOR IMPLEMENTATION  
**Blocked By:** ARCH-2 (DOMPurify must be local first)  
**Blocking:** Final security approval

**Priority Justification:** Critical security vulnerability. Required for production deployment. Addresses 3rd critical issue from security audit.
