import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type {
  EntityDetailsPageData,
  EntityDetailsViewState,
} from '@shared/components/data-display/details/entityDetails.types';
import { toAdminDetailsData } from '@features/client/admin/normalizers/adminDetails.normalizer';
import type { ClientAdminEntity } from '@features/client/admin/types/admin.types';

type AdminDetailsService<TItem extends ClientAdminEntity> = {
  getById: (id: string) => Promise<TItem>;
};

const emptyDetailsData: EntityDetailsPageData = {
  headerData: null,
  tabs: [],
};

type UseAdminDetailsBaseParams<TItem extends ClientAdminEntity> = {
  id: string;
  backPath: string;
  service: AdminDetailsService<TItem>;
  errorMessageFallback: string;
  fallbackSubtitle: string;
};

export const useAdminDetailsBase = <TItem extends ClientAdminEntity>({
  id,
  backPath,
  service,
  errorMessageFallback,
  fallbackSubtitle,
}: UseAdminDetailsBaseParams<TItem>) => {
  const serviceRef = useRef(service);
  const navigate = useNavigate();
  const [entity, setEntity] = useState<TItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  useEffect(() => {
    serviceRef.current = service;
  }, [service]);

  const fetchEntity = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const fetchedEntity = await serviceRef.current.getById(id);
      setEntity(fetchedEntity);
    } catch {
      setErrorMessage(errorMessageFallback);
    } finally {
      setLoading(false);
    }
  }, [errorMessageFallback, id]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchEntity();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchEntity]);

  const viewState: EntityDetailsViewState = loading
    ? 'loading'
    : errorMessage
      ? 'error'
      : entity
        ? 'ready'
        : 'empty';

  return {
    data: entity ? toAdminDetailsData(entity, fallbackSubtitle) : emptyDetailsData,
    viewState,
    errorMessage,
    onBack: () => {
      void navigate(backPath);
    },
    onRetry: fetchEntity,
  };
};
