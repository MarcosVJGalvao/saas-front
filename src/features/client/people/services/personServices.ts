import { createClientCrudService } from '@features/client/shared/services/createClientCrudService';
import type { ClientApiRecord } from '@features/client/shared/types/clientApi.types';
import type { Person, PersonQueryParams } from '@features/client/people/types/person.types';

export const personService = createClientCrudService<
  Person,
  Person,
  ClientApiRecord,
  ClientApiRecord,
  PersonQueryParams
>('/api/person');
