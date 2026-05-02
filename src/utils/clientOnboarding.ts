import type { CreateClientOnboardingRequest } from '../models/clients';
import type { ClientOnboardingUiExtras } from '../hooks/clients/useClientOnboardingForm';
import { onlyDigits } from './parse';

export const onboardingDocumentTypeOptions: CreateClientOnboardingRequest['employee']['person']['documentType'][] =
  ['CPF', 'CNPJ', 'RG', 'PASSPORT', 'OTHER'];

export const genderOptions: NonNullable<
  CreateClientOnboardingRequest['employee']['person']['gender']
>[] = ['male', 'female', 'other', 'prefer_not_to_say'];

export const maritalStatusOptions: NonNullable<
  CreateClientOnboardingRequest['employee']['person']['maritalStatus']
>[] = ['single', 'married', 'divorced', 'widowed', 'other'];

export const toOnboardingPayload = (
  value: CreateClientOnboardingRequest,
  uiExtras: ClientOnboardingUiExtras,
): CreateClientOnboardingRequest => ({
  ...value,
  documentNumber: onlyDigits(value.documentNumber),
  phone: onlyDigits(value.phone),
  clientAddress: {
    street: uiExtras.street,
    number: uiExtras.number,
    complement: uiExtras.complement || undefined,
    neighborhood: uiExtras.neighborhood,
    city: uiExtras.city,
    state: uiExtras.state,
    zipCode: onlyDigits(uiExtras.cep),
    country: uiExtras.country,
  },
  employee: {
    ...value.employee,
    person: {
      ...value.employee.person,
      documentNumber: onlyDigits(value.employee.person.documentNumber),
      dateOfBirth: normalizeDateOfBirth(value.employee.person.dateOfBirth),
    },
  },
});

const normalizeDateOfBirth = (value?: string): string | undefined => {
  if (!value) return undefined;
  const trimmedValue = value.trim();
  if (trimmedValue.length === 0) return undefined;

  const digits = onlyDigits(trimmedValue);
  if (digits.length === 8) {
    const day = digits.slice(0, 2);
    const month = digits.slice(2, 4);
    const year = digits.slice(4, 8);
    return `${year}-${month}-${day}`;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) {
    return trimmedValue;
  }

  return trimmedValue;
};

export const parseOnboardingDocumentType = (
  value: string,
): CreateClientOnboardingRequest['employee']['person']['documentType'] | undefined =>
  onboardingDocumentTypeOptions.find((option) => option === value);

export const parseGender = (
  value: string,
): NonNullable<CreateClientOnboardingRequest['employee']['person']['gender']> | undefined =>
  genderOptions.find((option) => option === value);

export const parseMaritalStatus = (
  value: string,
): NonNullable<CreateClientOnboardingRequest['employee']['person']['maritalStatus']> | undefined =>
  maritalStatusOptions.find((option) => option === value);
