import { useCallback, useEffect, useState } from 'react';
import type { PaginationMeta } from '@shared/types/pagination';
import { attendanceSchedulesService } from '@features/client/attendance/services/service';
import type {
  AttendanceQueryParams,
  AttendanceSchedule,
} from '@features/client/attendance/types/attendance.types';

const initialMeta: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export const useAttendanceSchedulesList = () => {
  const [rows, setRows] = useState<AttendanceSchedule[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(initialMeta);
  const [query, setQuery] = useState<AttendanceQueryParams>({ page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await attendanceSchedulesService.list(query);
      setRows(response.data);
      setMeta(response.meta);
    } catch {
      setErrorMessage('Erro ao carregar horários de frequência.');
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

  const updateQuery = useCallback((patch: Partial<AttendanceQueryParams>) => {
    setQuery((currentQuery) => ({ ...currentQuery, ...patch }));
  }, []);

  return { rows, meta, query, loading, errorMessage, updateQuery, reload: load };
};
