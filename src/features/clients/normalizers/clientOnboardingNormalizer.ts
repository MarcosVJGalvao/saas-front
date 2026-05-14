import type { CreateClientOnboardingRequest } from '@features/clients/types/clients';
import type { ClientOnboardingUiExtras } from '@features/clients/hooks/useClientOnboardingForm';
import { normalizeOptionalDateToIsoDate } from '@shared/normalizers/dateNormalizers';
import { onlyDigits } from '@shared/parsers/stringParsers';

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
      dateOfBirth: normalizeOptionalDateToIsoDate(value.employee.person.dateOfBirth),
    },
  },
});

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
