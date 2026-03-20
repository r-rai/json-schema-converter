/**
 * Secure Storage Module
 * Encrypted wrapper for localStorage using AES-GCM encryption
 * Sprint 3: Security Hardening - Data Encryption
 */

import { crypto } from './crypto.js';

/**
 * SecureStorage class - encrypts data before storing in localStorage
 * Provides transparent encryption/decryption for sensitive user data
 */
export class SecureStorage {
  constructor(namespace = 'devtoolbox') {
    this.namespace = namespace;
    this.encryptionKey = null;
    this.initialized = false;
    this.sessionIdKey = 'session-id';
  }
  
  /**
   * Initialize encryption key from session
   * Must be called before setSecure() or getSecure()
   * @returns {Promise<void>}
   * 
   * @example
   * await secureStorage.initialize();
   */
  async initialize() {
    if (this.initialized) {
      console.debug('[SecureStorage] Already initialized');
      return;
    }
    
    // Check if Web Crypto is available
    if (!crypto.isAvailable()) {
      console.error('[SecureStorage] Web Crypto API not available');
      throw new Error('Encryption not available in this browser');
    }
    
    try {
      // Get or create session ID
      let sessionId = sessionStorage.getItem(this.sessionIdKey);
      
      if (!sessionId) {
        // Generate new session ID
        sessionId = this.generateSessionId();
        sessionStorage.setItem(this.sessionIdKey, sessionId);
        console.debug('[SecureStorage] New session created');
      } else {
        console.debug('[SecureStorage] Existing session found');
      }
      
      // Derive encryption key from session ID
      this.encryptionKey = await crypto.deriveKey(sessionId);
      this.initialized = true;
      
      console.info('[SecureStorage] Initialized successfully');
      
    } catch (error) {
      console.error('[SecureStorage] Initialization failed:', error);
      throw new Error(`SecureStorage initialization failed: ${error.message}`);
    }
  }
  
  /**
   * Generate unique session ID
   * @returns {string} Random session ID (64 hex chars)
   */
  generateSessionId() {
    return crypto.generateSessionId();
  }
  
  /**
   * Store encrypted data in localStorage
   * Automatically initializes if not already initialized
   * @param {string} key - Storage key (will be prefixed with namespace)
   * @param {any} value - Value to encrypt and store (will be JSON stringified)
   * @returns {Promise<void>}
   * @throws {Error} If encryption or storage fails
   * 
   * @example
   * await secureStorage.setSecure('sip-calculation', { amount: 5000, rate: 12 });
   */
  async setSecure(key, value) {
    // Auto-initialize if needed
    if (!this.initialized) {
      await this.initialize();
    }
    
    if (!key || typeof key !== 'string') {
      throw new Error('Storage key must be a non-empty string');
    }
    
    try {
      // Serialize value to JSON
      const jsonString = JSON.stringify(value);
      
      // Encrypt data
      const startTime = performance.now();
      const encrypted = await crypto.encrypt(jsonString, this.encryptionKey);
      const duration = performance.now() - startTime;
      
      // Log performance warning if encryption is slow
      if (duration > 50) {
        console.warn(`[SecureStorage] Encryption took ${duration.toFixed(2)}ms (expected <50ms)`);
      }
      
      // Store in localStorage with namespace
      const storageKey = this.getStorageKey(key);
      localStorage.setItem(storageKey, encrypted);
      
      console.debug(`[SecureStorage] Stored encrypted data for key: ${key}`);
      
    } catch (error) {
      console.error('[SecureStorage] Failed to store secure data:', error);
      
      // Check for quota exceeded
      if (error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Please clear some data.');
      }
      
      throw new Error(`Failed to store secure data: ${error.message}`);
    }
  }
  
  /**
   * Retrieve and decrypt data from localStorage
   * Automatically initializes if not already initialized
   * @param {string} key - Storage key (namespace will be added)
   * @param {any} defaultValue - Default value if key not found or decryption fails
   * @returns {Promise<any>} Decrypted value or default value
   * 
   * @example
   * const calculation = await secureStorage.getSecure('sip-calculation', null);
   * if (calculation) {
   *   console.log('Restored:', calculation);
   * }
   */
  async getSecure(key, defaultValue = null) {
    // Auto-initialize if needed
    if (!this.initialized) {
      try {
        await this.initialize();
      } catch (error) {
        console.error('[SecureStorage] Failed to initialize:', error);
        return defaultValue;
      }
    }
    
    if (!key || typeof key !== 'string') {
      console.error('[SecureStorage] Invalid storage key');
      return defaultValue;
    }
    
    try {
      // Get encrypted data from localStorage
      const storageKey = this.getStorageKey(key);
      const encrypted = localStorage.getItem(storageKey);
      
      if (!encrypted) {
        console.debug(`[SecureStorage] No data found for key: ${key}`);
        return defaultValue;
      }
      
      // Decrypt data
      const startTime = performance.now();
      const decrypted = await crypto.decrypt(encrypted, this.encryptionKey);
      const duration = performance.now() - startTime;
      
      // Log performance warning
      if (duration > 50) {
        console.warn(`[SecureStorage] Decryption took ${duration.toFixed(2)}ms (expected <50ms)`);
      }
      
      // Parse JSON
      const value = JSON.parse(decrypted);
      
      console.debug(`[SecureStorage] Retrieved encrypted data for key: ${key}`);
      return value;
      
    } catch (error) {
      console.error(`[SecureStorage] Failed to retrieve secure data for key '${key}':`, error);
      
      // Return default value instead of throwing
      // This handles corrupted data gracefully
      return defaultValue;
    }
  }
  
  /**
   * Remove encrypted data from localStorage
   * @param {string} key - Storage key
   * @returns {void}
   * 
   * @example
   * secureStorage.removeSecure('old-calculation');
   */
  removeSecure(key) {
    if (!key || typeof key !== 'string') {
      console.error('[SecureStorage] Invalid storage key');
      return;
    }
    
    const storageKey = this.getStorageKey(key);
    localStorage.removeItem(storageKey);
    console.debug(`[SecureStorage] Removed data for key: ${key}`);
  }
  
  /**
   * Check if encrypted data exists for key
   * @param {string} key - Storage key
   * @returns {boolean} True if data exists
   * 
   * @example
   * if (secureStorage.hasSecure('sip-calculation')) {
   *   // Restore calculation
   * }
   */
  hasSecure(key) {
    if (!key || typeof key !== 'string') {
      return false;
    }
    
    const storageKey = this.getStorageKey(key);
    return localStorage.getItem(storageKey) !== null;
  }
  
  /**
   * Clear all encrypted data for this namespace
   * @returns {void}
   * 
   * @example
   * secureStorage.clearAll(); // Clear all encrypted data
   */
  clearAll() {
    const prefix = `${this.namespace}:secure:`;
    const keysToRemove = [];
    
    // Find all keys with our prefix
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }
    
    // Remove all found keys
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.info(`[SecureStorage] Cleared ${keysToRemove.length} encrypted items`);
  }
  
  /**
   * Get storage size statistics
   * @returns {{ count: number, estimatedBytes: number }}
   * 
   * @example
   * const stats = secureStorage.getStats();
   * console.log(`Stored ${stats.count} items, ~${stats.estimatedBytes} bytes`);
   */
  getStats() {
    const prefix = `${this.namespace}:secure:`;
    let count = 0;
    let estimatedBytes = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        count++;
        const value = localStorage.getItem(key);
        if (value) {
          // Rough estimate: 2 bytes per character in UTF-16
          estimatedBytes += (key.length + value.length) * 2;
        }
      }
    }
    
    return { count, estimatedBytes };
  }
  
  /**
   * Migrate data from regular storage to encrypted storage
   * @param {string} oldKey - Key in regular localStorage
   * @param {string} newKey - Key for secure storage
   * @returns {Promise<boolean>} True if migration successful
   * 
   * @example
   * // Migrate old unencrypted data
   * await secureStorage.migrateFromStorage('devtoolbox:sip-results', 'sip-results');
   */
  async migrateFromStorage(oldKey, newKey) {
    try {
      // Get old unencrypted data
      const oldData = localStorage.getItem(oldKey);
      
      if (!oldData) {
        console.debug(`[SecureStorage] No data to migrate from key: ${oldKey}`);
        return false;
      }
      
      // Parse and re-store encrypted
      const value = JSON.parse(oldData);
      await this.setSecure(newKey, value);
      
      // Remove old unencrypted data
      localStorage.removeItem(oldKey);
      
      console.info(`[SecureStorage] Migrated data from '${oldKey}' to secure '${newKey}'`);
      return true;
      
    } catch (error) {
      console.error(`[SecureStorage] Migration failed:`, error);
      return false;
    }
  }
  
  // ============================================================
  // PRIVATE METHODS
  // ============================================================
  
  /**
   * Get full storage key with namespace
   * @private
   */
  getStorageKey(key) {
    return `${this.namespace}:secure:${key}`;
  }
}

// Export singleton instance for convenience
export const secureStorage = new SecureStorage('devtoolbox');

// Auto-initialize on first import (optional)
if (typeof window !== 'undefined') {
  window.SecureStorage = secureStorage;
  console.debug('[SecureStorage] Module loaded');
  
  // Try to initialize (non-blocking)
  secureStorage.initialize().catch(error => {
    console.warn('[SecureStorage] Auto-initialization failed:', error.message);
  });
}
