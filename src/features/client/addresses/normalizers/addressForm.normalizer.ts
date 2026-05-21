import { onlyDigits } from '@shared/parsers/stringParsers';
import type { Address } from '@features/client/addresses/types/address.types';
import type { AddressFormValues } from '@features/client/addresses/schemas/addressForm.schema';

const optionalText = (value: string | undefined): string | undefined => {
  const trimmedValue = value?.trim() ?? '';
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

export const buildAddressInitialValues = (): AddressFormValues => ({
  personId: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'Brasil',
});

export const normalizeAddressInitialValues = (address: Address): AddressFormValues => ({
  personId: address.personId ?? '',
  street: address.street ?? '',
  number: address.number ?? '',
  complement: address.complement ?? '',
  neighborhood: address.neighborhood ?? '',
  city: address.city ?? '',
  state: address.state ?? '',
  zipCode: address.zipCode ?? '',
  country: address.country ?? 'Brasil',
});

export const normalizeAddressPayload = (values: AddressFormValues): Record<string, unknown> => ({
  personId: optionalText(values.personId),
  street: values.street.trim(),
  number: optionalText(values.number),
  complement: optionalText(values.complement),
  neighborhood: optionalText(values.neighborhood),
  city: values.city.trim(),
  state: values.state.trim(),
  zipCode: onlyDigits(values.zipCode ?? ''),
  country: optionalText(values.country),
});
