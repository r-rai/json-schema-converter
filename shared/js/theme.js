/**
 * Theme Management Module
 * Handles dark/light theme switching and persistence
 * 
 * @file shared/js/theme.js
 */

import { storage } from './storage.js';

/**
 * Theme Manager
 * Manages theme state and provides toggle functionality
 */
export const ThemeManager = {
  STORAGE_KEY: 'devtoolbox_theme',
  THEMES: {
    DARK: 'dark',
    LIGHT: 'light'
  },
  
  /**
   * Initialize theme system
   * Loads saved theme preference or defaults to dark
   */
  init() {
    const savedTheme = storage.get(this.STORAGE_KEY, this.THEMES.DARK);
    this.setTheme(savedTheme, false);
    
    // Add theme toggle event listener if button exists
    this.attachToggleListener();
  },
  
  /**
   * Attach event listener to theme toggle button
   * Can be called multiple times (e.g., when new page content is loaded)
   */
  attachToggleListener() {
    const toggleButton = document.querySelector('[data-theme-toggle]');
    if (toggleButton) {
      // Remove old listener if exists to prevent duplicates
      toggleButton.replaceWith(toggleButton.cloneNode(true));
      const newToggleButton = document.querySelector('[data-theme-toggle]');
      newToggleButton.addEventListener('click', () => this.toggle());
      
      // Update button icon to match current theme
      this.updateToggleButton(this.getCurrentTheme());
    }
  },
  
  /**
   * Set theme
   * @param {string} theme - Theme name ('dark' or 'light')
   * @param {boolean} save - Whether to save preference to localStorage
   */
  setTheme(theme, save = true) {
    // Validate theme
    if (theme !== this.THEMES.DARK && theme !== this.THEMES.LIGHT) {
      console.warn(`Invalid theme: ${theme}, defaulting to dark`);
      theme = this.THEMES.DARK;
    }
    
    // Apply theme to DOM
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update toggle button icon if it exists
    this.updateToggleButton(theme);
    
    // Save preference
    if (save) {
      storage.set(this.STORAGE_KEY, theme);
    }
    
    // Dispatch custom event for other components to react
    window.dispatchEvent(new CustomEvent('themechange', { 
      detail: { theme } 
    }));
  },
  
  /**
   * Toggle between dark and light themes
   */
  toggle() {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === this.THEMES.DARK 
      ? this.THEMES.LIGHT 
      : this.THEMES.DARK;
    
    this.setTheme(newTheme);
  },
  
  /**
   * Get current active theme
   * @returns {string} Current theme ('dark' or 'light')
   */
  getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || this.THEMES.DARK;
  },
  
  /**
   * Check if current theme is dark
   * @returns {boolean} True if dark theme is active
   */
  isDark() {
    return this.getCurrentTheme() === this.THEMES.DARK;
  },
  
  /**
   * Check if current theme is light
   * @returns {boolean} True if light theme is active
   */
  isLight() {
    return this.getCurrentTheme() === this.THEMES.LIGHT;
  },
  
  /**
   * Update theme toggle button icon/text
   * @param {string} theme - Current theme
   */
  updateToggleButton(theme) {
    const toggleButton = document.querySelector('[data-theme-toggle]');
    if (!toggleButton) return;
    
    // Update button text/icon based on theme
    if (theme === this.THEMES.DARK) {
      toggleButton.innerHTML = '☀️'; // Sun icon for switching to light
      toggleButton.setAttribute('aria-label', 'Switch to light theme');
      toggleButton.title = 'Switch to light theme';
    } else {
      toggleButton.innerHTML = '🌙'; // Moon icon for switching to dark
      toggleButton.setAttribute('aria-label', 'Switch to dark theme');
      toggleButton.title = 'Switch to dark theme';
    }
  },
  
  /**
   * Detect system theme preference
   * @returns {string} System preferred theme
   */
  getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return this.THEMES.DARK;
    }
    return this.THEMES.LIGHT;
  },
  
  /**
   * Use system theme preference
   * Sets theme based on user's OS/browser preference
   */
  useSystemTheme() {
    const systemTheme = this.getSystemTheme();
    this.setTheme(systemTheme);
    
    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (e) => {
          const newTheme = e.matches ? this.THEMES.DARK : this.THEMES.LIGHT;
          this.setTheme(newTheme);
        });
    }
  },
  
  /**
   * Reset theme to default (dark)
   */
  reset() {
    this.setTheme(this.THEMES.DARK);
  }
};

/**
 * Create theme toggle button element
 * @returns {HTMLButtonElement} Theme toggle button
 */
export function createThemeToggle() {
  const button = document.createElement('button');
  button.className = 'btn btn-ghost';
  button.setAttribute('data-theme-toggle', '');
  button.setAttribute('aria-label', 'Toggle theme');
  
  // Set initial icon based on current theme
  const currentTheme = ThemeManager.getCurrentTheme();
  button.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
  
  // Add click handler
  button.addEventListener('click', () => ThemeManager.toggle());
  
  return button;
}

// Auto-initialize theme when module loads
// Only if document is already loaded, otherwise wait for DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
} else {
  ThemeManager.init();
}
