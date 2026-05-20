import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  toFinancialCategoryEditFormValues,
  toFinancialCategoryEditPayload,
} from '@features/client/financial/normalizers/financialCategoryForm.normalizer';
import {
  financialCategoryEditFormSchema,
  type FinancialCategoryEditFormValues,
} from '@features/client/financial/schemas/financialCategoryEditForm.schema';
import { financialCategoriesService } from '@features/client/financial/services/service';
import type { FinancialCategory } from '@features/client/financial/types/financial.types';

type FinancialCategoryEditLocationState = {
  entity?: FinancialCategory;
};

const isFinancialCategoryEditLocationState = (
  value: unknown,
): value is FinancialCategoryEditLocationState =>
  typeof value === 'object' && value !== null && 'entity' in value;

export const useFinancialCategoryEditPage = (id: string) => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = isFinancialCategoryEditLocationState(location.state)
    ? location.state
    : undefined;
  const [entity, setEntity] = useState<FinancialCategory | null>(locationState?.entity ?? null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const form = useAppForm<FinancialCategoryEditFormValues>(
    financialCategoryEditFormSchema,
    locationState?.entity
      ? toFinancialCategoryEditFormValues(locationState.entity)
      : {
          code: '',
          type: 'expense',
          status: 'active',
          description: '',
        },
  );

  const load = useCallback(async () => {
    if (locationState?.entity) {
      form.reset(toFinancialCategoryEditFormValues(locationState.entity));
      return;
    }
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await financialCategoriesService.getById(id);
      setEntity(response);
      form.reset(toFinancialCategoryEditFormValues(response));
    } catch {
      setErrorMessage('Não foi possível carregar a categoria financeira.');
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

  const onSubmit = async (values: FinancialCategoryEditFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      const updatedEntity = await financialCategoriesService.update(
        id,
        toFinancialCategoryEditPayload(values),
      );
      void navigate(`/client/financial/categories/${updatedEntity.id}`);
    } catch {
      setErrorMessage('Não foi possível salvar a categoria financeira.');
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
      void navigate('/client/financial/categories');
    },
  };
};
