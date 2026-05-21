import { afterEach, describe, expect, it, vi } from 'vitest';
import { clientRolesService, clientUsersService } from '@features/client/admin/services/service';
import { httpClient } from '@shared/services/httpClient';

describe('admin services', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('lista usuários pelo endpoint correto usando search', async () => {
    const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      data: {
        data: [{ id: 'user-1', email: 'maria@escola.com', status: 'active' }],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    });

    const response = await clientUsersService.list({ page: 1, limit: 10, search: 'maria' });

    expect(getSpy).toHaveBeenCalledWith('/api/users', {
      params: { page: 1, limit: 10, search: 'maria', sortOrder: 'DESC' },
    });
    expect(response.data[0]?.email).toBe('maria@escola.com');
  });

  it('carrega detalhes de usuário pelo endpoint correto', async () => {
    const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      data: {
        id: 'user-1',
        fullName: 'Maria Souza',
        email: 'maria@escola.com',
        status: 'active',
      },
    });

    const response = await clientUsersService.getById('user-1');

    expect(getSpy).toHaveBeenCalledWith('/api/users/user-1');
    expect(response.email).toBe('maria@escola.com');
  });

  it('lista perfis pelo endpoint correto', async () => {
    const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      data: {
        data: [{ id: 'role-1', name: 'Secretaria', status: 'active' }],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    });

    const response = await clientRolesService.list({ page: 1, limit: 10 });

    expect(getSpy).toHaveBeenCalledWith('/api/roles', {
      params: { page: 1, limit: 10, sortOrder: 'DESC' },
    });
    expect(response.data[0]?.name).toBe('Secretaria');
  });

  it('carrega detalhes de perfil pelo endpoint correto', async () => {
    const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      data: {
        id: 'role-1',
        name: 'Secretaria',
        description: 'Acesso operacional',
        permissionsCount: 12,
        status: 'active',
      },
    });

    const response = await clientRolesService.getById('role-1');

    expect(getSpy).toHaveBeenCalledWith('/api/roles/role-1');
    expect(response.name).toBe('Secretaria');
  });
});
