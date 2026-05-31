import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useNotificationRecipientOptions } from '@features/client/notifications/hooks/useNotificationRecipientOptions';
import { clientUsersService } from '@features/client/admin/services/service';

vi.mock('@features/client/admin/services/service', () => ({
  clientUsersService: {
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

describe('useNotificationRecipientOptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('carrega usuários como opções de autocomplete', async () => {
    vi.mocked(clientUsersService.list).mockResolvedValue({
      data: [
        { id: 'user-1', fullName: 'Maria Silva', email: 'maria@teste.com' },
        { id: 'user-2', name: 'João Souza', email: 'joao@teste.com' },
      ],
      meta,
    });

    const { result } = renderHook(() => useNotificationRecipientOptions());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.userOptions).toEqual([
      { value: 'user-1', label: 'Maria Silva (maria@teste.com)' },
      { value: 'user-2', label: 'João Souza (joao@teste.com)' },
    ]);
    expect(result.current.errorMessage).toBeUndefined();
  });
});
