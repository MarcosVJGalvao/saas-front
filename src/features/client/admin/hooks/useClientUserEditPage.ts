import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  toClientUserEditFormValues,
  toClientUserUpdatePayload,
} from '@features/client/admin/normalizers/clientUserForm.normalizer';
import {
  clientUserEditFormSchema,
  type ClientUserEditFormValues,
} from '@features/client/admin/schemas/clientUserEditForm.schema';
import { clientUsersService } from '@features/client/admin/services/service';
import type { ClientUser } from '@features/client/admin/types/admin.types';

const initialValues: ClientUserEditFormValues = {
  email: '',
  roleId: '',
  status: 'active',
};

type ClientUserEditLocationState = {
  entity?: ClientUser | undefined;
};

const isClientUserEditLocationState = (value: unknown): value is ClientUserEditLocationState =>
  typeof value === 'object' && value !== null && 'entity' in value;

export const useClientUserEditPage = (id: string) => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = isClientUserEditLocationState(location.state) ? location.state : null;
  const [entity, setEntity] = useState<ClientUser | null>(locationState?.entity ?? null);
  const [loading, setLoading] = useState(entity === null);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const form = useAppForm<ClientUserEditFormValues>(clientUserEditFormSchema, initialValues);

  const fetchEntity = useCallback(async () => {
    if (entity) {
      form.reset(toClientUserEditFormValues(entity));
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage(undefined);
    try {
      const fetchedEntity = await clientUsersService.getById(id);
      setEntity(fetchedEntity);
      form.reset(toClientUserEditFormValues(fetchedEntity));
    } catch {
      setErrorMessage('Não foi possível carregar o usuário.');
    } finally {
      setLoading(false);
    }
  }, [entity, form, id]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchEntity();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchEntity]);

  return {
    form,
    entity,
    loading,
    submitting: form.formState.isSubmitting,
    errorMessage,
    onBack: () => {
      void navigate('/client/users');
    },
    onSubmit: async (values: ClientUserEditFormValues): Promise<void> => {
      await clientUsersService.update(id, toClientUserUpdatePayload(values));
      void navigate('/client/users');
    },
  };
};
