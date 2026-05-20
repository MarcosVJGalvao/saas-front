import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { EntityDetailsViewState } from '@shared/components/data-display/details/entityDetails.types';
import { toAcademicCatalogDetailsData } from '@features/client/academic/normalizers/academicCatalogDetails.normalizer';
import type {
  AcademicCatalogItem,
  AcademicCatalogQueryParams,
} from '@features/client/academic/types/academic.types';
import type { ClientCrudService } from '@features/client/shared/types/clientApi.types';

type AcademicCatalogDetailsService = Pick<
  ClientCrudService<
    AcademicCatalogItem,
    AcademicCatalogItem,
    Record<string, unknown>,
    Record<string, unknown>,
    AcademicCatalogQueryParams
  >,
  'getById'
>;

type UseAcademicCatalogDetailsPageParams = {
  id: string;
  service: AcademicCatalogDetailsService;
  backPath: string;
  errorMessageFallback: string;
};

export const useAcademicCatalogDetailsPage = ({
  id,
  service,
  backPath,
  errorMessageFallback,
}: UseAcademicCatalogDetailsPageParams) => {
  const navigate = useNavigate();
  const [item, setItem] = useState<AcademicCatalogItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await service.getById(id);
      setItem(response);
    } catch {
      setErrorMessage(errorMessageFallback);
    } finally {
      setLoading(false);
    }
  }, [errorMessageFallback, id, service]);

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
      : item
        ? 'ready'
        : 'empty';

  return {
    item,
    data: item ? toAcademicCatalogDetailsData(item) : { headerData: null, tabs: [] },
    viewState,
    errorMessage,
    onBack: () => {
      void navigate(backPath);
    },
    onRetry: load,
  };
};
