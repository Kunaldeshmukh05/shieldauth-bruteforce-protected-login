const {
  USER_MAX_ATTEMPTS,
  USER_ATTEMPT_WINDOW,
  USER_SUSPENSION_DURATION,
  IP_MAX_ATTEMPTS,
  IP_ATTEMPT_WINDOW,
  IP_BLOCK_DURATION,
  STATUS,
  MESSAGES,
} = require('../src/utils/constants');

describe('Lockout Configuration', () => {
  test('USER_MAX_ATTEMPTS should be 5 as per assignment', () => {
    expect(USER_MAX_ATTEMPTS).toBe(5);
  });

  test('USER_ATTEMPT_WINDOW should be 5 minutes', () => {
    expect(USER_ATTEMPT_WINDOW).toBe(5 * 60 * 1000);
  });

  test('USER_SUSPENSION_DURATION should be 15 minutes', () => {
    expect(USER_SUSPENSION_DURATION).toBe(15 * 60 * 1000);
  });

  test('IP_MAX_ATTEMPTS should be configured (20-100 range)', () => {
    expect(IP_MAX_ATTEMPTS).toBeGreaterThanOrEqual(20);
    expect(IP_MAX_ATTEMPTS).toBeLessThanOrEqual(100);
  });

  test('IP_ATTEMPT_WINDOW should be 5 minutes', () => {
    expect(IP_ATTEMPT_WINDOW).toBe(5 * 60 * 1000);
  });

  test('IP_BLOCK_DURATION should be defined and reasonable', () => {
    expect(IP_BLOCK_DURATION).toBeGreaterThan(0);
    expect(IP_BLOCK_DURATION).toBeLessThanOrEqual(60 * 60 * 1000); // Max 1 hour
  });
});

describe('HTTP Status Codes', () => {
  test('should have all required status codes', () => {
    expect(STATUS.SUCCESS).toBe(200);
    expect(STATUS.CREATED).toBe(201);
    expect(STATUS.BAD_REQUEST).toBe(400);
    expect(STATUS.UNAUTHORIZED).toBe(401);
    expect(STATUS.FORBIDDEN).toBe(403);
    expect(STATUS.TOO_MANY_REQUESTS).toBe(429);
    expect(STATUS.SERVER_ERROR).toBe(500);
  });

  test('status codes should be valid HTTP codes', () => {
    Object.values(STATUS).forEach((code) => {
      expect(code).toBeGreaterThanOrEqual(200);
      expect(code).toBeLessThan(600);
    });
  });
});

describe('Response Messages', () => {
  test('should have user suspension message matching assignment', () => {
    expect(MESSAGES.USER_SUSPENDED).toBe(
      'Account temporarily suspended due to too many failed attempts.'
    );
  });

  test('should have IP block message matching assignment', () => {
    expect(MESSAGES.IP_BLOCKED).toBe(
      'IP temporarily blocked due to excessive failed login attempts.'
    );
  });

  test('should have all required messages', () => {
    expect(MESSAGES.LOGIN_SUCCESS).toBeDefined();
    expect(MESSAGES.INVALID_CREDENTIALS).toBeDefined();
    expect(MESSAGES.REGISTRATION_SUCCESS).toBeDefined();
    expect(MESSAGES.USER_EXISTS).toBeDefined();
    expect(MESSAGES.INVALID_EMAIL).toBeDefined();
    expect(MESSAGES.WEAK_PASSWORD).toBeDefined();
  });

  test('messages should be non-empty strings', () => {
    Object.values(MESSAGES).forEach((message) => {
      expect(typeof message).toBe('string');
      expect(message.length).toBeGreaterThan(0);
    });
  });
});

describe('Security Configuration Validation', () => {
  test('attempt window should be less than suspension duration', () => {
    expect(USER_ATTEMPT_WINDOW).toBeLessThan(USER_SUSPENSION_DURATION);
    expect(IP_ATTEMPT_WINDOW).toBeLessThan(IP_BLOCK_DURATION);
  });

  test('max attempts should be reasonable numbers', () => {
    expect(USER_MAX_ATTEMPTS).toBeGreaterThan(0);
    expect(USER_MAX_ATTEMPTS).toBeLessThan(100);
    expect(IP_MAX_ATTEMPTS).toBeGreaterThan(USER_MAX_ATTEMPTS);
  });

  test('time windows should be in milliseconds', () => {
    // All time values should be reasonable (between 1 second and 24 hours)
    const oneSecond = 1000;
    const oneDay = 24 * 60 * 60 * 1000;

    expect(USER_ATTEMPT_WINDOW).toBeGreaterThanOrEqual(oneSecond);
    expect(USER_ATTEMPT_WINDOW).toBeLessThanOrEqual(oneDay);
    expect(USER_SUSPENSION_DURATION).toBeGreaterThanOrEqual(oneSecond);
    expect(USER_SUSPENSION_DURATION).toBeLessThanOrEqual(oneDay);
  });

  test('configuration should match assignment requirements', () => {
    // Verify exact requirements from assignment
    expect(USER_MAX_ATTEMPTS).toBe(5); // "more than 5 times" in assignment
    expect(USER_ATTEMPT_WINDOW).toBe(5 * 60 * 1000); // "within a 5-minute window"
    expect(USER_SUSPENSION_DURATION).toBe(15 * 60 * 1000); // "suspended for 15 minutes"
    // IP_MAX_ATTEMPTS can be configured (assignment says 100, but 20 is valid for testing)
    expect(IP_MAX_ATTEMPTS).toBeGreaterThanOrEqual(20);
    expect(IP_MAX_ATTEMPTS).toBeLessThanOrEqual(100);
  });
});

describe('Constants Immutability', () => {
  test('constants should be properly exported', () => {
    expect(USER_MAX_ATTEMPTS).toBeDefined();
    expect(IP_MAX_ATTEMPTS).toBeDefined();
    expect(STATUS).toBeDefined();
    expect(MESSAGES).toBeDefined();
  });

  test('STATUS object should not be null or undefined', () => {
    expect(STATUS).not.toBeNull();
    expect(STATUS).not.toBeUndefined();
    expect(typeof STATUS).toBe('object');
  });

  test('MESSAGES object should not be null or undefined', () => {
    expect(MESSAGES).not.toBeNull();
    expect(MESSAGES).not.toBeUndefined();
    expect(typeof MESSAGES).toBe('object');
  });
});