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
import { employeeStatusLabels } from '@shared/i18n/pt-BR/enums';
import type { EmployeeStatusValue } from '@shared/i18n/pt-BR/enums';
import type { PaginationMeta } from '@shared/types/pagination';
import { employeeService } from '@features/client/employees/services/employeeServices';
import type {
  Employee,
  EmployeeQueryParams,
} from '@features/client/employees/types/employee.types';

type EmployeeFilterValues = Record<string, unknown>;

const initialMeta: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

const initialFilterValues: EmployeeFilterValues = {
  query: '',
  status: '',
};

const getStringValue = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const isEmployeeStatus = (value: string): value is EmployeeStatusValue =>
  value === 'active' || value === 'inactive' || value === 'terminated';

const getEmployeeStatus = (value: unknown): EmployeeStatusValue | undefined => {
  const stringValue = getStringValue(value);
  return isEmployeeStatus(stringValue) ? stringValue : undefined;
};

const formatDocument = (employee: Employee): string => {
  const documentNumber = employee.person?.documentNumber;
  if (!documentNumber) return '-';
  const digits = onlyDigits(documentNumber);
  if (digits.length === 11) return maskCpf(digits);
  if (digits.length === 14) return maskCnpj(digits);
  return documentNumber;
};

const formatName = (employee: Employee): string => employee.person?.fullName ?? '-';

export const useEmployeesListPageViewModel = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Employee[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(initialMeta);
  const [query, setQuery] = useState<EmployeeQueryParams>({ page: 1, limit: 10 });
  const [filterValues, setFilterValues] = useState<EmployeeFilterValues>(initialFilterValues);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await employeeService.list(query);
      setRows(response.data);
      setMeta(response.meta);
    } catch {
      setErrorMessage('Não foi possível carregar funcionários.');
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
    (row: Employee): RowActionItem[] => [
      {
        key: 'details',
        label: 'Ver detalhes',
        onClick: () => void navigate(`/client/employees/${row.id}`),
      },
      {
        key: 'edit',
        label: 'Editar',
        onClick: () => void navigate(`/client/employees/${row.id}/edit`),
      },
    ],
    [navigate],
  );

  const columns: DataTableColumn<Employee>[] = [
    { key: 'name', header: 'Nome', render: formatName },
    { key: 'jobTitle', header: 'Cargo', render: (row) => row.jobTitle },
    { key: 'department', header: 'Departamento', render: (row) => row.department ?? '-' },
    { key: 'documentNumber', header: 'Documento', render: formatDocument },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (row.status ? employeeStatusLabels[row.status] : '-'),
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (row) => <RowActionsMenu actions={buildRowActions(row)} />,
      align: 'right',
    },
  ];

  const mobileConfig: DataListMobileConfig<Employee> = {
    renderTitle: formatName,
    renderSubtitle: (row) => row.jobTitle,
    renderDetails: formatDocument,
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
      status: getEmployeeStatus(filterValues.status),
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
