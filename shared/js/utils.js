/**
 * Utility Functions Module
 * Common utility functions used across tools
 * 
 * @file shared/js/utils.js
 */

/**
 * Currency formatting for Indian Rupees
 * @param {number} amount - Amount to format
 * @param {boolean} showSymbol - Whether to show ₹ symbol
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, showSymbol = true) {
  try {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: showSymbol ? 'currency' : 'decimal',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
    
    return formatted;
  } catch (error) {
    console.error('Error formatting currency:', error);
    return showSymbol ? `₹${amount}` : String(amount);
  }
}

/**
 * Number formatting with Indian number system (lakhs, crores)
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export function formatNumber(num) {
  try {
    return new Intl.NumberFormat('en-IN').format(num);
  } catch (error) {
    console.error('Error formatting number:', error);
    return String(num);
  }
}

/**
 * Format number to specified decimal places
 * @param {number} num - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number
 */
export function formatDecimal(num, decimals = 2) {
  try {
    return num.toFixed(decimals);
  } catch (error) {
    console.error('Error formatting decimal:', error);
    return String(num);
  }
}

/**
 * Format percentage
 * @param {number} value - Percentage value (e.g., 5 for 5%)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string with % symbol
 */
export function formatPercentage(value, decimals = 2) {
  return `${formatDecimal(value, decimals)}%`;
}

/**
 * Debounce function
 * Delays function execution until after delay milliseconds have elapsed
 * since the last time it was invoked
 * 
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(fn, delay = 300) {
  let timeoutId;
  
  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Throttle function
 * Ensures function is only called once per specified time period
 * 
 * @param {Function} fn - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(fn, limit = 100) {
  let inThrottle;
  
  return function throttled(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Deep clone an object (simple implementation)
 * Note: Does not handle functions, dates, or circular references
 * 
 * @param {any} obj - Object to clone
 * @returns {any} Cloned object
 */
export function deepClone(obj) {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    console.error('Error cloning object:', error);
    return obj;
  }
}

/**
 * Validate email address
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
export function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate JSON string
 * @param {string} jsonString - JSON string to validate
 * @returns {boolean} True if valid JSON
 */
export function isValidJSON(jsonString) {
  try {
    JSON.parse(jsonString);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate JSON string with detailed error information
 * @param {string} jsonString - JSON string to validate
 * @returns {Object} Object with valid (boolean) and error (string) properties
 */
export function validateJSON(jsonString) {
  try {
    JSON.parse(jsonString);
    return { valid: true, error: null };
  } catch (error) {
    let errorMessage = 'Invalid JSON';
    
    if (error instanceof SyntaxError) {
      // Extract error details from the error message
      const message = error.message;
      
      // Try to extract position information
      const positionMatch = message.match(/position (\d+)/);
      const lineMatch = message.match(/line (\d+)/);
      const columnMatch = message.match(/column (\d+)/);
      
      if (positionMatch) {
        const position = parseInt(positionMatch[1], 10);
        const lines = jsonString.substring(0, position).split('\n');
        const line = lines.length;
        const column = lines[lines.length - 1].length + 1;
        errorMessage += ` at line ${line}, column ${column}`;
      } else if (lineMatch && columnMatch) {
        errorMessage += ` at line ${lineMatch[1]}, column ${columnMatch[1]}`;
      }
      
      // Add specific error description
      if (message.includes('Unexpected')) {
        const unexpectedMatch = message.match(/Unexpected (.+?)(?:\s|$)/);
        if (unexpectedMatch) {
          errorMessage += `: Unexpected ${unexpectedMatch[1]}`;
        }
      } else if (message.includes('Expected')) {
        errorMessage += `: ${message}`;
      }
    } else {
      errorMessage = error.message || errorMessage;
    }
    
    return { valid: false, error: errorMessage };
  }
}

/**
 * Parse JSON safely with error handling
 * @param {string} jsonString - JSON string to parse
 * @param {any} defaultValue - Default value if parsing fails
 * @returns {any} Parsed object or default value
 */
export function parseJSON(jsonString, defaultValue = null) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return defaultValue;
  }
}

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate string to specified length
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated string
 */
export function truncate(str, maxLength, suffix = '...') {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Generate unique ID
 * @param {string} prefix - Optional prefix
 * @returns {string} Unique ID
 */
export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate UUID v4
 * @returns {string} UUID
 */
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Format date to readable string
 * @param {Date|string|number} date - Date to format
 * @param {string} locale - Locale (default: 'en-IN')
 * @returns {string} Formatted date string
 */
export function formatDate(date, locale = 'en-IN') {
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(date);
  }
}

/**
 * Format date and time to readable string
 * @param {Date|string|number} date - Date to format
 * @param {string} locale - Locale (default: 'en-IN')
 * @returns {string} Formatted date time string
 */
export function formatDateTime(date, locale = 'en-IN') {
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date time:', error);
    return String(date);
  }
}

/**
 * Calculate percentage
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @param {number} decimals - Decimal places
 * @returns {number} Percentage
 */
export function calculatePercentage(value, total, decimals = 2) {
  if (total === 0) return 0;
  return parseFloat(((value / total) * 100).toFixed(decimals));
}

/**
 * Clamp number between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 * @param {any} value - Value to check
 * @returns {boolean} True if empty
 */
export function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Safe execute async function with error handling
 * @param {Function} fn - Async function to execute
 * @param {any} fallback - Fallback value if error occurs
 * @returns {Promise<any>} Result or fallback
 */
export async function safeExecute(fn, fallback = null) {
  try {
    return await fn();
  } catch (error) {
    console.error('Error in safeExecute:', error);
    return fallback;
  }
}

/**
 * Show error toast notification
 * @param {string} message - Error message
 * @param {number} duration - Duration in milliseconds
 */
export function showErrorToast(message, duration = 3000) {
  showToast(message, 'error', duration);
}

/**
 * Show success toast notification
 * @param {string} message - Success message
 * @param {number} duration - Duration in milliseconds
 */
export function showSuccessToast(message, duration = 3000) {
  showToast(message, 'success', duration);
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Toast type (success, error, warning, info)
 * @param {number} duration - Duration in milliseconds
 */
export function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');
  
  document.body.appendChild(toast);
  
  // Auto remove after duration
  setTimeout(() => {
    toast.classList.add('toast-fade-out');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Get query parameter from URL
 * @param {string} param - Parameter name
 * @returns {string|null} Parameter value or null
 */
export function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

/**
 * Set query parameter in URL without page reload
 * @param {string} param - Parameter name
 * @param {string} value - Parameter value
 */
export function setQueryParam(param, value) {
  const url = new URL(window.location);
  url.searchParams.set(param, value);
  window.history.pushState({}, '', url);
}

/**
 * Remove query parameter from URL
 * @param {string} param - Parameter name
 */
export function removeQueryParam(param) {
  const url = new URL(window.location);
  url.searchParams.delete(param);
  window.history.pushState({}, '', url);
}
