import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { EntityDetailsViewState } from '@shared/components/data-display/details/entityDetails.types';
import { toReportCardCatalogDetailsData } from '@features/client/report-cards/normalizers/reportCardCatalogDetails.normalizer';
import type {
  ReportCardAcademicPeriod,
  ReportCardGradeSubject,
} from '@features/client/report-cards/types/reportCard.types';

type ReportCardCatalogMode = 'periods' | 'gradeSubjects';

type ReportCardCatalogDetailsEntity = ReportCardAcademicPeriod | ReportCardGradeSubject;

type ReportCardCatalogDetailsService = {
  getById: (id: string) => Promise<ReportCardCatalogDetailsEntity>;
};

type UseReportCardCatalogDetailsPageParams = {
  id: string;
  mode: ReportCardCatalogMode;
  service: ReportCardCatalogDetailsService;
  backPath: string;
  errorMessageFallback: string;
};

export const useReportCardCatalogDetailsPage = ({
  id,
  mode,
  service,
  backPath,
  errorMessageFallback,
}: UseReportCardCatalogDetailsPageParams) => {
  const serviceRef = useRef(service);
  const navigate = useNavigate();
  const [entity, setEntity] = useState<ReportCardCatalogDetailsEntity | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  useEffect(() => {
    serviceRef.current = service;
  }, [service]);

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await serviceRef.current.getById(id);
      setEntity(response);
    } catch {
      setErrorMessage(errorMessageFallback);
    } finally {
      setLoading(false);
    }
  }, [errorMessageFallback, id]);

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
      : entity
        ? 'ready'
        : 'empty';

  return {
    entity,
    data: entity ? toReportCardCatalogDetailsData(mode, entity) : { headerData: null, tabs: [] },
    viewState,
    errorMessage,
    onBack: () => {
      void navigate(backPath);
    },
    onRetry: load,
  };
};
