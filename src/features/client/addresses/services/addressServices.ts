import { createClientCrudService } from '@features/client/shared/services/createClientCrudService';
import type { ClientApiRecord } from '@features/client/shared/types/clientApi.types';
import type { Address, AddressQueryParams } from '@features/client/addresses/types/address.types';

export const addressService = createClientCrudService<
  Address,
  Address,
  ClientApiRecord,
  ClientApiRecord,
  AddressQueryParams
>('/api/address');
