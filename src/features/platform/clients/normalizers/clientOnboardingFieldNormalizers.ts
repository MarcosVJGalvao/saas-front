import type { CreateClientOnboardingRequest } from '@features/platform/clients/types/clients';

type EmployeePerson = CreateClientOnboardingRequest['employee']['person'];
type EmployeeDocumentType = EmployeePerson['documentType'];
type EmployeeGender = NonNullable<EmployeePerson['gender']>;
type EmployeeMaritalStatus = NonNullable<EmployeePerson['maritalStatus']>;

export const toOnboardingDocumentType = (value: string): EmployeeDocumentType | undefined => {
  switch (value) {
    case 'CPF':
    case 'CNPJ':
    case 'RG':
    case 'PASSPORT':
    case 'OTHER':
      return value;
    default:
      return undefined;
  }
};

export const toOnboardingGender = (value: string): EmployeeGender | undefined => {
  switch (value) {
    case 'male':
    case 'female':
    case 'other':
    case 'prefer_not_to_say':
      return value;
    default:
      return undefined;
  }
};

export const toOnboardingMaritalStatus = (value: string): EmployeeMaritalStatus | undefined => {
  switch (value) {
    case 'single':
    case 'married':
    case 'divorced':
    case 'widowed':
    case 'other':
      return value;
    default:
      return undefined;
  }
};
