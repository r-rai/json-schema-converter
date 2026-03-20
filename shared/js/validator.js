/**
 * Input Validation Framework
 * Provides comprehensive validation for user inputs with consistent error handling
 * Sprint 3: Security Hardening - Input Validation
 */

/**
 * Validator class with static validation methods
 * All methods return { valid: boolean, error?: string }
 */
export class Validator {
  
  // ============================================================
  // NUMERIC VALIDATORS
  // ============================================================
  
  /**
   * Validate positive number within range
   * @param {string|number} value - Value to validate
   * @param {number} min - Minimum value (exclusive)
   * @param {number} max - Maximum value (inclusive)
   * @returns {{ valid: boolean, error?: string }}
   * 
   * @example
   * Validator.isPositiveNumber(5000, 500, 10000000)
   * // Returns: { valid: true }
   * 
   * Validator.isPositiveNumber(-100, 0, 1000)
   * // Returns: { valid: false, error: "Must be greater than 0" }
   */
  static isPositiveNumber(value, min = 0, max = Infinity) {
    // Handle empty or null
    if (value === '' || value === null || value === undefined) {
      return { valid: false, error: 'This field is required' };
    }
    
    const num = parseFloat(value);
    
    // Check if valid number
    if (isNaN(num)) {
      return { valid: false, error: 'Must be a valid number' };
    }
    
    // Check if finite
    if (!isFinite(num)) {
      return { valid: false, error: 'Must be a finite number' };
    }
    
    // Check minimum (exclusive)
    if (num <= min) {
      return { 
        valid: false, 
        error: `Must be greater than ${this.formatNumber(min)}` 
      };
    }
    
    // Check maximum (inclusive)
    if (num > max) {
      return { 
        valid: false, 
        error: `Must be less than or equal to ${this.formatNumber(max)}` 
      };
    }
    
    return { valid: true };
  }
  
  /**
   * Validate percentage (0-100)
   * @param {string|number} value - Value to validate
   * @returns {{ valid: boolean, error?: string }}
   * 
   * @example
   * Validator.isPercentage(50) // { valid: true }
   * Validator.isPercentage(101) // { valid: false, error: "..." }
   */
  static isPercentage(value) {
    const result = this.isPositiveNumber(value, 0, 100);
    if (!result.valid) {
      return { 
        valid: false, 
        error: 'Must be a percentage between 0 and 100' 
      };
    }
    return { valid: true };
  }
  
  /**
   * Validate integer within range
   * @param {string|number} value - Value to validate
   * @param {number} min - Minimum value (inclusive)
   * @param {number} max - Maximum value (inclusive)
   * @returns {{ valid: boolean, error?: string }}
   * 
   * @example
   * Validator.isInteger(10, 1, 50) // { valid: true }
   * Validator.isInteger(10.5, 1, 50) // { valid: false }
   */
  static isInteger(value, min = 0, max = Infinity) {
    // First check if it's a valid number
    const numResult = this.isPositiveNumber(value, min - 1, max);
    if (!numResult.valid) {
      return numResult;
    }
    
    const num = parseFloat(value);
    
    // Check if integer
    if (!Number.isInteger(num)) {
      return { valid: false, error: 'Must be a whole number (no decimals)' };
    }
    
    // Check range (inclusive for integers)
    if (num < min || num > max) {
      return { 
        valid: false, 
        error: `Must be between ${min} and ${max}` 
      };
    }
    
    return { valid: true };
  }
  
  // ============================================================
  // STRING VALIDATORS
  // ============================================================
  
  /**
   * Validate non-empty string
   * @param {string} value - Value to validate
   * @returns {{ valid: boolean, error?: string }}
   * 
   * @example
   * Validator.isNotEmpty('hello') // { valid: true }
   * Validator.isNotEmpty('   ') // { valid: false }
   */
  static isNotEmpty(value) {
    if (value === null || value === undefined) {
      return { valid: false, error: 'This field is required' };
    }
    
    if (typeof value !== 'string') {
      value = String(value);
    }
    
    if (value.trim() === '') {
      return { valid: false, error: 'This field is required' };
    }
    
    return { valid: true };
  }
  
  /**
   * Validate string length
   * @param {string} value - Value to validate
   * @param {number} max - Maximum length
   * @returns {{ valid: boolean, error?: string }}
   * 
   * @example
   * Validator.maxLength('hello', 10) // { valid: true }
   * Validator.maxLength('very long string', 5) // { valid: false }
   */
  static maxLength(value, max) {
    if (value === null || value === undefined) {
      return { valid: true }; // Empty is valid for length check
    }
    
    const str = String(value);
    
    if (str.length > max) {
      return { 
        valid: false, 
        error: `Maximum length is ${max} characters (current: ${str.length})` 
      };
    }
    
    return { valid: true };
  }
  
  /**
   * Check for script injection patterns
   * @param {string} value - Value to validate
   * @returns {{ valid: boolean, error?: string }}
   * 
   * @example
   * Validator.isSafeString('Hello World') // { valid: true }
   * Validator.isSafeString('<script>alert(1)</script>') // { valid: false }
   */
  static isSafeString(value) {
    if (value === null || value === undefined) {
      return { valid: true };
    }
    
    const str = String(value);
    
    // Check for common script injection patterns
    const dangerousPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi, // Event handlers like onclick=
      /<iframe/gi,
      /eval\(/gi,
      /expression\(/gi, // CSS expression
    ];
    
    for (const pattern of dangerousPatterns) {
      if (pattern.test(str)) {
        return { 
          valid: false, 
          error: 'Input contains potentially unsafe content' 
        };
      }
    }
    
    return { valid: true };
  }
  
  // ============================================================
  // FILE VALIDATORS
  // ============================================================
  
  /**
   * Validate file MIME type against whitelist
   * @param {File} file - File object from input
   * @param {string[]} allowedMimeTypes - Array of allowed MIME types
   * @returns {{ valid: boolean, error?: string }}
   * 
   * @example
   * Validator.isValidFileType(file, ['text/html', 'text/plain'])
   */
  static isValidFileType(file, allowedMimeTypes) {
    if (!file || !(file instanceof File)) {
      return { valid: false, error: 'Invalid file object' };
    }
    
    if (!allowedMimeTypes.includes(file.type)) {
      const allowed = allowedMimeTypes.join(', ');
      return { 
        valid: false, 
        error: `File type '${file.type}' not allowed. Allowed: ${allowed}` 
      };
    }
    
    return { valid: true };
  }
  
  /**
   * Validate file size against limit
   * @param {File} file - File object from input
   * @param {number} maxBytes - Maximum size in bytes
   * @returns {{ valid: boolean, error?: string }}
   * 
   * @example
   * const maxSize = 5 * 1024 * 1024; // 5 MB
   * Validator.isWithinSizeLimit(file, maxSize)
   */
  static isWithinSizeLimit(file, maxBytes) {
    if (!file || !(file instanceof File)) {
      return { valid: false, error: 'Invalid file object' };
    }
    
    if (file.size > maxBytes) {
      const maxMB = (maxBytes / (1024 * 1024)).toFixed(1);
      const fileMB = (file.size / (1024 * 1024)).toFixed(1);
      return { 
        valid: false, 
        error: `File size ${fileMB} MB exceeds maximum of ${maxMB} MB` 
      };
    }
    
    return { valid: true };
  }
  
  /**
   * Validate file extension against whitelist
   * @param {string} filename - Filename with extension
   * @param {string[]} allowedExtensions - Array of allowed extensions (with dots, e.g., ['.html', '.txt'])
   * @returns {{ valid: boolean, error?: string }}
   * 
   * @example
   * Validator.hasValidExtension('document.html', ['.html', '.htm'])
   * Validator.hasValidExtension('virus.exe', ['.html', '.txt']) // Invalid
   */
  static hasValidExtension(filename, allowedExtensions) {
    if (!filename || typeof filename !== 'string') {
      return { valid: false, error: 'Invalid filename' };
    }
    
    // Extract extension (handle multiple dots)
    const ext = filename.toLowerCase().match(/\.[^.]+$/)?.[0];
    
    if (!ext) {
      return { valid: false, error: 'File has no extension' };
    }
    
    // Normalize allowed extensions to lowercase
    const normalizedAllowed = allowedExtensions.map(e => e.toLowerCase());
    
    if (!normalizedAllowed.includes(ext)) {
      const allowed = allowedExtensions.join(', ');
      return { 
        valid: false, 
        error: `Extension '${ext}' not allowed. Allowed: ${allowed}` 
      };
    }
    
    return { valid: true };
  }
  
  // ============================================================
  // UI HELPERS
  // ============================================================
  
  /**
   * Display validation error message below input field
   * @param {HTMLElement} inputElement - Input element to show error for
   * @param {string} message - Error message to display
   * 
   * @example
   * const input = document.getElementById('amount');
   * Validator.showValidationError(input, 'Amount must be positive');
   */
  static showValidationError(inputElement, message) {
    if (!inputElement) {
      console.error('[Validator] Invalid input element');
      return;
    }
    
    // Remove existing error if any
    this.clearValidationError(inputElement);
    
    // Add error class to input
    inputElement.classList.add('input-error');
    inputElement.setAttribute('aria-invalid', 'true');
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'validation-error';
    errorDiv.textContent = message;
    errorDiv.setAttribute('role', 'alert');
    
    // Set aria-describedby for accessibility
    const errorId = `${inputElement.id || 'input'}-error`;
    errorDiv.id = errorId;
    inputElement.setAttribute('aria-describedby', errorId);
    
    // Insert error after input (or after parent if input is wrapped)
    const parent = inputElement.parentElement;
    if (parent) {
      // Insert after the input or after the input's wrapper
      if (inputElement.nextSibling) {
        parent.insertBefore(errorDiv, inputElement.nextSibling);
      } else {
        parent.appendChild(errorDiv);
      }
    }
  }
  
  /**
   * Remove validation error from input field
   * @param {HTMLElement} inputElement - Input element to clear error from
   * 
   * @example
   * const input = document.getElementById('amount');
   * Validator.clearValidationError(input);
   */
  static clearValidationError(inputElement) {
    if (!inputElement) {
      return;
    }
    
    // Remove error class
    inputElement.classList.remove('input-error');
    inputElement.removeAttribute('aria-invalid');
    
    // Remove error message
    const errorId = inputElement.getAttribute('aria-describedby');
    if (errorId) {
      const errorElement = document.getElementById(errorId);
      if (errorElement && errorElement.classList.contains('validation-error')) {
        errorElement.remove();
      }
      inputElement.removeAttribute('aria-describedby');
    }
    
    // Also remove any validation-error that's a sibling (fallback)
    const parent = inputElement.parentElement;
    if (parent) {
      const errors = parent.querySelectorAll('.validation-error');
      errors.forEach(error => {
        // Only remove if it's close to this input
        if (error.previousElementSibling === inputElement) {
          error.remove();
        }
      });
    }
  }
  
  /**
   * Validate entire form against rules
   * @param {HTMLFormElement} formElement - Form element to validate
   * @param {Object} rules - Validation rules by field name
   * @returns {{ valid: boolean, errors: string[] }}
   * 
   * @example
   * const rules = {
   *   amount: (value) => Validator.isPositiveNumber(value, 500, 1000000),
   *   rate: (value) => Validator.isPercentage(value)
   * };
   * const result = Validator.validateForm(form, rules);
   */
  static validateForm(formElement, rules) {
    if (!formElement) {
      return { valid: false, errors: ['Invalid form element'] };
    }
    
    const errors = [];
    let isValid = true;
    
    // Validate each field according to rules
    for (const [fieldName, validator] of Object.entries(rules)) {
      const input = formElement.elements[fieldName];
      if (!input) {
        console.warn(`[Validator] Field '${fieldName}' not found in form`);
        continue;
      }
      
      const result = validator(input.value);
      
      if (!result.valid) {
        isValid = false;
        errors.push(`${fieldName}: ${result.error}`);
        this.showValidationError(input, result.error);
      } else {
        this.clearValidationError(input);
      }
    }
    
    return { valid: isValid, errors };
  }
  
  // ============================================================
  // UTILITY METHODS
  // ============================================================
  
  /**
   * Format number for user-friendly display
   * @private
   */
  static formatNumber(num) {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(1)} crore`;
    } else if (num >= 100000) {
      return `₹${(num / 100000).toFixed(1)} lakh`;
    } else if (num >= 1000) {
      return num.toLocaleString('en-IN');
    }
    return num.toString();
  }
}

// Export singleton instance for convenience
export const validator = Validator;

// Debug helper
if (typeof window !== 'undefined') {
  window.Validator = Validator;
  console.debug('[Validator] Validation framework loaded');
}
