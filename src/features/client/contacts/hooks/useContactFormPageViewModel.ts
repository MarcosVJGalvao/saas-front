import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  contactFormSchema,
  type ContactFormValues,
} from '@features/client/contacts/schemas/contactFormSchema';
import {
  buildContactInitialValues,
  normalizeContactInitialValues,
  normalizeContactPayload,
} from '@features/client/contacts/normalizers/contactFormNormalizer';
import { contactService } from '@features/client/contacts/services/contactServices';

const backPath = '/client/contacts';

export const useContactFormPageViewModel = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const form = useAppForm<ContactFormValues>(contactFormSchema, buildContactInitialValues());
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const contact = await contactService.getById(id);
      form.reset(normalizeContactInitialValues(contact));
    } catch {
      setErrorMessage('Não foi possível carregar o contato.');
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

  const submit = async (values: ContactFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      const payload = normalizeContactPayload(values);
      if (id) {
        await contactService.update(id, payload);
      } else {
        await contactService.create(payload);
      }
      void navigate(backPath);
    } catch {
      setErrorMessage('Não foi possível salvar o contato.');
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
