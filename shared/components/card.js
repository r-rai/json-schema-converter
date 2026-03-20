/**
 * Card Component
 * Factory function for creating card elements
 * 
 * @file shared/components/card.js
 */

/**
 * Create a card component
 * @param {Object} options - Card configuration
 * @param {string} [options.icon] - Optional icon HTML/emoji
 * @param {string} [options.title] - Card title
 * @param {string} [options.subtitle] - Card subtitle
 * @param {string} [options.content] - Card content (text or HTML)
 * @param {Array} [options.actions] - Array of button elements for card footer
 * @param {boolean} [options.hover=false] - Whether card has hover effect
 * @param {boolean} [options.clickable=false] - Whether card is clickable
 * @param {Function} [options.onClick] - Click handler (if clickable)
 * @param {string} [options.className=''] - Additional CSS classes
 * @returns {HTMLDivElement} Card element
 */
export function createCard(options) {
  const {
    icon = null,
    title = '',
    subtitle = '',
    content = '',
    actions = [],
    hover = false,
    clickable = false,
    onClick,
    className = ''
  } = options;
  
  // Create card container
  const card = document.createElement('div');
  const classes = ['card'];
  
  if (hover) classes.push('card-hover');
  if (clickable) classes.push('card-clickable');
  if (className) classes.push(className);
  
  card.className = classes.join(' ');
  
  // Create header (if title or subtitle exists)
  if (title || subtitle || icon) {
    const header = document.createElement('div');
    header.className = 'card-header';
    
    // Add icon
    if (icon) {
      const iconElement = document.createElement('div');
      iconElement.className = 'card-icon';
      iconElement.innerHTML = icon;
      header.appendChild(iconElement);
    }
    
    // Add title
    if (title) {
      const titleElement = document.createElement('h3');
      titleElement.className = 'card-title';
      titleElement.textContent = title;
      header.appendChild(titleElement);
    }
    
    // Add subtitle
    if (subtitle) {
      const subtitleElement = document.createElement('p');
      subtitleElement.className = 'card-subtitle';
      subtitleElement.textContent = subtitle;
      header.appendChild(subtitleElement);
    }
    
    card.appendChild(header);
  }
  
  // Create content
  if (content) {
    const contentElement = document.createElement('div');
    contentElement.className = 'card-content';
    
    // Check if content is HTML or plain text
    if (typeof content === 'string' && content.trim().startsWith('<')) {
      contentElement.innerHTML = content;
    } else {
      contentElement.textContent = content;
    }
    
    card.appendChild(contentElement);
  }
  
  // Create footer (if actions exist)
  if (actions && actions.length > 0) {
    const footer = document.createElement('div');
    footer.className = 'card-footer';
    
    actions.forEach(action => {
      if (action instanceof HTMLElement) {
        footer.appendChild(action);
      }
    });
    
    card.appendChild(footer);
  }
  
  // Attach click handler
  if (clickable && onClick) {
    card.addEventListener('click', onClick);
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    
    // Add keyboard support
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick(e);
      }
    });
  }
  
  return card;
}

/**
 * Create a tool card (specialized card for displaying tools on home page)
 * @param {Object} options - Tool card configuration
 * @param {string} options.name - Tool name
 * @param {string} options.description - Tool description
 * @param {string} [options.icon='🔧'] - Tool icon
 * @param {string} options.route - Route path (e.g., '/json-schema')
 * @param {Function} [options.onNavigate] - Navigation handler
 * @returns {HTMLDivElement} Tool card element
 */
export function createToolCard(options) {
  const {
    name,
    description,
    icon = '🔧',
    route,
    onNavigate
  } = options;
  
  return createCard({
    icon,
    title: name,
    content: description,
    hover: true,
    clickable: true,
    onClick: () => {
      if (onNavigate) {
        onNavigate(route);
      } else {
        window.location.hash = `#${route}`;
      }
    }
  });
}

/**
 * Create a feature card (for displaying features/capabilities)
 * @param {Object} options - Feature card configuration
 * @param {string} options.title - Feature title
 * @param {string} options.description - Feature description
 * @param {string} [options.icon] - Feature icon
 * @returns {HTMLDivElement} Feature card element
 */
export function createFeatureCard(options) {
  const {
    title,
    description,
    icon = '✨'
  } = options;
  
  return createCard({
    icon,
    title,
    content: description,
    hover: true
  });
}

/**
 * Create a stat card (for displaying statistics/metrics)
 * @param {Object} options - Stat card configuration
 * @param {string} options.label - Stat label
 * @param {string|number} options.value - Stat value
 * @param {string} [options.icon] - Optional icon
 * @param {string} [options.change] - Optional change indicator (e.g., '+5%')
 * @param {string} [options.changeType] - Change type ('positive', 'negative', 'neutral')
 * @returns {HTMLDivElement} Stat card element
 */
export function createStatCard(options) {
  const {
    label,
    value,
    icon = null,
    change = null,
    changeType = 'neutral'
  } = options;
  
  // Create custom content with stat styling
  const content = document.createElement('div');
  content.style.textAlign = 'center';
  
  const valueElement = document.createElement('div');
  valueElement.style.fontSize = 'var(--font-size-3xl)';
  valueElement.style.fontWeight = 'var(--font-weight-bold)';
  valueElement.style.color = 'var(--color-accent)';
  valueElement.textContent = value;
  content.appendChild(valueElement);
  
  if (change) {
    const changeElement = document.createElement('div');
    changeElement.style.fontSize = 'var(--font-size-sm)';
    changeElement.style.marginTop = 'var(--spacing-xs)';
    
    if (changeType === 'positive') {
      changeElement.style.color = 'var(--color-success)';
    } else if (changeType === 'negative') {
      changeElement.style.color = 'var(--color-error)';
    } else {
      changeElement.style.color = 'var(--color-text-muted)';
    }
    
    changeElement.textContent = change;
    content.appendChild(changeElement);
  }
  
  const card = createCard({
    icon,
    title: label,
    hover: false
  });
  
  // Insert custom content
  const contentContainer = document.createElement('div');
  contentContainer.className = 'card-content';
  contentContainer.appendChild(content);
  card.appendChild(contentContainer);
  
  return card;
}

/**
 * Create a grid of cards
 * @param {Array<HTMLDivElement>} cards - Array of card elements
 * @param {number} [columns=3] - Number of columns (will be responsive)
 * @returns {HTMLDivElement} Grid container with cards
 */
export function createCardGrid(cards, columns = 3) {
  const grid = document.createElement('div');
  grid.className = `grid grid-${columns}`;
  
  cards.forEach(card => {
    if (card instanceof HTMLElement) {
      grid.appendChild(card);
    }
  });
  
  return grid;
}

/**
 * Update card content
 * @param {HTMLDivElement} card - Card element
 * @param {Object} updates - Properties to update
 */
export function updateCard(card, updates) {
  if (updates.title) {
    const titleElement = card.querySelector('.card-title');
    if (titleElement) {
      titleElement.textContent = updates.title;
    }
  }
  
  if (updates.subtitle) {
    const subtitleElement = card.querySelector('.card-subtitle');
    if (subtitleElement) {
      subtitleElement.textContent = updates.subtitle;
    }
  }
  
  if (updates.content) {
    const contentElement = card.querySelector('.card-content');
    if (contentElement) {
      if (typeof updates.content === 'string' && updates.content.trim().startsWith('<')) {
        contentElement.innerHTML = updates.content;
      } else {
        contentElement.textContent = updates.content;
      }
    }
  }
  
  if (updates.icon) {
    const iconElement = card.querySelector('.card-icon');
    if (iconElement) {
      iconElement.innerHTML = updates.icon;
    }
  }
}
