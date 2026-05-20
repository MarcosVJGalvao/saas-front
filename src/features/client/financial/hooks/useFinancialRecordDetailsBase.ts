import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { EntityDetailsViewState } from '@shared/components/data-display/details/entityDetails.types';
import {
  toFinancialRecordDetailsTabs,
  toFinancialRecordHeaderData,
} from '@features/client/financial/normalizers/financialRecordDetails.normalizer';
import type { FinancialRecord } from '@features/client/financial/types/financial.types';

type FinancialRecordDetailsService = {
  getById: (id: string) => Promise<FinancialRecord>;
};

type UseFinancialRecordDetailsBaseParams = {
  id: string;
  backPath: string;
  service: FinancialRecordDetailsService;
  errorMessageFallback: string;
  fallbackSubtitle: string;
};

export const useFinancialRecordDetailsBase = ({
  id,
  backPath,
  service,
  errorMessageFallback,
  fallbackSubtitle,
}: UseFinancialRecordDetailsBaseParams) => {
  const navigate = useNavigate();
  const [record, setRecord] = useState<FinancialRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await service.getById(id);
      setRecord(response);
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
      : record
        ? 'ready'
        : 'empty';

  return {
    viewState,
    data: {
      headerData: record ? toFinancialRecordHeaderData(record, fallbackSubtitle) : null,
      tabs: record ? toFinancialRecordDetailsTabs(record) : [],
    },
    errorMessage,
    onBack: () => {
      void navigate(backPath);
    },
    onRetry: load,
  };
};
