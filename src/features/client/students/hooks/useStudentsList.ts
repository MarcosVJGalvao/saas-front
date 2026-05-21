import { useCallback, useEffect, useState } from 'react';
import type { PaginationMeta } from '@shared/types/pagination';
import { studentService } from '../services/service';
import type { Student, StudentQueryParams } from '../types/student.types';

export const useStudentsList = (initialParams?: Partial<StudentQueryParams>) => {
  const [rows, setRows] = useState<Student[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [queryParams, setQueryParams] = useState<StudentQueryParams>({
    page: 1,
    limit: 10,
    ...initialParams,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await studentService.list(queryParams);
      setRows(response.data);
      setPagination(response.meta);
    } catch {
      setErrorMessage('Erro ao carregar alunos.');
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchStudents();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchStudents]);

  const updateQueryParams = useCallback((patch: Partial<StudentQueryParams>) => {
    setQueryParams((currentQueryParams) => ({ ...currentQueryParams, ...patch }));
  }, []);

  return {
    rows,
    pagination,
    queryParams,
    loading,
    errorMessage,
    updateQueryParams,
    reload: fetchStudents,
  };
};
