import { onlyDigits } from '@shared/parsers/stringParsers';
import type { PersonFormValues } from '@features/client/people/schemas/personFormSchema';
import type { Person } from '@features/client/people/types/person.types';

const optionalText = (value: string | undefined): string | undefined => {
  const trimmedValue = value?.trim() ?? '';
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

export const buildPersonInitialValues = (): PersonFormValues => ({
  fullName: '',
  documentType: 'CPF',
  documentNumber: '',
  dateOfBirth: '',
  gender: 'prefer_not_to_say',
  maritalStatus: 'single',
  nationality: 'brazilian',
});

export const normalizePersonInitialValues = (person: Person): PersonFormValues => ({
  fullName: person.fullName,
  documentType: person.documentType ?? 'CPF',
  documentNumber: person.documentNumber ?? '',
  dateOfBirth: person.dateOfBirth ?? '',
  gender: person.gender ?? 'prefer_not_to_say',
  maritalStatus: person.maritalStatus ?? 'single',
  nationality: person.nationality ?? 'brazilian',
});

export const normalizePersonPayload = (values: PersonFormValues): Record<string, unknown> => ({
  fullName: values.fullName.trim(),
  documentType: values.documentType,
  documentNumber: onlyDigits(values.documentNumber ?? ''),
  dateOfBirth: optionalText(values.dateOfBirth),
  gender: values.gender,
  maritalStatus: values.maritalStatus,
  nationality: values.nationality,
});
