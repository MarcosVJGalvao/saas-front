import type { ClientRoleCreateFormValues } from '@features/client/admin/schemas/clientRoleCreateForm.schema';
import type { ClientRoleEditFormValues } from '@features/client/admin/schemas/clientRoleEditForm.schema';
import type {
  ClientRole,
  ClientRoleCreatePayload,
  ClientRoleUpdatePayload,
} from '@features/client/admin/types/admin.types';

const toOptionalText = (value: string): string | undefined => {
  const trimmedValue = value.trim();
  return trimmedValue ? trimmedValue : undefined;
};

export const toClientRoleCreatePayload = (
  values: ClientRoleCreateFormValues,
): ClientRoleCreatePayload => ({
  name: values.name.trim(),
  description: toOptionalText(values.description),
  permissionIds: values.permissionIds,
});

export const toClientRoleEditFormValues = (role: ClientRole): ClientRoleEditFormValues => ({
  name: role.name,
  description: role.description ?? '',
  permissionIds: role.permissions?.map((permission) => permission.id) ?? [],
});

export const toClientRoleUpdatePayload = (
  values: ClientRoleEditFormValues,
): ClientRoleUpdatePayload => ({
  name: values.name.trim(),
  description: toOptionalText(values.description),
  permissionIds: values.permissionIds,
});
