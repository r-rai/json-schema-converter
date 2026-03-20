/**
 * Home Page Logic
 * Tool discovery, search, and navigation
 * 
 * @file home/home.js
 */

/**
 * Tool definitions
 */
export const TOOLS = [
  {
    id: 'json-schema',
    name: 'JSON Schema Validator',
    description: 'Validate, beautify, minify, and convert JSON with schema validation support.',
    icon: '🔄',
    category: 'Developer',
    route: '/json-schema',
    keywords: ['json', 'validate', 'schema', 'beautify', 'minify', 'format'],
    badge: null
  },
  {
    id: 'sip-calculator',
    name: 'SIP Calculator',
    description: 'Calculate Systematic Investment Plan returns with step-up rate support.',
    icon: '📈',
    category: 'Financial',
    route: '/sip-calculator',
    keywords: ['sip', 'investment', 'mutual fund', 'calculator', 'returns', 'wealth'],
    badge: 'popular'
  },
  {
    id: 'html-markdown',
    name: 'HTML ↔ Markdown Converter',
    description: 'Bi-directional conversion between HTML and Markdown with live preview.',
    icon: '🔀',
    category: 'Conversion',
    route: '/html-markdown',
    keywords: ['html', 'markdown', 'convert', 'transform', 'preview'],
    badge: null
  },
  {
    id: 'text-diff',
    name: 'Text Diff Checker',
    description: 'Compare text and code files with line-by-line and character-level diff highlighting.',
    icon: '📝',
    category: 'Developer',
    route: '/text-diff',
    keywords: ['diff', 'compare', 'text', 'code', 'changes', 'version'],
    badge: 'new'
  },
  {
    id: 'emi-calculator',
    name: 'EMI Calculator',
    description: 'Calculate home loan EMI and model prepayment scenarios to optimize savings.',
    icon: '🏠',
    category: 'Financial',
    route: '/emi-calculator',
    keywords: ['emi', 'loan', 'home loan', 'calculator', 'prepayment', 'amortization'],
    badge: 'new'
  }
];

/**
 * Home Page Manager
 */
class HomePage {
  constructor() {
    this.tools = TOOLS;
    this.filteredTools = TOOLS;
    this.currentCategory = 'all';
    this.searchQuery = '';
    this.recentlyUsed = [];
    
    this.init();
  }
  
  /**
   * Initialize home page
   */
  init() {
    this.loadRecentlyUsed();
    this.render();
    this.attachEventListeners();
  }
  
  /**
   * Render home page
   */
  render() {
    const appContainer = document.getElementById('app');
    if (!appContainer) return;
    
    appContainer.innerHTML = this.getTemplate();
    
    // Re-attach theme toggle listener after updating DOM
    if (window.ThemeManager && typeof window.ThemeManager.attachToggleListener === 'function') {
      window.ThemeManager.attachToggleListener();
    }
    
    // Render components
    this.renderRecentlyUsed();
    this.renderCategories();
    this.renderTools();
  }
  
  /**
   * Get home page template
   */
  getTemplate() {
    return `
      <div class="container">
        <!-- Header with Theme Toggle -->
        <header class="home-header">
          <nav class="home-nav">
            <div class="logo">DevToolbox</div>
            <button data-theme-toggle class="btn btn-ghost theme-toggle-btn" aria-label="Toggle theme">
              <span class="theme-icon">🌙</span>
            </button>
          </nav>
        </header>
        
        <!-- Hero Section -->
        <section class="hero">
          <h1>🛠️ DevToolbox</h1>
          <p class="hero-subtitle">Your all-in-one developer utilities platform</p>
          <p class="hero-tagline">🚀 Fast • 🔒 Private • 💯 Free • ⚡ Client-side Only</p>
          
          <div class="search-container">
            <input 
              type="search" 
              id="tool-search" 
              class="search-bar" 
              placeholder="Search tools..."
              aria-label="Search tools"
            >
            <span class="search-icon">🔍</span>
          </div>
        </section>

        <!-- Recently Used Tools -->
        <section id="recently-used-section" class="recently-used" style="display: none;">
          <h2>Recently Used</h2>
          <div id="recent-tools-container" class="recent-tools"></div>
        </section>

        <!-- Categories Filter -->
        <section class="categories-section">
          <div id="categories-filter" class="categories-filter"></div>
        </section>

        <!-- Tools Grid -->
        <section id="tools-section">
          <div id="tools-grid" class="tools-grid"></div>
        </section>

        <!-- Features Section -->
        <section class="features-section">
          <h2>Why DevToolbox?</h2>
          <div class="features-grid">
            <div class="feature-item">
              <span class="feature-icon">🔒</span>
              <h3 class="feature-title">Privacy First</h3>
              <p class="feature-description">
                All processing happens locally in your browser. Your data never leaves your device.
              </p>
            </div>
            
            <div class="feature-item">
              <span class="feature-icon">⚡</span>
              <h3 class="feature-title">Lightning Fast</h3>
              <p class="feature-description">
                No server round-trips. Instant calculations and conversions right in your browser.
              </p>
            </div>
            
            <div class="feature-item">
              <span class="feature-icon">💯</span>
              <h3 class="feature-title">100% Free</h3>
              <p class="feature-description">
                No sign-ups, no subscriptions, no hidden costs. Free forever for everyone.
              </p>
            </div>
            
            <div class="feature-item">
              <span class="feature-icon">📱</span>
              <h3 class="feature-title">Works Offline</h3>
              <p class="feature-description">
                Use all tools without an internet connection after initial page load.
              </p>
            </div>
          </div>
        </section>

        <!-- Footer -->
        <footer class="home-footer">
          <div class="footer-links">
            <a href="https://github.com/yourusername/devtoolbox" class="footer-link" target="_blank" rel="noopener">GitHub</a>
            <a href="#" class="footer-link">Documentation</a>
            <a href="#" class="footer-link">About</a>
            <a href="#" class="footer-link">Privacy Policy</a>
          </div>
          
          <p>&copy; 2026 DevToolbox. Open source under MIT License.</p>
          <p style="margin-top: 0.5rem; font-size: 0.9rem;">Version 1.0.0</p>
        </footer>
      </div>
    `;
  }
  
  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Search input
    const searchInput = document.getElementById('tool-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.handleSearch(e.target.value);
      });
    }
  }
  
  /**
   * Render categories filter
   */
  renderCategories() {
    const container = document.getElementById('categories-filter');
    if (!container) return;
    
    const categories = ['all', 'Developer', 'Financial', 'Conversion'];
    
    let html = '';
    categories.forEach(category => {
      const isActive = this.currentCategory === category;
      const displayName = category === 'all' ? 'All Tools' : category;
      
      html += `
        <button 
          class="category-btn ${isActive ? 'active' : ''}"
          data-category="${category}"
        >
          ${displayName}
        </button>
      `;
    });
    
    container.innerHTML = html;
    
    // Add click handlers
    container.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const category = e.target.dataset.category;
        this.filterByCategory(category);
      });
    });
  }
  
  /**
   * Render tools grid
   */
  renderTools() {
    const container = document.getElementById('tools-grid');
    if (!container) return;
    
    if (this.filteredTools.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <p class="empty-state-message">No tools found</p>
          <p class="empty-state-hint">Try adjusting your search or filter</p>
        </div>
      `;
      return;
    }
    
    let html = '';
    this.filteredTools.forEach(tool => {
      html += this.getToolCardHTML(tool);
    });
    
    container.innerHTML = html;
    
    // Add click handlers
    container.querySelectorAll('.tool-card').forEach(card => {
      card.addEventListener('click', () => {
        const toolId = card.dataset.toolId;
        this.launchTool(toolId);
      });
      
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const toolId = card.dataset.toolId;
          this.launchTool(toolId);
        }
      });
    });
  }
  
  /**
   * Get tool card HTML
   */
  getToolCardHTML(tool) {
    const badgeHTML = tool.badge ? `<span class="tool-badge badge-${tool.badge}">${tool.badge}</span>` : '';
    
    return `
      <div 
        class="tool-card" 
        data-tool-id="${tool.id}"
        role="button"
        tabindex="0"
        aria-label="Launch ${tool.name}"
      >
        <span class="tool-category">${tool.category}</span>
        <span class="tool-icon">${tool.icon}</span>
        <h3 class="tool-name">
          ${tool.name}
          ${badgeHTML}
        </h3>
        <p class="tool-description">${tool.description}</p>
        <button class="tool-launch-btn">
          Launch Tool →
        </button>
      </div>
    `;
  }
  
  /**
   * Render recently used tools
   */
  renderRecentlyUsed() {
    if (this.recentlyUsed.length === 0) {
      const section = document.getElementById('recently-used-section');
      if (section) section.style.display = 'none';
      return;
    }
    
    const section = document.getElementById('recently-used-section');
    const container = document.getElementById('recent-tools-container');
    
    if (!section || !container) return;
    
    section.style.display = 'block';
    
    let html = '';
    this.recentlyUsed.forEach(toolId => {
      const tool = this.tools.find(t => t.id === toolId);
      if (!tool) return;
      
      html += `
        <div 
          class="recent-tool-card" 
          data-tool-id="${tool.id}"
          role="button"
          tabindex="0"
        >
          <span class="tool-icon">${tool.icon}</span>
          <h4 style="font-size: 1.1rem; margin: 0.5rem 0;">${tool.name}</h4>
          <p style="font-size: 0.9rem; color: var(--text-secondary);">${tool.category}</p>
        </div>
      `;
    });
    
    container.innerHTML = html;
    
    // Add click handlers
    container.querySelectorAll('.recent-tool-card').forEach(card => {
      card.addEventListener('click', () => {
        const toolId = card.dataset.toolId;
        this.launchTool(toolId);
      });
    });
  }
  
  /**
   * Handle search input
   */
  handleSearch(query) {
    this.searchQuery = query.toLowerCase().trim();
    this.applyFilters();
  }
  
  /**
   * Filter tools by category
   */
  filterByCategory(category) {
    this.currentCategory = category;
    this.applyFilters();
    this.renderCategories();
  }
  
  /**
   * Apply search and category filters
   */
  applyFilters() {
    this.filteredTools = this.tools.filter(tool => {
      // Category filter
      const categoryMatch = this.currentCategory === 'all' || tool.category === this.currentCategory;
      
      // Search filter
      const searchMatch = !this.searchQuery || 
        tool.name.toLowerCase().includes(this.searchQuery) ||
        tool.description.toLowerCase().includes(this.searchQuery) ||
        tool.keywords.some(keyword => keyword.includes(this.searchQuery));
      
      return categoryMatch && searchMatch;
    });
    
    this.renderTools();
  }
  
  /**
   * Launch a tool
   */
  launchTool(toolId) {
    const tool = this.tools.find(t => t.id === toolId);
    if (!tool) return;
    
    // Track usage
    this.trackToolUsage(toolId);
    
    // Navigate to tool
    window.location.hash = tool.route;
  }
  
  /**
   * Track tool usage in recently used
   */
  trackToolUsage(toolId) {
    // Remove if already exists
    this.recentlyUsed = this.recentlyUsed.filter(id => id !== toolId);
    
    // Add to beginning
    this.recentlyUsed.unshift(toolId);
    
    // Keep only last 5
    this.recentlyUsed = this.recentlyUsed.slice(0, 5);
    
    // Save to localStorage
    localStorage.setItem('recently-used-tools', JSON.stringify(this.recentlyUsed));
  }
  
  /**
   * Load recently used tools from localStorage
   */
  loadRecentlyUsed() {
    try {
      const saved = localStorage.getItem('recently-used-tools');
      if (saved) {
        this.recentlyUsed = JSON.parse(saved);
      }
    } catch (err) {
      console.error('Failed to load recently used tools:', err);
      this.recentlyUsed = [];
    }
  }
}

/**
 * Initialize and render home page
 */
export function showHomePage() {
  // Load home page CSS if not already loaded
  const cssLink = document.querySelector('link[href="/home/home.css"]');
  if (!cssLink) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/home/home.css';
    document.head.appendChild(link);
  }
  
  // Create and render home page
  new HomePage();
}

// Export HomePage class for external use
// Note: TOOLS already exported at top of file (line 11)
export { HomePage };
