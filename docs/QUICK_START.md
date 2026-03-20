# 🚀 Developer Quick Start Guide

**Infrastructure Complete ✅ | Start Building Now!**

---

## 📁 File Structure

```
json-schema-converter/
│
├── 📄 index.html                    ← Main entry point
├── 🧪 test-platform.html            ← TEST ALL COMPONENTS HERE
│
├── 📂 shared/                       ← YOUR TOOLKIT
│   │
│   ├── 📂 js/                       ← Utilities (import these)
│   │   ├── app.js                   ← App initialization
│   │   ├── router.js                ← Client-side routing
│   │   ├── theme.js                 ← Theme management
│   │   ├── storage.js               ← LocalStorage wrapper
│   │   ├── utils.js                 ← Format, validate, etc.
│   │   ├── clipboard.js             ← Copy to clipboard
│   │   └── download.js              ← File downloads
│   │
│   ├── 📂 components/               ← Component factories
│   │   ├── button.js                ← Button component
│   │   ├── input.js                 ← Input component
│   │   ├── card.js                  ← Card component
│   │   └── modal.js                 ← Modal component
│   │
│   └── 📂 css/                      ← Styling (already linked)
│       ├── variables.css            ← Design tokens
│       ├── reset.css                ← CSS reset
│       ├── components.css           ← Component styles
│       ├── themes.css               ← Light/dark themes
│       ├── utilities.css            ← Utility classes
│       └── responsive.css           ← Responsive breakpoints
│
├── 📂 tools/                        ← BUILD YOUR FEATURES HERE
│   ├── json-schema/                 ← Example: JSON Schema tool
│   ├── sip-calculator/              ← Example: SIP Calculator
│   └── [your-tool]/                 ← Your new tool goes here
│
└── 📂 docs/                         ← Documentation
    ├── INFRASTRUCTURE_STATUS.md     ← Quick reference
    ├── INFRASTRUCTURE_COMPLETE.md   ← Detailed report
    └── DEVELOPER_GUIDE.md           ← Full usage guide
```

---

## ⚡ Get Started in 3 Steps

### Step 1: Test the Platform (2 minutes)

```bash
# Open test page in browser
open test-platform.html

# Or run local server
python3 -m http.server 8000
# Then visit: http://localhost:8000/test-platform.html
```

**What to check:**
- ✅ All 9 tests pass
- ✅ Theme toggle works (sun/moon icon)
- ✅ Buttons render correctly
- ✅ Modal opens and closes
- ✅ No console errors

---

### Step 2: Learn the APIs (5 minutes)

Open `test-platform.html` source code and see examples of:
- Creating buttons, inputs, cards, modals
- Using storage, clipboard, download utilities
- Formatting currency and numbers
- Theme management

---

### Step 3: Build Your Tool (30 minutes)

Create your tool directory:

```bash
mkdir -p tools/my-tool
cd tools/my-tool
```

Create `index.html`:

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Tool - DevToolbox</title>
  
  <!-- Link shared CSS -->
  <link rel="stylesheet" href="../../shared/css/variables.css">
  <link rel="stylesheet" href="../../shared/css/reset.css">
  <link rel="stylesheet" href="../../shared/css/components.css">
  <link rel="stylesheet" href="../../shared/css/themes.css">
  <link rel="stylesheet" href="../../shared/css/utilities.css">
  <link rel="stylesheet" href="../../shared/css/responsive.css">
  
  <!-- Your tool-specific CSS (optional) -->
  <link rel="stylesheet" href="my-tool.css">
</head>
<body>
  <div class="container">
    <div id="app">
      <!-- Your tool UI here -->
    </div>
  </div>
  
  <!-- Load your tool -->
  <script type="module" src="my-tool.js"></script>
</body>
</html>
```

Create `my-tool.js`:

```javascript
/**
 * My Tool Implementation
 */

// Import what you need from shared modules
import { createButton } from '../../shared/components/button.js';
import { createInput } from '../../shared/components/input.js';
import { createCard } from '../../shared/components/card.js';
import { storage } from '../../shared/js/storage.js';
import { formatCurrency } from '../../shared/js/utils.js';
import { copyToClipboard } from '../../shared/js/clipboard.js';
import { downloadJSON } from '../../shared/js/download.js';

// Your tool initialization
function init() {
  const app = document.getElementById('app');
  
  // Example: Create a card with input and buttons
  const input = createInput({
    id: 'user-input',
    label: 'Enter Value',
    type: 'number',
    required: true,
    helpText: 'Enter a number to process',
    onChange: (value) => {
      console.log('Value changed:', value);
      // Your logic here
    }
  });
  
  const processBtn = createButton({
    label: 'Process',
    variant: 'primary',
    icon: '⚡',
    onClick: handleProcess
  });
  
  const card = createCard({
    icon: '🛠️',
    title: 'My Tool',
    content: input.container,
    actions: [processBtn]
  });
  
  app.appendChild(card);
}

function handleProcess() {
  // Your processing logic
  const value = document.getElementById('user-input').value;
  
  // Example: Save to storage
  storage.set('my-tool-value', value);
  
  // Example: Show formatted result
  alert(`Processed: ${formatCurrency(value)}`);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
```

---

## 🎯 Common Patterns

### Pattern 1: Create a Button

```javascript
import { createButton } from '../../shared/components/button.js';

const btn = createButton({
  label: 'Save',
  variant: 'primary',       // primary, secondary, ghost, danger
  size: 'medium',           // small, medium, large
  icon: '💾',
  onClick: () => {
    console.log('Clicked!');
  }
});

document.getElementById('container').appendChild(btn);
```

### Pattern 2: Create an Input with Validation

```javascript
import { createInput } from '../../shared/components/input.js';

const input = createInput({
  id: 'email',
  label: 'Email Address',
  type: 'email',
  required: true,
  helpText: 'We will never share your email',
  onChange: (value) => {
    console.log('Email:', value);
  }
});

document.getElementById('form').appendChild(input.container);

// Access the input element
const emailInput = input.input;
const emailValue = emailInput.value;
```

### Pattern 3: Save/Load State

```javascript
import { storage } from '../../shared/js/storage.js';

// Save data
const data = { user: 'John', score: 100 };
storage.set('my-tool-state', data);

// Load data (with default value)
const savedData = storage.get('my-tool-state', { user: '', score: 0 });

// Remove data
storage.remove('my-tool-state');
```

### Pattern 4: Format Currency (Indian Style)

```javascript
import { formatCurrency, formatNumber } from '../../shared/js/utils.js';

const amount = 1234567;
console.log(formatCurrency(amount));  // ₹12,34,567

const large = 9876543210;
console.log(formatNumber(large));     // 9,87,65,43,210
```

### Pattern 5: Copy to Clipboard

```javascript
import { copyToClipboard } from '../../shared/js/clipboard.js';

const copyBtn = createButton({
  label: 'Copy',
  onClick: async () => {
    const success = await copyToClipboard('Text to copy', false);
    if (success) {
      alert('Copied!');
    }
  }
});
```

### Pattern 6: Download Files

```javascript
import { downloadJSON, downloadCSV, downloadFile } from '../../shared/js/download.js';

// Download JSON
const data = { name: 'Test', value: 123 };
downloadJSON(data, 'my-data'); // Creates my-data.json

// Download CSV
const rows = [
  { name: 'Test 1', value: 100 },
  { name: 'Test 2', value: 200 }
];
downloadCSV(rows, 'my-data'); // Creates my-data.csv

// Download plain text
downloadFile('Hello world', 'hello.txt', 'text/plain');
```

### Pattern 7: Show Modal Dialog

```javascript
import { createModal } from '../../shared/components/modal.js';
import { createButton } from '../../shared/components/button.js';

const confirmBtn = createButton({
  label: 'OK',
  variant: 'primary',
  onClick: () => {
    console.log('Confirmed');
    modal.close();
  }
});

const modal = createModal({
  title: 'Confirm Action',
  content: '<p>Are you sure you want to proceed?</p>',
  actions: [confirmBtn],
  closeOnEscape: true,
  closeOnBackdrop: true
});

modal.open();
```

---

## 🎨 Using CSS Utilities

The platform includes utility classes for common styling needs:

```html
<!-- Flexbox -->
<div class="flex items-center justify-between gap-md">
  <span>Left</span>
  <span>Right</span>
</div>

<!-- Spacing -->
<div class="mt-lg mb-xl p-md">
  Content with margin-top-large, margin-bottom-xl, padding-medium
</div>

<!-- Text -->
<p class="text-secondary text-sm">
  Secondary colored small text
</p>

<!-- Display -->
<div class="hidden">Hidden element</div>
<div class="block">Block element</div>
```

Available utility classes:
- **Display:** `.hidden`, `.block`, `.flex`, `.grid`
- **Flex:** `.flex-row`, `.flex-col`, `.items-center`, `.justify-between`
- **Spacing:** `.m-{size}`, `.p-{size}`, `.mt-{size}`, `.gap-{size}`
- **Text:** `.text-{size}`, `.text-{color}`, `.text-center`

---

## 🎭 Theme Support

Your tool automatically supports dark/light themes. No extra work needed!

```javascript
// Optional: Listen to theme changes
import { ThemeManager } from '../../shared/js/theme.js';

const themeManager = new ThemeManager();
const currentTheme = themeManager.getTheme(); // 'dark' or 'light'

// Theme is already applied globally via CSS variables
```

---

## 📝 Component API Cheat Sheet

### Button
```javascript
createButton({
  label: string,           // Button text
  variant: string,         // 'primary' | 'secondary' | 'ghost' | 'danger'
  size: string,            // 'small' | 'medium' | 'large'
  icon: string,            // HTML or emoji
  disabled: boolean,       // Default: false
  onClick: function        // Click handler
})
→ Returns: HTMLButtonElement
```

### Input
```javascript
createInput({
  id: string,              // Unique ID (required)
  label: string,           // Label text (required)
  type: string,            // 'text' | 'number' | 'email' | 'password' | ...
  placeholder: string,     // Placeholder text
  value: string|number,    // Initial value
  required: boolean,       // Is required
  disabled: boolean,       // Is disabled
  helpText: string,        // Help text below input
  min: number,             // Min value (for number)
  max: number,             // Max value (for number)
  step: number,            // Step (for number)
  maxLength: number,       // Max length
  onChange: function,      // Change handler
  onInput: function,       // Input handler
  validator: function      // Custom validator
})
→ Returns: { container, input, setError, clearError }
```

### Card
```javascript
createCard({
  icon: string,            // Icon HTML or emoji
  title: string,           // Card title
  subtitle: string,        // Card subtitle
  content: string,         // Content (text or HTML)
  actions: Array,          // Array of button elements
  hover: boolean,          // Hover effect
  clickable: boolean,      // Is clickable
  onClick: function        // Click handler
})
→ Returns: HTMLDivElement
```

### Modal
```javascript
createModal({
  title: string,           // Modal title (required)
  content: string|Element, // Content (required)
  actions: Array,          // Array of buttons
  closeButton: boolean,    // Show close X button
  closeOnEscape: boolean,  // Close on ESC key
  closeOnBackdrop: boolean,// Close on backdrop click
  size: string,            // 'small' | 'medium' | 'large'
  onOpen: function,        // Open callback
  onClose: function        // Close callback
})
→ Returns: { open(), close() }
```

---

## 🐛 Troubleshooting

### Issue: Import not working
```javascript
// ❌ Wrong
import { createButton } from 'button.js';

// ✅ Correct - use relative path
import { createButton } from '../../shared/components/button.js';
```

### Issue: Component not visible
```javascript
// ❌ Wrong - forgot to append to DOM
const btn = createButton({ label: 'Test' });

// ✅ Correct - append to container
const btn = createButton({ label: 'Test' });
document.getElementById('container').appendChild(btn);
```

### Issue: CSS not applying
```html
<!-- Make sure all CSS files are linked in order -->
<link rel="stylesheet" href="../../shared/css/variables.css">
<link rel="stylesheet" href="../../shared/css/reset.css">
<link rel="stylesheet" href="../../shared/css/components.css">
<link rel="stylesheet" href="../../shared/css/themes.css">
<link rel="stylesheet" href="../../shared/css/utilities.css">
<link rel="stylesheet" href="../../shared/css/responsive.css">
```

### Issue: Theme not working
```html
<!-- Add data-theme attribute to <html> tag -->
<html lang="en" data-theme="dark">
```

---

## 📚 Additional Resources

1. **test-platform.html**
   - Live demo of all components
   - Copy-paste examples
   - Interactive testing

2. **docs/DEVELOPER_GUIDE.md**
   - Comprehensive usage guide
   - Advanced patterns
   - Best practices

3. **docs/INFRASTRUCTURE_COMPLETE.md**
   - Detailed infrastructure report
   - Architecture overview
   - Complete API reference

---

## ✅ Quality Checklist

Before submitting your tool, verify:

- [ ] Uses shared components (not custom HTML)
- [ ] Uses shared utilities (not reimplementing)
- [ ] Imports are correct (relative paths)
- [ ] No console errors
- [ ] Works in both dark and light themes
- [ ] Responsive (works on mobile)
- [ ] Accessible (keyboard navigation, ARIA labels)
- [ ] State saved/loaded using storage module
- [ ] Code is documented with comments

---

## 🎉 You're Ready!

Everything you need is in the `shared/` folder. Import, use, and build amazing tools!

**Questions?** Check:
1. `test-platform.html` for examples
2. `docs/DEVELOPER_GUIDE.md` for detailed docs
3. Source code JSDoc comments

**Happy coding! 🚀**
