import { useCallback, useEffect, useState } from 'react';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import {
  RowActionsMenu,
  type RowActionItem,
} from '@shared/components/data-display/data/RowActionsMenu';
import {
  translateDocumentFormat,
  translateDocumentGenerationStatus,
} from '@shared/i18n/pt-BR/enums';
import type { PaginationMeta } from '@shared/types/pagination';
import { personDocumentService } from '@features/client/person-documents/services/personDocumentServices';
import type {
  PersonDocument,
  PersonDocumentQueryParams,
} from '@features/client/person-documents/types/personDocument.types';

type PersonDocumentFilterValues = Record<string, unknown>;

const initialMeta: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

const initialFilterValues: PersonDocumentFilterValues = {
  query: '',
  personId: '',
};

const getStringValue = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const getOptionalString = (value: unknown): string | undefined => {
  const stringValue = getStringValue(value);
  return stringValue.length > 0 ? stringValue : undefined;
};

export const usePersonDocumentsPageViewModel = () => {
  const [rows, setRows] = useState<PersonDocument[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(initialMeta);
  const [query, setQuery] = useState<PersonDocumentQueryParams>({ page: 1, limit: 10 });
  const [filterValues, setFilterValues] = useState<PersonDocumentFilterValues>(initialFilterValues);
  const [personId, setPersonId] = useState('');
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deleteId, setDeleteId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    const currentPersonId = getOptionalString(filterValues.personId);
    if (!currentPersonId) {
      setRows([]);
      setMeta(initialMeta);
      setErrorMessage(undefined);
      return;
    }
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await personDocumentService.list(currentPersonId, query);
      setRows(response.data);
      setMeta(response.meta);
    } catch {
      setErrorMessage('Não foi possível carregar documentos de pessoa.');
    } finally {
      setLoading(false);
    }
  }, [filterValues.personId, query]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const onFilterChange = (name: string, value: unknown): void => {
    setFilterValues((currentValues) => ({ ...currentValues, [name]: value ?? '' }));
  };

  const applyFilters = (): void => {
    setQuery((currentQuery) => ({
      ...currentQuery,
      page: 1,
      search: getOptionalString(filterValues.query),
    }));
  };

  const clearFilters = (): void => {
    setFilterValues(initialFilterValues);
    setQuery({ page: 1, limit: query.limit });
  };

  const upload = async (): Promise<void> => {
    if (!personId.trim() || !title.trim() || selectedFile === null) {
      setErrorMessage('Informe pessoa, título e arquivo para enviar.');
      return;
    }
    setActionLoading(true);
    setErrorMessage(undefined);
    setSuccessMessage(undefined);
    try {
      await personDocumentService.upload(personId.trim(), title.trim(), selectedFile);
      setPersonId('');
      setTitle('');
      setSelectedFile(null);
      setSuccessMessage('Documento enviado com sucesso.');
      await load();
    } catch {
      setErrorMessage('Não foi possível enviar o documento.');
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async (): Promise<void> => {
    if (!deleteId) return;
    setActionLoading(true);
    setErrorMessage(undefined);
    setSuccessMessage(undefined);
    try {
      await personDocumentService.remove(deleteId);
      setDeleteId(undefined);
      setSuccessMessage('Documento removido com sucesso.');
      await load();
    } catch {
      setErrorMessage('Não foi possível remover o documento.');
    } finally {
      setActionLoading(false);
    }
  };

  const buildRowActions = useCallback(
    (row: PersonDocument): RowActionItem[] => [
      {
        key: 'delete',
        label: 'Remover',
        onClick: () => setDeleteId(row.id),
      },
    ],
    [],
  );

  const columns: DataTableColumn<PersonDocument>[] = [
    { key: 'title', header: 'Título', render: (row) => row.title },
    { key: 'person', header: 'Pessoa', render: (row) => row.personId ?? '-' },
    {
      key: 'format',
      header: 'Formato',
      render: (row) => (row.format ? translateDocumentFormat(row.format) : '-'),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (row.status ? translateDocumentGenerationStatus(row.status) : '-'),
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (row) => <RowActionsMenu actions={buildRowActions(row)} />,
      align: 'right',
    },
  ];

  const mobileConfig: DataListMobileConfig<PersonDocument> = {
    renderTitle: (row) => row.title,
    renderSubtitle: (row) => row.fileName ?? row.personId ?? '-',
    renderDetails: (row) => (row.status ? translateDocumentGenerationStatus(row.status) : '-'),
    renderActions: (row) => <RowActionsMenu actions={buildRowActions(row)} />,
  };

  return {
    rows,
    meta,
    query,
    loading,
    actionLoading,
    errorMessage,
    successMessage,
    filterValues,
    personId,
    title,
    selectedFile,
    deleteDialogOpen: deleteId !== undefined,
    columns,
    mobileConfig,
    setPersonId,
    setTitle,
    setSelectedFile,
    onFilterChange,
    applyFilters,
    clearFilters,
    upload,
    closeDeleteDialog: () => setDeleteId(undefined),
    confirmDelete,
    reload: load,
    onQueryChange: (search: string) =>
      setQuery((currentQuery) => ({ ...currentQuery, search, page: 1 })),
    onPageChange: (page: number) => setQuery((currentQuery) => ({ ...currentQuery, page })),
    onLimitChange: (limit: number) =>
      setQuery((currentQuery) => ({ ...currentQuery, limit, page: 1 })),
  };
};
