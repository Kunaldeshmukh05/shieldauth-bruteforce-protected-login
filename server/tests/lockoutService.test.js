const {
  cleanExpiredAttempts,
} = require('../src/services/lockoutService');

const {
  USER_ATTEMPT_WINDOW,
  IP_ATTEMPT_WINDOW,
} = require('../src/utils/constants');

describe('Lockout Service - cleanExpiredAttempts', () => {
  test('should remove attempts older than the time window', () => {
    const now = Date.now();
    const attempts = [
      { timestamp: new Date(now - 10 * 60 * 1000) }, // 10 minutes ago (expired)
      { timestamp: new Date(now - 4 * 60 * 1000) }, // 4 minutes ago (valid)
      { timestamp: new Date(now - 2 * 60 * 1000) }, // 2 minutes ago (valid)
      { timestamp: new Date(now - 30 * 1000) }, // 30 seconds ago (valid)
    ];

    const cleaned = cleanExpiredAttempts(attempts, USER_ATTEMPT_WINDOW);

    expect(cleaned).toHaveLength(3);
    expect(cleaned[0].timestamp).toEqual(attempts[1].timestamp);
  });

  test('should return empty array when all attempts are expired', () => {
    const now = Date.now();
    const attempts = [
      { timestamp: new Date(now - 10 * 60 * 1000) }, // 10 minutes ago
      { timestamp: new Date(now - 15 * 60 * 1000) }, // 15 minutes ago
      { timestamp: new Date(now - 20 * 60 * 1000) }, // 20 minutes ago
    ];

    const cleaned = cleanExpiredAttempts(attempts, USER_ATTEMPT_WINDOW);

    expect(cleaned).toHaveLength(0);
  });

  test('should return all attempts when none are expired', () => {
    const now = Date.now();
    const attempts = [
      { timestamp: new Date(now - 1 * 60 * 1000) }, // 1 minute ago
      { timestamp: new Date(now - 2 * 60 * 1000) }, // 2 minutes ago
      { timestamp: new Date(now - 3 * 60 * 1000) }, // 3 minutes ago
    ];

    const cleaned = cleanExpiredAttempts(attempts, USER_ATTEMPT_WINDOW);

    expect(cleaned).toHaveLength(3);
  });

  test('should handle empty attempts array', () => {
    const attempts = [];
    const cleaned = cleanExpiredAttempts(attempts, USER_ATTEMPT_WINDOW);

    expect(cleaned).toHaveLength(0);
  });

  test('should work with IP attempt window', () => {
    const now = Date.now();
    const attempts = [
      { timestamp: new Date(now - 6 * 60 * 1000), email: 'user1@test.com' }, // 6 min (expired)
      { timestamp: new Date(now - 4 * 60 * 1000), email: 'user2@test.com' }, // 4 min (valid)
      { timestamp: new Date(now - 1 * 60 * 1000), email: 'user3@test.com' }, // 1 min (valid)
    ];

    const cleaned = cleanExpiredAttempts(attempts, IP_ATTEMPT_WINDOW);

    expect(cleaned).toHaveLength(2);
    expect(cleaned[0].email).toBe('user2@test.com');
    expect(cleaned[1].email).toBe('user3@test.com');
  });

  test('should handle attempts at exact window boundary', () => {
    const now = Date.now();
    const attempts = [
      { timestamp: new Date(now - USER_ATTEMPT_WINDOW) }, // Exactly 5 minutes ago
      { timestamp: new Date(now - USER_ATTEMPT_WINDOW + 1000) }, // 4:59 ago (valid)
    ];

    const cleaned = cleanExpiredAttempts(attempts, USER_ATTEMPT_WINDOW);

    // The exact boundary attempt should be excluded
    expect(cleaned).toHaveLength(1);
  });
});

describe('Lockout Service - Time Window Logic', () => {
  test('USER_ATTEMPT_WINDOW should be 5 minutes', () => {
    expect(USER_ATTEMPT_WINDOW).toBe(5 * 60 * 1000);
  });

  test('IP_ATTEMPT_WINDOW should be 5 minutes', () => {
    expect(IP_ATTEMPT_WINDOW).toBe(5 * 60 * 1000);
  });

  test('should correctly calculate sliding window', () => {
    const now = Date.now();
    const fiveMinutesAgo = now - USER_ATTEMPT_WINDOW;
    const fourMinutesAgo = now - (4 * 60 * 1000);

    expect(now - fiveMinutesAgo).toBe(USER_ATTEMPT_WINDOW);
    expect(now - fourMinutesAgo).toBeLessThan(USER_ATTEMPT_WINDOW);
  });
});

describe('Lockout Service - Edge Cases', () => {
  test('should handle attempts with future timestamps', () => {
    const now = Date.now();
    const attempts = [
      { timestamp: new Date(now + 1000) }, // 1 second in future
      { timestamp: new Date(now - 2 * 60 * 1000) }, // 2 minutes ago (valid)
    ];

    const cleaned = cleanExpiredAttempts(attempts, USER_ATTEMPT_WINDOW);

    // Future timestamps should be kept (system clock issues)
    expect(cleaned).toHaveLength(2);
  });

  test('should handle attempts with invalid timestamps gracefully', () => {
    const now = Date.now();
    const attempts = [
      { timestamp: new Date('invalid') },
      { timestamp: new Date(now - 2 * 60 * 1000) },
    ];

    // Should not throw error
    expect(() => {
      cleanExpiredAttempts(attempts, USER_ATTEMPT_WINDOW);
    }).not.toThrow();
  });

  test('should maintain order of attempts after cleaning', () => {
    const now = Date.now();
    const attempts = [
      { timestamp: new Date(now - 10 * 60 * 1000), id: 1 }, // expired
      { timestamp: new Date(now - 4 * 60 * 1000), id: 2 }, // valid
      { timestamp: new Date(now - 3 * 60 * 1000), id: 3 }, // valid
      { timestamp: new Date(now - 8 * 60 * 1000), id: 4 }, // expired
      { timestamp: new Date(now - 1 * 60 * 1000), id: 5 }, // valid
    ];

    const cleaned = cleanExpiredAttempts(attempts, USER_ATTEMPT_WINDOW);

    expect(cleaned).toHaveLength(3);
    expect(cleaned[0].id).toBe(2);
    expect(cleaned[1].id).toBe(3);
    expect(cleaned[2].id).toBe(5);
  });
});

describe('Lockout Service - Performance', () => {
  test('should handle large number of attempts efficiently', () => {
    const now = Date.now();
    const attempts = [];

    // Create 1000 attempts
    for (let i = 0; i < 1000; i++) {
      attempts.push({
        timestamp: new Date(now - i * 1000), // 1 second apart
      });
    }

    const startTime = Date.now();
    const cleaned = cleanExpiredAttempts(attempts, USER_ATTEMPT_WINDOW);
    const endTime = Date.now();

    // Should complete in less than 100ms
    expect(endTime - startTime).toBeLessThan(100);

    // Should only keep attempts within 5 minute window (300 attempts)
    expect(cleaned.length).toBeLessThanOrEqual(300);
  });
});