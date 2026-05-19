import { afterEach, describe, expect, it, vi } from 'vitest';
import { httpClient } from '@shared/services/httpClient';
import { employeeService } from '@features/client/employees/services/employeeServices';

describe('employeeService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('lista funcionários no endpoint do guia', async () => {
    const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      data: {
        data: [{ id: 'employee-1', jobTitle: 'Professor' }],
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

    await employeeService.list({ page: 1, limit: 10, search: 'ana' });

    expect(getSpy).toHaveBeenCalledWith('/api/employees', {
      params: { page: 1, limit: 10, search: 'ana', sortOrder: 'DESC' },
    });
  });

  it('cria funcionário no endpoint do guia', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValueOnce({
      data: { id: 'employee-1', jobTitle: 'Professor' },
    });

    await employeeService.create({ jobTitle: 'Professor' });

    expect(postSpy).toHaveBeenCalledWith('/api/employees', { jobTitle: 'Professor' });
  });
});
