import { createClientCrudService } from '@features/client/shared/services/createClientCrudService';
import type { ClientApiRecord } from '@features/client/shared/types/clientApi.types';
import type { Contact, ContactQueryParams } from '@features/client/contacts/types/contact.types';

export const contactService = createClientCrudService<
  Contact,
  Contact,
  ClientApiRecord,
  ClientApiRecord,
  ContactQueryParams
>('/api/contact');
