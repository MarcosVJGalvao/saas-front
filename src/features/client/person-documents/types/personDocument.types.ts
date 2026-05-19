import type { DocumentFormatValue, DocumentGenerationStatusValue } from '@shared/i18n/pt-BR/enums';
import type { ClientBaseQueryParams } from '@features/client/shared/types/clientApi.types';

export type PersonDocument = {
  id: string;
  personId?: string | undefined;
  title: string;
  format?: DocumentFormatValue | undefined;
  status?: DocumentGenerationStatusValue | undefined;
  fileName?: string | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
};

export type PersonDocumentQueryParams = ClientBaseQueryParams & {
  format?: DocumentFormatValue | undefined;
  status?: DocumentGenerationStatusValue | undefined;
};
