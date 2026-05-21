import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RowActionItem } from '@shared/components/data-display/data/RowActionsMenu';
import { downloadBlob } from '@shared/utils/downloadBlob';
import {
  buildDocumentListColumns,
  buildDocumentMobileConfig,
} from '@features/client/documents/components/documentListColumns';
import { useDocumentsList } from '@features/client/documents/hooks/useDocumentsList';
import { documentsService } from '@features/client/documents/services/service';
import type {
  DocumentFormat,
  DocumentGenerationStatus,
  GeneratedDocument,
  GeneratedDocumentQueryParams,
} from '@features/client/documents/types/document.types';

type DocumentFilterValues = Record<string, unknown>;

const initialFilterValues: DocumentFilterValues = {
  query: '',
  format: '',
  status: '',
  templateKey: '',
  startDate: '',
  endDate: '',
};

const isDocumentFormat = (value: string): value is DocumentFormat =>
  value === 'pdf' || value === 'csv' || value === 'xlsx';

const isDocumentGenerationStatus = (value: string): value is DocumentGenerationStatus =>
  value === 'pending' || value === 'processing' || value === 'completed' || value === 'failed';

const getStringValue = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const getOptionalString = (value: unknown): string | undefined => {
  const stringValue = getStringValue(value);
  return stringValue.length > 0 ? stringValue : undefined;
};

const getOptionalFormat = (value: unknown): DocumentFormat | undefined => {
  const stringValue = getStringValue(value);
  return isDocumentFormat(stringValue) ? stringValue : undefined;
};

const getOptionalStatus = (value: unknown): DocumentGenerationStatus | undefined => {
  const stringValue = getStringValue(value);
  return isDocumentGenerationStatus(stringValue) ? stringValue : undefined;
};

const buildQueryFromFilters = (
  filterValues: DocumentFilterValues,
): Partial<GeneratedDocumentQueryParams> => ({
  search: getOptionalString(filterValues.query),
  format: getOptionalFormat(filterValues.format),
  status: getOptionalStatus(filterValues.status),
  templateKey: getOptionalString(filterValues.templateKey),
  startDate: getOptionalString(filterValues.startDate),
  endDate: getOptionalString(filterValues.endDate),
  page: 1,
});

const resolveDownloadFileName = (
  document: GeneratedDocument,
  headerFileName: string | undefined,
): string => headerFileName ?? document.fileName ?? `documento-${document.id}.${document.format}`;

export const useDocumentsListPage = () => {
  const navigate = useNavigate();
  const documentsList = useDocumentsList();
  const [filterValues, setFilterValues] = useState<DocumentFilterValues>(initialFilterValues);
  const [documentPendingDelete, setDocumentPendingDelete] = useState<
    GeneratedDocument | undefined
  >();
  const [actionLoading, setActionLoading] = useState(false);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | undefined>();

  const handleFilterChange = (name: string, value: unknown): void => {
    setFilterValues((currentValues) => ({ ...currentValues, [name]: value ?? '' }));
  };

  const handleApplyFilters = (): void => {
    documentsList.updateQueryParams(buildQueryFromFilters(filterValues));
  };

  const handleClearFilters = (): void => {
    setFilterValues(initialFilterValues);
    documentsList.updateQueryParams({
      page: 1,
      search: undefined,
      format: undefined,
      status: undefined,
      templateKey: undefined,
      startDate: undefined,
      endDate: undefined,
    });
  };

  const handleDownload = useCallback(async (document: GeneratedDocument): Promise<void> => {
    setActionLoading(true);
    setActionErrorMessage(undefined);
    try {
      const download = await documentsService.download(document.id);
      downloadBlob(download.blob, resolveDownloadFileName(document, download.fileName));
    } catch {
      setActionErrorMessage('Não foi possível baixar o documento.');
    } finally {
      setActionLoading(false);
    }
  }, []);

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!documentPendingDelete) {
      return;
    }

    setActionLoading(true);
    setActionErrorMessage(undefined);
    try {
      await documentsService.remove(documentPendingDelete.id);
      setDocumentPendingDelete(undefined);
      await documentsList.reload();
    } catch {
      setActionErrorMessage('Não foi possível remover o documento.');
    } finally {
      setActionLoading(false);
    }
  };

  const buildRowActions = useCallback(
    (document: GeneratedDocument): RowActionItem[] => [
      {
        key: 'details',
        label: 'Ver detalhes',
        onClick: () => {
          void navigate(`/client/documents/${document.id}`);
        },
      },
      {
        key: 'download',
        label: 'Baixar',
        onClick: () => {
          if (document.status !== 'completed') {
            setActionErrorMessage('O download fica disponível após a conclusão do processamento.');
            return;
          }

          void handleDownload(document);
        },
      },
      {
        key: 'delete',
        label: 'Remover',
        onClick: () => {
          setDocumentPendingDelete(document);
        },
      },
    ],
    [handleDownload, navigate],
  );

  return {
    documentsList,
    actionErrorMessage,
    actionLoading,
    filterValues,
    onFilterChange: handleFilterChange,
    onApplyFilters: handleApplyFilters,
    onClearFilters: handleClearFilters,
    onQueryChange: (search: string) => {
      documentsList.updateQueryParams({ search, page: 1 });
    },
    onPageChange: (page: number) => {
      documentsList.updateQueryParams({ page });
    },
    onRowsPerPageChange: (limit: number) => {
      documentsList.updateQueryParams({ limit, page: 1 });
    },
    tableColumns: buildDocumentListColumns({ buildRowActions }),
    mobileConfig: buildDocumentMobileConfig({ buildRowActions }),
    deleteModal: {
      open: documentPendingDelete !== undefined,
      title: 'Remover documento',
      description: `Confirma a remoção do documento ${documentPendingDelete?.title ?? 'selecionado'}?`,
      confirmLabel: actionLoading ? 'Removendo...' : 'Remover',
      onClose: () => {
        setDocumentPendingDelete(undefined);
      },
      onConfirm: handleDeleteConfirm,
    },
  };
};
