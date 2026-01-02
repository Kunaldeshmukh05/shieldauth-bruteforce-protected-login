// Security thresholds as per assignment requirements
module.exports = {
  // User-level lockout configuration
  USER_MAX_ATTEMPTS: 5,
  USER_ATTEMPT_WINDOW: 5 * 60 * 1000, // 5 minutes in milliseconds
  USER_SUSPENSION_DURATION: 15 * 60 * 1000, // 15 minutes in milliseconds

  // IP-level lockout configuration
  IP_MAX_ATTEMPTS: 20,
  IP_ATTEMPT_WINDOW: 5 * 60 * 1000, // 5 minutes in milliseconds
  IP_BLOCK_DURATION: 15 * 60 * 1000, // 15 minutes in milliseconds (not specified, using reasonable default)

  // HTTP Status codes
  STATUS: {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    TOO_MANY_REQUESTS: 429,
    SERVER_ERROR: 500,
  },

  // Response messages
  MESSAGES: {
    LOGIN_SUCCESS: 'Login successful',
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_SUSPENDED: 'Account temporarily suspended due to too many failed attempts.',
    IP_BLOCKED: 'IP temporarily blocked due to excessive failed login attempts.',
    REGISTRATION_SUCCESS: 'User registered successfully',
    USER_EXISTS: 'User already exists',
    INVALID_EMAIL: 'Invalid email format',
    WEAK_PASSWORD: 'Password must be at least 6 characters',
  },
};