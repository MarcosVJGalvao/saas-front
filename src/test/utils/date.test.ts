import { describe, expect, it } from 'vitest';
import { formatDate, formatDateTime } from '@shared/formatters/dateFormatter';

describe('utils date', () => {
  it('should format date and datetime', () => {
    const sample = new Date('2026-01-15T13:45:00Z');
    expect(formatDate(sample)).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    expect(formatDateTime(sample)).toMatch(/\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}/);
  });
});
