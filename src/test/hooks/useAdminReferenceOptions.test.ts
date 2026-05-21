import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAdminReferenceOptions } from '@features/client/admin/hooks/useAdminReferenceOptions';
import { clientRolesService } from '@features/client/admin/services/service';

vi.mock('@features/client/admin/services/service', () => ({
  clientRolesService: {
    list: vi.fn(),
  },
}));

const meta = {
  page: 1,
  limit: 10,
  total: 2,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

describe('useAdminReferenceOptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('carrega perfis como opções de select', async () => {
    vi.mocked(clientRolesService.list).mockResolvedValue({
      data: [
        { id: 'role-1', name: 'Administrador', description: '', status: 'active' },
        { id: 'role-2', name: 'Secretaria', description: '', status: 'active' },
      ],
      meta,
    });

    const { result } = renderHook(() => useAdminReferenceOptions());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.roleOptions).toEqual([
      { value: 'role-1', label: 'Administrador' },
      { value: 'role-2', label: 'Secretaria' },
    ]);
    expect(result.current.errorMessage).toBeUndefined();
  });
});
