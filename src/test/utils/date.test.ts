import { describe, expect, it } from 'vitest';
import { formatDate, formatDateTime, formatIsoDate } from '@shared/formatters/dateFormatter';

describe('utils date', () => {
  it('should format date and datetime', () => {
    const sample = new Date('2026-01-15T13:45:00Z');
    expect(formatDate(sample)).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    expect(formatDateTime(sample)).toMatch(/\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}/);
  });

  it('mantem datas puras da api no mesmo dia do calendario', () => {
    expect(formatIsoDate('2026-01-01')).toBe('01/01/2026');
    expect(formatIsoDate('2026-12-31')).toBe('31/12/2026');
  });

  it('continua formatando datetimes iso com horario', () => {
    expect(formatIsoDate('2026-01-15T13:45:00Z')).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });
});
