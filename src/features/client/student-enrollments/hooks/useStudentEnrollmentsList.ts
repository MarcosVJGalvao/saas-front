import { useCallback, useEffect, useState } from 'react';
import { studentEnrollmentService } from '@features/client/student-enrollments/services/service';
import type {
  StudentEnrollment,
  StudentEnrollmentQueryParams,
} from '@features/client/student-enrollments/types/studentEnrollment.types';
import type { PaginationMeta } from '@shared/types/pagination';

const initialMeta: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export const useStudentEnrollmentsList = (
  initialParams?: Partial<StudentEnrollmentQueryParams>,
) => {
  const [rows, setRows] = useState<StudentEnrollment[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(initialMeta);
  const [queryParams, setQueryParams] = useState<StudentEnrollmentQueryParams>({
    page: 1,
    limit: 10,
    ...initialParams,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await studentEnrollmentService.list(queryParams);
      setRows(response.data);
      setPagination(response.meta);
    } catch {
      setErrorMessage('Erro ao carregar matrículas.');
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const updateQueryParams = useCallback((patch: Partial<StudentEnrollmentQueryParams>) => {
    setQueryParams((currentQueryParams) => ({
      ...currentQueryParams,
      ...patch,
    }));
  }, []);

  return {
    rows,
    pagination,
    queryParams,
    loading,
    errorMessage,
    updateQueryParams,
    reload: load,
  };
};
