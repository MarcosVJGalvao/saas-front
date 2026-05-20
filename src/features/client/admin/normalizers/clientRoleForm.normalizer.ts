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
  status: values.status,
  description: toOptionalText(values.description),
});

export const toClientRoleEditFormValues = (role: ClientRole): ClientRoleEditFormValues => ({
  status: role.status ?? 'active',
  description: role.description ?? '',
});

export const toClientRoleUpdatePayload = (
  values: ClientRoleEditFormValues,
): ClientRoleUpdatePayload => ({
  status: values.status,
  description: toOptionalText(values.description),
});
