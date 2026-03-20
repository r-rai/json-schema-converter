/**
 * HTML ↔ Markdown Converter
 * Libraries: Turndown (HTML→MD), Marked (MD→HTML), DOMPurify (Sanitization)
 */

import { copyToClipboard, showCopyNotification } from '../../shared/js/clipboard.js';
import { downloadFile } from '../../shared/js/download.js';
import { storage } from '../../shared/js/storage.js';
import { debounce } from '../../shared/js/utils.js';

// Local library paths with SRI hashes
const TURNDOWN_LOCAL = '/lib/turndown.min.js';
const TURNDOWN_SRI = 'sha384-4E5fAjneTPSZB7TRmAH/1xQBJJTzeTfqpmhmI/uCnSvowQXSeDCRqAr0KWF7io1G';

const MARKED_LOCAL = '/lib/marked.min.js';
const MARKED_SRI = 'sha384-odPBjvtXVM/5hOYIr3A1dB+flh0c3wAT3bSesIOqEGmyUA4JoKf/YTWy0XKOYAY7';

const DOMPURIFY_LOCAL = '/lib/purify.min.js';
const DOMPURIFY_SRI = 'sha384-cwS6YdhLI7XS60eoDiC+egV0qHp8zI+Cms46R0nbn8JrmoAzV9uFL60etMZhAnSu';

// DOM Elements
const inputEditor = document.getElementById('input-editor');
const outputEditor = document.getElementById('output-editor');
const outputPreview = document.getElementById('output-preview');

const htmlToMdBtn = document.getElementById('html-to-md-btn');
const mdToHtmlBtn = document.getElementById('md-to-html-btn');
const swapBtn = document.getElementById('swap-btn');

const clearInputBtn = document.getElementById('clear-input-btn');
const pasteBtn = document.getElementById('paste-btn');
const sampleBtn = document.getElementById('sample-btn');

const copyOutputBtn = document.getElementById('copy-output-btn');
const downloadOutputBtn = document.getElementById('download-output-btn');
const openPreviewBtn = document.getElementById('open-preview-btn');

const inputFormatRadios = document.querySelectorAll('input[name="input-format"]');
const viewModeRadios = document.querySelectorAll('input[name="view-mode"]');

const gfmEnabled = document.getElementById('gfm-enabled');
const sanitizeHtml = document.getElementById('sanitize-html');
const preserveWhitespace = document.getElementById('preserve-whitespace');
const codeHighlighting = document.getElementById('code-highlighting');

const statusMessage = document.getElementById('status-message');
const inputCharCount = document.getElementById('input-char-count');
const inputLineCount = document.getElementById('input-line-count');
const outputCharCount = document.getElementById('output-char-count');
const outputFormat = document.getElementById('output-format');

// State
let currentInputFormat = 'html';
let currentViewMode = 'code';
let librariesLoaded = {
  turndown: false,
  marked: false,
  dompurify: false
};

/**
 * Initialize converter
 */
function init() {
  // Load saved options
  loadSavedOptions();
  
  // Event listeners
  htmlToMdBtn.addEventListener('click', () => handleConvert('html-to-md'));
  mdToHtmlBtn.addEventListener('click', () => handleConvert('md-to-html'));
  swapBtn.addEventListener('click', handleSwap);
  
  clearInputBtn.addEventListener('click', handleClearInput);
  pasteBtn.addEventListener('click', handlePaste);
  sampleBtn.addEventListener('click', handleLoadSample);
  
  copyOutputBtn.addEventListener('click', handleCopyOutput);
  downloadOutputBtn.addEventListener('click', handleDownloadOutput);
  openPreviewBtn.addEventListener('click', handleOpenPreview);
  
  inputFormatRadios.forEach(radio => {
    radio.addEventListener('change', handleInputFormatChange);
  });
  
  viewModeRadios.forEach(radio => {
    radio.addEventListener('change', handleViewModeChange);
  });
  
  inputEditor.addEventListener('input', debounce(handleInputChange, 300));
  
  // Save options on change
  [gfmEnabled, sanitizeHtml, preserveWhitespace, codeHighlighting].forEach(checkbox => {
    checkbox.addEventListener('change', saveOptions);
  });
}

/**
 * Load saved options
 */
function loadSavedOptions() {
  const saved = storage.get('htmlMarkdownOptions');
  if (saved) {
    gfmEnabled.checked = saved.gfm ?? true;
    sanitizeHtml.checked = saved.sanitize ?? true;
    preserveWhitespace.checked = saved.preserveWhitespace ?? false;
    codeHighlighting.checked = saved.codeHighlighting ?? true;
  }
}

/**
 * Save options
 */
function saveOptions() {
  storage.set('htmlMarkdownOptions', {
    gfm: gfmEnabled.checked,
    sanitize: sanitizeHtml.checked,
    preserveWhitespace: preserveWhitespace.checked,
    codeHighlighting: codeHighlighting.checked
  });
}

/**
 * Handle input change
 */
function handleInputChange() {
  updateInputStats();
}

/**
 * Update input statistics
 */
function updateInputStats() {
  const text = inputEditor.value;
  inputCharCount.textContent = `${text.length.toLocaleString()} characters`;
  inputLineCount.textContent = `${text ? text.split('\n').length : 0} lines`;
}

/**
 * Update output statistics
 */
function updateOutputStats(format) {
  const text = outputEditor.value;
  outputCharCount.textContent = `${text.length.toLocaleString()} characters`;
  outputFormat.textContent = format ? format.toUpperCase() : '';
}

/**
 * Show status message
 */
function showStatus(message, type = 'info') {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
  
  if (type === 'success') {
    setTimeout(() => {
      statusMessage.textContent = '';
      statusMessage.className = 'status-message';
    }, 3000);
  }
}

/**
 * Enable output actions
 */
function enableOutputActions() {
  copyOutputBtn.disabled = false;
  downloadOutputBtn.disabled = false;
  openPreviewBtn.disabled = false;
}

/**
 * Disable output actions
 */
function disableOutputActions() {
  copyOutputBtn.disabled = true;
  downloadOutputBtn.disabled = true;
  openPreviewBtn.disabled = true;
}

/**
 * Handle conversion
 */
async function handleConvert(direction) {
  const input = inputEditor.value.trim();
  
  if (!input) {
    showStatus('Please enter content to convert', 'error');
    return;
  }
  
  try {
    if (direction === 'html-to-md') {
      await convertHtmlToMarkdown(input);
    } else {
      await convertMarkdownToHtml(input);
    }
  } catch (error) {
    showStatus(`Conversion error: ${error.message}`, 'error');
    console.error('Conversion error:', error);
  }
}

/**
 * Convert HTML to Markdown
 */
async function convertHtmlToMarkdown(html) {
  // Load Turndown library
  if (!librariesLoaded.turndown) {
    await loadLibrary('turndown', TURNDOWN_LOCAL, TURNDOWN_SRI);
  }
  
  try {
    // Configure Turndown
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      hr: '---',
      bulletListMarker: '-',
      codeBlockStyle: 'fenced',
      fence: '```',
      emDelimiter: '*',
      strongDelimiter: '**'
    });
    
    // GitHub Flavored Markdown support
    if (gfmEnabled.checked) {
      // Add GFM rules
      turndownService.addRule('strikethrough', {
        filter: ['del', 's', 'strike'],
        replacement: content => `~~${content}~~`
      });
      
      turndownService.addRule('taskList', {
        filter: node => {
          return node.type === 'checkbox' || 
                 (node.nodeName === 'INPUT' && node.getAttribute('type') === 'checkbox');
        },
        replacement: (content, node) => {
          return node.checked ? '[x] ' : '[ ] ';
        }
      });
    }
    
    // Convert
    const markdown = turndownService.turndown(html);
    
    // Display output
    outputEditor.value = markdown;
    updateOutputStats('markdown');
    enableOutputActions();
    
    // Update view mode to code
    document.querySelector('input[name="view-mode"][value="code"]').checked = true;
    handleViewModeChange();
    
    showStatus('✓ Converted HTML to Markdown', 'success');
  } catch (error) {
    throw new Error(`HTML to Markdown conversion failed: ${error.message}`);
  }
}

/**
 * Convert Markdown to HTML
 */
async function convertMarkdownToHtml(markdown) {
  // Load Marked and DOMPurify libraries
  if (!librariesLoaded.marked) {
    await loadLibrary('marked', MARKED_LOCAL, MARKED_SRI);
  }
  if (!librariesLoaded.dompurify && sanitizeHtml.checked) {
    await loadLibrary('dompurify', DOMPURIFY_LOCAL, DOMPURIFY_SRI);
  }
  
  try {
    // Configure Marked
    marked.setOptions({
      gfm: gfmEnabled.checked,
      breaks: gfmEnabled.checked,
      pedantic: false,
      smartLists: true,
      smartypants: true
    });
    
    // Convert
    let html = marked.parse(markdown);
    
    // Sanitize HTML (CRITICAL for security)
    if (sanitizeHtml.checked && window.DOMPurify) {
      html = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'p', 'br', 'hr',
          'strong', 'em', 'u', 's', 'del',
          'a', 'img',
          'ul', 'ol', 'li',
          'blockquote', 'code', 'pre',
          'table', 'thead', 'tbody', 'tr', 'th', 'td',
          'div', 'span'
        ],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id']
      });
    }
    
    // Display output
    outputEditor.value = html;
    outputPreview.innerHTML = html;
    updateOutputStats('html');
    enableOutputActions();
    
    showStatus('✓ Converted Markdown to HTML', 'success');
  } catch (error) {
    throw new Error(`Markdown to HTML conversion failed: ${error.message}`);
  }
}

/**
 * Load external library with SRI support
 * @param {string} name - Library name
 * @param {string} url - Library URL (local or CDN)
 * @param {string} integrity - SRI hash (optional but recommended)
 */
function loadLibrary(name, url, integrity = null) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    
    // Add SRI hash if provided
    if (integrity) {
      script.integrity = integrity;
      script.crossOrigin = 'anonymous';
    }
    
    script.onload = () => {
      librariesLoaded[name] = true;
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load ${name} library from ${url}`));
    document.head.appendChild(script);
  });
}

/**
 * Handle swap input/output
 */
function handleSwap() {
  const temp = inputEditor.value;
  inputEditor.value = outputEditor.value;
  outputEditor.value = temp;
  
  updateInputStats();
  showStatus('Input and output swapped', 'info');
}

/**
 * Handle clear input
 */
function handleClearInput() {
  inputEditor.value = '';
  outputEditor.value = '';
  outputPreview.innerHTML = '';
  updateInputStats();
  updateOutputStats('');
  disableOutputActions();
  showStatus('Input cleared', 'info');
}

/**
 * Handle paste
 */
async function handlePaste() {
  try {
    const text = await navigator.clipboard.readText();
    inputEditor.value = text;
    updateInputStats();
    showStatus('Pasted from clipboard', 'success');
  } catch (error) {
    showStatus('Failed to paste: ' + error.message, 'error');
  }
}

/**
 * Handle load sample
 */
function handleLoadSample() {
  const htmlSample = `<h1>Welcome to HTML/Markdown Converter</h1>
<p>This is a <strong>sample HTML</strong> document with various elements:</p>
<ul>
  <li>Unordered lists</li>
  <li><em>Italic text</em></li>
  <li><code>Inline code</code></li>
</ul>
<h2>Code Block</h2>
<pre><code>function hello() {
  console.log("Hello, World!");
}</code></pre>
<h2>Links and Images</h2>
<p>Check out <a href="https://example.com">this link</a>.</p>`;

  const markdownSample = `# Welcome to HTML/Markdown Converter

This is a **sample Markdown** document with various elements:

- Unordered lists
- *Italic text*
- \`Inline code\`

## Code Block

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

## Links and Images

Check out [this link](https://example.com).

## GitHub Flavored Markdown

- [x] Task lists
- [ ] Unchecked item
- ~~Strikethrough text~~`;

  const sample = currentInputFormat === 'html' ? htmlSample : markdownSample;
  inputEditor.value = sample;
  updateInputStats();
  showStatus('Sample loaded', 'success');
}

/**
 * Handle copy output
 */
async function handleCopyOutput() {
  const output = outputEditor.value;
  if (!output) return;
  
  const success = await copyToClipboard(output);
  if (success) {
    showCopyNotification('Output copied to clipboard!');
    showStatus('✓ Copied to clipboard', 'success');
  } else {
    showStatus('Failed to copy', 'error');
  }
}

/**
 * Handle download output
 */
function handleDownloadOutput() {
  const output = outputEditor.value;
  if (!output) return;
  
  const format = outputFormat.textContent.toLowerCase();
  const extension = format === 'markdown' ? 'md' : 'html';
  const mimeType = format === 'markdown' ? 'text/markdown' : 'text/html';
  const filename = `converted-${Date.now()}.${extension}`;
  
  downloadFile(output, filename, mimeType);
  showStatus('✓ Downloaded', 'success');
}

/**
 * Handle open preview in new tab
 */
function handleOpenPreview() {
  const output = outputEditor.value;
  if (!output) return;
  
  const blob = new Blob([output], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  
  // Cleanup after a short delay
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Handle input format change
 */
function handleInputFormatChange(e) {
  currentInputFormat = e.target.value;
}

/**
 * Handle view mode change
 */
function handleViewModeChange() {
  const selectedMode = document.querySelector('input[name="view-mode"]:checked').value;
  currentViewMode = selectedMode;
  
  if (selectedMode === 'code') {
    outputEditor.classList.remove('hidden');
    outputPreview.classList.add('hidden');
  } else {
    outputEditor.classList.add('hidden');
    outputPreview.classList.remove('hidden');
  }
}

// Initialize on load
// Export initialization function for router
window.initHtmlMarkdown = init;

// Note: init() is called by router via window.initHtmlMarkdown
// Do NOT auto-initialize here as it would run before HTML is loaded
