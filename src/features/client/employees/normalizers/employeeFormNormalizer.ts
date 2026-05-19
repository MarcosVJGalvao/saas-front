import { onlyDigits } from '@shared/parsers/stringParsers';
import type { ClientApiRecord } from '@features/client/shared/types/clientApi.types';
import type { EmployeeFormValues } from '@features/client/employees/schemas/employeeFormSchema';
import type { Employee } from '@features/client/employees/types/employee.types';

const optionalText = (value: string | undefined): string | undefined => {
  const trimmedValue = value?.trim() ?? '';
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

export const buildEmployeeInitialValues = (): EmployeeFormValues => ({
  personId: '',
  fullName: '',
  documentNumber: '',
  jobTitle: '',
  department: '',
  status: '',
});

export const normalizeEmployeeInitialValues = (employee: Employee): EmployeeFormValues => ({
  personId: employee.person?.id ?? '',
  fullName: employee.person?.fullName ?? '',
  documentNumber: employee.person?.documentNumber ?? '',
  jobTitle: employee.jobTitle,
  department: employee.department ?? '',
  status: employee.status ?? '',
});

export const normalizeEmployeePayload = (values: EmployeeFormValues): ClientApiRecord => {
  const personId = optionalText(values.personId);
  const fullName = optionalText(values.fullName);
  const documentNumber = optionalText(values.documentNumber);

  return {
    personId,
    person: personId
      ? undefined
      : {
          fullName,
          documentNumber: documentNumber ? onlyDigits(documentNumber) : undefined,
        },
    jobTitle: values.jobTitle.trim(),
    department: optionalText(values.department),
    status: optionalText(values.status),
  };
};
