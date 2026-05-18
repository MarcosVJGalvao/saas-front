import { useCallback, useEffect, useState } from 'react';
import { studentEnrollmentService } from '@features/client/student-enrollments/services/studentEnrollmentService';
import type { StudentEnrollment } from '@features/client/student-enrollments/types/studentEnrollment.types';

export const useStudentEnrollmentDetails = (id?: string) => {
  const [data, setData] = useState<StudentEnrollment | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    if (!id) {
      setData(null);
      return;
    }

    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await studentEnrollmentService.getById(id);
      setData(response);
    } catch {
      setErrorMessage('Erro ao carregar detalhes da matrícula.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [load]);

  return {
    data,
    loading,
    errorMessage,
    reload: load,
  };
};
