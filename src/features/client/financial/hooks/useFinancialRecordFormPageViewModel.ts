import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  buildFinancialRecordInitialValues,
  normalizeFinancialRecordInitialValues,
  normalizeFinancialRecordPayload,
} from '@features/client/financial/normalizers/financialRecordFormNormalizer';
import {
  financialRecordFormSchema,
  type FinancialRecordFormValues,
} from '@features/client/financial/schemas/financialRecordFormSchema';
import type {
  FinancialRecord,
  FinancialRecordPayload,
} from '@features/client/financial/types/financial.types';

type FinancialRecordFormService = {
  getById: (id: string) => Promise<FinancialRecord>;
  create: (payload: FinancialRecordPayload) => Promise<FinancialRecord>;
  update: (id: string, payload: FinancialRecordPayload) => Promise<FinancialRecord>;
};

type FinancialRecordFormPageViewModelParams = {
  service: FinancialRecordFormService;
  backPath: string;
  includeStudent: boolean;
  loadErrorMessage: string;
  submitErrorMessage: string;
};

export const useFinancialRecordFormPageViewModel = ({
  service,
  backPath,
  includeStudent,
  loadErrorMessage,
  submitErrorMessage,
}: FinancialRecordFormPageViewModelParams) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const form = useAppForm<FinancialRecordFormValues>(
    financialRecordFormSchema,
    buildFinancialRecordInitialValues(),
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
      form.reset(normalizeFinancialRecordInitialValues(response));
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

  const submit = async (values: FinancialRecordFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);

    try {
      const payload = normalizeFinancialRecordPayload(values, includeStudent);
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
