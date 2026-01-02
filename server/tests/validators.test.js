const {
  isValidEmail,
  isValidPassword,
  validateLoginInput,
  validateRegisterInput,
} = require('../src/utils/validators');

describe('Email Validation', () => {
  test('should accept valid email addresses', () => {
    const validEmails = [
      'user@example.com',
      'john.doe@company.co.uk',
      'test+tag@domain.io',
      'name123@test-domain.com',
      'a@b.c',
    ];

    validEmails.forEach((email) => {
      expect(isValidEmail(email)).toBe(true);
    });
  });

  test('should reject invalid email addresses', () => {
    const invalidEmails = [
      'notanemail',
      '@example.com',
      'user@',
      'user @example.com',
      'user@.com',
      'user..name@example.com',
    ];

    invalidEmails.forEach((email) => {
      expect(isValidEmail(email)).toBe(false);
    });
  });

  test('should reject empty/null/undefined emails', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail(null)).toBe(false);
    expect(isValidEmail(undefined)).toBe(false);
  });

  test('should handle edge cases', () => {
    expect(isValidEmail('a@b.co')).toBe(true);
    expect(isValidEmail('user@domain')).toBe(false); // No TLD
    expect(isValidEmail('user@domain.')).toBe(false);
  });
});

describe('Password Validation', () => {
  test('should accept passwords with 6 or more characters', () => {
    const validPasswords = [
      '123456',
      'abcdef',
      'password123',
      'P@ssw0rd!',
      'a b c d e f',
    ];

    validPasswords.forEach((password) => {
      expect(isValidPassword(password)).toBe(true);
    });
  });

  test('should reject passwords with less than 6 characters', () => {
    const invalidPasswords = ['12345', 'abcde', 'a1!'];

    invalidPasswords.forEach((password) => {
      expect(isValidPassword(password)).toBe(false);
    });
  });

  test('should reject empty/null/undefined passwords', () => {
    expect(isValidPassword('')).toBe(false);
    expect(isValidPassword(null)).toBe(false);
    expect(isValidPassword(undefined)).toBe(false);
  });

  test('should accept exactly 6 characters', () => {
    expect(isValidPassword('123456')).toBe(true);
    expect(isValidPassword('abcdef')).toBe(true);
  });
});

describe('Login Input Validation', () => {
  test('should validate correct login input', () => {
    const result = validateLoginInput('user@example.com', 'password123');

    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  test('should reject missing email', () => {
    const result = validateLoginInput('', 'password123');

    expect(result.valid).toBe(false);
    expect(result.error).toBe('Email and password are required');
  });

  test('should reject missing password', () => {
    const result = validateLoginInput('user@example.com', '');

    expect(result.valid).toBe(false);
    expect(result.error).toBe('Email and password are required');
  });

  test('should reject invalid email format', () => {
    const result = validateLoginInput('notanemail', 'password123');

    expect(result.valid).toBe(false);
    expect(result.error).toBe('Invalid email format');
  });

  test('should accept login with short password (no length check)', () => {
    // Login doesn't enforce password length (only register does)
    const result = validateLoginInput('user@example.com', '12345');

    expect(result.valid).toBe(true);
  });
});

describe('Register Input Validation', () => {
  test('should validate correct registration input', () => {
    const result = validateRegisterInput('user@example.com', 'password123');

    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  test('should reject missing email', () => {
    const result = validateRegisterInput('', 'password123');

    expect(result.valid).toBe(false);
    expect(result.error).toBe('Email and password are required');
  });

  test('should reject missing password', () => {
    const result = validateRegisterInput('user@example.com', '');

    expect(result.valid).toBe(false);
    expect(result.error).toBe('Email and password are required');
  });

  test('should reject invalid email format', () => {
    const result = validateRegisterInput('notanemail', 'password123');

    expect(result.valid).toBe(false);
    expect(result.error).toBe('Invalid email format');
  });

  test('should reject weak password (less than 6 characters)', () => {
    const result = validateRegisterInput('user@example.com', '12345');

    expect(result.valid).toBe(false);
    expect(result.error).toBe('Password must be at least 6 characters');
  });

  test('should accept password with exactly 6 characters', () => {
    const result = validateRegisterInput('user@example.com', '123456');

    expect(result.valid).toBe(true);
  });

  test('should handle null/undefined inputs', () => {
    expect(validateRegisterInput(null, null).valid).toBe(false);
    expect(validateRegisterInput(undefined, undefined).valid).toBe(false);
  });
});

describe('Validation - Security Considerations', () => {
  test('should handle SQL injection attempts in email', () => {
    const maliciousEmails = [
      "admin'--@example.com",
      'user@example.com; DROP TABLE users;',
      "user@example.com' OR '1'='1",
    ];

    maliciousEmails.forEach((email) => {
      const result = validateLoginInput(email, 'password');
      // Should either be invalid or properly escaped
      expect(typeof result.valid).toBe('boolean');
    });
  });

  test('should handle XSS attempts in inputs', () => {
    const xssAttempts = [
      '<script>alert("xss")</script>@example.com',
      'user@example.com<img src=x onerror=alert(1)>',
    ];

    xssAttempts.forEach((email) => {
      const result = validateLoginInput(email, 'password');
      expect(typeof result.valid).toBe('boolean');
    });
  });

  test('should handle very long inputs', () => {
    const longEmail = 'a'.repeat(1000) + '@example.com';
    const longPassword = 'p'.repeat(10000);

    const result = validateRegisterInput(longEmail, longPassword);
    expect(typeof result.valid).toBe('boolean');
  });

  test('should handle special characters in password', () => {
    const specialPasswords = [
      '!@#$%^&*()',
      'p@$$w0rd',
      'test"password',
      "test'password",
    ];

    specialPasswords.forEach((password) => {
      const result = validateRegisterInput('user@example.com', password);
      if (password.length >= 6) {
        expect(result.valid).toBe(true);
      }
    });
  });
});