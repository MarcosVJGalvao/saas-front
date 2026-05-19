import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import {
  RowActionsMenu,
  type RowActionItem,
} from '@shared/components/data-display/data/RowActionsMenu';
import { maskCnpj, maskCpf } from '@shared/masks/inputMasks';
import { onlyDigits } from '@shared/parsers/stringParsers';
import { translateDocumentType } from '@shared/i18n/pt-BR/enums';
import type { PaginationMeta } from '@shared/types/pagination';
import { personService } from '@features/client/people/services/personServices';
import type { Person, PersonQueryParams } from '@features/client/people/types/person.types';

type PersonFilterValues = Record<string, unknown>;

const initialMeta: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

const initialFilterValues: PersonFilterValues = {
  query: '',
};

const getStringValue = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const formatDocument = (person: Person): string => {
  const documentNumber = person.documentNumber;
  if (!documentNumber) return '-';
  const digits = onlyDigits(documentNumber);
  if (person.documentType === 'CPF' || digits.length === 11) return maskCpf(digits);
  if (person.documentType === 'CNPJ' || digits.length === 14) return maskCnpj(digits);
  return documentNumber;
};

export const usePeopleListPageViewModel = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Person[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(initialMeta);
  const [query, setQuery] = useState<PersonQueryParams>({ page: 1, limit: 10 });
  const [filterValues, setFilterValues] = useState<PersonFilterValues>(initialFilterValues);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await personService.list(query);
      setRows(response.data);
      setMeta(response.meta);
    } catch {
      setErrorMessage('Não foi possível carregar pessoas.');
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const buildRowActions = useCallback(
    (row: Person): RowActionItem[] => [
      {
        key: 'details',
        label: 'Ver detalhes',
        onClick: () => void navigate(`/client/people/${row.id}`),
      },
      {
        key: 'edit',
        label: 'Editar',
        onClick: () => void navigate(`/client/people/${row.id}/edit`),
      },
    ],
    [navigate],
  );

  const columns: DataTableColumn<Person>[] = [
    { key: 'name', header: 'Nome', render: (row) => row.fullName },
    {
      key: 'documentType',
      header: 'Tipo',
      render: (row) => (row.documentType ? translateDocumentType(row.documentType) : '-'),
    },
    { key: 'documentNumber', header: 'Documento', render: formatDocument },
    {
      key: 'actions',
      header: 'Ações',
      render: (row) => <RowActionsMenu actions={buildRowActions(row)} />,
      align: 'right',
    },
  ];

  const mobileConfig: DataListMobileConfig<Person> = {
    renderTitle: (row) => row.fullName,
    renderSubtitle: formatDocument,
    renderDetails: (row) => (row.documentType ? translateDocumentType(row.documentType) : '-'),
    renderActions: (row) => <RowActionsMenu actions={buildRowActions(row)} />,
  };

  const onFilterChange = (name: string, value: unknown): void => {
    setFilterValues((currentValues) => ({ ...currentValues, [name]: value ?? '' }));
  };

  const applyFilters = (): void => {
    setQuery((currentQuery) => ({
      ...currentQuery,
      page: 1,
      search: getStringValue(filterValues.query) || undefined,
    }));
  };

  const clearFilters = (): void => {
    setFilterValues(initialFilterValues);
    setQuery({ page: 1, limit: query.limit });
  };

  return {
    rows,
    meta,
    query,
    loading,
    errorMessage,
    filterValues,
    columns,
    mobileConfig,
    onFilterChange,
    applyFilters,
    clearFilters,
    reload: load,
    onQueryChange: (search: string) =>
      setQuery((currentQuery) => ({ ...currentQuery, search, page: 1 })),
    onPageChange: (page: number) => setQuery((currentQuery) => ({ ...currentQuery, page })),
    onLimitChange: (limit: number) =>
      setQuery((currentQuery) => ({ ...currentQuery, limit, page: 1 })),
  };
};
