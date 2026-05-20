import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  toAccountsReceivableEditFormValues,
  toAccountsReceivableEditPayload,
} from '@features/client/financial/normalizers/accountsReceivableForm.normalizer';
import {
  accountsReceivableEditFormSchema,
  type AccountsReceivableEditFormValues,
} from '@features/client/financial/schemas/accountsReceivableEditForm.schema';
import { accountsReceivableService } from '@features/client/financial/services/service';
import type { FinancialRecord } from '@features/client/financial/types/financial.types';

type AccountsReceivableEditLocationState = {
  entity?: FinancialRecord;
};

const isAccountsReceivableEditLocationState = (
  value: unknown,
): value is AccountsReceivableEditLocationState =>
  typeof value === 'object' && value !== null && 'entity' in value;

export const useAccountsReceivableEditPage = (id: string) => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = isAccountsReceivableEditLocationState(location.state)
    ? location.state
    : undefined;
  const [entity, setEntity] = useState<FinancialRecord | null>(locationState?.entity ?? null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const form = useAppForm<AccountsReceivableEditFormValues>(
    accountsReceivableEditFormSchema,
    locationState?.entity
      ? toAccountsReceivableEditFormValues(locationState.entity)
      : {
          amount: '',
          dueDate: '',
          status: 'open',
          categoryId: '',
          costCenterId: '',
          studentId: '',
        },
  );

  const load = useCallback(async () => {
    if (locationState?.entity) {
      form.reset(toAccountsReceivableEditFormValues(locationState.entity));
      return;
    }
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await accountsReceivableService.getById(id);
      setEntity(response);
      form.reset(toAccountsReceivableEditFormValues(response));
    } catch {
      setErrorMessage('Não foi possível carregar a conta a receber.');
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

  const onSubmit = async (values: AccountsReceivableEditFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      const updatedEntity = await accountsReceivableService.update(
        id,
        toAccountsReceivableEditPayload(values),
      );
      void navigate(`/client/financial/accounts-receivable/${updatedEntity.id}`);
    } catch {
      setErrorMessage('Não foi possível salvar a conta a receber.');
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
      void navigate('/client/financial/accounts-receivable');
    },
  };
};
