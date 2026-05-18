import { afterEach, describe, expect, it, vi } from 'vitest';
import { legalGuardianService } from '@features/client/students/services/studentServices';
import { httpClient } from '@shared/services/httpClient';

describe('legalGuardianService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('lista responsáveis com filtros', async () => {
    const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      data: {
        data: [
          {
            id: 'guardian-1',
            relationshipType: 'mother',
            person: { fullName: 'Ana Silva', documentNumber: '12345678900' },
          },
        ],
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

    const response = await legalGuardianService.list({
      page: 1,
      limit: 10,
      relationshipType: 'mother',
    });

    expect(getSpy).toHaveBeenCalledWith('/api/legal-guardians', {
      params: { page: 1, limit: 10, relationshipType: 'mother', sortOrder: 'DESC' },
    });
    expect(response.data[0]?.person?.fullName).toBe('Ana Silva');
  });

  it('busca detalhes do responsável pelo endpoint correto', async () => {
    const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      data: {
        id: 'guardian-1',
        relationshipType: 'father',
        person: { fullName: 'João Silva' },
      },
    });

    const response = await legalGuardianService.getById('guardian-1');

    expect(getSpy).toHaveBeenCalledWith('/api/legal-guardians/guardian-1');
    expect(response.relationshipType).toBe('father');
  });
});
