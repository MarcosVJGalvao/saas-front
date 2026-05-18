import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  buildAdminEntityInitialValues,
  normalizeAdminEntityInitialValues,
  normalizeAdminEntityPayload,
} from '@features/client/admin/normalizers/adminEntityFormNormalizer';
import {
  adminEntityFormSchema,
  type AdminEntityFormValues,
} from '@features/client/admin/schemas/adminEntityFormSchema';
import type { ClientAdminEntity } from '@features/client/admin/types/admin.types';

type AdminEntityFormService = {
  getById: (id: string) => Promise<ClientAdminEntity>;
  create: (payload: Record<string, unknown>) => Promise<ClientAdminEntity>;
  update: (id: string, payload: Record<string, unknown>) => Promise<ClientAdminEntity>;
};

type AdminEntityFormPageViewModelParams = {
  service: AdminEntityFormService;
  backPath: string;
  includeUserFields: boolean;
  loadErrorMessage: string;
  submitErrorMessage: string;
};

export const useAdminEntityFormPageViewModel = ({
  service,
  backPath,
  includeUserFields,
  loadErrorMessage,
  submitErrorMessage,
}: AdminEntityFormPageViewModelParams) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const form = useAppForm<AdminEntityFormValues>(
    adminEntityFormSchema,
    buildAdminEntityInitialValues(),
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
      form.reset(normalizeAdminEntityInitialValues(response));
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

  const submit = async (values: AdminEntityFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);

    try {
      const payload = normalizeAdminEntityPayload(values, includeUserFields);
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
