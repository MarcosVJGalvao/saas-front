import type { PaginatedResponse } from '@shared/types/pagination';
import type {
  DocumentDownload,
  GeneratedDocument,
  GeneratedDocumentQueryParams,
} from '@features/client/documents/types/document.types';

export type DocumentsListParams = GeneratedDocumentQueryParams;
export type DocumentsListResponse = PaginatedResponse<GeneratedDocument>;
export type DocumentDetailsResponse = GeneratedDocument;
export type DocumentDeleteResponse = void;
export type DocumentDownloadResponse = DocumentDownload;
