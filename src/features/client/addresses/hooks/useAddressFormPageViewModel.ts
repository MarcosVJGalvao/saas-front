import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  addressFormSchema,
  type AddressFormValues,
} from '@features/client/addresses/schemas/addressFormSchema';
import {
  buildAddressInitialValues,
  normalizeAddressInitialValues,
  normalizeAddressPayload,
} from '@features/client/addresses/normalizers/addressFormNormalizer';
import { addressService } from '@features/client/addresses/services/addressServices';

const backPath = '/client/addresses';

export const useAddressFormPageViewModel = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const form = useAppForm<AddressFormValues>(addressFormSchema, buildAddressInitialValues());
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const address = await addressService.getById(id);
      form.reset(normalizeAddressInitialValues(address));
    } catch {
      setErrorMessage('Não foi possível carregar o endereço.');
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

  const submit = async (values: AddressFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      const payload = normalizeAddressPayload(values);
      if (id) {
        await addressService.update(id, payload);
      } else {
        await addressService.create(payload);
      }
      void navigate(backPath);
    } catch {
      setErrorMessage('Não foi possível salvar o endereço.');
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
