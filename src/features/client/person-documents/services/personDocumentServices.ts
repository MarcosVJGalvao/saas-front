import { httpClient } from '@shared/services/httpClient';
import type { PaginatedResponse } from '@shared/types/pagination';
import type {
  PersonDocument,
  PersonDocumentQueryParams,
} from '@features/client/person-documents/types/personDocument.types';

export const personDocumentService = {
  async list(
    personId: string,
    params: PersonDocumentQueryParams,
  ): Promise<PaginatedResponse<PersonDocument>> {
    const { data } = await httpClient.get<PaginatedResponse<PersonDocument>>(
      `/api/person/${personId}/documents`,
      { params: { ...params, sortOrder: params.sortOrder ?? 'DESC' } },
    );
    return data;
  },
  async upload(personId: string, title: string, file: File): Promise<PersonDocument> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    const { data } = await httpClient.post<PersonDocument>(
      `/api/person/${personId}/documents`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return data;
  },
  async remove(id: string): Promise<void> {
    await httpClient.delete(`/api/person-documents/${id}`);
  },
};
