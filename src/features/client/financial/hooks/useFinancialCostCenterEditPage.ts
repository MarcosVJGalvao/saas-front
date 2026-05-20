import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  toFinancialCostCenterEditFormValues,
  toFinancialCostCenterEditPayload,
} from '@features/client/financial/normalizers/financialCostCenterForm.normalizer';
import {
  financialCostCenterEditFormSchema,
  type FinancialCostCenterEditFormValues,
} from '@features/client/financial/schemas/financialCostCenterEditForm.schema';
import { financialCostCentersService } from '@features/client/financial/services/service';
import type { FinancialCostCenter } from '@features/client/financial/types/financial.types';

type FinancialCostCenterEditLocationState = {
  entity?: FinancialCostCenter;
};

const isFinancialCostCenterEditLocationState = (
  value: unknown,
): value is FinancialCostCenterEditLocationState =>
  typeof value === 'object' && value !== null && 'entity' in value;

export const useFinancialCostCenterEditPage = (id: string) => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = isFinancialCostCenterEditLocationState(location.state)
    ? location.state
    : undefined;
  const [entity, setEntity] = useState<FinancialCostCenter | null>(locationState?.entity ?? null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const form = useAppForm<FinancialCostCenterEditFormValues>(
    financialCostCenterEditFormSchema,
    locationState?.entity
      ? toFinancialCostCenterEditFormValues(locationState.entity)
      : {
          code: '',
          status: 'active',
          description: '',
        },
  );

  const load = useCallback(async () => {
    if (locationState?.entity) {
      form.reset(toFinancialCostCenterEditFormValues(locationState.entity));
      return;
    }
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await financialCostCentersService.getById(id);
      setEntity(response);
      form.reset(toFinancialCostCenterEditFormValues(response));
    } catch {
      setErrorMessage('Não foi possível carregar o centro de custo.');
    } finally {
      setLoading(false);
    }
  }, [form, id, locationState]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const onSubmit = async (values: FinancialCostCenterEditFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      const updatedEntity = await financialCostCentersService.update(
        id,
        toFinancialCostCenterEditPayload(values),
      );
      void navigate(`/client/financial/cost-centers/${updatedEntity.id}`);
    } catch {
      setErrorMessage('Não foi possível salvar o centro de custo.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    entity,
    loading,
    submitting,
    errorMessage,
    onSubmit,
    onBack: () => {
      void navigate('/client/financial/cost-centers');
    },
  };
};
