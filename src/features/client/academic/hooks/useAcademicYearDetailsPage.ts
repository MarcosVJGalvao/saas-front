import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type {
  EntityDetailsPageData,
  EntityDetailsViewState,
} from '@shared/components/data-display/details/entityDetails.types';
import { toAcademicYearDetailsData } from '@features/client/academic/normalizers/academicYearDetails.normalizer';
import { academicYearService } from '@features/client/academic/services/service';
import type { AcademicYear } from '@features/client/academic/types/academic.types';

const emptyDetailsData: EntityDetailsPageData = {
  headerData: null,
  tabs: [],
};

export const useAcademicYearDetailsPage = (id: string) => {
  const navigate = useNavigate();
  const [academicYear, setAcademicYear] = useState<AcademicYear | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await academicYearService.getById(id);
      setAcademicYear(response);
    } catch {
      setErrorMessage('Erro ao carregar ano letivo.');
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

  const viewState: EntityDetailsViewState = loading
    ? 'loading'
    : errorMessage
      ? 'error'
      : academicYear
        ? 'ready'
        : 'empty';

  return {
    data: academicYear ? toAcademicYearDetailsData(academicYear) : emptyDetailsData,
    viewState,
    errorMessage,
    onBack: () => {
      void navigate('/client/academic-years');
    },
    onRetry: load,
  };
};
