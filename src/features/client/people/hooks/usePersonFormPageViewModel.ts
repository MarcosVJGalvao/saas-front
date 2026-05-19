import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  buildPersonInitialValues,
  normalizePersonInitialValues,
  normalizePersonPayload,
} from '@features/client/people/normalizers/personFormNormalizer';
import {
  personFormSchema,
  type PersonFormValues,
} from '@features/client/people/schemas/personFormSchema';
import { personService } from '@features/client/people/services/personServices';

const backPath = '/client/people';

export const usePersonFormPageViewModel = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const form = useAppForm<PersonFormValues>(personFormSchema, buildPersonInitialValues());
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const person = await personService.getById(id);
      form.reset(normalizePersonInitialValues(person));
    } catch {
      setErrorMessage('Não foi possível carregar a pessoa.');
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

  const submit = async (values: PersonFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      const payload = normalizePersonPayload(values);
      if (id) {
        await personService.update(id, payload);
      } else {
        await personService.create(payload);
      }
      void navigate(backPath);
    } catch {
      setErrorMessage('Não foi possível salvar a pessoa.');
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
