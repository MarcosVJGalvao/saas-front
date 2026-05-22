import { useCallback, useEffect, useState } from 'react';
import { schoolClassService } from '@features/client/academic/services/service';
import { studentService } from '@features/client/students/services/service';

type ClientDashboardSummary = {
  totalStudents: number;
  activeStudents: number;
  totalSchoolClasses: number;
};

type ClientDashboardPageState = {
  summary: ClientDashboardSummary | undefined;
  loading: boolean;
  errorMessage: string | undefined;
  reload: () => Promise<void>;
};

export const useClientDashboardPage = (): ClientDashboardPageState => {
  const [summary, setSummary] = useState<ClientDashboardSummary | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const [allStudents, activeStudents, schoolClasses] = await Promise.all([
        studentService.list({ limit: 1, page: 1 }),
        studentService.list({ limit: 1, page: 1, status: 'active' }),
        schoolClassService.list({ limit: 1, page: 1 }),
      ]);
      setSummary({
        totalStudents: allStudents.meta.total,
        activeStudents: activeStudents.meta.total,
        totalSchoolClasses: schoolClasses.meta.total,
      });
    } catch {
      setErrorMessage('Erro ao carregar dados do dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [load]);

  return { summary, loading, errorMessage, reload: load };
};
