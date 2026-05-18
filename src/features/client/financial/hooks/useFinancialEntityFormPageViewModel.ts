import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  buildFinancialEntityInitialValues,
  normalizeFinancialEntityInitialValues,
  normalizeFinancialEntityPayload,
} from '@features/client/financial/normalizers/financialEntityFormNormalizer';
import {
  financialEntityFormSchema,
  type FinancialEntityFormValues,
} from '@features/client/financial/schemas/financialEntityFormSchema';
import type {
  FinancialEntity,
  FinancialEntityPayload,
} from '@features/client/financial/types/financial.types';

type FinancialEntityFormService = {
  getById: (id: string) => Promise<FinancialEntity>;
  create: (payload: FinancialEntityPayload) => Promise<FinancialEntity>;
  update: (id: string, payload: FinancialEntityPayload) => Promise<FinancialEntity>;
};

type FinancialEntityFormPageViewModelParams = {
  service: FinancialEntityFormService;
  backPath: string;
  includeType: boolean;
  loadErrorMessage: string;
  submitErrorMessage: string;
};

export const useFinancialEntityFormPageViewModel = ({
  service,
  backPath,
  includeType,
  loadErrorMessage,
  submitErrorMessage,
}: FinancialEntityFormPageViewModelParams) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const form = useAppForm<FinancialEntityFormValues>(
    financialEntityFormSchema,
    buildFinancialEntityInitialValues(),
  );
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setErrorMessage(undefined);

    try {
      const response = await service.getById(id);
      form.reset(normalizeFinancialEntityInitialValues(response));
    } catch {
      setErrorMessage(loadErrorMessage);
    } finally {
      setLoading(false);
    }
  }, [form, id, loadErrorMessage, service]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const submit = async (values: FinancialEntityFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);

    try {
      const payload = normalizeFinancialEntityPayload(values, includeType);
      if (id) {
        await service.update(id, payload);
      } else {
        await service.create(payload);
      }
      void navigate(backPath);
    } catch {
      setErrorMessage(submitErrorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    isEdit,
    loading,
    submitting,
    errorMessage,
    onBack: () => void navigate(backPath),
    onSubmit: submit,
  };
};
