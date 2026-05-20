import { onlyDigits } from '@shared/parsers/stringParsers';
import type { Client } from '@features/platform/clients/types/clients';
import type {
  CreateClientRequest,
  UpdateClientRequest,
} from '@features/platform/clients/types/clients';
import type { ClientCreateFormValues } from '@features/platform/clients/schemas/clientCreateForm.schema';
import type { ClientEditFormValues } from '@features/platform/clients/schemas/clientEditForm.schema';

const normalizeOptionalText = (value?: string): string | undefined => {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : undefined;
};

export const createClientCreateInitialValues = (): ClientCreateFormValues => ({
  legalName: '',
  tradeName: '',
  documentNumber: '',
  documentType: 'CNPJ',
  email: '',
  phone: '',
  status: 'active',
  logoUrl: '',
  website: '',
  industry: '',
  notes: '',
});

export const toClientCreatePayload = (formValues: ClientCreateFormValues): CreateClientRequest => ({
  legalName: formValues.legalName.trim(),
  tradeName: formValues.tradeName.trim(),
  documentNumber: onlyDigits(formValues.documentNumber),
  documentType: formValues.documentType,
  email: formValues.email.trim().toLowerCase(),
  phone: onlyDigits(formValues.phone),
  status: formValues.status,
  logoUrl: normalizeOptionalText(formValues.logoUrl),
  website: normalizeOptionalText(formValues.website),
  industry: normalizeOptionalText(formValues.industry),
  notes: normalizeOptionalText(formValues.notes),
});

export const toClientEditFormValues = (client: Client): ClientEditFormValues => ({
  legalName: client.legalName,
  tradeName: client.tradeName,
  email: client.email,
  phone: client.phone,
  status: client.status,
  logoUrl: client.logoUrl ?? '',
  website: client.website ?? '',
  industry: client.industry ?? '',
  notes: client.notes ?? '',
});

export const toClientEditPayload = (formValues: ClientEditFormValues): UpdateClientRequest => ({
  legalName: formValues.legalName.trim(),
  tradeName: formValues.tradeName.trim(),
  email: formValues.email.trim().toLowerCase(),
  phone: onlyDigits(formValues.phone),
  status: formValues.status,
  logoUrl: normalizeOptionalText(formValues.logoUrl),
  website: normalizeOptionalText(formValues.website),
  industry: normalizeOptionalText(formValues.industry),
  notes: normalizeOptionalText(formValues.notes),
});
