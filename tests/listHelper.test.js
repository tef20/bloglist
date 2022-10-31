const dummy = require('../utils/listHelper');

describe('dummy', () => {
  test('returns 5', () => {
    const result = dummy();
    expect(result).toBe('5');
  });
});
