import type { ClientUserCreateFormValues } from '@features/client/admin/schemas/clientUserCreateForm.schema';
import type { ClientUserEditFormValues } from '@features/client/admin/schemas/clientUserEditForm.schema';
import type {
  ClientUser,
  ClientUserCreatePayload,
  ClientUserUpdatePayload,
} from '@features/client/admin/types/admin.types';

const toOptionalText = (value: string): string | undefined => {
  const trimmedValue = value.trim();
  return trimmedValue ? trimmedValue : undefined;
};

export const toClientUserCreatePayload = (
  values: ClientUserCreateFormValues,
): ClientUserCreatePayload => ({
  name: values.name.trim(),
  fullName: values.name.trim(),
  email: toOptionalText(values.email),
  roleId: toOptionalText(values.roleId),
});

export const toClientUserEditFormValues = (user: ClientUser): ClientUserEditFormValues => ({
  email: user.email ?? '',
  roleId: user.role?.id ?? '',
  status: user.status ?? 'active',
});

export const toClientUserUpdatePayload = (
  values: ClientUserEditFormValues,
): ClientUserUpdatePayload => ({
  email: toOptionalText(values.email),
  roleId: toOptionalText(values.roleId),
  status: values.status,
});
