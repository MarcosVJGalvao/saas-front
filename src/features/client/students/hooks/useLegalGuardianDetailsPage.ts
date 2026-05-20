import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type {
  EntityDetailsPageData,
  EntityDetailsViewState,
} from '@shared/components/data-display/details/entityDetails.types';
import { toLegalGuardianDetailsData } from '../normalizers/legalGuardianDetails.normalizer';
import { legalGuardianService } from '../services/service';

export const useLegalGuardianDetailsPage = (id: string) => {
  const navigate = useNavigate();
  const [data, setData] = useState<EntityDetailsPageData>({ headerData: null, tabs: [] });
  const [viewState, setViewState] = useState<EntityDetailsViewState>('loading');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const fetchLegalGuardian = useCallback(async () => {
    setViewState('loading');
    setErrorMessage(undefined);
    try {
      const legalGuardian = await legalGuardianService.getById(id);
      setData(toLegalGuardianDetailsData(legalGuardian));
      setViewState('ready');
    } catch {
      setErrorMessage('Erro ao carregar responsável.');
      setViewState('error');
    }
  }, [id]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchLegalGuardian();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchLegalGuardian]);

  return {
    data,
    viewState,
    errorMessage,
    onBack: () => navigate('/client/legal-guardians'),
    onRetry: fetchLegalGuardian,
  };
};
