import type { EmployeeStatusValue } from '@shared/i18n/pt-BR/enums';
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

export type Employee = {
  id: string;
  jobTitle: EmployeeJobTitle;
  department?: string | undefined;
  status?: EmployeeStatusValue | undefined;
  person?: {
    id: string;
    fullName?: string | undefined;
    documentNumber?: string | undefined;
  } | null;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
};

export type EmployeeQueryParams = ClientBaseQueryParams & {
  status?: EmployeeStatusValue | undefined;
  jobTitle?: EmployeeJobTitle | undefined;
};
