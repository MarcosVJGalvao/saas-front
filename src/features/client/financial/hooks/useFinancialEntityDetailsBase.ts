import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type {
  EntityDetailsPageData,
  EntityDetailsViewState,
} from '@shared/components/data-display/details/entityDetails.types';
import {
  toFinancialEntityDetailsTabs,
  toFinancialEntityHeaderData,
} from '@features/client/financial/normalizers/financialEntityDetails.normalizer';
import type { FinancialEntity } from '@features/client/financial/types/financial.types';

type FinancialEntityDetailsService = {
  getById: (id: string) => Promise<FinancialEntity>;
};

type UseFinancialEntityDetailsBaseParams = {
  id: string;
  backPath: string;
  service: FinancialEntityDetailsService;
  errorMessageFallback: string;
  fallbackSubtitle: string;
  includeType: boolean;
};

export const useFinancialEntityDetailsBase = ({
  id,
  backPath,
  service,
  errorMessageFallback,
  fallbackSubtitle,
  includeType,
}: UseFinancialEntityDetailsBaseParams): {
  viewState: EntityDetailsViewState;
  data: EntityDetailsPageData;
  errorMessage: string | undefined;
  onBack: () => void;
  onRetry: () => Promise<void>;
} => {
  const navigate = useNavigate();
  const [entity, setEntity] = useState<FinancialEntity | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await service.getById(id);
      setEntity(response);
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

  return {
    viewState: loading ? 'loading' : errorMessage ? 'error' : entity ? 'ready' : 'empty',
    data: {
      headerData: entity ? toFinancialEntityHeaderData(entity, fallbackSubtitle) : null,
      tabs: entity ? toFinancialEntityDetailsTabs(entity, includeType) : [],
    },
    errorMessage,
    onBack: () => {
      void navigate(backPath);
    },
    onRetry: load,
  };
};
