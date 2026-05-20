import { onlyDigits } from '@shared/parsers/stringParsers';
import type { StudentEditFormValues } from '../schemas/studentEditForm.schema';
import type { StudentCreateFormValues } from '../schemas/studentCreateForm.schema';
import type { Student, StudentRequest } from '../types/student.types';

const getOptionalText = (value: string | undefined): string | undefined => {
  const trimmedValue = value?.trim() ?? '';
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

export const createStudentInitialValues = (): StudentCreateFormValues => ({
  fullName: '',
  documentNumber: '',
  documentType: 'CPF',
  dateOfBirth: '',
  gender: 'prefer_not_to_say',
  registrationCode: '',
  status: 'active',
});

export const toStudentCreatePayload = (values: StudentCreateFormValues): StudentRequest => ({
  registrationCode: getOptionalText(values.registrationCode),
  status: values.status,
  person: {
    fullName: values.fullName.trim(),
    documentNumber: onlyDigits(values.documentNumber ?? ''),
    documentType: values.documentType,
    dateOfBirth: getOptionalText(values.dateOfBirth),
    gender: values.gender,
  },
});

export const toStudentEditFormValues = (entity: Student): StudentEditFormValues => ({
  documentNumber: entity.person?.documentNumber ?? '',
  documentType: entity.person?.documentType ?? 'CPF',
  dateOfBirth: entity.person?.dateOfBirth ?? '',
  gender: entity.person?.gender ?? 'prefer_not_to_say',
  registrationCode: entity.registrationCode ?? '',
  status: entity.status,
});

export const toStudentEditPayload = (values: StudentEditFormValues): StudentRequest => ({
  registrationCode: getOptionalText(values.registrationCode),
  status: values.status,
  person: {
    documentNumber: onlyDigits(values.documentNumber ?? ''),
    documentType: values.documentType,
    dateOfBirth: getOptionalText(values.dateOfBirth),
    gender: values.gender,
  },
});
