/**
 * Clipboard Module
 * Utilities for copying text to clipboard
 * 
 * @file shared/js/clipboard.js
 */

import { showSuccessToast, showErrorToast } from './utils.js';

/**
 * Copy text to clipboard using modern Clipboard API
 * Falls back to older method if Clipboard API is not available
 * 
 * @param {string} text - Text to copy
 * @param {boolean} showNotification - Whether to show success/error notification
 * @returns {Promise<boolean>} True if successful
 */
export async function copyToClipboard(text, showNotification = true) {
  try {
    // Modern Clipboard API (preferred)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      
      if (showNotification) {
        showSuccessToast('Copied to clipboard');
      }
      
      return true;
    } else {
      // Fallback for older browsers
      return copyToClipboardFallback(text, showNotification);
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    
    // Try fallback method
    return copyToClipboardFallback(text, showNotification);
  }
}

/**
 * Fallback method for copying to clipboard
 * Uses older document.execCommand method
 * 
 * @param {string} text - Text to copy
 * @param {boolean} showNotification - Whether to show notification
 * @returns {boolean} True if successful
 */
function copyToClipboardFallback(text, showNotification = true) {
  try {
    // Create temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    
    // Make textarea invisible but functional
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.width = '2em';
    textarea.style.height = '2em';
    textarea.style.padding = '0';
    textarea.style.border = 'none';
    textarea.style.outline = 'none';
    textarea.style.boxShadow = 'none';
    textarea.style.background = 'transparent';
    textarea.setAttribute('readonly', '');
    
    document.body.appendChild(textarea);
    
    // Select text
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    
    // Copy to clipboard
    const successful = document.execCommand('copy');
    
    // Remove temporary element
    document.body.removeChild(textarea);
    
    if (successful) {
      if (showNotification) {
        showSuccessToast('Copied to clipboard');
      }
      return true;
    } else {
      throw new Error('execCommand copy failed');
    }
  } catch (error) {
    console.error('Fallback copy failed:', error);
    
    if (showNotification) {
      showErrorToast('Failed to copy to clipboard');
    }
    
    return false;
  }
}

/**
 * Copy element's text content to clipboard
 * @param {HTMLElement} element - Element to copy text from
 * @param {boolean} showNotification - Whether to show notification
 * @returns {Promise<boolean>} True if successful
 */
export async function copyElementText(element, showNotification = true) {
  if (!element) {
    console.error('Element not found');
    return false;
  }
  
  const text = element.textContent || element.innerText;
  return copyToClipboard(text, showNotification);
}

/**
 * Copy element's value to clipboard (for input/textarea)
 * @param {HTMLInputElement|HTMLTextAreaElement} element - Input element
 * @param {boolean} showNotification - Whether to show notification
 * @returns {Promise<boolean>} True if successful
 */
export async function copyElementValue(element, showNotification = true) {
  if (!element) {
    console.error('Element not found');
    return false;
  }
  
  return copyToClipboard(element.value, showNotification);
}

/**
 * Create a copy button that copies text when clicked
 * @param {string} text - Text to copy
 * @param {string} label - Button label (default: 'Copy')
 * @param {string} successLabel - Label shown after successful copy (default: 'Copied!')
 * @returns {HTMLButtonElement} Copy button element
 */
export function createCopyButton(text, label = 'Copy', successLabel = 'Copied!') {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn btn-secondary btn-small';
  button.textContent = label;
  button.setAttribute('aria-label', 'Copy to clipboard');
  
  button.addEventListener('click', async () => {
    const success = await copyToClipboard(text, false);
    
    if (success) {
      // Update button text temporarily
      const originalText = button.textContent;
      button.textContent = successLabel;
      button.disabled = true;
      
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 2000);
      
      showSuccessToast('Copied to clipboard');
    } else {
      showErrorToast('Failed to copy');
    }
  });
  
  return button;
}

/**
 * Create a copy button for a specific element
 * @param {string} elementId - ID of element to copy from
 * @param {string} label - Button label
 * @returns {HTMLButtonElement} Copy button element
 */
export function createCopyButtonForElement(elementId, label = 'Copy') {
  const button = createCopyButton('', label);
  
  button.addEventListener('click', async (e) => {
    e.stopPropagation(); // Prevent original handler
    
    const element = document.getElementById(elementId);
    if (!element) {
      showErrorToast('Element not found');
      return;
    }
    
    const text = element.value || element.textContent || element.innerText;
    const success = await copyToClipboard(text, false);
    
    if (success) {
      button.textContent = 'Copied!';
      button.disabled = true;
      
      setTimeout(() => {
        button.textContent = label;
        button.disabled = false;
      }, 2000);
      
      showSuccessToast('Copied to clipboard');
    } else {
      showErrorToast('Failed to copy');
    }
  });
  
  return button;
}

/**
 * Check if clipboard API is available
 * @returns {boolean} True if clipboard API is available
 */
export function isClipboardAvailable() {
  return !!(navigator.clipboard && navigator.clipboard.writeText);
}

/**
 * Read text from clipboard (requires user permission)
 * @returns {Promise<string|null>} Clipboard text or null
 */
export async function readFromClipboard() {
  try {
    if (navigator.clipboard && navigator.clipboard.readText) {
      const text = await navigator.clipboard.readText();
      return text;
    } else {
      console.warn('Clipboard read not supported');
      return null;
    }
  } catch (error) {
    console.error('Failed to read from clipboard:', error);
    
    // User likely denied permission
    if (error.name === 'NotAllowedError') {
      showErrorToast('Clipboard access denied');
    }
    
    return null;
  }
}

/**
 * Create a paste button that reads from clipboard
 * @param {Function} onPaste - Callback function with pasted text
 * @param {string} label - Button label (default: 'Paste')
 * @returns {HTMLButtonElement} Paste button element
 */
export function createPasteButton(onPaste, label = 'Paste') {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn btn-secondary btn-small';
  button.textContent = label;
  button.setAttribute('aria-label', 'Paste from clipboard');
  
  button.addEventListener('click', async () => {
    const text = await readFromClipboard();
    
    if (text) {
      onPaste(text);
      showSuccessToast('Pasted from clipboard');
    } else {
      showErrorToast('Failed to read from clipboard');
    }
  });
  
  return button;
}

/**
 * Show a temporary copy notification overlay
 * Displays a visual notification that content was copied
 * 
 * @param {string} message - Message to display (default: 'Copied!')
 * @param {number} duration - Duration in milliseconds (default: 2000)
 */
export function showCopyNotification(message = 'Copied!', duration = 2000) {
  // Remove any existing notification
  const existingNotification = document.querySelector('.copy-notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'copy-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: rgba(34, 197, 94, 0.95);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 9999;
    animation: slideInRight 0.3s ease-out;
  `;
  
  // Add animation styles if not already present
  if (!document.querySelector('#copy-notification-styles')) {
    const style = document.createElement('style');
    style.id = 'copy-notification-styles';
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Add to document
  document.body.appendChild(notification);
  
  // Remove after duration
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => notification.remove(), 300);
  }, duration);
}
