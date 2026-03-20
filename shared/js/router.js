/**
 * Router Module
 * Client-side hash-based routing for tool navigation
 * Enables navigation without server requests
 * 
 * @file shared/js/router.js
 */

/**
 * Router class for managing client-side navigation
 * Uses hash-based routing (#/path) for compatibility with static hosting
 */
export class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.notFoundHandler = null;
    
    // Listen to hash changes for navigation
    window.addEventListener('hashchange', () => this.handleRoute());
    
    // NOTE: Initial route handled explicitly via init() - called after routes registered
  }
  
  /**
   * Initialize router and handle initial route
   * Must be called AFTER all routes are registered
   */
  init() {
    this.handleRoute();
  }
  
  /**
   * Register a route with its handler function
   * @param {string} path - Route path (e.g., '/json-schema')
   * @param {Function} handler - Function to execute when route is accessed
   */
  register(path, handler) {
    if (typeof handler !== 'function') {
      throw new Error(`Handler for route '${path}' must be a function`);
    }
    this.routes.set(path, handler);
    return this;
  }
  
  /**
   * Register multiple routes at once
   * @param {Object} routes - Object with path: handler pairs
   */
  registerRoutes(routes) {
    Object.entries(routes).forEach(([path, handler]) => {
      this.register(path, handler);
    });
    return this;
  }
  
  /**
   * Set handler for 404 (route not found)
   * @param {Function} handler - Function to execute when route not found
   */
  setNotFoundHandler(handler) {
    this.notFoundHandler = handler;
    return this;
  }
  
  /**
   * Handle route changes
   * Called on hash change and initial load
   */
  handleRoute() {
    // Get current hash, remove # and query strings
    const hash = window.location.hash.slice(1) || '/';
    const route = hash.split('?')[0];
    const queryString = hash.split('?')[1] || '';
    
    // Parse query parameters
    const params = this.parseQueryParams(queryString);
    
    // Find matching route
    const handler = this.routes.get(route);
    
    if (handler) {
      this.currentRoute = route;
      
      try {
        handler(params);
      } catch (error) {
        console.error(`Error executing route handler for '${route}':`, error);
        this.handleError(error, route);
      }
    } else {
      // Route not found
      if (this.notFoundHandler) {
        this.notFoundHandler(route);
      } else {
        // Default: redirect to home
        console.warn(`Route not found: ${route}, redirecting to home`);
        this.navigate('/');
      }
    }
  }
  
  /**
   * Parse query string into object
   * @param {string} queryString - Query string (without ?)
   * @returns {Object} Parsed parameters
   */
  parseQueryParams(queryString) {
    if (!queryString) return {};
    
    const params = {};
    const pairs = queryString.split('&');
    
    pairs.forEach(pair => {
      const [key, value] = pair.split('=');
      if (key) {
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
      }
    });
    
    return params;
  }
  
  /**
   * Navigate to a route programmatically
   * @param {string} path - Path to navigate to
   * @param {Object} params - Optional query parameters
   */
  navigate(path, params = {}) {
    let url = `#${path}`;
    
    // Add query parameters if provided
    const queryString = this.buildQueryString(params);
    if (queryString) {
      url += `?${queryString}`;
    }
    
    window.location.hash = url;
  }
  
  /**
   * Build query string from object
   * @param {Object} params - Parameters object
   * @returns {string} Query string (without ?)
   */
  buildQueryString(params) {
    return Object.entries(params)
      .map(([key, value]) => 
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join('&');
  }
  
  /**
   * Get current route path
   * @returns {string} Current route
   */
  getCurrentRoute() {
    return this.currentRoute;
  }
  
  /**
   * Check if current route matches given path
   * @param {string} path - Path to check
   * @returns {boolean} True if current route matches
   */
  isCurrentRoute(path) {
    return this.currentRoute === path;
  }
  
  /**
   * Go back in history
   */
  back() {
    window.history.back();
  }
  
  /**
   * Go forward in history
   */
  forward() {
    window.history.forward();
  }
  
  /**
   * Handle route errors
   * @param {Error} error - Error object
   * @param {string} route - Route that caused error
   */
  handleError(error, route) {
    console.error(`Route error in '${route}':`, error);
    
    // Show error message to user
    const errorMessage = `Failed to load route: ${route}. ${error.message}`;
    this.showError(errorMessage);
  }
  
  /**
   * Show error message (basic implementation)
   * Can be overridden by applications
   * @param {string} message - Error message
   */
  showError(message) {
    alert(message);
  }
}

/**
 * Create and export singleton router instance
 */
export const router = new Router();

/**
 * Lazy load tool module
 * Loads tool-specific HTML, CSS, and JS on demand
 * 
 * @param {string} toolName - Name of tool to load
 * @returns {Promise<void>}
 */
export async function lazyLoadTool(toolName) {
  // Track loaded tools to avoid duplicate loading
  if (!window.loadedTools) {
    window.loadedTools = new Set();
  }
  
  try {
    // Check if already loaded
    if (window.loadedTools.has(toolName)) {
      // Tool already loaded, just initialize it
      const initFunctionName = getInitFunctionName(toolName);
      if (typeof window[initFunctionName] === 'function') {
        window[initFunctionName]();
      }
      return;
    }
    
    // CRITICAL: Load HTML first, then CSS, then JS
    // This ensures DOM elements exist before JS tries to access them
    await loadToolHTML(toolName);
    
    // Re-attach theme toggle listener for the new page content
    if (window.ThemeManager && typeof window.ThemeManager.attachToggleListener === 'function') {
      window.ThemeManager.attachToggleListener();
    }
    
    // Load tool-specific CSS
    await loadStylesheet(`/tools/${toolName}/${toolName}.css`);
    
    // Load external libraries if needed (before tool JS)
    await loadToolDependencies(toolName);
    
    // Load tool-specific JavaScript (after HTML is in place)
    await loadScript(`/tools/${toolName}/${toolName}.js`);
    
    // Mark as loaded
    window.loadedTools.add(toolName);
    
    // Initialize tool (the tool's JS file should export window.initToolName)
    const initFunctionName = getInitFunctionName(toolName);
    console.log(`[Router] Looking for init function: ${initFunctionName}`, typeof window[initFunctionName]);
    if (typeof window[initFunctionName] === 'function') {
      console.log(`[Router] Calling ${initFunctionName}()`);
      window[initFunctionName]();
      console.log(`[Router] Finished calling ${initFunctionName}()`);
    } else {
      console.warn(`Init function '${initFunctionName}' not found for tool '${toolName}'`);
    }
    
  } catch (error) {
    console.error(`Failed to load tool: ${toolName}`, error);
    throw new Error(`Failed to load tool: ${toolName}. Please try again.`);
  }
}

/**
 * Load tool HTML into #app container
 * Fetches tool's index.html and injects body content into app
 * 
 * @param {string} toolName - Name of tool
 * @returns {Promise<void>}
 */
async function loadToolHTML(toolName) {
  const appContainer = document.getElementById('app');
  if (!appContainer) {
    throw new Error('App container not found');
  }
  
  try {
    // Fetch tool's HTML file
    const response = await fetch(`/tools/${toolName}/index.html`);
    if (!response.ok) {
      throw new Error(`Failed to fetch HTML: ${response.statusText}`);
    }
    
    const html = await response.text();
    
    // Parse HTML to extract body content
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const bodyContent = doc.body.innerHTML;
    
    // Inject into app container
    appContainer.innerHTML = bodyContent;
    
    console.log(`[Router] Loaded HTML for ${toolName}`);
    
  } catch (error) {
    console.error(`Failed to load HTML for ${toolName}:`, error);
    throw error;
  }
}

/**
 * Get initialization function name for a tool
 * Converts tool-name to initToolName (camelCase)
 * 
 * @param {string} toolName - Tool name (e.g., 'json-schema')
 * @returns {string} Init function name (e.g., 'initJsonSchema')
 */
function getInitFunctionName(toolName) {
  // Convert kebab-case to camelCase: json-schema -> JsonSchema
  const camelCase = toolName
    .split('-')
    .map(word => capitalize(word))
    .join('');
  
  return `init${camelCase}`;
}

/**
 * Load external dependencies for specific tools
 * @param {string} toolName - Tool name
 * @returns {Promise<void>}
 */
async function loadToolDependencies(toolName) {
  const dependencies = {
    'sip-calculator': ['/lib/chart.umd.min.js'],
    'emi-calculator': ['/lib/chart.umd.min.js'],
    'html-markdown': [
      '/lib/turndown.min.js',
      '/lib/marked.min.js',
      '/lib/purify.min.js'
    ],
    'text-diff': ['/lib/diff.min.js']
  };
  
  const toolDeps = dependencies[toolName];
  if (toolDeps && toolDeps.length > 0) {
    // Load libraries as regular scripts (not modules)
    await Promise.all(toolDeps.map(dep => loadLibraryScript(dep)));
  }
}

/**
 * Load third-party library script (non-module)
 * Libraries like Chart.js should be loaded as regular scripts to expose global objects
 * @param {string} src - Script source URL
 * @returns {Promise<void>}
 */
function loadLibraryScript(src) {
  return new Promise((resolve, reject) => {
    // Check if already loaded by looking for script tag that has executed
    // Note: innerHTML-injected scripts don't execute, so check for dynamically added ones
    const existing = Array.from(document.querySelectorAll(`script[src="${src}"]`))
      .find(script => script.parentElement === document.head);
    
    if (existing) {
      console.log(`[Router] Library already loaded: ${src}`);
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = src;
    // DO NOT set type="module" for third-party libraries
    // They need to run as regular scripts to expose global objects like Chart
    script.onload = () => {
      console.log(`[Router] Loaded library: ${src}`);
      // Check for specific global availability
      if (src.includes('chart')) {
        console.log(`[Router] window.Chart available:`, typeof window.Chart !== 'undefined', window.Chart);
      } else if (src.includes('diff')) {
        console.log(`[Router] window.Diff available:`, typeof window.Diff !== 'undefined', window.Diff);
      }
      // Add a small delay to ensure global variables are fully available
      setTimeout(() => resolve(), 100);
    };
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

/**
 * Load JavaScript file dynamically (ES6 module)
 * @param {string} src - Script source URL
 * @returns {Promise<void>}
 */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = src;
    script.type = 'module';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

/**
 * Load CSS file dynamically
 * @param {string} href - Stylesheet URL
 * @returns {Promise<void>}
 */
function loadStylesheet(href) {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    const existing = document.querySelector(`link[href="${href}"]`);
    if (existing) {
      resolve();
      return;
    }
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load stylesheet: ${href}`));
    document.head.appendChild(link);
  });
}

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
