import { describe, expect, it } from 'vitest';
import {
  buildAdminEntityInitialValues,
  normalizeAdminEntityPayload,
} from '@features/client/admin/normalizers/adminEntityFormNormalizer';
import { adminEntityFormSchema } from '@features/client/admin/schemas/adminEntityFormSchema';

describe('admin entity form normalizer', () => {
  it('cria estado inicial padrão', () => {
    expect(buildAdminEntityInitialValues()).toEqual({
      name: '',
      email: '',
      roleId: '',
      status: 'active',
      description: '',
    });
  });

  it('normaliza usuário com campos de acesso', () => {
    const values = adminEntityFormSchema.parse({
      name: ' Maria Souza ',
      email: ' maria@escola.com ',
      roleId: ' role-1 ',
      status: 'active',
      description: '',
    });

    expect(normalizeAdminEntityPayload(values, true)).toEqual({
      name: 'Maria Souza',
      fullName: 'Maria Souza',
      email: 'maria@escola.com',
      roleId: 'role-1',
      status: 'active',
      description: undefined,
    });
  });

  it('normaliza perfil com descrição', () => {
    const values = adminEntityFormSchema.parse({
      name: ' Secretaria ',
      status: 'active',
      description: ' Operação escolar ',
    });

    expect(normalizeAdminEntityPayload(values, false)).toEqual({
      name: 'Secretaria',
      fullName: undefined,
      email: undefined,
      roleId: undefined,
      status: 'active',
      description: 'Operação escolar',
    });
  });
});
