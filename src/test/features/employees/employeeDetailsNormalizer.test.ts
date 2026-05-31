import { describe, expect, it } from 'vitest';
import { toEmployeeDetailsData } from '@features/client/employees/normalizers/employeeDetails.normalizer';
import type { Employee } from '@features/client/employees/types/employee.types';

const hasStringValue = (
  item: { label: string; value?: unknown },
  label: string,
  expectedValue: string,
): boolean => item.label === label && item.value === expectedValue;

describe('employeeDetails.normalizer', () => {
  it('exibe a naturalidade da pessoa vinculada quando existir', () => {
    const employee: Employee = {
      id: 'employee-1',
      jobTitle: 'teacher',
      department: 'Acadêmico',
      status: 'active',
      person: {
        id: 'person-1',
        fullName: 'Ana Silva',
        documentNumber: '12345678900',
        naturality: 'Salvador',
      },
      createdAt: '2026-05-29T02:32:57.090Z',
      updatedAt: '2026-05-29T02:32:57.090Z',
    };

    const detailsData = toEmployeeDetailsData(employee);
    const personItems = detailsData.tabs[0]?.sections[1]?.items ?? [];

    expect(personItems.some((item) => hasStringValue(item, 'Naturalidade', 'Salvador'))).toBe(true);
  });
});
