/**
 * JSON Schema Validator & Converter Tool
 * Features: Validate, Minify, Beautify JSON with customizable indentation
 */

import { storage } from '../../shared/js/storage.js';
import { validateJSON, debounce } from '../../shared/js/utils.js';
import { copyToClipboard, showCopyNotification } from '../../shared/js/clipboard.js';
import { downloadFile } from '../../shared/js/download.js';

// DOM Elements
const jsonInput = document.getElementById('json-input');
const jsonOutput = document.getElementById('json-output');
const validateBtn = document.getElementById('validate-btn');
const generateSchemaBtn = document.getElementById('generate-schema-btn');
const minifyBtn = document.getElementById('minify-btn');
const beautifyBtn = document.getElementById('beautify-btn');
const indentSelect = document.getElementById('indent-select');
const clearInputBtn = document.getElementById('clear-input-btn');
const pasteBtn = document.getElementById('paste-btn');
const copyOutputBtn = document.getElementById('copy-output-btn');
const downloadBtn = document.getElementById('download-btn');
const statusMessage = document.getElementById('status-message');
const inputCharCount = document.getElementById('input-char-count');
const inputLineCount = document.getElementById('input-line-count');
const outputCharCount = document.getElementById('output-char-count');
const outputReduction = document.getElementById('output-reduction');

// State
let currentJSON = null;
let lastOperation = null;

/**
 * Initialize the tool
 */
function init() {
  // Load saved indentation preference
  const savedIndent = storage.get('jsonIndentPreference', '2');
  indentSelect.value = savedIndent;
  
  // Load saved JSON if exists
  const savedJSON = storage.get('lastJSON');
  if (savedJSON) {
    jsonInput.value = savedJSON;
    updateInputStats();
  }
  
  // Event listeners
  jsonInput.addEventListener('input', debounce(handleInputChange, 300));
  validateBtn.addEventListener('click', handleValidate);
  generateSchemaBtn.addEventListener('click', handleGenerateSchema);
  minifyBtn.addEventListener('click', handleMinify);
  beautifyBtn.addEventListener('click', handleBeautify);
  indentSelect.addEventListener('change', handleIndentChange);
  clearInputBtn.addEventListener('click', handleClearInput);
  pasteBtn.addEventListener('click', handlePaste);
  copyOutputBtn.addEventListener('click', handleCopyOutput);
  downloadBtn.addEventListener('click', handleDownload);
  
  // Development-only logging
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('JSON Schema Tool initialized');
  }
}

// Export initialization function for router
window.initJsonSchema = init;

/**
 * Handle input change
 */
function handleInputChange() {
  updateInputStats();
  
  // Auto-save to localStorage
  storage.set('lastJSON', jsonInput.value);
  
  // Clear output when input changes
  if (lastOperation) {
    jsonOutput.value = '';
    updateOutputStats();
    disableOutputActions();
  }
}

/**
 * Update input statistics
 */
function updateInputStats() {
  const text = jsonInput.value;
  const charCount = text.length;
  const lineCount = text ? text.split('\n').length : 0;
  
  inputCharCount.textContent = `${charCount.toLocaleString()} characters`;
  inputLineCount.textContent = `${lineCount.toLocaleString()} lines`;
}

/**
 * Update output statistics
 */
function updateOutputStats(reductionBytes = null) {
  const text = jsonOutput.value;
  const charCount = text.length;
  
  outputCharCount.textContent = `${charCount.toLocaleString()} characters`;
  
  if (reductionBytes !== null) {
    const sign = reductionBytes >= 0 ? '-' : '+';
    const percent = ((Math.abs(reductionBytes) / jsonInput.value.length) * 100).toFixed(1);
    outputReduction.textContent = `${sign}${Math.abs(reductionBytes).toLocaleString()} bytes (${percent}%)`;
    outputReduction.className = reductionBytes >= 0 ? 'reduction positive' : 'reduction negative';
  } else {
    outputReduction.textContent = '';
  }
}

/**
 * Show status message
 */
function showStatus(message, type = 'info') {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
  statusMessage.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
  
  // Auto-hide success messages after 3 seconds
  if (type === 'success') {
    setTimeout(() => {
      statusMessage.textContent = '';
      statusMessage.className = 'status-message';
    }, 3000);
  }
}

/**
 * Enable output action buttons
 */
function enableOutputActions() {
  copyOutputBtn.disabled = false;
  downloadBtn.disabled = false;
}

/**
 * Disable output action buttons
 */
function disableOutputActions() {
  copyOutputBtn.disabled = true;
  downloadBtn.disabled = true;
}

/**
 * Handle validate JSON
 */
function handleValidate() {
  const input = jsonInput.value.trim();
  
  if (!input) {
    showStatus('Please enter JSON to validate', 'error');
    return;
  }
  
  const validation = validateJSON(input);
  
  if (validation.valid) {
    try {
      const parsed = JSON.parse(input);
      currentJSON = parsed;
      lastOperation = 'validate';
      
      // Beautify with current indentation setting
      const indent = getIndentValue();
      const formatted = JSON.stringify(parsed, null, indent);
      jsonOutput.value = formatted;
      
      updateOutputStats();
      enableOutputActions();
      
      showStatus('✓ Valid JSON!', 'success');
    } catch (error) {
      showStatus(`Validation error: ${error.message}`, 'error');
    }
  } else {
    showStatus(`Invalid JSON: ${validation.error}`, 'error');
    jsonOutput.value = '';
    updateOutputStats();
    disableOutputActions();
  }
}

/**
 * Handle generate JSON Schema from JSON
 */
function handleGenerateSchema() {
  const input = jsonInput.value.trim();
  
  if (!input) {
    showStatus('Please enter JSON to generate schema', 'error');
    return;
  }
  
  const validation = validateJSON(input);
  
  if (!validation.valid) {
    showStatus(`Cannot generate schema from invalid JSON: ${validation.error}`, 'error');
    return;
  }
  
  try {
    const parsed = JSON.parse(input);
    const schema = generateJSONSchema(parsed);
    
    currentJSON = schema;
    lastOperation = 'generate-schema';
    
    const indent = getIndentValue();
    jsonOutput.value = JSON.stringify(schema, null, indent);
    
    updateOutputStats();
    enableOutputActions();
    
    showStatus('✓ JSON Schema generated successfully!', 'success');
  } catch (error) {
    showStatus(`Schema generation error: ${error.message}`, 'error');
  }
}

/**
 * Generate JSON Schema from a JSON object
 * @param {*} data - The JSON data to analyze
 * @param {string} title - Optional title for the schema
 * @returns {Object} JSON Schema object
 */
function generateJSONSchema(data, title = 'Generated Schema') {
  const schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: title,
    type: getType(data)
  };
  
  if (Array.isArray(data)) {
    // Array type
    if (data.length > 0) {
      // Analyze all items to find common schema
      const itemSchemas = data.map(item => generateJSONSchema(item, 'Item'));
      // Use first item's schema as template (could be enhanced to merge all)
      schema.items = itemSchemas[0];
      delete schema.items.title; // Remove title from items
    } else {
      schema.items = {};
    }
  } else if (typeof data === 'object' && data !== null) {
    // Object type
    schema.properties = {};
    schema.required = [];
    
    for (const [key, value] of Object.entries(data)) {
      schema.properties[key] = generateJSONSchema(value, key);
      delete schema.properties[key].title; // Remove title from properties
      // Mark all existing properties as required
      schema.required.push(key);
    }
    
    if (schema.required.length === 0) {
      delete schema.required;
    }
  } else if (typeof data === 'string') {
    // String type - add format hints
    if (isEmail(data)) {
      schema.format = 'email';
    } else if (isURL(data)) {
      schema.format = 'uri';
    } else if (isDate(data)) {
      schema.format = 'date-time';
    }
    schema.examples = [data];
  } else if (typeof data === 'number') {
    // Number type
    schema.examples = [data];
  } else if (typeof data === 'boolean') {
    // Boolean type
    schema.examples = [data];
  }
  
  return schema;
}

/**
 * Get JSON Schema type for a value
 * @param {*} value - Value to get type for
 * @returns {string} JSON Schema type
 */
function getType(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';
  if (typeof value === 'number') {
    return Number.isInteger(value) ? 'integer' : 'number';
  }
  return typeof value; // string, boolean
}

/**
 * Check if string is an email
 * @param {string} str - String to check
 * @returns {boolean}
 */
function isEmail(str) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(str);
}

/**
 * Check if string is a URL
 * @param {string} str - String to check
 * @returns {boolean}
 */
function isURL(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if string is a date
 * @param {string} str - String to check
 * @returns {boolean}
 */
function isDate(str) {
  const date = new Date(str);
  return date instanceof Date && !isNaN(date) && str.match(/\d{4}-\d{2}-\d{2}/);
}

/**
 * Handle minify JSON
 */
function handleMinify() {
  const input = jsonInput.value.trim();
  
  if (!input) {
    showStatus('Please enter JSON to minify', 'error');
    return;
  }
  
  const validation = validateJSON(input);
  
  if (!validation.valid) {
    showStatus(`Cannot minify invalid JSON: ${validation.error}`, 'error');
    return;
  }
  
  try {
    const parsed = JSON.parse(input);
    const minified = JSON.stringify(parsed);
    
    currentJSON = parsed;
    lastOperation = 'minify';
    jsonOutput.value = minified;
    
    const reduction = input.length - minified.length;
    updateOutputStats(reduction);
    enableOutputActions();
    
    showStatus(`✓ Minified successfully! Reduced by ${reduction.toLocaleString()} bytes`, 'success');
  } catch (error) {
    showStatus(`Minification error: ${error.message}`, 'error');
  }
}

/**
 * Handle beautify JSON
 */
function handleBeautify() {
  const input = jsonInput.value.trim();
  
  if (!input) {
    showStatus('Please enter JSON to beautify', 'error');
    return;
  }
  
  const validation = validateJSON(input);
  
  if (!validation.valid) {
    showStatus(`Cannot beautify invalid JSON: ${validation.error}`, 'error');
    return;
  }
  
  try {
    const parsed = JSON.parse(input);
    const indent = getIndentValue();
    const beautified = JSON.stringify(parsed, null, indent);
    
    currentJSON = parsed;
    lastOperation = 'beautify';
    jsonOutput.value = beautified;
    
    const increase = beautified.length - input.length;
    updateOutputStats(-increase); // Negative reduction (size increased)
    enableOutputActions();
    
    showStatus(`✓ Beautified successfully with ${indentSelect.options[indentSelect.selectedIndex].text}`, 'success');
  } catch (error) {
    showStatus(`Beautification error: ${error.message}`, 'error');
  }
}

/**
 * Get indentation value from select
 */
function getIndentValue() {
  const value = indentSelect.value;
  return value === '\t' ? '\t' : parseInt(value, 10);
}

/**
 * Handle indentation change
 */
function handleIndentChange() {
  // Save preference
  storage.set('jsonIndentPreference', indentSelect.value);
  
  // Re-beautify if last operation was beautify or validate
  if ((lastOperation === 'beautify' || lastOperation === 'validate') && currentJSON) {
    const indent = getIndentValue();
    const beautified = JSON.stringify(currentJSON, null, indent);
    jsonOutput.value = beautified;
    updateOutputStats();
    showStatus(`Indentation changed to ${indentSelect.options[indentSelect.selectedIndex].text}`, 'info');
  }
}

/**
 * Handle clear input
 */
function handleClearInput() {
  jsonInput.value = '';
  jsonOutput.value = '';
  currentJSON = null;
  lastOperation = null;
  
  updateInputStats();
  updateOutputStats();
  disableOutputActions();
  
  storage.remove('lastJSON');
  showStatus('Input cleared', 'info');
}

/**
 * Handle paste from clipboard
 */
async function handlePaste() {
  try {
    const text = await navigator.clipboard.readText();
    jsonInput.value = text;
    handleInputChange();
    showStatus('Pasted from clipboard', 'success');
    
    // Auto-validate after paste
    setTimeout(() => handleValidate(), 100);
  } catch (error) {
    showStatus('Failed to paste: ' + error.message, 'error');
  }
}

/**
 * Handle copy output
 */
async function handleCopyOutput() {
  const output = jsonOutput.value;
  
  if (!output) {
    showStatus('No output to copy', 'error');
    return;
  }
  
  const success = await copyToClipboard(output);
  
  if (success) {
    showCopyNotification('Output copied to clipboard!');
    showStatus('✓ Copied to clipboard', 'success');
  } else {
    showStatus('Failed to copy to clipboard', 'error');
  }
}

/**
 * Handle download
 */
function handleDownload() {
  const output = jsonOutput.value;
  
  if (!output) {
    showStatus('No output to download', 'error');
    return;
  }
  
  const filename = `json-${lastOperation}-${Date.now()}.json`;
  downloadFile(output, filename, 'application/json');
  showStatus('✓ Downloaded successfully', 'success');
}

// Note: init() is called by router via window.initJsonSchema
// Do NOT auto-initialize here as it would run before HTML is loaded
