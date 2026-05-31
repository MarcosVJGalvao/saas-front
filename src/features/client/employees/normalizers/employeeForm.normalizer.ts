import { onlyDigits } from '@shared/parsers/stringParsers';
import type { Employee } from '@features/client/employees/types/employee.types';
import type { EmployeeCreateFormValues } from '@features/client/employees/schemas/employeeCreateForm.schema';
import type { EmployeeEditFormValues } from '@features/client/employees/schemas/employeeEditForm.schema';
import type { ClientApiRecord } from '@features/client/shared/types/clientApi.types';
import type {
  EmployeeCreateContact,
  EmployeeJobTitle,
  EmployeeCreateRequest,
} from '@features/client/employees/types/employee.types';

const getOptionalText = (value: string | undefined): string | undefined => {
  const trimmedValue = value?.trim() ?? '';
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

const isEmployeeJobTitle = (value: string): value is EmployeeJobTitle =>
  value === 'teacher' ||
  value === 'teaching_assistant' ||
  value === 'coordinator' ||
  value === 'director' ||
  value === 'secretary' ||
  value === 'financial' ||
  value === 'administrator' ||
  value === 'administrative' ||
  value === 'assistant' ||
  value === 'other';

const getEmployeeJobTitle = (value: string): EmployeeJobTitle => {
  if (isEmployeeJobTitle(value)) {
    return value;
  }

  throw new Error('Cargo inválido para cadastro de funcionário.');
};

const buildContacts = (values: EmployeeCreateFormValues): EmployeeCreateContact[] => {
  const contacts: EmployeeCreateContact[] = [];
  const email = getOptionalText(values.email);
  const phone = getOptionalText(values.phone);

  if (email) {
    contacts.push({ type: 'email', value: email });
  }

  if (phone) {
    contacts.push({ type: 'phone', value: onlyDigits(phone) });
  }

  return contacts;
};

export const createEmployeeInitialValues = (): EmployeeCreateFormValues => ({
  creationMode: 'existing_person',
  personId: '',
  fullName: '',
  documentType: 'CPF',
  documentNumber: '',
  naturality: '',
  jobTitle: '',
  department: '',
  zipCode: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  country: 'BR',
  email: '',
  phone: '',
});

export const toEmployeeCreatePayload = (
  values: EmployeeCreateFormValues,
): EmployeeCreateRequest => {
  const personId = getOptionalText(values.personId);

  if (values.creationMode === 'existing_person' && personId) {
    return {
      personId,
      jobTitle: getEmployeeJobTitle(values.jobTitle.trim()),
      department: getOptionalText(values.department),
    };
  }

  return {
    person: {
      fullName: values.fullName.trim(),
      documentNumber: onlyDigits(values.documentNumber),
      documentType: values.documentType,
      naturality: getOptionalText(values.naturality),
    },
    addresses: [
      {
        zipCode: onlyDigits(values.zipCode),
        street: values.street.trim(),
        number: values.number.trim(),
        complement: getOptionalText(values.complement),
        neighborhood: values.neighborhood.trim(),
        city: values.city.trim(),
        state: values.state.trim(),
        country: values.country.trim(),
      },
    ],
    contacts: buildContacts(values),
    jobTitle: getEmployeeJobTitle(values.jobTitle.trim()),
    department: getOptionalText(values.department),
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
