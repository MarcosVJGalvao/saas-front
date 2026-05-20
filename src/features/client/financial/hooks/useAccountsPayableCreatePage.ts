import { useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import { useState } from 'react';
import { toAccountsPayableCreatePayload } from '@features/client/financial/normalizers/accountsPayableForm.normalizer';
import {
  accountsPayableCreateFormSchema,
  type AccountsPayableCreateFormValues,
} from '@features/client/financial/schemas/accountsPayableCreateForm.schema';
import { accountsPayableService } from '@features/client/financial/services/service';

export const useAccountsPayableCreatePage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const form = useAppForm<AccountsPayableCreateFormValues>(accountsPayableCreateFormSchema, {
    description: '',
    amount: '',
    dueDate: '',
    status: 'open',
    categoryId: '',
    costCenterId: '',
  });

  const onSubmit = async (values: AccountsPayableCreateFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      await accountsPayableService.create(toAccountsPayableCreatePayload(values));
      void navigate('/client/financial/accounts-payable');
    } catch {
      setErrorMessage('Não foi possível salvar a conta a pagar.');
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
      void navigate('/client/financial/accounts-payable');
    },
  };
};
