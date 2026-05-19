import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import {
  RowActionsMenu,
  type RowActionItem,
} from '@shared/components/data-display/data/RowActionsMenu';
import { maskCep } from '@shared/masks/inputMasks';
import type { PaginationMeta } from '@shared/types/pagination';
import { addressService } from '@features/client/addresses/services/addressServices';
import type { Address, AddressQueryParams } from '@features/client/addresses/types/address.types';

type AddressFilterValues = Record<string, unknown>;

const initialMeta: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

const initialFilterValues: AddressFilterValues = {
  query: '',
  city: '',
  state: '',
  personId: '',
};

const getStringValue = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const getOptionalString = (value: unknown): string | undefined => {
  const stringValue = getStringValue(value);
  return stringValue.length > 0 ? stringValue : undefined;
};

const formatAddress = (row: Address): string =>
  [row.street, row.number].filter(Boolean).join(', ') || '-';

export const useAddressesListPageViewModel = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Address[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(initialMeta);
  const [query, setQuery] = useState<AddressQueryParams>({ page: 1, limit: 10 });
  const [filterValues, setFilterValues] = useState<AddressFilterValues>(initialFilterValues);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await addressService.list(query);
      setRows(response.data);
      setMeta(response.meta);
    } catch {
      setErrorMessage('Não foi possível carregar endereços.');
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
      city: getOptionalString(filterValues.city),
      state: getOptionalString(filterValues.state),
      personId: getOptionalString(filterValues.personId),
    }));
  };

  const clearFilters = (): void => {
    setFilterValues(initialFilterValues);
    setQuery({ page: 1, limit: query.limit });
  };

  const buildRowActions = useCallback(
    (row: Address): RowActionItem[] => [
      {
        key: 'details',
        label: 'Ver detalhes',
        onClick: () => void navigate(`/client/addresses/${row.id}`),
      },
      {
        key: 'edit',
        label: 'Editar',
        onClick: () => void navigate(`/client/addresses/${row.id}/edit`),
      },
    ],
    [navigate],
  );

  const columns: DataTableColumn<Address>[] = [
    { key: 'address', header: 'Endereço', render: formatAddress },
    { key: 'city', header: 'Cidade', render: (row) => row.city ?? '-' },
    { key: 'state', header: 'Estado', render: (row) => row.state ?? '-' },
    { key: 'zipCode', header: 'CEP', render: (row) => (row.zipCode ? maskCep(row.zipCode) : '-') },
    {
      key: 'actions',
      header: 'Ações',
      render: (row) => <RowActionsMenu actions={buildRowActions(row)} />,
      align: 'right',
    },
  ];

  const mobileConfig: DataListMobileConfig<Address> = {
    renderTitle: formatAddress,
    renderSubtitle: (row) => `${row.city ?? '-'} / ${row.state ?? '-'}`,
    renderDetails: (row) =>
      `Bairro: ${row.neighborhood ?? '-'} | CEP: ${row.zipCode ? maskCep(row.zipCode) : '-'}`,
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
