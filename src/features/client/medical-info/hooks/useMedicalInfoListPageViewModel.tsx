import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import {
  RowActionsMenu,
  type RowActionItem,
} from '@shared/components/data-display/data/RowActionsMenu';
import { maskPhone } from '@shared/masks/inputMasks';
import { onlyDigits } from '@shared/parsers/stringParsers';
import type { PaginationMeta } from '@shared/types/pagination';
import { medicalInfoService } from '@features/client/medical-info/services/medicalInfoServices';
import type {
  MedicalInfo,
  MedicalInfoQueryParams,
} from '@features/client/medical-info/types/medicalInfo.types';

type MedicalInfoFilterValues = Record<string, unknown>;

const initialMeta: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

const initialFilterValues: MedicalInfoFilterValues = {
  query: '',
};

const getStringValue = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const formatPersonName = (medicalInfo: MedicalInfo): string =>
  medicalInfo.person?.fullName ?? medicalInfo.personId ?? '-';

const formatEmergencyPhone = (medicalInfo: MedicalInfo): string => {
  const phone = medicalInfo.emergencyContactPhone;
  return phone ? maskPhone(onlyDigits(phone)) : '-';
};

export const useMedicalInfoListPageViewModel = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<MedicalInfo[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(initialMeta);
  const [query, setQuery] = useState<MedicalInfoQueryParams>({ page: 1, limit: 10 });
  const [filterValues, setFilterValues] = useState<MedicalInfoFilterValues>(initialFilterValues);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await medicalInfoService.list(query);
      setRows(response.data);
      setMeta(response.meta);
    } catch {
      setErrorMessage('Não foi possível carregar informações médicas.');
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
    (row: MedicalInfo): RowActionItem[] => [
      {
        key: 'details',
        label: 'Ver detalhes',
        onClick: () => void navigate(`/client/medical-info/${row.id}`),
      },
      {
        key: 'edit',
        label: 'Editar',
        onClick: () => void navigate(`/client/medical-info/${row.id}/edit`),
      },
    ],
    [navigate],
  );

  const columns: DataTableColumn<MedicalInfo>[] = [
    { key: 'person', header: 'Pessoa', render: formatPersonName },
    { key: 'bloodType', header: 'Tipo sanguíneo', render: (row) => row.bloodType ?? '-' },
    {
      key: 'emergencyContactName',
      header: 'Contato de emergência',
      render: (row) => row.emergencyContactName ?? '-',
    },
    { key: 'emergencyContactPhone', header: 'Telefone', render: formatEmergencyPhone },
    {
      key: 'actions',
      header: 'Ações',
      render: (row) => <RowActionsMenu actions={buildRowActions(row)} />,
      align: 'right',
    },
  ];

  const mobileConfig: DataListMobileConfig<MedicalInfo> = {
    renderTitle: formatPersonName,
    renderSubtitle: (row) => row.bloodType ?? 'Sem tipo sanguíneo',
    renderDetails: formatEmergencyPhone,
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
