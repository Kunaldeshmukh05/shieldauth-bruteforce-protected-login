const User = require('../models/user.js');
const IPBlock = require('../models/ipBlock.js');
const {
  USER_MAX_ATTEMPTS,
  USER_ATTEMPT_WINDOW,
  USER_SUSPENSION_DURATION,
  IP_MAX_ATTEMPTS,
  IP_ATTEMPT_WINDOW,
  IP_BLOCK_DURATION,
} = require('../utils/constants');

/**
 * Check if user is currently suspended
 * @param {string} email 
 * @returns {Promise<Object>} { suspended: boolean, remainingTime: number }
 */
const checkUserLockout = async (email) => {
  const user = await User.findOne({ email });
  
  if (!user) {
    return { suspended: false, remainingTime: 0 };
  }

  // Check if suspension has expired
  if (user.suspendedUntil && new Date() >= user.suspendedUntil) {
    // Clear suspension and old attempts
    user.suspendedUntil = null;
    user.failedAttempts = [];
    await user.save();
    return { suspended: false, remainingTime: 0 };
  }

  if (user.isSuspended()) {
    return {
      suspended: true,
      remainingTime: user.getRemainingLockoutTime(),
    };
  }

  return { suspended: false, remainingTime: 0 };
};

/**
 * Check if IP is currently blocked
 * @param {string} ip 
 * @returns {Promise<Object>} { blocked: boolean, remainingTime: number }
 */
const checkIPLockout = async (ip) => {
  const ipBlock = await IPBlock.findOne({ ip });
  
  if (!ipBlock) {
    return { blocked: false, remainingTime: 0 };
  }

  // Check if block has expired
  if (ipBlock.blockedUntil && new Date() >= ipBlock.blockedUntil) {
    // Clear block and old attempts
    ipBlock.blockedUntil = null;
    ipBlock.failedAttempts = [];
    await ipBlock.save();
    return { blocked: false, remainingTime: 0 };
  }

  if (ipBlock.isBlocked()) {
    return {
      blocked: true,
      remainingTime: ipBlock.getRemainingBlockTime(),
    };
  }

  return { blocked: false, remainingTime: 0 };
};

/**
 * Clean expired attempts from the sliding window
 * @param {Array} attempts - Array of attempt objects with timestamp
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Array} - Filtered attempts within the window
 */
const cleanExpiredAttempts = (attempts, windowMs) => {
  const cutoffTime = new Date(Date.now() - windowMs);
  return attempts.filter(attempt => attempt.timestamp > cutoffTime);
};

/**
 * Record a failed login attempt for both user and IP
 * Implements sliding window and applies lockouts if thresholds exceeded
 * @param {string} email 
 * @param {string} ip 
 * @returns {Promise<Object>} { userSuspended: boolean, ipBlocked: boolean }
 */
const recordFailedAttempt = async (email, ip) => {
  const now = new Date();
  let userSuspended = false;
  let ipBlocked = false;

  // Handle user-level attempts
  const user = await User.findOne({ email });
  if (user) {
    // Clean old attempts outside the 5-minute window
    user.failedAttempts = cleanExpiredAttempts(
      user.failedAttempts,
      USER_ATTEMPT_WINDOW
    );

    // Add new failed attempt
    user.failedAttempts.push({ timestamp: now });

    // Check if threshold exceeded
    if (user.failedAttempts.length >= USER_MAX_ATTEMPTS) {
      user.suspendedUntil = new Date(now.getTime() + USER_SUSPENSION_DURATION);
      userSuspended = true;
    }

    await user.save();
  }

  // Handle IP-level attempts
  let ipBlock = await IPBlock.findOne({ ip });
  
  if (!ipBlock) {
    // Create new IP block record
    ipBlock = new IPBlock({ ip, failedAttempts: [] });
  }

  // Clean old attempts outside the 5-minute window
  ipBlock.failedAttempts = cleanExpiredAttempts(
    ipBlock.failedAttempts,
    IP_ATTEMPT_WINDOW
  );

  // Add new failed attempt
  ipBlock.failedAttempts.push({ timestamp: now, email });

  // Check if threshold exceeded
  if (ipBlock.failedAttempts.length >= IP_MAX_ATTEMPTS) {
    ipBlock.blockedUntil = new Date(now.getTime() + IP_BLOCK_DURATION);
    ipBlocked = true;
  }

  await ipBlock.save();

  return { userSuspended, ipBlocked };
};

/**
 * Clear user's failed attempts on successful login
 * Note: IP attempts are NOT cleared on successful login (per assignment logic)
 * @param {string} email 
 * @returns {Promise<void>}
 */
const clearUserAttempts = async (email) => {
  const user = await User.findOne({ email });
  if (user) {
    user.failedAttempts = [];
    user.suspendedUntil = null;
    await user.save();
  }
};

module.exports = {
  checkUserLockout,
  checkIPLockout,
  recordFailedAttempt,
  clearUserAttempts,
  cleanExpiredAttempts, // Export for testing
};