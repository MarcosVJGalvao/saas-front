import { describe, expect, it } from 'vitest';
import { toClientRoleCreatePayload } from '@features/client/admin/normalizers/clientRoleForm.normalizer';
import { toClientUserCreatePayload } from '@features/client/admin/normalizers/clientUserForm.normalizer';
import { clientRoleCreateFormSchema } from '@features/client/admin/schemas/clientRoleCreateForm.schema';
import { clientUserCreateFormSchema } from '@features/client/admin/schemas/clientUserCreateForm.schema';

describe('admin entity form normalizers', () => {
  it('normaliza payload de usuário', () => {
    const values = clientUserCreateFormSchema.parse({
      name: ' Maria Souza ',
      email: ' maria@escola.com ',
      roleId: ' role-1 ',
      status: 'active',
    });

    expect(toClientUserCreatePayload(values)).toEqual({
      name: 'Maria Souza',
      fullName: 'Maria Souza',
      email: 'maria@escola.com',
      roleId: 'role-1',
      status: 'active',
    });
  });

  it('normaliza payload de perfil', () => {
    const values = clientRoleCreateFormSchema.parse({
      name: ' Secretaria ',
      description: ' Operação escolar ',
      permissionIds: ['5b55f8ac-3b74-4c44-9a32-1f1f0a8d2b10'],
    });

    expect(toClientRoleCreatePayload(values)).toEqual({
      name: 'Secretaria',
      description: 'Operação escolar',
      permissionIds: ['5b55f8ac-3b74-4c44-9a32-1f1f0a8d2b10'],
    });
  });
});
