import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useClientsListPage } from '@features/platform/clients/hooks/useClientsListPage';

const mockNavigate = vi.fn();
const mockReload = vi.fn();
const mockUpdateQueryParams = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@features/platform/clients/hooks/useClientsList', () => ({
  useClientsList: () => ({
    rows: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    queryParams: { page: 1, limit: 10 },
    loading: false,
    errorMessage: undefined,
    updateQueryParams: mockUpdateQueryParams,
    reload: mockReload,
  }),
}));

describe('useClientsListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('manages filter state and clears applied filters', () => {
    const { result } = renderHook(() => useClientsListPage());

    act(() => {
      result.current.onFilterChange('query', 'escola');
      result.current.onFilterChange('status', 'active');
    });

    expect(result.current.filterValues.query).toBe('escola');
    expect(result.current.filterValues.status).toBe('active');

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.filterValues.query).toBe('');
    expect(result.current.filterValues.status).toBe('');
    expect(mockUpdateQueryParams).toHaveBeenCalledWith({
      search: undefined,
      status: undefined,
      startDate: undefined,
      endDate: undefined,
      page: 1,
    });
  });
});
