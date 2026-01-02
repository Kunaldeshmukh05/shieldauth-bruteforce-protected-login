const { MESSAGES } = require('./constants');

/**
 * Validates email format using industry-standard regex
 * Based on RFC 5322 Official Standard
 * @param {string} email 
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  // RFC 5322 compliant email regex (simplified but robust)
  // Allows: letters, numbers, dots, hyphens, underscores, plus signs
  // in local part and domain
  // Requires at least one dot in domain (must have TLD)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  
  if (!emailRegex.test(email)) return false;
  
  // Additional security checks
  if (email.includes('..')) return false; // No consecutive dots
  if (email.length > 254) return false; // Max email length per RFC
  
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  
  const [localPart, domain] = parts;
  if (localPart.length > 64) return false; // Max local part length
  if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
  
  // Additional check to ensure domain has at least one dot (TLD)
  if (!domain.includes('.')) return false;
  
  return true;
};

/**
 * Validates password strength (minimum 6 characters as basic requirement)
 * @param {string} password 
 * @returns {boolean}
 */
const isValidPassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  return password.length >= 6;
};

/**
 * Validates login input
 * @param {string} email 
 * @param {string} password 
 * @returns {Object} { valid: boolean, error: string }
 */
const validateLoginInput = (email, password) => {
  if (!email || !password) {
    return { valid: false, error: 'Email and password are required' };
  }

  if (!isValidEmail(email)) {
    return { valid: false, error: MESSAGES.INVALID_EMAIL };
  }

  return { valid: true };
};

/**
 * Validates registration input
 * @param {string} email 
 * @param {string} password 
 * @returns {Object} { valid: boolean, error: string }
 */
const validateRegisterInput = (email, password) => {
  if (!email || !password) {
    return { valid: false, error: 'Email and password are required' };
  }

  if (!isValidEmail(email)) {
    return { valid: false, error: MESSAGES.INVALID_EMAIL };
  }

  if (!isValidPassword(password)) {
    return { valid: false, error: MESSAGES.WEAK_PASSWORD };
  }

  return { valid: true };
};

module.exports = {
  isValidEmail,
  isValidPassword,
  validateLoginInput,
  validateRegisterInput,
};