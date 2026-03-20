/**
 * Modal Component
 * Factory function for creating modal dialog elements
 * 
 * @file shared/components/modal.js
 */

/**
 * Create a modal dialog component
 * @param {Object} options - Modal configuration
 * @param {string} options.title - Modal title
 * @param {string|HTMLElement} options.content - Modal content (HTML string or element)
 * @param {Array<HTMLButtonElement>} [options.actions=[]] - Action buttons for footer
 * @param {boolean} [options.closeButton=true] - Whether to show close button
 * @param {boolean} [options.closeOnEscape=true] - Whether Escape key closes modal
 * @param {boolean} [options.closeOnBackdrop=true] - Whether clicking backdrop closes modal
 * @param {Function} [options.onOpen] - Callback when modal opens
 * @param {Function} [options.onClose] - Callback when modal closes
 * @param {string} [options.size='medium'] - Modal size (small, medium, large)
 * @returns {Object} Object containing modal element and control methods
 */
export function createModal(options) {
  const {
    title,
    content,
    actions = [],
    closeButton = true,
    closeOnEscape = true,
    closeOnBackdrop = true,
    onOpen,
    onClose,
    size = 'medium'
  } = options;
  
  // Track focus elements for focus trap
  let previousFocus = null;
  let focusableElements = [];
  
  // Create backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');
  backdrop.setAttribute('aria-labelledby', 'modal-title');
  
  // Create modal container
  const modal = document.createElement('div');
  modal.className = `modal modal-${size}`;
  
  // Create header
  const header = document.createElement('div');
  header.className = 'modal-header';
  
  const titleElement = document.createElement('h2');
  titleElement.id = 'modal-title';
  titleElement.className = 'modal-title';
  titleElement.textContent = title;
  header.appendChild(titleElement);
  
  // Add close button if enabled
  if (closeButton) {
    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close';
    closeBtn.innerHTML = '✕';
    closeBtn.setAttribute('aria-label', 'Close modal');
    closeBtn.addEventListener('click', close);
    header.appendChild(closeBtn);
  }
  
  modal.appendChild(header);
  
  // Create body
  const body = document.createElement('div');
  body.className = 'modal-body';
  
  if (typeof content === 'string') {
    body.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    body.appendChild(content);
  }
  
  modal.appendChild(body);
  
  // Create footer if actions provided
  if (actions && actions.length > 0) {
    const footer = document.createElement('div');
    footer.className = 'modal-footer';
    
    actions.forEach(action => {
      if (action instanceof HTMLElement) {
        footer.appendChild(action);
      }
    });
    
    modal.appendChild(footer);
  }
  
  backdrop.appendChild(modal);
  
  // Close on backdrop click
  if (closeOnBackdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        close();
      }
    });
  }
  
  // Close on Escape key
  if (closeOnEscape) {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        close();
      }
    };
    
    backdrop.addEventListener('keydown', handleEscape);
  }
  
  /**
   * Open the modal
   */
  function open() {
    // Store currently focused element
    previousFocus = document.activeElement;
    
    // Add to DOM
    document.body.appendChild(backdrop);
    document.body.style.overflow = 'hidden';
    
    // Get focusable elements for focus trap
    focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    // Focus first focusable element or close button
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
    
    // Setup focus trap
    setupFocusTrap();
    
    // Call onOpen callback
    if (onOpen) {
      onOpen();
    }
  }
  
  /**
   * Close the modal
   */
  function close() {
    // Remove from DOM
    if (backdrop.parentNode) {
      document.body.removeChild(backdrop);
    }
    document.body.style.overflow = '';
    
    // Restore focus
    if (previousFocus) {
      previousFocus.focus();
    }
    
    // Call onClose callback
    if (onClose) {
      onClose();
    }
  }
  
  /**
   * Setup focus trap to keep focus within modal
   */
  function setupFocusTrap() {
    modal.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (e.shiftKey) {
        // Shift + Tab: focus previous element
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: focus next element
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  }
  
  /**
   * Update modal content
   * @param {string|HTMLElement} newContent - New content
   */
  function setContent(newContent) {
    body.innerHTML = '';
    if (typeof newContent === 'string') {
      body.innerHTML = newContent;
    } else if (newContent instanceof HTMLElement) {
      body.appendChild(newContent);
    }
  }
  
  /**
   * Update modal title
   * @param {string} newTitle - New title
   */
  function setTitle(newTitle) {
    titleElement.textContent = newTitle;
  }
  
  /**
   * Check if modal is currently open
   * @returns {boolean} True if modal is open
   */
  function isOpen() {
    return !!backdrop.parentNode;
  }
  
  return {
    backdrop,
    modal,
    open,
    close,
    setContent,
    setTitle,
    isOpen
  };
}

/**
 * Create a confirm dialog
 * @param {Object} options - Confirm dialog options
 * @param {string} options.title - Dialog title
 * @param {string} options.message - Confirmation message
 * @param {string} [options.confirmLabel='Confirm'] - Confirm button label
 * @param {string} [options.cancelLabel='Cancel'] - Cancel button label
 * @param {Function} [options.onConfirm] - Callback when confirmed
 * @param {Function} [options.onCancel] - Callback when cancelled
 * @returns {Object} Modal object
 */
export function createConfirmDialog(options) {
  const {
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel
  } = options;
  
  // Create content
  const content = document.createElement('p');
  content.textContent = message;
  content.style.lineHeight = 'var(--line-height-relaxed)';
  
  // Create confirm button
  const confirmButton = document.createElement('button');
  confirmButton.className = 'btn btn-primary';
  confirmButton.textContent = confirmLabel;
  confirmButton.addEventListener('click', () => {
    if (onConfirm) onConfirm();
    dialog.close();
  });
  
  // Create cancel button
  const cancelButton = document.createElement('button');
  cancelButton.className = 'btn btn-secondary';
  cancelButton.textContent = cancelLabel;
  cancelButton.addEventListener('click', () => {
    if (onCancel) onCancel();
    dialog.close();
  });
  
  // Create modal
  const dialog = createModal({
    title,
    content,
    actions: [cancelButton, confirmButton],
    closeButton: true,
    closeOnEscape: true,
    closeOnBackdrop: false,
    size: 'small'
  });
  
  return dialog;
}

/**
 * Create an alert dialog
 * @param {Object} options - Alert dialog options
 * @param {string} options.title - Dialog title
 * @param {string} options.message - Alert message
 * @param {string} [options.type='info'] - Alert type (info, success, warning, error)
 * @param {string} [options.okLabel='OK'] - OK button label
 * @param {Function} [options.onOk] - Callback when OK clicked
 * @returns {Object} Modal object
 */
export function createAlertDialog(options) {
  const {
    title,
    message,
    type = 'info',
    okLabel = 'OK',
    onOk
  } = options;
  
  // Icon based on type
  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };
  
  // Create content
  const content = document.createElement('div');
  content.style.display = 'flex';
  content.style.gap = 'var(--spacing-md)';
  content.style.alignItems = 'flex-start';
  
  const iconElement = document.createElement('div');
  iconElement.style.fontSize = 'var(--font-size-2xl)';
  iconElement.textContent = icons[type] || icons.info;
  
  const messageElement = document.createElement('p');
  messageElement.textContent = message;
  messageElement.style.flex = '1';
  messageElement.style.lineHeight = 'var(--line-height-relaxed)';
  
  content.appendChild(iconElement);
  content.appendChild(messageElement);
  
  // Create OK button
  const okButton = document.createElement('button');
  okButton.className = 'btn btn-primary';
  okButton.textContent = okLabel;
  okButton.addEventListener('click', () => {
    if (onOk) onOk();
    dialog.close();
  });
  
  // Create modal
  const dialog = createModal({
    title,
    content,
    actions: [okButton],
    closeButton: true,
    closeOnEscape: true,
    closeOnBackdrop: true,
    size: 'small'
  });
  
  return dialog;
}

/**
 * Quick confirm function (promise-based)
 * @param {string} message - Confirmation message
 * @param {string} title - Dialog title (default: 'Confirm')
 * @returns {Promise<boolean>} True if confirmed, false if cancelled
 */
export function confirm(message, title = 'Confirm') {
  return new Promise((resolve) => {
    const dialog = createConfirmDialog({
      title,
      message,
      onConfirm: () => resolve(true),
      onCancel: () => resolve(false)
    });
    dialog.open();
  });
}

/**
 * Quick alert function
 * @param {string} message - Alert message
 * @param {string} title - Dialog title (default: 'Alert')
 * @param {string} type - Alert type
 * @returns {Promise<void>}
 */
export function alert(message, title = 'Alert', type = 'info') {
  return new Promise((resolve) => {
    const dialog = createAlertDialog({
      title,
      message,
      type,
      onOk: () => resolve()
    });
    dialog.open();
  });
}
