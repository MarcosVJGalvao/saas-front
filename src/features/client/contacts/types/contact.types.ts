import type { ContactTypeValue } from '@shared/i18n/pt-BR/enums';
import type { ClientBaseQueryParams } from '@features/client/shared/types/clientApi.types';

export type ContactType = ContactTypeValue;

export type Contact = {
  id: string;
  personId?: string | undefined;
  type: ContactType;
  value: string;
  label?: string | undefined;
  isPrimary?: boolean | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
};

export type ContactQueryParams = ClientBaseQueryParams & {
  type?: ContactType | undefined;
  personId?: string | undefined;
};
