import { useCallback, useEffect, useState } from 'react';
import type { PaginationMeta } from '@shared/types/pagination';
import { employeeService } from '@features/client/employees/services/service';
import type {
  Employee,
  EmployeeQueryParams,
} from '@features/client/employees/types/employee.types';

const initialPagination: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export const useEmployeesList = (initialParams?: Partial<EmployeeQueryParams>) => {
  const [rows, setRows] = useState<Employee[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(initialPagination);
  const [queryParams, setQueryParams] = useState<EmployeeQueryParams>({
    page: 1,
    limit: 10,
    ...initialParams,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await employeeService.list(queryParams);
      setRows(response.data);
      setPagination(response.meta);
    } catch {
      setErrorMessage('Não foi possível carregar funcionários.');
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchEmployees();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchEmployees]);

  return {
    rows,
    pagination,
    queryParams,
    loading,
    errorMessage,
    updateQueryParams: (patch: Partial<EmployeeQueryParams>) =>
      setQueryParams((currentQueryParams) => ({ ...currentQueryParams, ...patch })),
    reload: fetchEmployees,
  };
};
