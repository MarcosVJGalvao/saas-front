import { onlyDigits } from '@shared/parsers/stringParsers';
import type { LegalGuardianEditFormValues } from '../schemas/legalGuardianEditForm.schema';
import type { LegalGuardianCreateFormValues } from '../schemas/legalGuardianCreateForm.schema';
import type { LegalGuardian, LegalGuardianRequest } from '../types/student.types';

export const createLegalGuardianInitialValues = (): LegalGuardianCreateFormValues => ({
  fullName: '',
  documentNumber: '',
  documentType: 'CPF',
  relationshipType: 'legal_guardian',
});

export const toLegalGuardianCreatePayload = (
  values: LegalGuardianCreateFormValues,
): LegalGuardianRequest => ({
  relationshipType: values.relationshipType,
  person: {
    fullName: values.fullName.trim(),
    documentNumber: onlyDigits(values.documentNumber ?? ''),
    documentType: values.documentType,
  },
});

export const toLegalGuardianEditFormValues = (
  entity: LegalGuardian,
): LegalGuardianEditFormValues => ({
  documentNumber: entity.person?.documentNumber ?? '',
  documentType: entity.person?.documentType ?? 'CPF',
  relationshipType: entity.relationshipType ?? 'legal_guardian',
});

export const toLegalGuardianEditPayload = (
  values: LegalGuardianEditFormValues,
): LegalGuardianRequest => ({
  relationshipType: values.relationshipType,
  person: {
    documentNumber: onlyDigits(values.documentNumber ?? ''),
    documentType: values.documentType,
  },
});
