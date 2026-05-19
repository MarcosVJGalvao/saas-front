import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  academicYearFormSchema,
  type AcademicYearFormValues,
} from '@features/client/academic/schemas/academicYearFormSchema';
import {
  buildAcademicYearInitialValues,
  normalizeAcademicYearInitialValues,
  normalizeAcademicYearPayload,
} from '@features/client/academic/normalizers/academicYearFormNormalizer';
import { academicYearService } from '@features/client/academic/services/academicServices';

const backPath = '/client/academic-years';

export const useAcademicYearFormPageViewModel = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const form = useAppForm<AcademicYearFormValues>(
    academicYearFormSchema,
    buildAcademicYearInitialValues(),
  );
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setErrorMessage(undefined);

    try {
      const response = await academicYearService.getById(id);
      form.reset(normalizeAcademicYearInitialValues(response));
    } catch {
      setErrorMessage('Não foi possível carregar o ano letivo.');
    } finally {
      setLoading(false);
    }
  }, [form, id]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const submit = async (values: AcademicYearFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);

    try {
      const payload = normalizeAcademicYearPayload(values);
      if (id) {
        await academicYearService.update(id, payload);
      } else {
        await academicYearService.create(payload);
      }
      void navigate(backPath);
    } catch {
      setErrorMessage('Não foi possível salvar o ano letivo.');
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
