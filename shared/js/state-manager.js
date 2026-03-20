/**
 * State Manager
 * Unified state management with localStorage persistence
 * 
 * @file shared/js/state-manager.js
 * Sprint 2 - Day 5 - State Management
 * Created: March 20, 2026
 */

/**
 * StateManager - Centralized state management with persistence
 * 
 * Features:
 * - localStorage persistence
 * - Reactive subscriptions
 * - Namespace isolation
 * - Type-safe get/set
 * - Error handling
 * 
 * Usage:
 *   import { appState } from '/shared/js/state-manager.js';
 *   
 *   // Set value
 *   appState.set('theme', 'dark');
 *   
 *   // Get value
 *   const theme = appState.get('theme', 'light');
 *   
 *   // Subscribe to changes
 *   appState.subscribe('theme', (newTheme) => {
 *     document.body.dataset.theme = newTheme;
 *   });
 */
export class StateManager {
  /**
   * Create new state manager
   * @param {string} namespace - Namespace for localStorage keys
   */
  constructor(namespace = 'devtoolbox') {
    this.namespace = namespace;
    this.subscribers = new Map();
    this.cache = new Map();
    
    // Initialize from localStorage
    this.hydrate();
  }

  /**
   * Hydrate cache from localStorage
   * @private
   */
  hydrate() {
    try {
      const keys = this.keys();
      keys.forEach(key => {
        const value = this.get(key);
        this.cache.set(key, value);
      });
    } catch (error) {
      console.warn('[StateManager] Hydration failed:', error);
    }
  }

  /**
   * Get value from state
   * @param {string} key - State key
   * @param {*} defaultValue - Default value if key not found
   * @returns {*} - Stored value or default
   */
  get(key, defaultValue = null) {
    // Check cache first
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    // Try localStorage
    try {
      const storageKey = this._getStorageKey(key);
      const item = localStorage.getItem(storageKey);
      
      if (item !== null) {
        const parsed = JSON.parse(item);
        this.cache.set(key, parsed);
        return parsed;
      }
    } catch (error) {
      console.warn(`[StateManager] Failed to get ${key}:`, error);
    }

    return defaultValue;
  }

  /**
   * Set value in state
   * @param {string} key - State key
   * @param {*} value - Value to store
   * @returns {boolean} - Success status
   */
  set(key, value) {
    try {
      // Update localStorage
      const storageKey = this._getStorageKey(key);
      localStorage.setItem(storageKey, JSON.stringify(value));

      // Update cache
      const oldValue = this.cache.get(key);
      this.cache.set(key, value);

      // Notify subscribers
      this.notify(key, value, oldValue);

      return true;
    } catch (error) {
      console.error(`[StateManager] Failed to set ${key}:`, error);
      
      // Handle quota exceeded error
      if (error.name === 'QuotaExceededError') {
        console.error('[StateManager] localStorage quota exceeded');
        this._handleQuotaExceeded();
      }
      
      return false;
    }
  }

  /**
   * Subscribe to value changes
   * @param {string} key - State key to watch
   * @param {Function} callback - Callback function (newValue, oldValue, key)
   * @returns {Function} - Unsubscribe function
   */
  subscribe(key, callback) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, []);
    }

    this.subscribers.get(key).push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(key);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  /**
   * Subscribe to multiple keys
   * @param {string[]} keys - Array of keys to watch
   * @param {Function} callback - Callback function
   * @returns {Function} - Unsubscribe function
   */
  subscribeMany(keys, callback) {
    const unsubscribes = keys.map(key => this.subscribe(key, callback));
    
    // Return function that unsubscribes from all
    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }

  /**
   * Notify subscribers of change
   * @param {string} key - State key that changed
   * @param {*} newValue - New value
   * @param {*} oldValue - Previous value
   * @private
   */
  notify(key, newValue, oldValue) {
    if (this.subscribers.has(key)) {
      this.subscribers.get(key).forEach(callback => {
        try {
          callback(newValue, oldValue, key);
        } catch (error) {
          console.error(`[StateManager] Subscriber error for ${key}:`, error);
        }
      });
    }
  }

  /**
   * Check if key exists
   * @param {string} key - State key
   * @returns {boolean} - True if key exists
   */
  has(key) {
    if (this.cache.has(key)) {
      return true;
    }
    
    const storageKey = this._getStorageKey(key);
    return localStorage.getItem(storageKey) !== null;
  }

  /**
   * Clear specific key
   * @param {string} key - State key to clear
   * @returns {boolean} - Success status
   */
  clear(key) {
    try {
      const storageKey = this._getStorageKey(key);
      const oldValue = this.cache.get(key);
      
      localStorage.removeItem(storageKey);
      this.cache.delete(key);
      
      this.notify(key, null, oldValue);
      return true;
    } catch (error) {
      console.error(`[StateManager] Failed to clear ${key}:`, error);
      return false;
    }
  }

  /**
   * Clear all state for this namespace
   * @returns {boolean} - Success status
   */
  clearAll() {
    try {
      // Get all keys and notify subscribers
      const keys = Array.from(this.cache.keys());
      keys.forEach(key => {
        const oldValue = this.cache.get(key);
        this.notify(key, null, oldValue);
      });

      // Clear localStorage
      Object.keys(localStorage)
        .filter(key => key.startsWith(`${this.namespace}:`))
        .forEach(key => localStorage.removeItem(key));

      // Clear cache
      this.cache.clear();
      
      return true;
    } catch (error) {
      console.error('[StateManager] Failed to clear all:', error);
      return false;
    }
  }

  /**
   * Get all keys in namespace
   * @returns {string[]} - Array of keys
   */
  keys() {
    return Object.keys(localStorage)
      .filter(key => key.startsWith(`${this.namespace}:`))
      .map(key => key.substring(this.namespace.length + 1));
  }

  /**
   * Get all values as object
   * @returns {Object} - Object with all key-value pairs
   */
  getAll() {
    const result = {};
    this.keys().forEach(key => {
      result[key] = this.get(key);
    });
    return result;
  }

  /**
   * Set multiple values at once
   * @param {Object} values - Object with key-value pairs
   * @returns {boolean} - Success status
   */
  setMany(values) {
    try {
      Object.entries(values).forEach(([key, value]) => {
        this.set(key, value);
      });
      return true;
    } catch (error) {
      console.error('[StateManager] Failed to set many:', error);
      return false;
    }
  }

  /**
   * Clear expired items (if TTL is set)
   * @param {number} maxAge - Maximum age in milliseconds
   */
  clearExpired(maxAge = 7 * 24 * 60 * 60 * 1000) {
    const now = Date.now();
    
    this.keys().forEach(key => {
      const value = this.get(key);
      
      if (value && typeof value === 'object' && value._timestamp) {
        if (now - value._timestamp > maxAge) {
          this.clear(key);
        }
      }
    });
  }

  /**
   * Export state as JSON
   * @returns {string} - JSON string of all state
   */
  export() {
    return JSON.stringify(this.getAll(), null, 2);
  }

  /**
   * Import state from JSON
   * @param {string} json - JSON string
   * @returns {boolean} - Success status
   */
  import(json) {
    try {
      const data = JSON.parse(json);
      this.setMany(data);
      return true;
    } catch (error) {
      console.error('[StateManager] Import failed:', error);
      return false;
    }
  }

  /**
   * Get storage statistics
   * @returns {Object} - Storage stats
   */
  getStats() {
    const keys = this.keys();
    let totalSize = 0;
    
    keys.forEach(key => {
      const storageKey = this._getStorageKey(key);
      const item = localStorage.getItem(storageKey);
      if (item) {
        totalSize += item.length * 2; // 2 bytes per character
      }
    });

    return {
      keyCount: keys.length,
      totalSize: totalSize,
      totalSizeKB: (totalSize / 1024).toFixed(2),
      subscriberCount: Array.from(this.subscribers.values())
        .reduce((sum, arr) => sum + arr.length, 0)
    };
  }

  /**
   * Get namespaced storage key
   * @param {string} key - Raw key
   * @returns {string} - Namespaced key
   * @private
   */
  _getStorageKey(key) {
    return `${this.namespace}:${key}`;
  }

  /**
   * Handle quota exceeded error
   * @private
   */
  _handleQuotaExceeded() {
    console.warn('[StateManager] Clearing expired items due to quota exceeded');
    this.clearExpired();
  }

  /**
   * Debug: Log all state
   */
  debug() {
    console.group(`[StateManager] ${this.namespace}`);
    console.log('Cache:', this.cache);
    console.log('Keys:', this.keys());
    console.log('Stats:', this.getStats());
    console.log('All values:', this.getAll());
    console.groupEnd();
  }
}

/**
 * Create singleton instance for app-wide state
 */
export const appState = new StateManager('devtoolbox');

/**
 * Create scoped state manager for specific feature
 * @param {string} scope - Scope name
 * @returns {StateManager} - Scoped state manager
 */
export function createScopedState(scope) {
  return new StateManager(`devtoolbox:${scope}`);
}

/**
 * Migrate from old localStorage keys to state manager
 * @param {Object} keyMap - Map of old keys to new keys
 * @param {StateManager} stateManager - State manager instance
 */
export function migrateLocalStorage(keyMap, stateManager = appState) {
  Object.entries(keyMap).forEach(([oldKey, newKey]) => {
    const oldValue = localStorage.getItem(oldKey);
    if (oldValue !== null) {
      try {
        const parsed = JSON.parse(oldValue);
        stateManager.set(newKey, parsed);
        localStorage.removeItem(oldKey);
        console.log(`[StateManager] Migrated ${oldKey} → ${newKey}`);
      } catch (error) {
        // Value wasn't JSON, store as-is
        stateManager.set(newKey, oldValue);
        localStorage.removeItem(oldKey);
        console.log(`[StateManager] Migrated ${oldKey} → ${newKey} (raw value)`);
      }
    }
  });
}

// Export class for custom instances
export { StateManager };

// Export default
export default appState;
