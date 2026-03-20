/**
 * Application Entry Point
 * Main application initialization and routing setup
 * 
 * @file shared/js/app.js
 */

console.log('[APP] Loading app.js module...');

import { router, lazyLoadTool } from './router.js';
console.log('[APP] router imported');
import { ThemeManager } from './theme.js';
console.log('[APP] ThemeManager imported');
import { storage, trackToolUsage } from './storage.js';
console.log('[APP] storage imported');
import { showErrorToast } from './utils.js';
console.log('[APP] utils imported');
import { showHomePage } from '../../home/home.js';
console.log('[APP] showHomePage imported');

/**
 * Application Configuration
 */
const APP_CONFIG = {
  name: 'DevToolbox',
  version: '1.0.0',
  tools: [
    {
      name: 'JSON Schema',
      route: '/json-schema',
      description: 'Validate, beautify, and minify JSON data',
      icon: '📋'
    },
    {
      name: 'SIP Calculator',
      route: '/sip-calculator',
      description: 'Calculate SIP returns and investment growth',
      icon: '💰'
    },
    {
      name: 'HTML ↔ Markdown',
      route: '/html-markdown',
      description: 'Convert between HTML and Markdown',
      icon: '🔄'
    },
    {
      name: 'Text Diff Checker',
      route: '/text-diff',
      description: 'Compare and visualize text differences',
      icon: '🔍'
    },
    {
      name: 'EMI Calculator',
      route: '/emi-calculator',
      description: 'Calculate EMI, prepayment, and amortization',
      icon: '🏠'
    }
  ]
};

/**
 * Initialize the application
 */
function initializeApp() {
  console.log(`${APP_CONFIG.name} v${APP_CONFIG.version} - Initializing...`);
  
  // Initialize theme system
  ThemeManager.init();
  
  // Export ThemeManager to window for router access
  window.ThemeManager = ThemeManager;
  
  // Setup routing
  setupRoutes();
  
  // Setup error handlers
  setupErrorHandlers();
  
  // Log initialization complete
  console.log('Application initialized successfully');
}

/**
 * Setup application routes
 */
function setupRoutes() {
  // Home route
  router.register('/', showHomePage);
  
  // Tool routes - lazy load on navigation
  router.register('/json-schema', () => {
    loadTool('json-schema');
  });
  
  router.register('/sip-calculator', () => {
    loadTool('sip-calculator');
  });
  
  router.register('/html-markdown', () => {
    loadTool('html-markdown');
  });
  
  router.register('/text-diff', () => {
    loadTool('text-diff');
  });
  
  router.register('/emi-calculator', () => {
    loadTool('emi-calculator');
  });
  
  // 404 handler
  router.setNotFoundHandler((route) => {
    console.warn(`Route not found: ${route}`);
    showErrorToast(`Page not found: ${route}`);
    router.navigate('/');
  });
  
  // Initialize router after all routes are registered
  router.init();
}

/**
 * Load a tool with lazy loading and usage tracking
 * @param {string} toolName - Name of tool to load
 */
async function loadTool(toolName) {
  try {
    // Show loading indicator
    showLoadingIndicator();
    
    // Track tool usage
    trackToolUsage(toolName);
    
    // Lazy load tool
    await lazyLoadTool(toolName);
    
    // Hide loading indicator
    hideLoadingIndicator();
    
  } catch (error) {
    console.error(`Failed to load tool '${toolName}':`, error);
    hideLoadingIndicator();
    showErrorToast(`Failed to load ${toolName}. Please try again.`);
    
    // Navigate back to home on error
    router.navigate('/');
  }
}

/**
 * Show home page with tool selector
 * Now delegated to dedicated home page module
 */
// Function is imported from home/home.js

/**
 * Show loading indicator
 */
function showLoadingIndicator() {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;
  
  // Create loading overlay
  const loading = document.createElement('div');
  loading.id = 'loading-indicator';
  loading.className = 'loading-container';
  loading.style.position = 'fixed';
  loading.style.top = '0';
  loading.style.left = '0';
  loading.style.right = '0';
  loading.style.bottom = '0';
  loading.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  loading.style.display = 'flex';
  loading.style.alignItems = 'center';
  loading.style.justifyContent = 'center';
  loading.style.zIndex = 'var(--z-modal)';
  
  loading.innerHTML = `
    <div style="text-align: center;">
      <div class="spinner"></div>
      <p style="color: white; margin-top: var(--spacing-md);">Loading...</p>
    </div>
  `;
  
  document.body.appendChild(loading);
}

/**
 * Hide loading indicator
 */
function hideLoadingIndicator() {
  const loading = document.getElementById('loading-indicator');
  if (loading) {
    loading.remove();
  }
}

/**
 * Setup global error handlers
 */
function setupErrorHandlers() {
  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    console.error('Uncaught error:', event.error);
    showErrorToast('An unexpected error occurred');
  });
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showErrorToast('An unexpected error occurred');
  });
}

/**
 * Get application configuration
 * @returns {Object} App configuration
 */
export function getAppConfig() {
  return APP_CONFIG;
}

/**
 * Get list of available tools
 * @returns {Array} Array of tool configurations
 */
export function getTools() {
  return APP_CONFIG.tools;
}

// Initialize application when DOM is ready
// ES6 modules are deferred by default, so DOM is usually already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // DOM already loaded - initialize immediately
  initializeApp();
}

// Export for use in other modules
export { router, ThemeManager, storage };
