import { afterEach, describe, expect, it, vi } from 'vitest';
import { httpClient } from '@shared/services/httpClient';
import { medicalInfoService } from '@features/client/medical-info/services/medicalInfoServices';

describe('medicalInfoService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('lista informações médicas no endpoint do guia', async () => {
    const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      data: {
        data: [{ id: 'medical-1', bloodType: 'O+' }],
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

    await medicalInfoService.list({ page: 1, limit: 10 });

    expect(getSpy).toHaveBeenCalledWith('/api/medical-info', {
      params: { page: 1, limit: 10, sortOrder: 'DESC' },
    });
  });

  it('cria informações médicas no endpoint do guia', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValueOnce({
      data: { id: 'medical-1', bloodType: 'O+' },
    });

    await medicalInfoService.create({ personId: 'person-1', bloodType: 'O+' });

    expect(postSpy).toHaveBeenCalledWith('/api/medical-info', {
      personId: 'person-1',
      bloodType: 'O+',
    });
  });
});
