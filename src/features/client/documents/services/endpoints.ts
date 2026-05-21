import { httpClient } from '@shared/services/httpClient';
import type {
  DocumentDeleteResponse,
  DocumentDetailsResponse,
  DocumentsListParams,
  DocumentsListResponse,
} from '@features/client/documents/services/types';

const CLIENT_DOCUMENTS_BASE_PATH = '/api/documents';

export const clientDocumentsEndpoints = {
  list: (params: DocumentsListParams) =>
    httpClient.get<DocumentsListResponse>(CLIENT_DOCUMENTS_BASE_PATH, {
      params: { ...params, sortOrder: params.sortOrder ?? 'DESC' },
    }),
  getById: (id: string) =>
    httpClient.get<DocumentDetailsResponse>(`${CLIENT_DOCUMENTS_BASE_PATH}/${id}`),
  remove: (id: string) =>
    httpClient.delete<DocumentDeleteResponse>(`${CLIENT_DOCUMENTS_BASE_PATH}/${id}`),
  download: (id: string) =>
    httpClient.get<Blob>(`${CLIENT_DOCUMENTS_BASE_PATH}/${id}/download`, {
      responseType: 'blob',
    }),
};
