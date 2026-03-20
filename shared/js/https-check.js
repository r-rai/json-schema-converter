/**
 * HTTPS Enforcement Module
 * Client-side HTTPS redirect for non-localhost environments
 * Sprint 3: Security Hardening - Transport Security
 */

/**
 * Check if current connection is secure (HTTPS)
 * @returns {boolean} True if using HTTPS or localhost
 */
function isSecureConnection() {
  return window.location.protocol === 'https:' || isLocalhost();
}

/**
 * Check if running on localhost
 * @returns {boolean} True if localhost or 127.0.0.1
 */
function isLocalhost() {
  const hostname = window.location.hostname;
  return hostname === 'localhost' || 
         hostname === '127.0.0.1' || 
         hostname.startsWith('127.') ||
         hostname === '[::1]'; // IPv6 localhost
}

/**
 * Enforce HTTPS by redirecting HTTP connections
 * Skips localhost for development convenience
 * @returns {void}
 */
function enforceHTTPS() {
  // Skip if already secure
  if (isSecureConnection()) {
    console.debug('[HTTPS] Already using secure connection');
    return;
  }
  
  // Skip if localhost (development)
  if (isLocalhost()) {
    console.debug('[HTTPS] Localhost detected, skipping HTTPS enforcement');
    return;
  }
  
  // Log warning before redirect
  console.warn('[HTTPS] Insecure connection detected, redirecting to HTTPS...');
  
  // Build HTTPS URL
  const httpsUrl = window.location.href.replace(/^http:/, 'https:');
  
  // Redirect to HTTPS
  // Use replace() to prevent back button from returning to HTTP
  window.location.replace(httpsUrl);
}

/**
 * Log connection security status
 * @returns {void}
 */
function logSecurityStatus() {
  if (window.location.protocol === 'https:') {
    console.info('[HTTPS] ✓ Secure connection (HTTPS)');
  } else if (isLocalhost()) {
    console.info('[HTTPS] ⚠ Development mode (HTTP on localhost)');
  } else {
    console.error('[HTTPS] ✗ Insecure connection (HTTP)');
  }
}

// Run enforcement check immediately
enforceHTTPS();

// Log security status
logSecurityStatus();

// Export for testing
export { enforceHTTPS, isSecureConnection, isLocalhost };
