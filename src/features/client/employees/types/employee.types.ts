import type {
  ContactTypeValue,
  DocumentTypeValue,
  EmployeeStatusValue,
} from '@shared/i18n/pt-BR/enums';
import type { ClientBaseQueryParams } from '@features/client/shared/types/clientApi.types';

export type EmployeeJobTitle =
  | 'teacher'
  | 'teaching_assistant'
  | 'coordinator'
  | 'director'
  | 'secretary'
  | 'financial'
  | 'administrator'
  | 'administrative'
  | 'assistant'
  | 'other';

export type EmployeeCreateAddress = {
  zipCode: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  complement?: string | undefined;
};

export type EmployeeCreateContact = {
  type: ContactTypeValue;
  value: string;
};

export type EmployeeContact = {
  id?: string | undefined;
  type: ContactTypeValue;
  value: string;
};

export type EmployeeCreatePerson = {
  fullName: string;
  documentNumber: string;
  documentType: DocumentTypeValue;
  naturality?: string | undefined;
};

export type EmployeeCreateWithExistingPersonRequest = {
  personId: string;
  jobTitle: EmployeeJobTitle;
  department?: string | undefined;
};

export type EmployeeCreateFromScratchRequest = {
  person: EmployeeCreatePerson;
  addresses: EmployeeCreateAddress[];
  contacts: EmployeeCreateContact[];
  jobTitle: EmployeeJobTitle;
  department?: string | undefined;
};

export type EmployeeCreateRequest =
  | EmployeeCreateWithExistingPersonRequest
  | EmployeeCreateFromScratchRequest;

export type EmployeeRoleReference = {
  id: string;
  role: {
    id: string;
    name: string;
  };
};

export type EmployeePersonReference = {
  id: string;
  fullName?: string | undefined;
  documentNumber?: string | undefined;
  naturality?: string | undefined;
  contacts?: EmployeeContact[] | undefined;
};

export type EmployeeAccountReference = {
  id: string;
  jobTitle: EmployeeJobTitle;
  person?: EmployeePersonReference | null | undefined;
};

export type Employee = {
  id: string;
  jobTitle: EmployeeJobTitle;
  department?: string | undefined;
  status?: EmployeeStatusValue | undefined;
  email?: string | undefined;
  roles?: EmployeeRoleReference[] | undefined;
  person?: EmployeePersonReference | null | undefined;
  employee?: EmployeeAccountReference | null | undefined;
  contacts?: EmployeeContact[] | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
};

export type EmployeeQueryParams = ClientBaseQueryParams & {
  status?: EmployeeStatusValue | undefined;
  jobTitle?: EmployeeJobTitle | undefined;
};
