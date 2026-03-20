/**
 * Web Crypto API Wrapper
 * Provides AES-GCM encryption for sensitive data storage
 * Sprint 3: Security Hardening - Data Encryption
 */

/**
 * Crypto class for encrypting/decrypting sensitive data
 * Uses AES-GCM-256 with PBKDF2 key derivation
 */
export class Crypto {
  constructor() {
    this.algorithm = 'AES-GCM';
    this.keyLength = 256;
    this.ivLength = 12; // 96 bits for GCM
    this.saltString = 'devtoolbox-security-salt-v1'; // Application-specific salt
    this.keyDerivationIterations = 100000; // OWASP recommended minimum
  }
  
  /**
   * Check if Web Crypto API is available
   * @returns {boolean} True if crypto is available
   */
  isAvailable() {
    return !!(window.crypto && window.crypto.subtle);
  }
  
  /**
   * Derive encryption key from session ID using PBKDF2
   * @param {string} sessionId - Unique session identifier
   * @returns {Promise<CryptoKey>} Derived encryption key
   * @throws {Error} If Web Crypto API is not available
   * 
   * @example
   * const sessionId = 'user-session-123';
   * const key = await crypto.deriveKey(sessionId);
   */
  async deriveKey(sessionId) {
    if (!this.isAvailable()) {
      throw new Error('Web Crypto API not available in this browser');
    }
    
    if (!sessionId || typeof sessionId !== 'string') {
      throw new Error('Session ID must be a non-empty string');
    }
    
    try {
      const encoder = new TextEncoder();
      
      // Import session ID as key material
      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(sessionId),
        'PBKDF2',
        false, // not extractable
        ['deriveKey']
      );
      
      // Derive actual encryption key using PBKDF2
      const key = await window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: encoder.encode(this.saltString),
          iterations: this.keyDerivationIterations,
          hash: 'SHA-256'
        },
        keyMaterial,
        {
          name: this.algorithm,
          length: this.keyLength
        },
        false, // not extractable
        ['encrypt', 'decrypt']
      );
      
      console.debug('[Crypto] Key derived successfully');
      return key;
      
    } catch (error) {
      console.error('[Crypto] Key derivation failed:', error);
      throw new Error(`Key derivation failed: ${error.message}`);
    }
  }
  
  /**
   * Encrypt plaintext using AES-GCM
   * @param {string} plaintext - Data to encrypt
   * @param {CryptoKey} key - Encryption key from deriveKey()
   * @returns {Promise<string>} Base64 encoded ciphertext (IV || encrypted data)
   * @throws {Error} If encryption fails
   * 
   * @example
   * const encrypted = await crypto.encrypt('sensitive data', key);
   * // Returns: "SGVsbG8gV29ybGQ..." (Base64)
   */
  async encrypt(plaintext, key) {
    if (!this.isAvailable()) {
      throw new Error('Web Crypto API not available');
    }
    
    if (!plaintext) {
      // Empty string is valid, just return empty encrypted value
      plaintext = '';
    }
    
    if (!key) {
      throw new Error('Encryption key is required');
    }
    
    try {
      const encoder = new TextEncoder();
      
      // Generate random IV (initialization vector)
      const iv = window.crypto.getRandomValues(new Uint8Array(this.ivLength));
      
      // Encrypt data
      const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
          name: this.algorithm,
          iv: iv
        },
        key,
        encoder.encode(plaintext)
      );
      
      // Combine IV + ciphertext for storage
      const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
      combined.set(iv, 0);
      combined.set(new Uint8Array(encryptedBuffer), iv.length);
      
      // Convert to Base64 for text storage
      const base64 = this.arrayBufferToBase64(combined);
      
      console.debug('[Crypto] Encrypted data successfully');
      return base64;
      
    } catch (error) {
      console.error('[Crypto] Encryption failed:', error);
      throw new Error(`Encryption failed: ${error.message}`);
    }
  }
  
  /**
   * Decrypt ciphertext using AES-GCM
   * @param {string} ciphertext - Base64 encoded encrypted data (IV || encrypted data)
   * @param {CryptoKey} key - Decryption key from deriveKey()
   * @returns {Promise<string>} Decrypted plaintext
   * @throws {Error} If decryption fails (wrong key, corrupted data, etc.)
   * 
   * @example
   * const decrypted = await crypto.decrypt(encrypted, key);
   * // Returns: "sensitive data"
   */
  async decrypt(ciphertext, key) {
    if (!this.isAvailable()) {
      throw new Error('Web Crypto API not available');
    }
    
    if (!ciphertext) {
      throw new Error('Ciphertext is required');
    }
    
    if (!key) {
      throw new Error('Decryption key is required');
    }
    
    try {
      // Decode from Base64
      const combined = this.base64ToArrayBuffer(ciphertext);
      
      // Extract IV (first 12 bytes) and encrypted data (rest)
      const iv = combined.slice(0, this.ivLength);
      const encryptedData = combined.slice(this.ivLength);
      
      // Decrypt data
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: this.algorithm,
          iv: iv
        },
        key,
        encryptedData
      );
      
      // Convert back to string
      const decoder = new TextDecoder();
      const plaintext = decoder.decode(decryptedBuffer);
      
      console.debug('[Crypto] Decrypted data successfully');
      return plaintext;
      
    } catch (error) {
      console.error('[Crypto] Decryption failed:', error);
      
      // Provide more helpful error messages
      if (error.name === 'OperationError') {
        throw new Error('Decryption failed: wrong key or corrupted data');
      } else if (error.name === 'InvalidAccessError') {
        throw new Error('Decryption failed: invalid key or data format');
      } else {
        throw new Error(`Decryption failed: ${error.message}`);
      }
    }
  }
  
  /**
   * Generate random session ID
   * @returns {string} Random 64-character hex string (32 bytes)
   * 
   * @example
   * const sessionId = crypto.generateSessionId();
   * // Returns: "a1b2c3d4e5f6..."
   */
  generateSessionId() {
    if (!this.isAvailable()) {
      // Fallback to Math.random (less secure)
      console.warn('[Crypto] Using fallback random generator (less secure)');
      return Array.from({ length: 32 }, () => 
        Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
      ).join('');
    }
    
    const randomBytes = window.crypto.getRandomValues(new Uint8Array(32));
    return Array.from(randomBytes, byte => 
      byte.toString(16).padStart(2, '0')
    ).join('');
  }
  
  // ============================================================
  // UTILITY METHODS
  // ============================================================
  
  /**
   * Convert ArrayBuffer to Base64 string
   * @private
   */
  arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    
    return btoa(binary);
  }
  
  /**
   * Convert Base64 string to Uint8Array
   * @private
   */
  base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    
    return bytes;
  }
  
  /**
   * Hash a string using SHA-256 (for integrity checks, not encryption)
   * @param {string} message - String to hash
   * @returns {Promise<string>} Hex encoded hash
   * 
   * @example
   * const hash = await crypto.hash('hello world');
   */
  async hash(message) {
    if (!this.isAvailable()) {
      throw new Error('Web Crypto API not available');
    }
    
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

// Export singleton instance
export const crypto = new Crypto();

// Self-test on load (only in development)
if (typeof window !== 'undefined') {
  window.Crypto = crypto;
  
  // Check availability
  if (crypto.isAvailable()) {
    console.debug('[Crypto] Web Crypto API available and ready');
    
    // Run basic self-test
    (async () => {
      try {
        const testSessionId = 'test-session-' + Date.now();
        const key = await crypto.deriveKey(testSessionId);
        const encrypted = await crypto.encrypt('test', key);
        const decrypted = await crypto.decrypt(encrypted, key);
        
        if (decrypted === 'test') {
          console.debug('[Crypto] Self-test passed ✓');
        } else {
          console.error('[Crypto] Self-test failed: decryption mismatch');
        }
      } catch (error) {
        console.error('[Crypto] Self-test failed:', error);
      }
    })();
  } else {
    console.warn('[Crypto] Web Crypto API not available - encryption will not work');
  }
}
