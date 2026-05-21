import { formatIsoDate } from '@shared/formatters';
import {
  translateDocumentFormat,
  translateDocumentGenerationStatus,
} from '@shared/i18n/pt-BR/enums';
import type { GeneratedDocument } from '@features/client/documents/types/document.types';

type KeyValueItem = {
  keyLabel: string;
  value: string;
};

type DocumentDetailsItems = {
  document: KeyValueItem[];
  processing: KeyValueItem[];
};

const formatDate = (value: string | undefined): string => (value ? formatIsoDate(value) : '-');

export const toDocumentDetailsItems = (document: GeneratedDocument): DocumentDetailsItems => ({
  document: [
    { keyLabel: 'Título', value: document.title || '-' },
    { keyLabel: 'Formato', value: translateDocumentFormat(document.format) },
    { keyLabel: 'Status', value: translateDocumentGenerationStatus(document.status) },
    { keyLabel: 'Template', value: document.templateKey ?? '-' },
    { keyLabel: 'Arquivo', value: document.fileName ?? '-' },
  ],
  processing: [
    { keyLabel: 'Tipo MIME', value: document.mimeType ?? '-' },
    { keyLabel: 'Criado em', value: formatDate(document.createdAt) },
    { keyLabel: 'Atualizado em', value: formatDate(document.updatedAt) },
  ],
});
