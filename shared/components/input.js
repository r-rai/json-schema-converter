/**
 * Input Component
 * Factory function for creating form input elements with validation
 * 
 * @file shared/components/input.js
 */

/**
 * Create an input component with label and validation
 * @param {Object} options - Input configuration
 * @param {string} options.id - Input ID (unique)
 * @param {string} options.label - Label text
 * @param {string} [options.type='text'] - Input type (text, number, email, password, etc.)
 * @param {string} [options.placeholder=''] - Placeholder text
 * @param {string|number} [options.value=''] - Initial value
 * @param {boolean} [options.required=false] - Whether field is required
 * @param {boolean} [options.disabled=false] - Whether field is disabled
 * @param {string} [options.helpText=''] - Helper text shown below input
 * @param {string} [options.errorMessage=''] - Error message to display
 * @param {Function} [options.onInput] - Input event handler
 * @param {Function} [options.onChange] - Change event handler
 * @param {Function} [options.onBlur] - Blur event handler
 * @param {Function} [options.validator] - Custom validation function
 * @param {number} [options.min] - Minimum value (for number inputs)
 * @param {number} [options.max] - Maximum value (for number inputs)
 * @param {number} [options.step] - Step value (for number inputs)
 * @param {number} [options.maxLength] - Maximum character length
 * @returns {Object} Object containing container, input, and helper methods
 */
export function createInput(options) {
  const {
    id,
    label,
    type = 'text',
    placeholder = '',
    value = '',
    required = false,
    disabled = false,
    helpText = '',
    errorMessage = '',
    onInput,
    onChange,
    onBlur,
    validator,
    min,
    max,
    step,
    maxLength
  } = options;
  
  // Create container
  const container = document.createElement('div');
  container.className = 'input-group';
  
  // Create label
  const labelElement = document.createElement('label');
  labelElement.className = 'input-label';
  labelElement.htmlFor = id;
  labelElement.textContent = label;
  
  if (required) {
    const requiredSpan = document.createElement('span');
    requiredSpan.className = 'input-required';
    requiredSpan.textContent = ' *';
    requiredSpan.setAttribute('aria-label', 'required');
    labelElement.appendChild(requiredSpan);
  }
  
  // Create input
  const input = document.createElement('input');
  input.type = type;
  input.id = id;
  input.className = 'input';
  input.placeholder = placeholder;
  input.value = value;
  input.disabled = disabled;
  
  if (required) input.required = true;
  if (min !== undefined) input.min = min;
  if (max !== undefined) input.max = max;
  if (step !== undefined) input.step = step;
  if (maxLength) input.maxLength = maxLength;
  
  // ARIA attributes
  input.setAttribute('aria-label', label);
  if (required) {
    input.setAttribute('aria-required', 'true');
  }
  
  // Create help text element
  const helpElement = document.createElement('span');
  helpElement.className = 'input-help';
  helpElement.textContent = helpText;
  helpElement.id = `${id}-help`;
  if (helpText) {
    input.setAttribute('aria-describedby', `${id}-help`);
  }
  
  // Create error message element
  const errorElement = document.createElement('span');
  errorElement.className = 'input-error-message';
  errorElement.id = `${id}-error`;
  errorElement.textContent = errorMessage;
  errorElement.style.display = errorMessage ? 'block' : 'none';
  errorElement.setAttribute('role', 'alert');
  errorElement.setAttribute('aria-live', 'polite');
  
  // Assemble container
  container.appendChild(labelElement);
  container.appendChild(input);
  if (helpText) container.appendChild(helpElement);
  container.appendChild(errorElement);
  
  // Event listeners
  if (onInput) input.addEventListener('input', onInput);
  if (onChange) input.addEventListener('change', onChange);
  if (onBlur) input.addEventListener('blur', onBlur);
  
  // Validation on blur if validator provided
  if (validator) {
    input.addEventListener('blur', () => {
      const validationResult = validator(input.value);
      if (validationResult === true) {
        clearError();
      } else {
        showError(validationResult);
      }
    });
  }
  
  // Helper methods
  function getValue() {
    return type === 'number' ? parseFloat(input.value) : input.value;
  }
  
  function setValue(newValue) {
    input.value = newValue;
  }
  
  function showError(message) {
    input.classList.add('input-error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', `${id}-error ${id}-help`);
  }
  
  function clearError() {
    input.classList.remove('input-error');
    errorElement.style.display = 'none';
    input.removeAttribute('aria-invalid');
    input.setAttribute('aria-describedby', `${id}-help`);
  }
  
  function setDisabled(isDisabled) {
    input.disabled = isDisabled;
  }
  
  function validate() {
    if (validator) {
      const result = validator(input.value);
      if (result === true) {
        clearError();
        return true;
      } else {
        showError(result);
        return false;
      }
    }
    return true;
  }
  
  function focus() {
    input.focus();
  }
  
  return {
    container,
    input,
    getValue,
    setValue,
    showError,
    clearError,
    setDisabled,
    validate,
    focus
  };
}

/**
 * Create textarea component
 * @param {Object} options - Textarea configuration (similar to input)
 * @returns {Object} Object containing container, textarea, and helper methods
 */
export function createTextarea(options) {
  const {
    id,
    label,
    placeholder = '',
    value = '',
    required = false,
    disabled = false,
    rows = 5,
    helpText = '',
    errorMessage = '',
    onInput,
    onChange,
    onBlur,
    validator,
    maxLength
  } = options;
  
  // Create container
  const container = document.createElement('div');
  container.className = 'input-group';
  
  // Create label
  const labelElement = document.createElement('label');
  labelElement.className = 'input-label';
  labelElement.htmlFor = id;
  labelElement.textContent = label;
  
  if (required) {
    const requiredSpan = document.createElement('span');
    requiredSpan.className = 'input-required';
    requiredSpan.textContent = ' *';
    labelElement.appendChild(requiredSpan);
  }
  
  // Create textarea
  const textarea = document.createElement('textarea');
  textarea.id = id;
  textarea.className = 'input textarea';
  textarea.placeholder = placeholder;
  textarea.value = value;
  textarea.disabled = disabled;
  textarea.rows = rows;
  
  if (required) textarea.required = true;
  if (maxLength) textarea.maxLength = maxLength;
  
  textarea.setAttribute('aria-label', label);
  if (required) {
    textarea.setAttribute('aria-required', 'true');
  }
  
  // Create help text
  const helpElement = document.createElement('span');
  helpElement.className = 'input-help';
  helpElement.textContent = helpText;
  helpElement.id = `${id}-help`;
  if (helpText) {
    textarea.setAttribute('aria-describedby', `${id}-help`);
  }
  
  // Create error message
  const errorElement = document.createElement('span');
  errorElement.className = 'input-error-message';
  errorElement.id = `${id}-error`;
  errorElement.textContent = errorMessage;
  errorElement.style.display = errorMessage ? 'block' : 'none';
  errorElement.setAttribute('role', 'alert');
  
  // Assemble
  container.appendChild(labelElement);
  container.appendChild(textarea);
  if (helpText) container.appendChild(helpElement);
  container.appendChild(errorElement);
  
  // Event listeners
  if (onInput) textarea.addEventListener('input', onInput);
  if (onChange) textarea.addEventListener('change', onChange);
  if (onBlur) textarea.addEventListener('blur', onBlur);
  
  // Validation
  if (validator) {
    textarea.addEventListener('blur', () => {
      const validationResult = validator(textarea.value);
      if (validationResult === true) {
        clearError();
      } else {
        showError(validationResult);
      }
    });
  }
  
  // Helper methods
  function getValue() {
    return textarea.value;
  }
  
  function setValue(newValue) {
    textarea.value = newValue;
  }
  
  function showError(message) {
    textarea.classList.add('input-error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    textarea.setAttribute('aria-invalid', 'true');
  }
  
  function clearError() {
    textarea.classList.remove('input-error');
    errorElement.style.display = 'none';
    textarea.removeAttribute('aria-invalid');
  }
  
  function setDisabled(isDisabled) {
    textarea.disabled = isDisabled;
  }
  
  function validate() {
    if (validator) {
      const result = validator(textarea.value);
      if (result === true) {
        clearError();
        return true;
      } else {
        showError(result);
        return false;
      }
    }
    return true;
  }
  
  function focus() {
    textarea.focus();
  }
  
  return {
    container,
    textarea,
    getValue,
    setValue,
    showError,
    clearError,
    setDisabled,
    validate,
    focus
  };
}

/**
 * Common validator functions
 */
export const validators = {
  required: (value) => {
    return value && value.trim().length > 0 ? true : 'This field is required';
  },
  
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? true : 'Please enter a valid email address';
  },
  
  number: (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value) 
      ? true 
      : 'Please enter a valid number';
  },
  
  positiveNumber: (value) => {
    const num = parseFloat(value);
    return !isNaN(num) && isFinite(num) && num > 0 
      ? true 
      : 'Please enter a positive number';
  },
  
  minLength: (min) => (value) => {
    return value.length >= min 
      ? true 
      : `Must be at least ${min} characters`;
  },
  
  maxLength: (max) => (value) => {
    return value.length <= max 
      ? true 
      : `Must be no more than ${max} characters`;
  },
  
  range: (min, max) => (value) => {
    const num = parseFloat(value);
    return num >= min && num <= max 
      ? true 
      : `Must be between ${min} and ${max}`;
  }
};
