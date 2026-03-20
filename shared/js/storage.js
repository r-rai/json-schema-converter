/**
 * Storage Module
 * Safe wrapper around localStorage with error handling
 * Handles JSON serialization and quota exceeded errors
 * 
 * @file shared/js/storage.js
 */

/**
 * Storage Keys Registry
 * Centralized list of all localStorage keys used in the application
 */
export const STORAGE_KEYS = {
  THEME: 'devtoolbox_theme',
  RECENT_TOOLS: 'devtoolbox_recent_tools',
  PREFERENCES: 'devtoolbox_preferences',
  
  // Tool-specific keys
  JSON_SCHEMA_STATE: 'json_schema_state',
  SIP_CALCULATOR_STATE: 'sip_calculator_state',
  EMI_CALCULATOR_STATE: 'emi_calculator_state',
  HTML_MARKDOWN_STATE: 'html_markdown_state',
  TEXT_DIFF_STATE: 'text_diff_state'
};

/**
 * Storage wrapper with error handling and type safety
 */
export const storage = {
  /**
   * Get value from localStorage
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value if key doesn't exist or error occurs
   * @returns {any} Parsed value or default
   */
  get(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key);
      
      if (value === null) {
        return defaultValue;
      }
      
      // Try to parse as JSON
      try {
        return JSON.parse(value);
      } catch (parseError) {
        // If parsing fails, return raw value
        return value;
      }
    } catch (error) {
      console.error(`localStorage get error for key '${key}':`, error);
      return defaultValue;
    }
  },
  
  /**
   * Set value in localStorage
   * @param {string} key - Storage key
   * @param {any} value - Value to store (will be JSON stringified)
   * @returns {boolean} True if successful, false otherwise
   */
  set(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      // Check if quota exceeded
      if (this.isQuotaExceeded(error)) {
        console.error('localStorage quota exceeded');
        this.handleQuotaExceeded();
      } else {
        console.error(`localStorage set error for key '${key}':`, error);
      }
      return false;
    }
  },
  
  /**
   * Remove value from localStorage
   * @param {string} key - Storage key
   * @returns {boolean} True if successful, false otherwise
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`localStorage remove error for key '${key}':`, error);
      return false;
    }
  },
  
  /**
   * Clear all localStorage data
   * @returns {boolean} True if successful, false otherwise
   */
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('localStorage clear error:', error);
      return false;
    }
  },
  
  /**
   * Check if key exists in localStorage
   * @param {string} key - Storage key
   * @returns {boolean} True if key exists
   */
  has(key) {
    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error(`localStorage has error for key '${key}':`, error);
      return false;
    }
  },
  
  /**
   * Get all keys in localStorage
   * @returns {string[]} Array of all keys
   */
  keys() {
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('localStorage keys error:', error);
      return [];
    }
  },
  
  /**
   * Get storage size estimate in bytes
   * @returns {number} Approximate size in bytes
   */
  getSize() {
    try {
      let size = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          size += localStorage[key].length + key.length;
        }
      }
      return size;
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return 0;
    }
  },
  
  /**
   * Get storage size in human-readable format
   * @returns {string} Size string (e.g., "1.5 MB")
   */
  getSizeFormatted() {
    const bytes = this.getSize();
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  },
  
  /**
   * Check if error is quota exceeded error
   * @param {Error} error - Error object
   * @returns {boolean} True if quota exceeded
   */
  isQuotaExceeded(error) {
    return (
      error instanceof DOMException &&
      (error.code === 22 ||
       error.code === 1014 ||
       error.name === 'QuotaExceededError' ||
       error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
    );
  },
  
  /**
   * Handle quota exceeded error
   * Attempt to free up space by removing old data
   */
  handleQuotaExceeded() {
    console.warn('localStorage quota exceeded, attempting cleanup...');
    
    // Strategy: Remove oldest tool states first (keep core settings)
    const toolStateKeys = [
      STORAGE_KEYS.JSON_SCHEMA_STATE,
      STORAGE_KEYS.HTML_MARKDOWN_STATE,
      STORAGE_KEYS.TEXT_DIFF_STATE,
      STORAGE_KEYS.SIP_CALCULATOR_STATE,
      STORAGE_KEYS.EMI_CALCULATOR_STATE
    ];
    
    // Remove tool states one by one until space is available
    for (const key of toolStateKeys) {
      if (this.has(key)) {
        this.remove(key);
        console.log(`Removed ${key} to free up space`);
        
        // Test if we have space now
        try {
          localStorage.setItem('__test__', '1');
          localStorage.removeItem('__test__');
          console.log('Successfully freed up space');
          return;
        } catch (e) {
          continue;
        }
      }
    }
    
    // If still no space, show warning to user
    alert('Browser storage is full. Some tool states could not be saved.');
  },
  
  /**
   * Export all localStorage data as JSON
   * @returns {Object} All localStorage data
   */
  export() {
    const data = {};
    try {
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          data[key] = this.get(key);
        }
      }
      return data;
    } catch (error) {
      console.error('Error exporting localStorage:', error);
      return {};
    }
  },
  
  /**
   * Import localStorage data from object
   * @param {Object} data - Data to import
   * @param {boolean} clearExisting - Whether to clear existing data first
   * @returns {boolean} True if successful
   */
  import(data, clearExisting = false) {
    try {
      if (clearExisting) {
        this.clear();
      }
      
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          this.set(key, data[key]);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error importing localStorage:', error);
      return false;
    }
  },
  
  /**
   * Check if localStorage is available
   * @returns {boolean} True if localStorage is available
   */
  isAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }
};

/**
 * Track recent tool usage
 * Maintains a list of recently accessed tools for quick access
 * 
 * @param {string} toolName - Name of tool
 * @param {number} maxRecent - Maximum number of recent tools to track
 */
export function trackToolUsage(toolName, maxRecent = 5) {
  try {
    const recentTools = storage.get(STORAGE_KEYS.RECENT_TOOLS, []);
    
    // Remove if already exists (to move to front)
    const index = recentTools.indexOf(toolName);
    if (index > -1) {
      recentTools.splice(index, 1);
    }
    
    // Add to beginning
    recentTools.unshift(toolName);
    
    // Keep only last N tools
    const limited = recentTools.slice(0, maxRecent);
    
    storage.set(STORAGE_KEYS.RECENT_TOOLS, limited);
    
    // Dispatch event for UI updates
    window.dispatchEvent(new CustomEvent('recenttoolsupdate', {
      detail: { recentTools: limited }
    }));
    
  } catch (error) {
    console.error('Error tracking tool usage:', error);
  }
}

/**
 * Get recent tools list
 * @returns {string[]} Array of recent tool names
 */
export function getRecentTools() {
  return storage.get(STORAGE_KEYS.RECENT_TOOLS, []);
}

/**
 * Clear recent tools history
 */
export function clearRecentTools() {
  storage.remove(STORAGE_KEYS.RECENT_TOOLS);
}

// Log storage availability on module load
if (!storage.isAvailable()) {
  console.warn('localStorage is not available. Tool states will not be persisted.');
}
