import { useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import { toFinancialCategoryCreatePayload } from '@features/client/financial/normalizers/financialCategoryForm.normalizer';
import {
  financialCategoryCreateFormSchema,
  type FinancialCategoryCreateFormValues,
} from '@features/client/financial/schemas/financialCategoryCreateForm.schema';
import { financialCategoriesService } from '@features/client/financial/services/service';
import { useState } from 'react';

export const useFinancialCategoryCreatePage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const form = useAppForm<FinancialCategoryCreateFormValues>(financialCategoryCreateFormSchema, {
    name: '',
    code: '',
    type: 'expense',
    status: 'active',
    description: '',
  });

  const onSubmit = async (values: FinancialCategoryCreateFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      await financialCategoriesService.create(toFinancialCategoryCreatePayload(values));
      void navigate('/client/financial/categories');
    } catch {
      setErrorMessage('Não foi possível salvar a categoria financeira.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    submitting,
    errorMessage,
    onSubmit,
    onBack: () => {
      void navigate('/client/financial/categories');
    },
  };
};
