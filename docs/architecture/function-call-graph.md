# Function Call Graph

**Execution Flow & Function Dependencies**

This document maps how execution flows through the DevToolbox application, showing function call hierarchies and dependencies.

Last Updated: March 20, 2026

---

## Application Initialization Flow

### Page Load Sequence
```
Browser loads index.html
    ↓
DOM Ready
    ↓
[IIFE Auto-Execution]
    ├─→ setTheme(getTheme())          # Apply saved theme
    ├─→ renderRecentApps()            # Show recent tools
    └─→ updatePageVisibility()        # Route to current hash
         ↓
window.addEventListener('hashchange', ...)
    └─→ updatePageVisibility()        # Re-route on hash change
```

---

## Core Navigation System

### Home Navigation
```
User clicks "Home" or logo
    ↓
navigateHome()
    ├─→ window.location.hash = ''
    └─→ updateBreadcrumb('Home')
         ↓
hashchange event fires
    ↓
updatePageVisibility()
    ├─→ homePage.style.display = 'block'
    ├─→ [all tools].style.display = 'none'
    └─→ updateBreadcrumb('Home')
```

### Tool Navigation
```
User clicks tool card or recent app chip
    ↓
launchTool(toolId)
    ├─→ addToRecentApps(toolId)
    │    ├─→ getRecentApps()
    │    │    └─→ localStorage.getItem(RECENT_APPS_KEY)
    │    ├─→ localStorage.setItem(...)
    │    └─→ renderRecentApps()
    │
    ├─→ window.location.hash = toolId
    └─→ updateBreadcrumb(TOOLS[toolId].name)
         ↓
hashchange event fires
    ↓
updatePageVisibility()
    ├─→ [check hash value]
    ├─→ [show appropriate tool container]
    ├─→ loadJsonTool() [if hash === 'json']
    │    └─→ initializeJsonTool()
    │         └─→ [setup JSON tool state]
    └─→ addToRecentApps(toolId)
```

---

## Theme Management System

### Theme Toggle Flow
```
User clicks theme toggle button
    ↓
toggleTheme()
    ├─→ getTheme()
    │    └─→ localStorage.getItem(THEME_KEY) || 'dark'
    │
    └─→ setTheme(newTheme)
         ├─→ localStorage.setItem(THEME_KEY, theme)
         ├─→ document.documentElement.setAttribute('data-theme', theme)
         └─→ updateThemeIcon(theme)
              └─→ themeIcon.textContent = [☀️ or 🌙]
```

---

## Search Modal System

### Search Activation
```
User presses Ctrl+K or clicks search icon
    ↓
openSearch()
    ├─→ searchModal.classList.add('active')
    ├─→ searchInput.value = ''
    ├─→ searchInput.focus()
    └─→ renderSearchResults('')
         ├─→ [filter TOOLS by query]
         └─→ searchResults.innerHTML = [rendered results]
```

### Search Interaction
```
User types in search input
    ↓
handleSearchInput()
    ├─→ const query = searchInput.value
    └─→ renderSearchResults(query)
         ├─→ [filter TOOLS by query]
         └─→ searchResults.innerHTML = [rendered results with highlights]

User presses Enter or clicks result
    ↓
launchTool(toolId)
    └─→ [see Tool Navigation flow above]
```

---

## JSON Schema Tool

### Schema Generation Flow
```
User pastes JSON, clicks "Generate Schema"
    ↓
generateSchema()
    ├─→ JSON.parse(jsonInput.value)
    │    └─→ [throws SyntaxError if invalid]
    │
    ├─→ inferType(data)
    │    ├─→ [check Array.isArray()]
    │    ├─→ [check typeof]
    │    └─→ return 'string' | 'number' | 'object' | 'array' | ...
    │
    ├─→ generateSchemaFromData(data, schemaVersion)
    │    ├─→ inferType(data)
    │    ├─→ [recursively process object properties]
    │    ├─→ [recursively process array items]
    │    ├─→ detectFormat(value)  # for strings
    │    │    └─→ [regex checks for email, uri, date-time, etc.]
    │    └─→ return schemaObject
    │
    ├─→ showSchemaOutput()
    │    ├─→ schemaOutputWrapper.style.display = 'block'
    │    ├─→ mainGrid.setAttribute('data-schema-visible', 'true')
    │    └─→ [setTimeout] → schemaOutputHeading.focus()
    │
    ├─→ [render schema to textarea]
    └─→ showToast('success', 'Schema generated')
```

### Beautify/Minify Flow
```
User clicks "Beautify" or "Minify"
    ↓
beautifyJSON() OR minifyJSON()
    ├─→ JSON.parse(jsonInput.value)
    │    └─→ [throws SyntaxError if invalid]
    │
    ├─→ JSON.stringify(json, null, 2)  # beautify with 2-space indent
    │   OR
    │   JSON.stringify(json)            # minify (no spacing)
    │
    ├─→ jsonInput.value = [formatted result]
    └─→ showToast('success', 'JSON beautified/minified ✓')
```

### Validation Flow
```
User clicks "Validate JSON Against Schema"
    ↓
validateJSON()
    ├─→ schemaSourcePanel.style.display = 'block'
    └─→ [wait for user to select schema source]

User selects schema source and clicks "Validate Now"
    ↓
runValidation()
    ├─→ [check schema source: generated or custom]
    │
    ├─→ [if custom]
    │    ├─→ JSON.parse(customSchemaText)
    │    └─→ [validate schema structure]
    │
    ├─→ JSON.parse(jsonInput.value)
    │
    ├─→ validateData(jsonData, schema)
    │    ├─→ [check type match]
    │    ├─→ [check required properties]
    │    ├─→ [recursively validate nested objects]
    │    ├─→ [validate array items]
    │    ├─→ [check string formats]
    │    └─→ return { valid: boolean, errors: array }
    │
    ├─→ showSchemaOutput()
    │
    ├─→ displayValidationResult(result, schemaSource)
    │    ├─→ [render success or error messages]
    │    └─→ [highlight error locations]
    │
    └─→ closeSchemaPanel()
```

---

## Markdown Converter Tool

### Conversion Flow
```
User enters HTML/Markdown, clicks "Convert"
    ↓
convertFormat()
    ├─→ [get conversion mode from dropdown]
    │
    ├─→ [if 'html-to-md']
    │    ├─→ [lazy-load Turndown library if not loaded]
    │    │    └─→ loadScript(turndownUrl)
    │    ├─→ new TurndownService(options)
    │    └─→ turndownService.turndown(htmlInput)
    │
    └─→ [if 'md-to-html']
         ├─→ [lazy-load Marked & DOMPurify if not loaded]
         │    ├─→ loadScript(markedUrl)
         │    └─→ loadScript(dompurifyUrl)
         │
         ├─→ convertMarkdownToHtml(markdown)
         │    ├─→ parseMarkdown(markdown)
         │    │    ├─→ [regex replace headers: # → <h1>]
         │    │    ├─→ [regex replace bold: ** → <strong>]
         │    │    ├─→ [regex replace italic: * → <em>]
         │    │    ├─→ [regex replace links: [text](url) → <a>]
         │    │    ├─→ [regex replace code: ` → <code>]
         │    │    └─→ return htmlString
         │    │
         │    └─→ DOMPurify.sanitize(htmlString)
         │         └─→ return sanitizedHtml
         │
         └─→ converterOutput.value = result
```

---

## Diff Checker Tool

### Text Comparison Flow
```
User enters text in both panels, clicks "Compare"
    ↓
compareDiff()
    ├─→ [get original and modified text]
    │
    ├─→ [lazy-load jsdiff library if not loaded]
    │    └─→ loadScript(jsdiffUrl)
    │
    ├─→ Diff.diffLines(originalText, modifiedText)
    │    └─→ return diffArray [{value: string, added: bool, removed: bool}]
    │
    ├─→ renderDiff(diffArray)
    │    ├─→ [count additions, deletions, unchanged]
    │    ├─→ [generate HTML for each diff part]
    │    │    ├─→ .diff-added for added lines
    │    │    ├─→ .diff-removed for removed lines
    │    │    └─→ .diff-unchanged for unchanged lines
    │    └─→ diffOutput.innerHTML = [rendered diff]
    │
    ├─→ [update diff stats]
    └─→ diffResults.style.display = 'block'
```

---

## SIP Calculator Tool

### Calculation Flow
```
User enters investment details, clicks "Calculate Returns"
    ↓
calculateSIP()
    ├─→ parseFloat(sipAmount)
    ├─→ parseFloat(sipRate)
    ├─→ parseFloat(sipDuration)
    │
    ├─→ [for each year in duration]
    │    ├─→ invested += monthlyAmount * 12
    │    ├─→ value = FV calculation using compound interest formula
    │    │    FV = P * [((1 + r)^n - 1) / r] * (1 + r)
    │    │    where P=monthly, r=monthly rate, n=total months
    │    └─→ yearData.push({year, invested, value, gain})
    │
    ├─→ [render summary cards]
    │    ├─→ sipInvested.textContent = formatCurrency(totalInvested)
    │    ├─→ sipGain.textContent = formatCurrency(wealthGain)
    │    └─→ sipFinalValue.textContent = formatCurrency(finalValue)
    │
    ├─→ [render year-wise table]
    │    └─→ sipTableBody.innerHTML = [rows for each year]
    │
    ├─→ [lazy-load Chart.js if not loaded]
    │    └─→ loadScript(chartjsUrl)
    │
    ├─→ renderSIPChart(yearData)
    │    └─→ new Chart(canvas, {type: 'line', data: yearData})
    │
    └─→ sipResults.style.display = 'block'
```

---

## EMI Calculator Tool

### Basic EMI Calculation Flow
```
User enters loan details, clicks "Calculate EMI"
    ↓
calculateEMI()
    ├─→ parseFloat(loanAmount)
    ├─→ parseFloat(loanRate)
    ├─→ parseFloat(loanTenure)
    │
    ├─→ [calculate monthly EMI using formula]
    │    EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
    │    where P=principal, r=monthly rate, n=total months
    │
    ├─→ [build amortization schedule]
    │    ├─→ [for each month]
    │    │    ├─→ interestPaid = balance * monthlyRate
    │    │    ├─→ principalPaid = emi - interestPaid
    │    │    └─→ balance -= principalPaid
    │    └─→ [aggregate by year for table]
    │
    ├─→ [render summary cards]
    │    ├─→ monthlyEMI.textContent = formatCurrency(emi)
    │    ├─→ totalInterest.textContent = formatCurrency(totalInterest)
    │    └─→ totalPayment.textContent = formatCurrency(totalPayment)
    │
    ├─→ [render amortization table]
    │    └─→ emiTableBody.innerHTML = [rows for each year]
    │
    └─→ emiResults.style.display = 'block'
         └─→ prepaymentSection.style.display = 'block'  # Show prepayment option
```

### Prepayment Calculation Flow
```
User expands prepayment section, enters details, clicks "Recalculate"
    ↓
calculateEMIWithPrepaymentUI()
    ├─→ [get prepayment type, amount, strategy]
    │
    ├─→ calculateEMIWithPrepayment(principal, rate, tenure, prepayment)
    │    ├─→ [calculate month-by-month with prepayment applied]
    │    │
    │    ├─→ [if type === 'lump-sum']
    │    │    ├─→ [when month === startMonth]
    │    │    └─→ balance -= prepaymentAmount
    │    │
    │    ├─→ [if type === 'monthly-extra']
    │    │    ├─→ [when month >= startMonth]
    │    │    └─→ principalPaid += extraPayment
    │    │
    │    ├─→ [if strategy === 'reduce-tenure']
    │    │    └─→ [stop when balance reaches 0]
    │    │
    │    └─→ [if strategy === 'reduce-emi']
    │         └─→ [recalculate EMI after prepayment, keep tenure same]
    │
    ├─→ displayPrepaymentComparison(result)
    │    ├─→ [render "Without Prepayment" card]
    │    ├─→ [render "With Prepayment" card]
    │    ├─→ [calculate and show savings]
    │    │    ├─→ interestSaved = originalInterest - prepaymentInterest
    │    │    ├─→ tenureReduced = originalMonths - prepaymentMonths
    │    │    └─→ totalSavings = interestSaved
    │    └─→ [render comparison cards]
    │
    └─→ prepaymentComparison.style.display = 'block'
```

---

## Utility Functions

### Toast Notifications
```
Any function needs to show user feedback
    ↓
showToast(type, message)
    ├─→ [create toast element]
    ├─→ toast.classList.add(type)  # 'success', 'error', 'warning', 'info'
    ├─→ document.body.appendChild(toast)
    ├─→ setTimeout(() => toast.classList.add('show'), 100)
    └─→ setTimeout(() => {
         ├─→ toast.classList.remove('show')
         └─→ setTimeout(() => toast.remove(), 300)
        }, 3000)
```

### Clipboard Operations
```
User clicks "Copy" button
    ↓
copyToClipboard(elementId)
    ├─→ document.getElementById(elementId)
    ├─→ textarea.select()
    ├─→ document.execCommand('copy')
    └─→ showToast('success', 'Copied to clipboard')
```

### Download Operations
```
User clicks "Download" button
    ↓
downloadJSON() / downloadSchema() / etc.
    ├─→ [get content to download]
    ├─→ new Blob([content], {type: 'application/json'})
    ├─→ URL.createObjectURL(blob)
    ├─→ [create temporary <a> element]
    ├─→ a.href = url
    ├─→ a.download = filename
    ├─→ a.click()
    └─→ URL.revokeObjectURL(url)
```

---

## External Library Loading

### Lazy-Load Pattern
```
Tool needs external library (Chart.js, jsdiff, Turndown, etc.)
    ↓
[check if library already loaded]
    ├─→ if (typeof LibraryName !== 'undefined')
    │    └─→ [use library directly]
    │
    └─→ else
         ├─→ loadScript(libraryUrl)
         │    ├─→ new Promise((resolve, reject) => {
         │    ├─→    const script = document.createElement('script')
         │    ├─→    script.src = url
         │    ├─→    script.onload = resolve
         │    ├─→    script.onerror = reject
         │    └─→    document.head.appendChild(script)
         │         })
         │
         └─→ .then(() => [use library])
              OR
              .catch(() => showToast('error', 'Failed to load library'))
```

---

## Error Handling Patterns

### JSON Parsing Errors
```
Function attempts JSON.parse()
    ↓
try {
    const data = JSON.parse(input)
    └─→ [continue with data]
}
catch (e) {
    ├─→ showToast('error', 'Invalid JSON: ' + e.message)
    └─→ return early
}
```

### Input Validation Errors
```
Function validates user input
    ↓
if (!input || input <= 0) {
    ├─→ showToast('error', 'Please enter a valid value')
    └─→ return early
}
```

---

## Performance Optimizations

### Debouncing (Search Input)
```
User types in search
    ↓
handleSearchInput()
    ├─→ [clear previous timeout]
    └─→ setTimeout(() => {
         └─→ renderSearchResults(query)
        }, 150)  # Debounce delay
```

### Caching (Recent Apps)
```
getRecentApps()
    ├─→ localStorage.getItem(RECENT_APPS_KEY)
    └─→ [cache is localStorage itself - persistent]

addToRecentApps()
    └─→ [update localStorage immediately]
         └─→ [no need to re-read, already in memory]
```

---

## Summary: Key Function Categories

### Navigation (7 functions)
- `navigateHome()`
- `launchTool(toolId)`
- `updatePageVisibility()`
- `updateBreadcrumb(toolName)`
- `handleCardKeypress(event, toolId)`
- `getCurrentTool()`
- `loadJsonTool()`

### Theme Management (4 functions)
- `getTheme()`
- `setTheme(theme)`
- `toggleTheme()`
- `updateThemeIcon(theme)`

### Recent Apps (3 functions)
- `getRecentApps()`
- `addToRecentApps(toolId)`
- `renderRecentApps()`

### Search (4 functions)
- `openSearch()`
- `closeSearchModal(event)`
- `handleSearchInput()`
- `renderSearchResults(query)`

### JSON Schema (12 functions)
- `generateSchema()`
- `validateJSON()`
- `runValidation()`
- `inferType(data)`
- `generateSchemaFromData(data, version)`
- `detectFormat(value)`
- `validateData(data, schema)`
- `beautifyJSON()`
- `minifyJSON()`
- `showSchemaOutput()`
- `toggleSchemaInput()`
- `closeSchemaPanel()`

### Markdown Converter (6 functions)
- `convertFormat()`
- `convertMarkdownToHtml(markdown)`
- `parseMarkdown(markdown)`
- `updateConversionLabels()`
- `swapConversionDirection()`
- `clearConverter()`

### Diff Checker (5 functions)
- `compareDiff()`
- `renderDiff(diffArray)`
- `swapDiffTexts()`
- `clearDiff()`
- `updateLineCount(textareaId, countId)`

### Calculators (10 functions)
- `calculateSIP()`
- `renderSIPChart(data)`
- `exportSIPResults()`
- `calculateEMI()`
- `calculateEMIWithPrepaymentUI()`
- `calculateEMIWithPrepayment(principal, rate, tenure, prepayment)`
- `displayPrepaymentComparison(result)`
- `togglePrepaymentSection()`
- `updatePrepaymentForm()`
- `exportEMIResults()`

### Utilities (8 functions)
- `showToast(type, message)`
- `copyToClipboard(elementId)`
- `downloadJSON()`
- `downloadSchema()`
- `formatCurrency(amount)`
- `formatNumber(number)`
- `loadScript(url)`
- `handleErrors(error)`

---

## Related Documentation

- [Architecture Overview](./overview.md) - System architecture
- [Repository Index](./repo-index.md) - File structure
- [ARCHITECTURE.md](../ARCHITECTURE.md) - Complete technical specification
- [DEVELOPER_GUIDE.md](../DEVELOPER_GUIDE.md) - Contributing guidelines

---

**This call graph is maintained as part of the architecture documentation. Update when new functions are added or flows change.**
