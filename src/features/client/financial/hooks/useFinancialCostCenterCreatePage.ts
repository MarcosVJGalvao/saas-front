import { useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import { toFinancialCostCenterCreatePayload } from '@features/client/financial/normalizers/financialCostCenterForm.normalizer';
import {
  financialCostCenterCreateFormSchema,
  type FinancialCostCenterCreateFormValues,
} from '@features/client/financial/schemas/financialCostCenterCreateForm.schema';
import { financialCostCentersService } from '@features/client/financial/services/service';
import { useState } from 'react';

export const useFinancialCostCenterCreatePage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const form = useAppForm<FinancialCostCenterCreateFormValues>(
    financialCostCenterCreateFormSchema,
    {
      name: '',
      code: '',
      description: '',
    },
  );

  const onSubmit = async (values: FinancialCostCenterCreateFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      await financialCostCentersService.create(toFinancialCostCenterCreatePayload(values));
      void navigate('/client/financial/cost-centers');
    } catch {
      setErrorMessage('Não foi possível salvar o centro de custo.');
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
      void navigate('/client/financial/cost-centers');
    },
  };
};
