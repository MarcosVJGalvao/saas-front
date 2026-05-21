import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  toAccountsPayableEditFormValues,
  toAccountsPayableEditPayload,
} from '@features/client/financial/normalizers/accountsPayableForm.normalizer';
import {
  accountsPayableEditFormSchema,
  type AccountsPayableEditFormValues,
} from '@features/client/financial/schemas/accountsPayableEditForm.schema';
import { accountsPayableService } from '@features/client/financial/services/service';
import { useFinancialReferenceOptions } from '@features/client/financial/hooks/useFinancialReferenceOptions';
import type { FinancialRecord } from '@features/client/financial/types/financial.types';

type AccountsPayableEditLocationState = {
  entity?: FinancialRecord;
};

const isAccountsPayableEditLocationState = (
  value: unknown,
): value is AccountsPayableEditLocationState =>
  typeof value === 'object' && value !== null && 'entity' in value;

export const useAccountsPayableEditPage = (id: string) => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = isAccountsPayableEditLocationState(location.state)
    ? location.state
    : undefined;
  const [entity, setEntity] = useState<FinancialRecord | null>(locationState?.entity ?? null);
  const referenceOptions = useFinancialReferenceOptions();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const form = useAppForm<AccountsPayableEditFormValues>(
    accountsPayableEditFormSchema,
    locationState?.entity
      ? toAccountsPayableEditFormValues(locationState.entity)
      : {
          amount: '',
          dueDate: '',
          status: 'open',
          categoryId: '',
          costCenterId: '',
        },
  );

  const load = useCallback(async () => {
    if (locationState?.entity) {
      form.reset(toAccountsPayableEditFormValues(locationState.entity));
      return;
    }
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await accountsPayableService.getById(id);
      setEntity(response);
      form.reset(toAccountsPayableEditFormValues(response));
    } catch {
      setErrorMessage('Não foi possível carregar a conta a pagar.');
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

  const onSubmit = async (values: AccountsPayableEditFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      const updatedEntity = await accountsPayableService.update(
        id,
        toAccountsPayableEditPayload(values),
      );
      void navigate(`/client/financial/accounts-payable/${updatedEntity.id}`);
    } catch {
      setErrorMessage('Não foi possível salvar a conta a pagar.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    entity,
    referenceOptions,
    loading,
    submitting,
    errorMessage,
    onSubmit,
    onBack: () => {
      void navigate('/client/financial/accounts-payable');
    },
  };
};
