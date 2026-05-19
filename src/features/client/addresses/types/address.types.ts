import type { ClientBaseQueryParams } from '@features/client/shared/types/clientApi.types';

export type Address = {
  id: string;
  personId?: string | undefined;
  street?: string | undefined;
  number?: string | undefined;
  complement?: string | undefined;
  neighborhood?: string | undefined;
  city?: string | undefined;
  state?: string | undefined;
  zipCode?: string | undefined;
  country?: string | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
};

export type AddressQueryParams = ClientBaseQueryParams & {
  personId?: string | undefined;
  city?: string | undefined;
  state?: string | undefined;
};
