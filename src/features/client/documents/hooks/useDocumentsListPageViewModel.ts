import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RowActionItem } from '@shared/components/data-display/data/RowActionsMenu';
import { downloadBlob } from '@shared/utils/downloadBlob';
import {
  buildDocumentsMobileConfig,
  buildDocumentsTableColumns,
} from '@features/client/documents/components/documentsListPresentation';
import { documentService } from '@features/client/documents/services/documentServices';
import { useDocumentsList } from '@features/client/documents/hooks/useDocumentsList';
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
  title: getOptionalString(filterValues.query),
  format: getOptionalFormat(filterValues.format),
  status: getOptionalStatus(filterValues.status),
  templateKey: getOptionalString(filterValues.templateKey),
  startDate: getOptionalString(filterValues.startDate),
  endDate: getOptionalString(filterValues.endDate),
  page: 1,
});

const resolveDownloadFileName = (
  row: GeneratedDocument,
  headerFileName: string | undefined,
): string => headerFileName ?? row.fileName ?? `documento-${row.id}.${row.format}`;

export const useDocumentsListPageViewModel = () => {
  const navigate = useNavigate();
  const list = useDocumentsList();
  const [filterValues, setFilterValues] = useState<DocumentFilterValues>(initialFilterValues);
  const [deleteDocumentId, setDeleteDocumentId] = useState<string | undefined>(undefined);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | undefined>(undefined);

  const selectedDocument = useMemo(
    () => list.rows.find((row) => row.id === deleteDocumentId),
    [deleteDocumentId, list.rows],
  );

  const onFilterChange = (name: string, value: unknown): void => {
    setFilterValues((currentValues) => ({ ...currentValues, [name]: value ?? '' }));
  };

  const applyFilters = (): void => {
    list.updateQuery(buildQueryFromFilters(filterValues));
  };

  const clearFilters = (): void => {
    setFilterValues(initialFilterValues);
    list.updateQuery({
      page: 1,
      search: undefined,
      title: undefined,
      format: undefined,
      status: undefined,
      templateKey: undefined,
      startDate: undefined,
      endDate: undefined,
    });
  };

  const downloadDocument = useCallback(async (row: GeneratedDocument): Promise<void> => {
    setActionLoading(true);
    setActionErrorMessage(undefined);
    try {
      const download = await documentService.download(row.id);
      downloadBlob(download.blob, resolveDownloadFileName(row, download.fileName));
    } catch {
      setActionErrorMessage('Não foi possível baixar o documento.');
    } finally {
      setActionLoading(false);
    }
  }, []);

  const confirmDelete = async (): Promise<void> => {
    if (!deleteDocumentId) return;
    setActionLoading(true);
    setActionErrorMessage(undefined);
    try {
      await documentService.remove(deleteDocumentId);
      setDeleteDocumentId(undefined);
      await list.reload();
    } catch {
      setActionErrorMessage('Não foi possível remover o documento.');
    } finally {
      setActionLoading(false);
    }
  };

  const buildRowActions = useCallback(
    (row: GeneratedDocument): RowActionItem[] => [
      {
        key: 'details',
        label: 'Ver detalhes',
        onClick: () => void navigate(`/client/documents/${row.id}`),
      },
      {
        key: 'download',
        label: 'Baixar',
        onClick: () => {
          if (row.status !== 'completed') {
            setActionErrorMessage('O download fica disponível após a conclusão do processamento.');
            return;
          }
          void downloadDocument(row);
        },
      },
      {
        key: 'delete',
        label: 'Remover',
        onClick: () => setDeleteDocumentId(row.id),
      },
    ],
    [downloadDocument, navigate],
  );

  return {
    list,
    query: list.query.search ?? '',
    actionLoading,
    actionErrorMessage,
    filterValues,
    onFilterChange,
    applyFilters,
    clearFilters,
    onQueryChange: (search: string) => list.updateQuery({ search, title: search, page: 1 }),
    onPageChange: (page: number) => list.updateQuery({ page }),
    onLimitChange: (limit: number) => list.updateQuery({ limit, page: 1 }),
    columns: buildDocumentsTableColumns({ buildRowActions }),
    mobileConfig: buildDocumentsMobileConfig({ buildRowActions }),
    deleteDialogOpen: deleteDocumentId !== undefined,
    deleteDialogTitle: 'Remover documento',
    deleteDialogDescription: `Confirma a remoção do documento ${selectedDocument?.title ?? 'selecionado'}?`,
    closeDeleteDialog: () => setDeleteDocumentId(undefined),
    confirmDelete,
  };
};
