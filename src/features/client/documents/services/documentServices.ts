import { httpClient } from '@shared/services/httpClient';
import { createClientCrudService } from '@features/client/shared/services/createClientCrudService';
import { getFileNameFromContentDisposition } from '@shared/utils/contentDisposition';
import type { ClientApiRecord } from '@features/client/shared/types/clientApi.types';
import type {
  DocumentDownload,
  GeneratedDocument,
  GeneratedDocumentQueryParams,
} from '@features/client/documents/types/document.types';

const getHeaderValue = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined;

export const documentService = {
  ...createClientCrudService<
    GeneratedDocument,
    GeneratedDocument,
    ClientApiRecord,
    ClientApiRecord,
    GeneratedDocumentQueryParams
  >('/api/documents'),
  async download(id: string): Promise<DocumentDownload> {
    const response = await httpClient.get<Blob>(`/api/documents/${id}/download`, {
      responseType: 'blob',
    });
    const contentDisposition = getHeaderValue(response.headers['content-disposition']);
    return {
      blob: response.data,
      fileName: getFileNameFromContentDisposition(contentDisposition),
    };
  },
};
