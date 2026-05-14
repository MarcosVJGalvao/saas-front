import { onlyDigits } from '@shared/parsers/stringParsers';
import type {
  CreateClientRequest,
  UpdateClientRequest,
} from '@features/platform/clients/types/clients';

const normalizeOptionalText = (value?: string): string | undefined => {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : undefined;
};

export const normalizeClientPayload = (payload: CreateClientRequest): CreateClientRequest => ({
  ...payload,
  legalName: payload.legalName.trim(),
  tradeName: payload.tradeName.trim(),
  documentNumber: onlyDigits(payload.documentNumber),
  email: payload.email.trim().toLowerCase(),
  phone: onlyDigits(payload.phone),
  logoUrl: normalizeOptionalText(payload.logoUrl),
  website: normalizeOptionalText(payload.website),
  industry: normalizeOptionalText(payload.industry),
  notes: normalizeOptionalText(payload.notes),
});

export const normalizeClientUpdatePayload = (
  payload: UpdateClientRequest,
): UpdateClientRequest => ({
  ...payload,
  legalName: payload.legalName?.trim(),
  tradeName: payload.tradeName?.trim(),
  documentNumber:
    payload.documentNumber === undefined ? undefined : onlyDigits(payload.documentNumber),
  email: payload.email?.trim().toLowerCase(),
  phone: payload.phone === undefined ? undefined : onlyDigits(payload.phone),
  logoUrl: normalizeOptionalText(payload.logoUrl),
  website: normalizeOptionalText(payload.website),
  industry: normalizeOptionalText(payload.industry),
  notes: normalizeOptionalText(payload.notes),
});
