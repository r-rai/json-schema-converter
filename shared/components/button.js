/**
 * Button Component
 * Factory function for creating button elements with consistent styling
 * 
 * @file shared/components/button.js
 */

/**
 * Create a button component
 * @param {Object} options - Button configuration
 * @param {string} options.label - Button label text
 * @param {string} [options.variant='primary'] - Button variant (primary, secondary, ghost, danger)
 * @param {string} [options.size='medium'] - Button size (small, medium, large)
 * @param {string} [options.icon] - Optional icon HTML/emoji
 * @param {boolean} [options.disabled=false] - Whether button is disabled
 * @param {boolean} [options.block=false] - Whether button is full width
 * @param {boolean} [options.loading=false] - Whether button shows loading state
 * @param {Function} [options.onClick] - Click handler function
 * @param {string} [options.type='button'] - Button type attribute
 * @param {string} [options.ariaLabel] - Accessible label (defaults to label)
 * @returns {HTMLButtonElement} Button element
 */
export function createButton(options) {
  const {
    label,
    variant = 'primary',
    size = 'medium',
    icon = null,
    disabled = false,
    block = false,
    loading = false,
    onClick,
    type = 'button',
    ariaLabel = label
  } = options;
  
  // Create button element
  const button = document.createElement('button');
  button.type = type;
  
  // Build class list
  const classes = ['btn', `btn-${variant}`, `btn-${size}`];
  if (block) classes.push('btn-block');
  if (loading) classes.push('btn-loading');
  
  button.className = classes.join(' ');
  
  // Set content
  if (icon && !loading) {
    button.innerHTML = `${icon} <span>${label}</span>`;
  } else {
    button.textContent = label;
  }
  
  // Set attributes
  button.disabled = disabled || loading;
  button.setAttribute('aria-label', ariaLabel);
  
  if (loading) {
    button.setAttribute('aria-busy', 'true');
  }
  
  // Attach event listener
  if (onClick && typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  
  return button;
}

/**
 * Create primary button (convenience function)
 * @param {string} label - Button label
 * @param {Function} onClick - Click handler
 * @returns {HTMLButtonElement} Button element
 */
export function createPrimaryButton(label, onClick) {
  return createButton({ label, variant: 'primary', onClick });
}

/**
 * Create secondary button (convenience function)
 * @param {string} label - Button label
 * @param {Function} onClick - Click handler
 * @returns {HTMLButtonElement} Button element
 */
export function createSecondaryButton(label, onClick) {
  return createButton({ label, variant: 'secondary', onClick });
}

/**
 * Create ghost button (convenience function)
 * @param {string} label - Button label
 * @param {Function} onClick - Click handler
 * @returns {HTMLButtonElement} Button element
 */
export function createGhostButton(label, onClick) {
  return createButton({ label, variant: 'ghost', onClick });
}

/**
 * Create danger button (convenience function)
 * @param {string} label - Button label
 * @param {Function} onClick - Click handler
 * @returns {HTMLButtonElement} Button element
 */
export function createDangerButton(label, onClick) {
  return createButton({ label, variant: 'danger', onClick });
}

/**
 * Create icon button (button with only icon, no text)
 * @param {string} icon - Icon HTML/emoji
 * @param {Function} onClick - Click handler
 * @param {string} ariaLabel - Accessible label (required for icon-only buttons)
 * @param {string} variant - Button variant
 * @returns {HTMLButtonElement} Button element
 */
export function createIconButton(icon, onClick, ariaLabel, variant = 'ghost') {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `btn btn-${variant} btn-small`;
  button.innerHTML = icon;
  button.setAttribute('aria-label', ariaLabel);
  
  if (onClick) {
    button.addEventListener('click', onClick);
  }
  
  return button;
}

/**
 * Create button group container
 * @param {HTMLButtonElement[]} buttons - Array of button elements
 * @param {boolean} vertical - Whether buttons stack vertically
 * @returns {HTMLDivElement} Button group container
 */
export function createButtonGroup(buttons, vertical = false) {
  const group = document.createElement('div');
  group.className = vertical ? 'btn-group btn-group-vertical' : 'btn-group';
  group.style.display = 'flex';
  group.style.gap = 'var(--spacing-sm)';
  
  if (vertical) {
    group.style.flexDirection = 'column';
  }
  
  buttons.forEach(button => group.appendChild(button));
  
  return group;
}

/**
 * Update button loading state
 * @param {HTMLButtonElement} button - Button element
 * @param {boolean} isLoading - Whether button is loading
 * @param {string} loadingLabel - Optional text to show during loading
 */
export function setButtonLoading(button, isLoading, loadingLabel = null) {
  if (isLoading) {
    button.classList.add('btn-loading');
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    
    if (loadingLabel) {
      button.setAttribute('data-original-label', button.textContent);
      button.textContent = loadingLabel;
    }
  } else {
    button.classList.remove('btn-loading');
    button.disabled = false;
    button.removeAttribute('aria-busy');
    
    const originalLabel = button.getAttribute('data-original-label');
    if (originalLabel) {
      button.textContent = originalLabel;
      button.removeAttribute('data-original-label');
    }
  }
}

/**
 * Update button disabled state
 * @param {HTMLButtonElement} button - Button element
 * @param {boolean} isDisabled - Whether button is disabled
 */
export function setButtonDisabled(button, isDisabled) {
  button.disabled = isDisabled;
}

/**
 * Update button text/label
 * @param {HTMLButtonElement} button - Button element
 * @param {string} newLabel - New label text
 */
export function setButtonLabel(button, newLabel) {
  // Preserve icon if present
  const icon = button.querySelector('svg, .icon');
  if (icon) {
    button.innerHTML = '';
    button.appendChild(icon);
    const span = document.createElement('span');
    span.textContent = newLabel;
    button.appendChild(span);
  } else {
    button.textContent = newLabel;
  }
}
