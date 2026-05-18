import type { DocumentFormatValue, DocumentGenerationStatusValue } from '@shared/i18n/pt-BR/enums';
import type { ClientBaseQueryParams } from '@features/client/shared/types/clientApi.types';

export type DocumentFormat = DocumentFormatValue;
export type DocumentGenerationStatus = DocumentGenerationStatusValue;

export type GeneratedDocument = {
  id: string;
  title: string;
  format: DocumentFormat;
  status: DocumentGenerationStatus;
  templateKey?: string | undefined;
  fileName?: string | undefined;
  mimeType?: string | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
};

export type GeneratedDocumentQueryParams = ClientBaseQueryParams & {
  title?: string | undefined;
  format?: DocumentFormat | undefined;
  status?: DocumentGenerationStatus | undefined;
  templateKey?: string | undefined;
};

export type DocumentDownload = {
  blob: Blob;
  fileName?: string | undefined;
};
