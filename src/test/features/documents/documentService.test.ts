import { afterEach, describe, expect, it, vi } from 'vitest';
import { documentService } from '@features/client/documents/services/documentServices';
import { httpClient } from '@shared/services/httpClient';

describe('documentService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('baixa documento como blob e usa nome do cabeçalho', async () => {
    const blob = new Blob(['pdf'], { type: 'application/pdf' });
    const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      data: blob,
      headers: {
        'content-disposition': 'attachment; filename="documento-final.pdf"',
      },
    });

    const response = await documentService.download('document-1');

    expect(getSpy).toHaveBeenCalledWith('/api/documents/document-1/download', {
      responseType: 'blob',
    });
    expect(response.blob).toBe(blob);
    expect(response.fileName).toBe('documento-final.pdf');
  });
});
