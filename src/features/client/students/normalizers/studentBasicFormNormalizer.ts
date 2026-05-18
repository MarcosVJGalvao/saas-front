import { onlyDigits } from '@shared/parsers/stringParsers';
import type {
  LegalGuardianBasicFormValues,
  StudentBasicFormValues,
} from '@features/client/students/schemas/studentBasicFormSchema';
import type { LegalGuardian, Student } from '@features/client/students/types/student.types';

const optionalText = (value: string | undefined): string | undefined => {
  const trimmedValue = value?.trim() ?? '';
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

export const buildStudentBasicInitialValues = (): StudentBasicFormValues => ({
  fullName: '',
  documentNumber: '',
  documentType: 'CPF',
  dateOfBirth: '',
  gender: 'prefer_not_to_say',
  registrationCode: '',
  status: 'active',
});

export const normalizeStudentBasicInitialValues = (value: Student): StudentBasicFormValues => ({
  fullName: value.person?.fullName ?? '',
  documentNumber: value.person?.documentNumber ?? '',
  documentType: value.person?.documentType ?? 'CPF',
  dateOfBirth: value.person?.dateOfBirth ?? '',
  gender: value.person?.gender ?? 'prefer_not_to_say',
  registrationCode: value.registrationCode ?? '',
  status: value.status,
});

export const normalizeStudentBasicPayload = (
  values: StudentBasicFormValues,
): Record<string, unknown> => ({
  registrationCode: optionalText(values.registrationCode),
  status: values.status,
  person: {
    fullName: values.fullName.trim(),
    documentNumber: onlyDigits(values.documentNumber ?? ''),
    documentType: values.documentType,
    dateOfBirth: optionalText(values.dateOfBirth),
    gender: values.gender,
  },
});

export const buildLegalGuardianBasicInitialValues = (): LegalGuardianBasicFormValues => ({
  fullName: '',
  documentNumber: '',
  documentType: 'CPF',
  relationshipType: 'legal_guardian',
});

export const normalizeLegalGuardianBasicInitialValues = (
  value: LegalGuardian,
): LegalGuardianBasicFormValues => ({
  fullName: value.person?.fullName ?? '',
  documentNumber: value.person?.documentNumber ?? '',
  documentType: value.person?.documentType ?? 'CPF',
  relationshipType: value.relationshipType ?? 'legal_guardian',
});

export const normalizeLegalGuardianBasicPayload = (
  values: LegalGuardianBasicFormValues,
): Record<string, unknown> => ({
  relationshipType: values.relationshipType,
  person: {
    fullName: values.fullName.trim(),
    documentNumber: onlyDigits(values.documentNumber ?? ''),
    documentType: values.documentType,
  },
});
