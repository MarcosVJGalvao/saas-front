import { afterEach, describe, expect, it, vi } from 'vitest';
import { academicYearService } from '@features/client/academic/services/service';
import { httpClient } from '@shared/services/httpClient';

describe('academicYearService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('lista anos letivos com filtros', async () => {
    const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      data: {
        data: [{ id: 'year-1', name: '2026', status: 'active' }],
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

    const response = await academicYearService.list({ page: 1, limit: 10, status: 'active' });

    expect(getSpy).toHaveBeenCalledWith('/api/academic-years', {
      params: { page: 1, limit: 10, status: 'active', sortOrder: 'DESC' },
    });
    expect(response.data[0]?.name).toBe('2026');
  });

  it('fecha e reabre ano letivo pelos endpoints corretos', async () => {
    const patchSpy = vi.spyOn(httpClient, 'patch').mockResolvedValue({ data: undefined });

    await academicYearService.close('year-1');
    await academicYearService.reopen('year-1');

    expect(patchSpy).toHaveBeenCalledWith('/api/academic-years/year-1/close');
    expect(patchSpy).toHaveBeenCalledWith('/api/academic-years/year-1/reopen');
  });
});
