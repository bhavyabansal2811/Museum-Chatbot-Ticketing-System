/**
 * Tests for frontend validation and logic helpers
 */

// Pure validation and business logic functions (matching renderer.js)
function validateDate(str) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(str)) return false;
  const d = new Date(str);
  return d instanceof Date && !isNaN(d.getTime());
}

function validateName(str) {
  return typeof str === 'string' && str.trim().length >= 2;
}

function parseTicketType(str) {
  const lower = str.toLowerCase();
  if (lower.includes('child') || lower.includes('बच्चा')) {
    return { type: 'Child', price: 50 };
  } else if (lower.includes('senior') || lower.includes('वरिष्ठ')) {
    return { type: 'Senior', price: 70 };
  } else if (lower.includes('adult') || lower.includes('वयस्क') || lower === 'general') {
    return { type: 'Adult', price: 100 };
  }
  return null;
}

describe('Frontend UI Logic & Validation', () => {
  describe('validateDate()', () => {
    test('should accept valid YYYY-MM-DD dates', () => {
      expect(validateDate('2026-12-25')).toBe(true);
      expect(validateDate('2027-01-01')).toBe(true);
    });

    test('should reject invalid date strings', () => {
      expect(validateDate('tomorrow')).toBe(false);
      expect(validateDate('25-12-2026')).toBe(false);
      expect(validateDate('')).toBe(false);
    });
  });

  describe('validateName()', () => {
    test('should accept names with 2 or more characters', () => {
      expect(validateName('Bhavya')).toBe(true);
      expect(validateName('Al')).toBe(true);
    });

    test('should reject empty or 1-character names', () => {
      expect(validateName('')).toBe(false);
      expect(validateName(' ')).toBe(false);
      expect(validateName('A')).toBe(false);
    });
  });

  describe('parseTicketType()', () => {
    test('should identify Adult ticket and correct price in English and Hindi', () => {
      expect(parseTicketType('Adult')).toEqual({ type: 'Adult', price: 100 });
      expect(parseTicketType('वयस्क')).toEqual({ type: 'Adult', price: 100 });
    });

    test('should identify Child ticket and correct price in English and Hindi', () => {
      expect(parseTicketType('Child')).toEqual({ type: 'Child', price: 50 });
      expect(parseTicketType('बच्चा')).toEqual({ type: 'Child', price: 50 });
    });

    test('should identify Senior ticket and correct price', () => {
      expect(parseTicketType('Senior Citizen')).toEqual({ type: 'Senior', price: 70 });
      expect(parseTicketType('वरिष्ठ')).toEqual({ type: 'Senior', price: 70 });
    });

    test('should return null for invalid ticket categories', () => {
      expect(parseTicketType('VIP Guest')).toBeNull();
      expect(parseTicketType('Free')).toBeNull();
    });
  });
});
