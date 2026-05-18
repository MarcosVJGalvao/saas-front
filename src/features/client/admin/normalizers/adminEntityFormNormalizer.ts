import type { AdminEntityFormValues } from '@features/client/admin/schemas/adminEntityFormSchema';
import type { ClientAdminEntity, ClientUser } from '@features/client/admin/types/admin.types';

const optionalText = (value: string | undefined): string | undefined => {
  const trimmedValue = value?.trim() ?? '';
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

const hasEmail = (value: ClientAdminEntity): value is ClientUser => 'email' in value;

export const buildAdminEntityInitialValues = (): AdminEntityFormValues => ({
  name: '',
  email: '',
  roleId: '',
  status: 'active',
  description: '',
});

export const normalizeAdminEntityInitialValues = (
  value: ClientAdminEntity,
): AdminEntityFormValues => ({
  name: hasEmail(value) ? (value.fullName ?? value.name ?? '') : value.name,
  email: hasEmail(value) ? (value.email ?? '') : '',
  roleId: hasEmail(value) ? (value.role?.id ?? '') : '',
  status: value.status ?? 'active',
  description: 'description' in value ? (value.description ?? '') : '',
});

export const normalizeAdminEntityPayload = (
  values: AdminEntityFormValues,
  includeUserFields: boolean,
): Record<string, unknown> => ({
  name: values.name.trim(),
  fullName: includeUserFields ? values.name.trim() : undefined,
  email: includeUserFields ? optionalText(values.email) : undefined,
  roleId: includeUserFields ? optionalText(values.roleId) : undefined,
  status: values.status,
  description: includeUserFields ? undefined : optionalText(values.description),
});
