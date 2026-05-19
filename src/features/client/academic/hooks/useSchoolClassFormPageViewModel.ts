import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  schoolClassFormSchema,
  type SchoolClassFormValues,
} from '@features/client/academic/schemas/schoolClassFormSchema';
import {
  buildSchoolClassInitialValues,
  normalizeSchoolClassInitialValues,
  normalizeSchoolClassPayload,
} from '@features/client/academic/normalizers/schoolClassFormNormalizer';
import { schoolClassService } from '@features/client/academic/services/academicServices';

const backPath = '/client/school-classes';

export const useSchoolClassFormPageViewModel = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const form = useAppForm<SchoolClassFormValues>(
    schoolClassFormSchema,
    buildSchoolClassInitialValues(),
  );
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setErrorMessage(undefined);

    try {
      const response = await schoolClassService.getById(id);
      form.reset(normalizeSchoolClassInitialValues(response));
    } catch {
      setErrorMessage('Não foi possível carregar a turma.');
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

  const submit = async (values: SchoolClassFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);

    try {
      const payload = normalizeSchoolClassPayload(values);
      if (id) {
        await schoolClassService.update(id, payload);
      } else {
        await schoolClassService.create(payload);
      }
      void navigate(backPath);
    } catch {
      setErrorMessage('Não foi possível salvar a turma.');
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
