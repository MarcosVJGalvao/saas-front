import { describe, expect, it } from 'vitest';
import { normalizeEmployeePayload } from '@features/client/employees/normalizers/employeeFormNormalizer';

describe('employeeFormNormalizer', () => {
  it('usa pessoa existente quando personId está preenchido', () => {
    const payload = normalizeEmployeePayload({
      personId: ' person-1 ',
      fullName: ' Ana ',
      documentNumber: '123.456.789-00',
      jobTitle: ' Professor ',
      department: ' Acadêmico ',
      status: 'active',
    });

    expect(payload).toEqual({
      personId: 'person-1',
      person: undefined,
      jobTitle: 'Professor',
      department: 'Acadêmico',
      status: 'active',
    });
  });

  it('normaliza pessoa inline quando personId não está preenchido', () => {
    const payload = normalizeEmployeePayload({
      personId: '',
      fullName: ' Ana Silva ',
      documentNumber: '123.456.789-00',
      jobTitle: ' Professor ',
      department: '',
      status: '',
    });

    expect(payload).toEqual({
      personId: undefined,
      person: {
        fullName: 'Ana Silva',
        documentNumber: '12345678900',
      },
      jobTitle: 'Professor',
      department: undefined,
      status: undefined,
    });
  });
});
