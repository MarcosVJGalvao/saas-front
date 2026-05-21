import { onlyDigits } from '@shared/parsers/stringParsers';
import type { ContactFormValues } from '@features/client/contacts/schemas/contactForm.schema';
import type { Contact } from '@features/client/contacts/types/contact.types';

const optionalText = (value: string | undefined): string | undefined => {
  const trimmedValue = value?.trim() ?? '';
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

const normalizeContactValue = (values: ContactFormValues): string =>
  values.type === 'email' ? values.value.trim() : onlyDigits(values.value);

export const buildContactInitialValues = (): ContactFormValues => ({
  personId: '',
  type: 'email',
  value: '',
  label: '',
  isPrimary: '',
});

export const normalizeContactInitialValues = (contact: Contact): ContactFormValues => ({
  personId: contact.personId ?? '',
  type: contact.type,
  value: contact.value,
  label: contact.label ?? '',
  isPrimary: contact.isPrimary ? 'true' : '',
});

export const normalizeContactPayload = (values: ContactFormValues): Record<string, unknown> => ({
  personId: optionalText(values.personId),
  type: values.type,
  value: normalizeContactValue(values),
  label: optionalText(values.label),
  isPrimary: values.isPrimary === 'true',
});
