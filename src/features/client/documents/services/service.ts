import { getFileNameFromContentDisposition } from '@shared/utils/contentDisposition';
import { clientDocumentsEndpoints } from '@features/client/documents/services/endpoints';
import type {
  DocumentDetailsResponse,
  DocumentDownloadResponse,
  DocumentsListParams,
  DocumentsListResponse,
} from '@features/client/documents/services/types';

const getHeaderValue = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined;

export const documentsService = {
  async list(params: DocumentsListParams): Promise<DocumentsListResponse> {
    const { data } = await clientDocumentsEndpoints.list(params);
    return data;
  },
  async getById(id: string): Promise<DocumentDetailsResponse> {
    const { data } = await clientDocumentsEndpoints.getById(id);
    return data;
  },
  async remove(id: string): Promise<void> {
    await clientDocumentsEndpoints.remove(id);
  },
  async download(id: string): Promise<DocumentDownloadResponse> {
    const response = await clientDocumentsEndpoints.download(id);
    const contentDisposition = getHeaderValue(response.headers['content-disposition']);

    return {
      blob: response.data,
      fileName: getFileNameFromContentDisposition(contentDisposition),
    };
  },
};
