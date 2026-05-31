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

export type Employee = {
  id: string;
  jobTitle: EmployeeJobTitle;
  department?: string | undefined;
  status?: EmployeeStatusValue | undefined;
  person?: {
    id: string;
    fullName?: string | undefined;
    documentNumber?: string | undefined;
    naturality?: string | undefined;
  } | null;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
};

export type EmployeeQueryParams = ClientBaseQueryParams & {
  status?: EmployeeStatusValue | undefined;
  jobTitle?: EmployeeJobTitle | undefined;
};
