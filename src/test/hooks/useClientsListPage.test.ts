import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useClientsListPage } from '@features/platform/clients/hooks/useClientsListPage';

const mockNavigate = vi.fn();
const mockRefresh = vi.fn();
const mockRemove = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@features/platform/clients/hooks/useClientsList', () => ({
  useClientsList: () => ({
    rows: [],
    refresh: mockRefresh,
  }),
}));

vi.mock('@features/platform/clients/hooks/useClientDetails', () => ({
  useClientDetails: () => ({
    loading: false,
    errorMessage: null,
  }),
}));

vi.mock('@features/platform/clients/hooks/useClientsMutations', () => ({
  useClientsMutations: () => ({
    remove: mockRemove,
  }),
}));

describe('useClientsListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts without selected client and updates selection in memory', () => {
    const { result } = renderHook(() => useClientsListPage());

    expect(result.current.selectedClientId).toBeUndefined();

    act(() => {
      result.current.setSelectedClientId('client-2');
    });

    expect(result.current.selectedClientId).toBe('client-2');

    act(() => {
      result.current.setSelectedClientId(undefined);
    });

    expect(result.current.selectedClientId).toBeUndefined();
  });
});
