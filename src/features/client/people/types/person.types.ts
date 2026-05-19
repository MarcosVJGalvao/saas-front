import type {
  DocumentTypeValue,
  GenderValue,
  MaritalStatusValue,
  NationalityValue,
} from '@shared/i18n/pt-BR/enums';
import type { ClientBaseQueryParams } from '@features/client/shared/types/clientApi.types';

export type Person = {
  id: string;
  fullName: string;
  documentType?: DocumentTypeValue | undefined;
  documentNumber?: string | undefined;
  dateOfBirth?: string | undefined;
  gender?: GenderValue | undefined;
  maritalStatus?: MaritalStatusValue | undefined;
  nationality?: NationalityValue | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
};

export type PersonQueryParams = ClientBaseQueryParams & {
  documentType?: DocumentTypeValue | undefined;
};
