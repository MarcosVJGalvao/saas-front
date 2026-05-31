import { describe, expect, it } from 'vitest';
import { toClientRoleCreatePayload } from '@features/client/admin/normalizers/clientRoleForm.normalizer';
import { toClientUserCreatePayload } from '@features/client/admin/normalizers/clientUserForm.normalizer';
import { clientRoleCreateFormSchema } from '@features/client/admin/schemas/clientRoleCreateForm.schema';
import { clientUserCreateFormSchema } from '@features/client/admin/schemas/clientUserCreateForm.schema';

describe('admin entity form normalizers', () => {
  it('normaliza payload de usuario', () => {
    const values = clientUserCreateFormSchema.parse({
      employeeId: ' employee-1 ',
      email: ' maria@escola.com ',
      password: ' senha-forte-123 ',
    });

    expect(toClientUserCreatePayload(values)).toEqual({
      employeeId: 'employee-1',
      email: 'maria@escola.com',
      password: 'senha-forte-123',
    });
  });

  it('normaliza payload de perfil', () => {
    const values = clientRoleCreateFormSchema.parse({
      name: ' Secretaria ',
      description: ' Operacao escolar ',
      permissionIds: ['5b55f8ac-3b74-4c44-9a32-1f1f0a8d2b10'],
    });

    expect(toClientRoleCreatePayload(values)).toEqual({
      name: 'Secretaria',
      description: 'Operacao escolar',
      permissionIds: ['5b55f8ac-3b74-4c44-9a32-1f1f0a8d2b10'],
    });
  });
});
