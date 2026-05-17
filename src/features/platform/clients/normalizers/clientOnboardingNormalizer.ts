import type { CreateClientOnboardingRequest } from '@features/platform/clients/types/clients';
import type { ClientOnboardingUiExtras } from '@features/platform/clients/types/clientOnboarding';
import { normalizeOptionalDateToIsoDate } from '@shared/normalizers/dateNormalizers';
import { onlyDigits } from '@shared/parsers/stringParsers';

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
