/**
 * JSON Schema Validator & Converter Tool
 * Features: Dynamic layout, Multiple validation modes, Generate schema, Minify, Beautify
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
const clearOutputBtn = document.getElementById('clear-output-btn');
const statusMessage = document.getElementById('status-message');
const inputCharCount = document.getElementById('input-char-count');
const inputLineCount = document.getElementById('input-line-count');
const outputCharCount = document.getElementById('output-char-count');
const outputReduction = document.getElementById('output-reduction');
const outputLabel = document.getElementById('output-label');

// Dynamic Layout Elements
const container = document.getElementById('json-tool-container');
const inputSection = document.getElementById('input-section');
const outputSection = document.getElementById('output-section');
const validationSchemaSection = document.getElementById('validation-schema-section');
const validationSchemaInput = document.getElementById('validation-schema-input');
const validationOptions = document.getElementById('validation-options');
const validateGeneratedBtn = document.getElementById('validate-generated-btn');
const validateCustomStartBtn = document.getElementById('validate-custom-start-btn');
const validateCustomBtn = document.getElementById('validate-custom-btn');
const cancelCustomValidationBtn = document.getElementById('cancel-custom-validation-btn');

// State Management
const state = {
  hasGeneratedSchema: false,
  layoutMode: 'single', // 'single' or 'split'
  currentJSON: null,
  lastOperation: null,
  generatedSchema: null
};

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
  
  // Event listeners - Actions
  jsonInput.addEventListener('input', debounce(handleInputChange, 300));
  generateSchemaBtn.addEventListener('click', handleGenerateSchema);
  validateBtn.addEventListener('click', handleValidateClick);
  minifyBtn.addEventListener('click', handleMinify);
  beautifyBtn.addEventListener('click', handleBeautify);
  indentSelect.addEventListener('change', handleIndentChange);
  clearInputBtn.addEventListener('click', handleClearInput);
  pasteBtn.addEventListener('click', handlePaste);
  copyOutputBtn.addEventListener('click', handleCopyOutput);
  downloadBtn.addEventListener('click', handleDownload);
  clearOutputBtn.addEventListener('click', handleClearOutput);
  
  // Event listeners - Validation options
  validateGeneratedBtn.addEventListener('click', handleValidateGenerated);
  validateCustomStartBtn.addEventListener('click', showCustomValidationInput);
  validateCustomBtn.addEventListener('click', handleValidateCustom);
  cancelCustomValidationBtn.addEventListener('click', hideCustomValidationInput);
  
  // Initialize help modal
  initHelpModal();
  
  // Development-only logging
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('JSON Schema Tool initialized with dynamic layout');
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
  
  // Clear output when input changes significantly
  if (state.lastOperation) {
    // Optional: could keep output visible for reference
  }
}

/**
 * Layout Management Functions
 */

/**
 * Show split layout (input on left, output on right)
 */
function showSplitLayout() {
  state.layoutMode = 'split';
  
  // Add grid layout
  container.classList.remove('space-y-6');
  container.classList.add('grid', 'grid-cols-1', 'lg:grid-cols-2', 'gap-6');
  
  // Show output section
  outputSection.classList.remove('hidden');
  outputSection.classList.add('flex');
}

/**
 * Show single layout (input only, full width)
 */
function showSingleLayout() {
  state.layoutMode = 'single';
  
  // Remove grid layout
  container.classList.remove('grid', 'grid-cols-1', 'lg:grid-cols-2', 'gap-6');
  container.classList.add('space-y-6');
  
  // Hide output and validation sections
  outputSection.classList.remove('flex');
  outputSection.classList.add('hidden');
  validationSchemaSection.classList.remove('flex');
  validationSchemaSection.classList.add('hidden');
  validationOptions.classList.add('hidden');
}

/**
 * Show custom validation input
 */
function showCustomValidationInput() {
  validationSchemaSection.classList.remove('hidden');
  validationSchemaSection.classList.add('flex');
  validationOptions.classList.add('hidden');
  
  // Focus on the validation schema input
  validationSchemaInput.focus();
}

/**
 * Hide custom validation input
 */
function hideCustomValidationInput() {
  validationSchemaSection.classList.remove('flex');
  validationSchemaSection.classList.add('hidden');
  validationSchemaInput.value = '';
  
  // Show validation options again if schema exists
  if (state.hasGeneratedSchema) {
    validationOptions.classList.remove('hidden');
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
  // Create status element HTML based on type
  let iconHtml = '';
  let bgClass = '';
  let textClass = '';
  let borderClass = '';
  
  switch(type) {
    case 'success':
      iconHtml = '<span class="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>';
      bgClass = 'bg-green-50 dark:bg-green-900/20';
      textClass = 'text-green-800 dark:text-green-200';
      borderClass = 'border-green-300 dark:border-green-700';
      break;
    case 'error':
      iconHtml = '<span class="material-symbols-outlined text-red-600 dark:text-red-400">error</span>';
      bgClass = 'bg-red-50 dark:bg-red-900/20';
      textClass = 'text-red-800 dark:text-red-200';
      borderClass = 'border-red-300 dark:border-red-700';
      break;
    case 'info':
    default:
      iconHtml = '<span class="material-symbols-outlined text-blue-600 dark:text-blue-400">info</span>';
      bgClass = 'bg-blue-50 dark:bg-blue-900/20';
      textClass = 'text-blue-800 dark:text-blue-200';
      borderClass = 'border-blue-300 dark:border-blue-700';
      break;
  }
  
  statusMessage.innerHTML = `
    <div class="flex items-center gap-3 p-4 rounded-lg border ${bgClass} ${borderClass} ${textClass}">
      ${iconHtml}
      <p class="text-sm">${message}</p>
    </div>
  `;
  statusMessage.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
  
  // Auto-hide success and info messages after 5 seconds
  if (type === 'success' || type === 'info') {
    setTimeout(() => {
      statusMessage.innerHTML = '';
    }, 5000);
  }
}

/**
 * Enable output action buttons
 */
function enableOutputActions() {
  copyOutputBtn.disabled = false;
  downloadBtn.disabled = false;
  clearOutputBtn.disabled = false;
}

/**
 * Disable output action buttons
 */
function disableOutputActions() {
  copyOutputBtn.disabled = true;
  downloadBtn.disabled = true;
  clearOutputBtn.disabled = true;
}

/**
 * Clear output and reset to single layout
 */
function handleClearOutput() {
  jsonOutput.value = '';
  state.hasGeneratedSchema = false;
  state.generatedSchema = null;
  state.lastOperation = null;
  state.currentJSON = null;
  
  updateOutputStats();
  disableOutputActions();
  showSingleLayout();
  
  showStatus('Output cleared', 'info');
}

/**
 * Handle validate button click - Show options or start validation
 */
function handleValidateClick() {
  const input = jsonInput.value.trim();
  
  if (!input) {
    showStatus('Please enter JSON to validate', 'error');
    return;
  }
  
  // First check if JSON is valid syntax
  const validation = validateJSON(input);
  if (!validation.valid) {
    showStatus(`Invalid JSON syntax: ${validation.error}`, 'error');
    return;
  }
  
  // If generated schema exists, show validation options
  if (state.hasGeneratedSchema) {
    validationOptions.classList.remove('hidden');
    showStatus('Choose validation method below', 'info');
  } else {
    // No generated schema, prompt for custom schema
    showCustomValidationInput();
    showStatus('Paste a JSON schema to validate against', 'info');
  }
}

/**
 * Validate against generated schema
 */
function handleValidateGenerated() {
  const input = jsonInput.value.trim();
  
  if (!input || !state.generatedSchema) {
    showStatus('Missing JSON input or generated schema', 'error');
    return;
  }
  
  try {
    const jsonObj = JSON.parse(input);
    const isValid = validateAgainstSchema(jsonObj, state.generatedSchema);
    
    validationOptions.classList.add('hidden');
    
    if (isValid.valid) {
      showStatus('✓ JSON is valid against the generated schema!', 'success');
    } else {
      showStatus(`✗ JSON validation failed: ${isValid.errors.join(', ')}`, 'error');
    }
  } catch (err) {
    showStatus(`Validation error: ${err.message}`, 'error');
  }
}

/**
 * Validate against custom schema
 */
function handleValidateCustom() {
  const input = jsonInput.value.trim();
  const customSchema = validationSchemaInput.value.trim();
  
  if (!input) {
    showStatus('Please enter JSON to validate', 'error');
    return;
  }
  
  if (!customSchema) {
    showStatus('Please enter a JSON schema', 'error');
    return;
  }
  
  try {
    const jsonObj = JSON.parse(input);
    const schemaObj = JSON.parse(customSchema);
    
    const isValid = validateAgainstSchema(jsonObj, schemaObj);
    
    if (isValid.valid) {
      showStatus('✓ JSON is valid against the custom schema!', 'success');
      hideCustomValidationInput();
    } else {
      showStatus(`✗ JSON validation failed: ${isValid.errors.join(', ')}`, 'error');
    }
  } catch (err) {
    showStatus(`Validation error: ${err.message}`, 'error');
  }
}

/**
 * Validate JSON against a schema
 * Basic implementation - can be enhanced with ajv library
 */
function validateAgainstSchema(json, schema) {
  const errors = [];
  
  // Basic type checking
  if (schema.type) {
    const actualType = getType(json);
    if (actualType !== schema.type) {
      errors.push(`Expected type "${schema.type}" but got "${actualType}"`);
      return { valid: false, errors };
    }
  }
  
  // Object validation
  if (schema.type === 'object' && schema.properties) {
    for (const [key, propSchema] of Object.entries(schema.properties)) {
      if (!(key in json)) {
        if (schema.required && schema.required.includes(key)) {
          errors.push(`Missing required property: ${key}`);
        }
      } else {
        const propResult = validateAgainstSchema(json[key], propSchema);
        if (!propResult.valid) {
          errors.push(`Property "${key}": ${propResult.errors.join(', ')}`);
        }
      }
    }
  }
  
  // Array validation
  if (schema.type === 'array' && schema.items) {
    for (let i = 0; i < json.length; i++) {
      const itemResult = validateAgainstSchema(json[i], schema.items);
      if (!itemResult.valid) {
        errors.push(`Item ${i}: ${itemResult.errors.join(', ')}`);
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
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
    
    state.currentJSON = schema;
    state.generatedSchema = schema;
    state.hasGeneratedSchema = true;
    state.lastOperation = 'generate-schema';
    
    const indent = getIndentValue();
    jsonOutput.value = JSON.stringify(schema, null, indent);
    outputLabel.textContent = 'Generated Schema';
    
    // Show split layout
    showSplitLayout();
    
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
    
    state.currentJSON = parsed;
    state.lastOperation = 'minify';
    jsonOutput.value = minified;
    outputLabel.textContent = 'Minified JSON';
    
    // Show split layout
    showSplitLayout();
    
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
    
    state.currentJSON = parsed;
    state.lastOperation = 'beautify';
    jsonOutput.value = beautified;
    outputLabel.textContent = 'Beautified JSON';
    
    // Show split layout
    showSplitLayout();
    
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
  
  // Re-beautify if last operation was beautify, validate, or generate-schema
  if ((state.lastOperation === 'beautify' || state.lastOperation === 'validate' || state.lastOperation === 'generate-schema') && state.currentJSON) {
    const indent = getIndentValue();
    const beautified = JSON.stringify(state.currentJSON, null, indent);
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
  state.currentJSON = null;
  state.lastOperation = null;
  state.hasGeneratedSchema = false;
  state.generatedSchema = null;
  
  updateInputStats();
  updateOutputStats();
  disableOutputActions();
  showSingleLayout();
  
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

/**
 * Initialize Help Modal
 */
function initHelpModal() {
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const helpClose = document.getElementById('help-close');
  const helpOk = document.getElementById('help-ok');
  
  if (!helpBtn || !helpModal) return;
  
  // Open modal
  helpBtn.addEventListener('click', () => {
    helpModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
    // Focus trap (accessibility)
    helpClose.focus();
  });
  
  // Close modal functions
  const closeModal = () => {
    helpModal.classList.add('hidden');
    document.body.style.overflow = ''; // Restore scroll
    helpBtn.focus(); // Return focus to trigger button
  };
  
  // Close button
  helpClose.addEventListener('click', closeModal);
  helpOk.addEventListener('click', closeModal);
  
  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !helpModal.classList.contains('hidden')) {
      closeModal();
    }
  });
  
  // Click outside
  helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) {
      closeModal();
    }
  });
}

// Auto-initialize if loaded directly (not via router)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('json-schema')) {
      init();
    }
  });
} else {
  if (window.location.pathname.includes('json-schema')) {
    init();
  }
}
