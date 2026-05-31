import type { CreateClientOnboardingRequest } from '@features/platform/clients/types/clients';
import type { ClientOnboardingUiExtras } from '@features/platform/clients/types/clientOnboarding';

export const initialClientOnboardingValue: CreateClientOnboardingRequest = {
  legalName: '',
  tradeName: '',
  documentNumber: '',
  documentType: 'CNPJ',
  clientEmail: '',
  phone: '',
  tenantName: '',
  tenantSlug: '',
  timezone: '',
  locale: '',
  currency: '',
  planId: '',
  adminPassword: '',
  employee: {
    person: { fullName: '', documentNumber: '', documentType: 'CPF', naturality: '' },
    contacts: [{ type: 'email', value: '' }],
    department: '',
  },
  clientAddress: {
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  },
};

export const initialClientOnboardingUiExtras: ClientOnboardingUiExtras = {
  cep: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  country: 'Brasil',
};
