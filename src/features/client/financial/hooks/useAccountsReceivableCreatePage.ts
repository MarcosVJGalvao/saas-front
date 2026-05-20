import { useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import { useState } from 'react';
import { toAccountsReceivableCreatePayload } from '@features/client/financial/normalizers/accountsReceivableForm.normalizer';
import {
  accountsReceivableCreateFormSchema,
  type AccountsReceivableCreateFormValues,
} from '@features/client/financial/schemas/accountsReceivableCreateForm.schema';
import { accountsReceivableService } from '@features/client/financial/services/service';

export const useAccountsReceivableCreatePage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const form = useAppForm<AccountsReceivableCreateFormValues>(accountsReceivableCreateFormSchema, {
    description: '',
    amount: '',
    dueDate: '',
    status: 'open',
    categoryId: '',
    costCenterId: '',
    studentId: '',
  });

  const onSubmit = async (values: AccountsReceivableCreateFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      await accountsReceivableService.create(toAccountsReceivableCreatePayload(values));
      void navigate('/client/financial/accounts-receivable');
    } catch {
      setErrorMessage('Não foi possível salvar a conta a receber.');
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
      void navigate('/client/financial/accounts-receivable');
    },
  };
};
