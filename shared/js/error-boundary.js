/**
 * Error Boundary System
 * Provides graceful error handling and user-friendly error modals
 * 
 * @file shared/js/error-boundary.js
 * Sprint 2 - Day 4 - Error Handling
 * Created: March 20, 2026
 */

/**
 * ErrorBoundary - Wrap functions with error handling
 * 
 * Usage:
 *   const boundary = new ErrorBoundary({ containerId: 'app' });
 *   const safeCalculate = boundary.wrap(calculateResults);
 *   safeCalculate(); // Will catch errors and show modal
 */
export class ErrorBoundary {
  /**
   * Create new error boundary
   * @param {Object} options - Configuration options
   * @param {string} options.containerId - Container element ID for error display
   * @param {Function} options.onError - Custom error handler
   * @param {boolean} options.logErrors - Whether to log errors to console (default: true)
   */
  constructor(options = {}) {
    this.containerId = options.containerId;
    this.onError = options.onError || this.defaultErrorHandler.bind(this);
    this.logErrors = options.logErrors !== false;
    this.errorCount = 0;
    this.lastError = null;
  }

  /**
   * Wrap an async function with error handling
   * @param {Function} fn - Async function to wrap
   * @returns {Function} - Wrapped function
   */
  wrap(fn) {
    return async (...args) => {
      try {
        return await fn(...args);
      } catch (error) {
        this.handleError(error, fn.name || 'Anonymous Function');
      }
    };
  }

  /**
   * Wrap synchronous function with error handling
   * @param {Function} fn - Sync function to wrap
   * @returns {Function} - Wrapped function
   */
  wrapSync(fn) {
    return (...args) => {
      try {
        return fn(...args);
      } catch (error) {
        this.handleError(error, fn.name || 'Anonymous Function');
      }
    };
  }

  /**
   * Handle caught errors
   * @param {Error} error - The error object
   * @param {string} context - Context where error occurred
   */
  handleError(error, context = 'Unknown') {
    this.errorCount++;
    this.lastError = { error, context, timestamp: new Date() };

    if (this.logErrors) {
      console.error(`[ErrorBoundary] Error in ${context}:`, error);
      console.error('Stack trace:', error.stack);
    }

    this.onError(error, context);
  }

  /**
   * Default error handler - shows modal with error details
   * @param {Error} error - The error object
   * @param {string} context - Context where error occurred
   */
  defaultErrorHandler(error, context) {
    const modal = this.createErrorModal(error, context);
    document.body.appendChild(modal);
    
    // Show modal with animation
    requestAnimationFrame(() => {
      modal.classList.add('visible');
    });
  }

  /**
   * Create error modal element
   * @param {Error} error - The error object
   * @param {string} context - Context where error occurred
   * @returns {HTMLElement} - Modal element
   */
  createErrorModal(error, context) {
    const modal = document.createElement('div');
    modal.className = 'error-modal-overlay';
    
    const sanitizedMessage = this.sanitizeErrorMessage(error.message);
    const sanitizedContext = this.sanitizeErrorMessage(context);
    
    modal.innerHTML = `
      <div class="error-modal">
        <div class="error-modal-header">
          <h3>⚠️ Something Went Wrong</h3>
          <button class="error-modal-close" aria-label="Close">&times;</button>
        </div>
        <div class="error-modal-content">
          <p>We encountered an unexpected error while executing:</p>
          <div class="error-context">${sanitizedContext}</div>
          <details class="error-details">
            <summary>Error Details</summary>
            <pre>${sanitizedMessage}</pre>
          </details>
          <p class="error-help">
            You can try refreshing the page or clearing your browser cache.
          </p>
        </div>
        <div class="error-modal-actions">
          <button class="btn btn-primary error-refresh-btn">
            🔄 Refresh Page
          </button>
          <button class="btn btn-secondary error-close-btn">
            Close
          </button>
        </div>
      </div>
    `;

    // Add event listeners
    const closeBtn = modal.querySelector('.error-modal-close');
    const closeActionBtn = modal.querySelector('.error-close-btn');
    const refreshBtn = modal.querySelector('.error-refresh-btn');

    const closeModal = () => {
      modal.classList.remove('visible');
      setTimeout(() => modal.remove(), 300);
    };

    closeBtn.addEventListener('click', closeModal);
    closeActionBtn.addEventListener('click', closeModal);
    refreshBtn.addEventListener('click', () => {
      window.location.reload();
    });

    // Close on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);

    return modal;
  }

  /**
   * Sanitize error messages to prevent XSS
   * @param {string} message - Raw error message
   * @returns {string} - Sanitized message
   */
  sanitizeErrorMessage(message) {
    return String(message)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Get error statistics
   * @returns {Object} - Error stats
   */
  getStats() {
    return {
      errorCount: this.errorCount,
      lastError: this.lastError
    };
  }

  /**
   * Reset error statistics
   */
  resetStats() {
    this.errorCount = 0;
    this.lastError = null;
  }

  /**
   * Setup global error handlers
   * Catches unhandled errors and promise rejections
   */
  static setupGlobalHandler() {
    const globalBoundary = new ErrorBoundary({
      containerId: 'app-root',
      logErrors: true
    });

    // Catch synchronous errors
    window.addEventListener('error', (event) => {
      event.preventDefault();
      globalBoundary.handleError(
        event.error || new Error(event.message),
        'Global Error'
      );
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      event.preventDefault();
      globalBoundary.handleError(
        event.reason || new Error('Unhandled Promise Rejection'),
        'Promise Rejection'
      );
    });

    console.log('[ErrorBoundary] Global error handlers installed');
    return globalBoundary;
  }
}

/**
 * Add modal styles to document
 */
function injectErrorModalStyles() {
  if (document.getElementById('error-boundary-styles')) {
    return; // Already injected
  }

  const style = document.createElement('style');
  style.id = 'error-boundary-styles';
  style.textContent = `
    .error-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      opacity: 0;
      transition: opacity 0.3s ease;
      backdrop-filter: blur(2px);
    }

    .error-modal-overlay.visible {
      opacity: 1;
    }

    .error-modal {
      background: white;
      border-radius: 12px;
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
                  0 10px 10px -5px rgba(0, 0, 0, 0.04);
      transform: scale(0.95);
      transition: transform 0.3s ease;
    }

    .error-modal-overlay.visible .error-modal {
      transform: scale(1);
    }

    .error-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      background: #fef2f2;
    }

    .error-modal-header h3 {
      margin: 0;
      font-size: 1.25rem;
      color: #dc2626;
    }

    .error-modal-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #6b7280;
      padding: 0;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .error-modal-close:hover {
      background: rgba(0, 0, 0, 0.05);
      color: #dc2626;
    }

    .error-modal-content {
      padding: 1.5rem;
      overflow-y: auto;
      max-height: 50vh;
    }

    .error-modal-content p {
      margin: 0 0 1rem 0;
      color: #374151;
      line-height: 1.6;
    }

    .error-context {
      background: #f3f4f6;
      padding: 0.75rem 1rem;
      border-radius: 6px;
      font-family: 'Monaco', 'Courier New', monospace;
      font-size: 0.875rem;
      color: #1f2937;
      margin-bottom: 1rem;
      font-weight: 600;
    }

    .error-details {
      margin: 1rem 0;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      overflow: hidden;
    }

    .error-details summary {
      padding: 0.75rem 1rem;
      background: #f9fafb;
      cursor: pointer;
      user-select: none;
      font-weight: 500;
      color: #6b7280;
    }

    .error-details summary:hover {
      background: #f3f4f6;
    }

    .error-details pre {
      margin: 0;
      padding: 1rem;
      background: #1f2937;
      color: #f3f4f6;
      font-family: 'Monaco', 'Courier New', monospace;
      font-size: 0.75rem;
      overflow-x: auto;
      line-height: 1.5;
    }

    .error-help {
      margin-top: 1rem;
      padding: 1rem;
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      border-radius: 4px;
      color: #1e40af;
      font-size: 0.875rem;
    }

    .error-modal-actions {
      display: flex;
      gap: 0.75rem;
      padding: 1.5rem;
      border-top: 1px solid #e5e7eb;
      background: #f9fafb;
      justify-content: flex-end;
    }

    .error-modal-actions button {
      padding: 0.625rem 1.25rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }

    .error-refresh-btn {
      background: #4f46e5 !important;
      color: white !important;
    }

    .error-refresh-btn:hover {
      background: #4338ca !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .error-close-btn {
      background: #e5e7eb !important;
      color: #374151 !important;
    }

    .error-close-btn:hover {
      background: #d1d5db !important;
    }
  `;

  document.head.appendChild(style);
}

// Auto-inject styles when module loads
if (typeof document !== 'undefined') {
  injectErrorModalStyles();
}

// Auto-setup global handler when imported
if (typeof window !== 'undefined') {
  ErrorBoundary.setupGlobalHandler();
}

export default ErrorBoundary;
