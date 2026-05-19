import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import {
  RowActionsMenu,
  type RowActionItem,
} from '@shared/components/data-display/data/RowActionsMenu';
import { translateContactType } from '@shared/i18n/pt-BR/enums';
import type { PaginationMeta } from '@shared/types/pagination';
import { contactService } from '@features/client/contacts/services/contactServices';
import type {
  Contact,
  ContactQueryParams,
  ContactType,
} from '@features/client/contacts/types/contact.types';

type ContactFilterValues = Record<string, unknown>;

const initialMeta: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

const initialFilterValues: ContactFilterValues = {
  query: '',
  type: '',
  personId: '',
};

const getStringValue = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const getOptionalString = (value: unknown): string | undefined => {
  const stringValue = getStringValue(value);
  return stringValue.length > 0 ? stringValue : undefined;
};

const isContactType = (value: string): value is ContactType =>
  value === 'email' ||
  value === 'phone' ||
  value === 'whatsapp' ||
  value === 'linkedin' ||
  value === 'other';

const getOptionalContactType = (value: unknown): ContactType | undefined => {
  const stringValue = getStringValue(value);
  return isContactType(stringValue) ? stringValue : undefined;
};

export const useContactsListPageViewModel = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Contact[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(initialMeta);
  const [query, setQuery] = useState<ContactQueryParams>({ page: 1, limit: 10 });
  const [filterValues, setFilterValues] = useState<ContactFilterValues>(initialFilterValues);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await contactService.list(query);
      setRows(response.data);
      setMeta(response.meta);
    } catch {
      setErrorMessage('Não foi possível carregar contatos.');
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

  const onFilterChange = (name: string, value: unknown): void => {
    setFilterValues((currentValues) => ({ ...currentValues, [name]: value ?? '' }));
  };

  const applyFilters = (): void => {
    setQuery((currentQuery) => ({
      ...currentQuery,
      page: 1,
      search: getOptionalString(filterValues.query),
      type: getOptionalContactType(filterValues.type),
      personId: getOptionalString(filterValues.personId),
    }));
  };

  const clearFilters = (): void => {
    setFilterValues(initialFilterValues);
    setQuery({ page: 1, limit: query.limit });
  };

  const buildRowActions = useCallback(
    (row: Contact): RowActionItem[] => [
      {
        key: 'details',
        label: 'Ver detalhes',
        onClick: () => void navigate(`/client/contacts/${row.id}`),
      },
      {
        key: 'edit',
        label: 'Editar',
        onClick: () => void navigate(`/client/contacts/${row.id}/edit`),
      },
    ],
    [navigate],
  );

  const columns: DataTableColumn<Contact>[] = [
    { key: 'type', header: 'Tipo', render: (row) => translateContactType(row.type) },
    { key: 'value', header: 'Contato', render: (row) => row.value },
    { key: 'label', header: 'Rótulo', render: (row) => row.label ?? '-' },
    { key: 'primary', header: 'Principal', render: (row) => (row.isPrimary ? 'Sim' : 'Não') },
    {
      key: 'actions',
      header: 'Ações',
      render: (row) => <RowActionsMenu actions={buildRowActions(row)} />,
      align: 'right',
    },
  ];

  const mobileConfig: DataListMobileConfig<Contact> = {
    renderTitle: (row) => row.value,
    renderSubtitle: (row) => translateContactType(row.type),
    renderDetails: (row) =>
      `Rótulo: ${row.label ?? '-'} | Principal: ${row.isPrimary ? 'Sim' : 'Não'}`,
    renderActions: (row) => <RowActionsMenu actions={buildRowActions(row)} />,
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
