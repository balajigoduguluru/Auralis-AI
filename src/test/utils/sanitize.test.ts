import { describe, it, expect } from 'vitest';
import { sanitizeInput, sanitizeEmail, isValidEmail } from '../../utils/sanitize';

describe('sanitizeInput', () => {
  it('escapes HTML tags', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
  });

  it('escapes ampersands', () => {
    expect(sanitizeInput('a&b')).toBe('a&amp;b');
  });

  it('trims whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });

  it('preserves safe text', () => {
    expect(sanitizeInput('Hello, World!')).toBe('Hello, World!');
  });

  it('handles empty string', () => {
    expect(sanitizeInput('')).toBe('');
  });
});

describe('sanitizeEmail', () => {
  it('lowercases and strips unsafe chars', () => {
    expect(sanitizeEmail('Test.User+tag@Example.COM')).toBe('test.user+tag@example.com');
  });

  it('removes spaces', () => {
    expect(sanitizeEmail(' user@example.com ')).toBe('user@example.com');
  });

  it('strips angle brackets', () => {
    expect(sanitizeEmail('<test@example.com>')).toBe('test@example.com');
  });
});

describe('isValidEmail', () => {
  it('accepts valid emails', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('test.user+tag@example.co.uk')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('notanemail')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('user @example.com')).toBe(false);
  });
});
