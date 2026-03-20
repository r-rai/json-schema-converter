/**
 * Text Diff Checker - Main Logic
 * Implements text comparison with jsdiff library
 * 
 * @file text-diff.js
 */

// Theme is handled globally by app.js - no need to import

/**
 * Text Diff Application State
 */
class DiffApp {
  constructor() {
    this.originalText = '';
    this.modifiedText = '';
    this.diffResult = null;
    this.viewMode = 'side-by-side'; // or 'unified'
    this.options = {
      ignoreWhitespace: false,
      ignoreCase: false,
      charLevelDiff: false
    };
    
    this.init();
  }
  
  /**
   * Initialize the application
   */
  init() {
    this.cacheElements();
    this.attachEventListeners();
    this.loadPersistedState();
    // Theme is handled globally by app.js
  }
  
  /**
   * Cache DOM elements
   */
  cacheElements() {
    // Text inputs
    this.originalTextarea = document.getElementById('original-text');
    this.modifiedTextarea = document.getElementById('modified-text');
    
    // Checkboxes
    this.ignoreWhitespaceCheckbox = document.getElementById('ignore-whitespace');
    this.ignoreCaseCheckbox = document.getElementById('ignore-case');
    this.charLevelDiffCheckbox = document.getElementById('char-level-diff');
    
    // Buttons
    this.compareBtn = document.getElementById('compare-btn');
    this.clearBtn = document.getElementById('clear-btn');
    this.sampleBtn = document.getElementById('sample-btn');
    this.sideBySideBtn = document.getElementById('side-by-side-btn');
    this.unifiedBtn = document.getElementById('unified-btn');
    this.copyDiffBtn = document.getElementById('copy-diff-btn');
    this.downloadHtmlBtn = document.getElementById('download-html-btn');
    this.downloadTextBtn = document.getElementById('download-text-btn');
    
    // Output areas
    this.resultsSection = document.getElementById('results-section');
    this.diffOutput = document.getElementById('diff-output');
    
    // Stats
    this.statAdded = document.getElementById('stat-added');
    this.statRemoved = document.getElementById('stat-removed');
    this.statModified = document.getElementById('stat-modified');
    this.statUnchanged = document.getElementById('stat-unchanged');
    
    // Character counts
    this.originalCount = document.getElementById('original-count');
    this.modifiedCount = document.getElementById('modified-count');
  }
  
  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Text input handlers
    this.originalTextarea.addEventListener('input', () => this.updateCharCount('original'));
    this.modifiedTextarea.addEventListener('input', () => this.updateCharCount('modified'));
    
    // Option change handlers
    this.ignoreWhitespaceCheckbox.addEventListener('change', () => {
      this.options.ignoreWhitespace = this.ignoreWhitespaceCheckbox.checked;
      if (this.diffResult) this.performDiff();
    });
    
    this.ignoreCaseCheckbox.addEventListener('change', () => {
      this.options.ignoreCase = this.ignoreCaseCheckbox.checked;
      if (this.diffResult) this.performDiff();
    });
    
    this.charLevelDiffCheckbox.addEventListener('change', () => {
      this.options.charLevelDiff = this.charLevelDiffCheckbox.checked;
      if (this.diffResult) this.performDiff();
    });
    
    // Button handlers
    this.compareBtn.addEventListener('click', () => this.performDiff());
    this.clearBtn.addEventListener('click', () => this.clearAll());
    this.sampleBtn.addEventListener('click', () => this.loadSample());
    this.sideBySideBtn.addEventListener('click', () => this.switchViewMode('side-by-side'));
    this.unifiedBtn.addEventListener('click', () => this.switchViewMode('unified'));
    this.copyDiffBtn.addEventListener('click', () => this.copyDiff());
    this.downloadHtmlBtn.addEventListener('click', () => this.downloadHtml());
    this.downloadTextBtn.addEventListener('click', () => this.downloadText());
  }
  
  /**
   * Update character count display
   */
  updateCharCount(which) {
    if (which === 'original') {
      const count = this.originalTextarea.value.length;
      this.originalCount.textContent = `${count.toLocaleString()} character${count !== 1 ? 's' : ''}`;
    } else {
      const count = this.modifiedTextarea.value.length;
      this.modifiedCount.textContent = `${count.toLocaleString()} character${count !== 1 ? 's' : ''}`;
    }
  }
  
  /**
   * Perform diff comparison
   */
  performDiff() {
    this.originalText = this.originalTextarea.value;
    this.modifiedText = this.modifiedTextarea.value;
    
    if (!this.originalText && !this.modifiedText) {
      alert('Please enter text in both fields to compare.');
      return;
    }
    
    // Ensure jsdiff library is loaded
    console.log('[TextDiff] Checking for library. window.Diff:', typeof window.Diff, window.Diff);
    if (!window.Diff || typeof window.Diff.diffLines !== 'function') {
      console.error('[TextDiff] jsdiff library not loaded properly');
      console.error('[TextDiff] window.Diff:', window.Diff);
      console.error('[TextDiff] typeof window.Diff.diffLines:', window.Diff ? typeof window.Diff.diffLines : 'N/A');
      this.showToast('Diff library not available. Please refresh the page.', 'error');
      return;
    }
    
    const startTime = performance.now();
    
    // Apply text transformations based on options
    let text1 = this.originalText;
    let text2 = this.modifiedText;
    
    if (this.options.ignoreCase) {
      text1 = text1.toLowerCase();
      text2 = text2.toLowerCase();
    }
    
    if (this.options.ignoreWhitespace) {
      text1 = text1.replace(/\s+/g, ' ').trim();
      text2 = text2.replace(/\s+/g, ' ').trim();
    }
    
    // Compute diff using jsdiff library
    const Diff = window.Diff;
    
    if (this.options.charLevelDiff) {
      this.diffResult = Diff.diffChars(text1, text2);
    } else {
      this.diffResult = Diff.diffLines(text1, text2);
    }
    
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    
    console.log(`Diff computed in ${duration}ms`);
    
    // Calculate statistics
    this.calculateStats();
    
    // Render diff output
    this.renderDiff();
    
    // Show results section
    this.resultsSection.style.display = 'block';
    
    // Scroll to results
    this.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Persist state
    this.persistState();
  }
  
  /**
   * Calculate diff statistics
   */
  calculateStats() {
    let added = 0;
    let removed = 0;
    let unchanged = 0;
    
    this.diffResult.forEach(part => {
      if (this.options.charLevelDiff) {
        // Character-level stats
        if (part.added) added += part.value.length;
        else if (part.removed) removed += part.value.length;
        else unchanged += part.value.length;
      } else {
        // Line-level stats
        const lines = part.value.split('\n').filter(line => line.length > 0);
        const lineCount = lines.length;
        
        if (part.added) added += lineCount;
        else if (part.removed) removed += lineCount;
        else unchanged += lineCount;
      }
    });
    
    const modified = Math.min(added, removed);
    
    this.statAdded.textContent = added;
    this.statRemoved.textContent = removed;
    this.statModified.textContent = modified;
    this.statUnchanged.textContent = unchanged;
  }
  
  /**
   * Render diff output based on view mode
   */
  renderDiff() {
    if (this.viewMode === 'side-by-side') {
      this.renderSideBySide();
    } else {
      this.renderUnified();
    }
  }
  
  /**
   * Render side-by-side diff view
   */
  renderSideBySide() {
    let leftHtml = '';
    let rightHtml = '';
    let leftLineNum = 1;
    let rightLineNum = 1;
    
    this.diffResult.forEach(part => {
      const text = this.escapeHtml(part.value);
      const lines = part.value.split('\n');
      
      lines.forEach((line, index) => {
        // Skip empty last line from split
        if (index === lines.length - 1 && line === '') return;
        
        const escapedLine = this.escapeHtml(line);
        
        if (part.removed) {
          leftHtml += `<div class="diff-line diff-removed">`;
          leftHtml += `<span class="diff-line-number">${leftLineNum++}</span>`;
          leftHtml += `${escapedLine || ' '}</div>`;
        } else if (part.added) {
          rightHtml += `<div class="diff-line diff-added">`;
          rightHtml += `<span class="diff-line-number">${rightLineNum++}</span>`;
          rightHtml += `${escapedLine || ' '}</div>`;
        } else {
          leftHtml += `<div class="diff-line diff-unchanged">`;
          leftHtml += `<span class="diff-line-number">${leftLineNum++}</span>`;
          leftHtml += `${escapedLine || ' '}</div>`;
          
          rightHtml += `<div class="diff-line diff-unchanged">`;
          rightHtml += `<span class="diff-line-number">${rightLineNum++}</span>`;
          rightHtml += `${escapedLine || ' '}</div>`;
        }
      });
    });
    
    this.diffOutput.innerHTML = `
      <div class="diff-side-by-side">
        <div class="diff-column">
          <div class="diff-column-header">Original</div>
          <div class="diff-column-content">${leftHtml}</div>
        </div>
        <div class="diff-column">
          <div class="diff-column-header">Modified</div>
          <div class="diff-column-content">${rightHtml}</div>
        </div>
      </div>
    `;
  }
  
  /**
   * Render unified diff view
   */
  renderUnified() {
    let html = '';
    let lineNum = 1;
    
    this.diffResult.forEach(part => {
      const lines = part.value.split('\n');
      
      lines.forEach((line, index) => {
        // Skip empty last line from split
        if (index === lines.length - 1 && line === '') return;
        
        const escapedLine = this.escapeHtml(line);
        
        if (part.added) {
          html += `<div class="diff-line diff-added">`;
          html += `<span class="diff-prefix diff-prefix-added">+</span>`;
          html += `<span class="diff-line-number">${lineNum++}</span>`;
          html += `${escapedLine || ' '}</div>`;
        } else if (part.removed) {
          html += `<div class="diff-line diff-removed">`;
          html += `<span class="diff-prefix diff-prefix-removed">-</span>`;
          html += `<span class="diff-line-number">${lineNum++}</span>`;
          html += `${escapedLine || ' '}</div>`;
        } else {
          html += `<div class="diff-line diff-unchanged">`;
          html += `<span class="diff-prefix"> </span>`;
          html += `<span class="diff-line-number">${lineNum++}</span>`;
          html += `${escapedLine || ' '}</div>`;
        }
      });
    });
    
    this.diffOutput.innerHTML = `<div class="diff-unified">${html}</div>`;
  }
  
  /**
   * Switch view mode
   */
  switchViewMode(mode) {
    this.viewMode = mode;
    
    if (mode === 'side-by-side') {
      this.sideBySideBtn.classList.add('active');
      this.unifiedBtn.classList.remove('active');
    } else {
      this.unifiedBtn.classList.add('active');
      this.sideBySideBtn.classList.remove('active');
    }
    
    if (this.diffResult) {
      this.renderDiff();
    }
  }
  
  /**
   * Copy diff to clipboard
   */
  async copyDiff() {
    const text = this.generatePlainTextDiff();
    
    try {
      await navigator.clipboard.writeText(text);
      this.showToast('Diff copied to clipboard!', 'success');
    } catch (err) {
      console.error('Failed to copy:', err);
      this.showToast('Failed to copy diff', 'error');
    }
  }
  
  /**
   * Generate plain text representation of diff
   */
  generatePlainTextDiff() {
    let text = '';
    
    this.diffResult.forEach(part => {
      const lines = part.value.split('\n');
      
      lines.forEach((line, index) => {
        if (index === lines.length - 1 && line === '') return;
        
        if (part.added) {
          text += `+ ${line}\n`;
        } else if (part.removed) {
          text += `- ${line}\n`;
        } else {
          text += `  ${line}\n`;
        }
      });
    });
    
    return text;
  }
  
  /**
   * Download diff as HTML
   */
  downloadHtml() {
    const html = this.generateHtmlExport();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diff-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    
    this.showToast('HTML file downloaded!', 'success');
  }
  
  /**
   * Generate HTML export with styling
   */
  generateHtmlExport() {
    const timestamp = new Date().toLocaleString();
    const stats = {
      added: this.statAdded.textContent,
      removed: this.statRemoved.textContent,
      modified: this.statModified.textContent,
      unchanged: this.statUnchanged.textContent
    };
    
    const diffHtml = this.diffOutput.innerHTML;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Text Diff - ${timestamp}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
    .header { margin-bottom: 20px; }
    .stats { display: flex; gap: 20px; margin-bottom: 20px; }
    .stat { padding: 10px; background: #f5f5f5; border-radius: 4px; }
    .diff-added { background-color: rgba(34, 197, 94, 0.15); }
    .diff-removed { background-color: rgba(239, 68, 68, 0.15); }
    .diff-unchanged { color: #666; }
    .diff-line { padding: 2px 8px; font-family: monospace; font-size: 14px; line-height: 1.8; }
    .diff-line-number { display: inline-block; width: 50px; color: #999; text-align: right; margin-right: 16px; }
    .diff-prefix { display: inline-block; width: 20px; font-weight: bold; }
    .diff-prefix-added { color: #22c55e; }
    .diff-prefix-removed { color: #ef4444; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Text Diff Comparison</h1>
    <p>Generated: ${timestamp}</p>
  </div>
  <div class="stats">
    <div class="stat">Added: ${stats.added}</div>
    <div class="stat">Removed: ${stats.removed}</div>
    <div class="stat">Modified: ${stats.modified}</div>
    <div class="stat">Unchanged: ${stats.unchanged}</div>
  </div>
  ${diffHtml}
</body>
</html>`;
  }
  
  /**
   * Download diff as plain text
   */
  downloadText() {
    const text = this.generatePlainTextDiff();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diff-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    this.showToast('Text file downloaded!', 'success');
  }
  
  /**
   * Clear all inputs and results
   */
  clearAll() {
    this.originalTextarea.value = '';
    this.modifiedTextarea.value = '';
    this.updateCharCount('original');
    this.updateCharCount('modified');
    this.resultsSection.style.display = 'none';
    this.diffResult = null;
    
    localStorage.removeItem('text-diff-state');
  }
  
  /**
   * Load sample text
   */
  loadSample() {
    const sample1 = `function calculateTotal(items) {
  let total = 0;
  for (let item of items) {
    total += item.price;
  }
  return total;
}

const result = calculateTotal(cartItems);
console.log("Total: " + result);`;

    const sample2 = `function calculateTotal(items, discount = 0) {
  let total = 0;
  for (let item of items) {
    total += item.price * item.quantity;
  }
  
  // Apply discount
  if (discount > 0) {
    total = total * (1 - discount / 100);
  }
  
  return Math.round(total * 100) / 100;
}

const result = calculateTotal(cartItems, 10);
console.log(\`Total: $\${result.toFixed(2)}\`);`;

    this.originalTextarea.value = sample1;
    this.modifiedTextarea.value = sample2;
    this.updateCharCount('original');
    this.updateCharCount('modified');
    
    this.showToast('Sample text loaded!', 'success');
  }
  
  /**
   * Show toast notification
   */
  showToast(message, type = 'info') {
    // Simple toast implementation
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 24px;
      background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      border-radius: 6px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
  
  /**
   * Escape HTML special characters
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  /**
   * Persist state to localStorage
   */
  persistState() {
    const state = {
      originalText: this.originalText,
      modifiedText: this.modifiedText,
      options: this.options,
      viewMode: this.viewMode
    };
    
    localStorage.setItem('text-diff-state', JSON.stringify(state));
  }
  
  /**
   * Load persisted state from localStorage
   */
  loadPersistedState() {
    const saved = localStorage.getItem('text-diff-state');
    if (!saved) return;
    
    try {
      const state = JSON.parse(saved);
      
      if (state.originalText) {
        this.originalTextarea.value = state.originalText;
        this.updateCharCount('original');
      }
      
      if (state.modifiedText) {
        this.modifiedTextarea.value = state.modifiedText;
        this.updateCharCount('modified');
      }
      
      if (state.options) {
        this.options = state.options;
        this.ignoreWhitespaceCheckbox.checked = state.options.ignoreWhitespace;
        this.ignoreCaseCheckbox.checked = state.options.ignoreCase;
        this.charLevelDiffCheckbox.checked = state.options.charLevelDiff;
      }
      
      if (state.viewMode) {
        this.viewMode = state.viewMode;
      }
    } catch (err) {
      console.error('Failed to load persisted state:', err);
    }
  }
}

// Export initialization function for router
window.initTextDiff = function() {
  new DiffApp();
};

// Note: DiffApp is instantiated by router via window.initTextDiff
// Do NOT auto-initialize here as it would run before HTML is loaded
