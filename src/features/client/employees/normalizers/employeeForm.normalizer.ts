import { onlyDigits } from '@shared/parsers/stringParsers';
import type { ClientApiRecord } from '@features/client/shared/types/clientApi.types';
import type { Employee } from '@features/client/employees/types/employee.types';
import type { EmployeeCreateFormValues } from '@features/client/employees/schemas/employeeCreateForm.schema';
import type { EmployeeEditFormValues } from '@features/client/employees/schemas/employeeEditForm.schema';

const getOptionalText = (value: string | undefined): string | undefined => {
  const trimmedValue = value?.trim() ?? '';
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

export const createEmployeeInitialValues = (): EmployeeCreateFormValues => ({
  personId: '',
  fullName: '',
  documentNumber: '',
  jobTitle: '',
  department: '',
  status: '',
});

export const toEmployeeCreatePayload = (values: EmployeeCreateFormValues): ClientApiRecord => {
  const personId = getOptionalText(values.personId);
  const fullName = getOptionalText(values.fullName);
  const documentNumber = getOptionalText(values.documentNumber);

  return {
    personId,
    person: personId
      ? undefined
      : {
          fullName,
          documentNumber: documentNumber ? onlyDigits(documentNumber) : undefined,
        },
    jobTitle: values.jobTitle.trim(),
    department: getOptionalText(values.department),
    status: getOptionalText(values.status),
  };
};

export const toEmployeeEditFormValues = (employee: Employee): EmployeeEditFormValues => ({
  jobTitle: employee.jobTitle,
  department: employee.department ?? '',
  status: employee.status ?? '',
});

export const toEmployeeEditPayload = (values: EmployeeEditFormValues): ClientApiRecord => ({
  jobTitle: values.jobTitle.trim(),
  department: getOptionalText(values.department),
  status: getOptionalText(values.status),
});
