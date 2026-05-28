import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  toClientRoleEditFormValues,
  toClientRoleUpdatePayload,
} from '@features/client/admin/normalizers/clientRoleForm.normalizer';
import {
  clientRoleEditFormSchema,
  type ClientRoleEditFormValues,
} from '@features/client/admin/schemas/clientRoleEditForm.schema';
import { clientRolesService } from '@features/client/admin/services/service';
import { usePermissionsList } from '@features/client/admin/hooks/usePermissionsList';
import type { ClientRole } from '@features/client/admin/types/admin.types';

const initialValues: ClientRoleEditFormValues = {
  name: '',
  description: '',
  permissionIds: [],
};

type ClientRoleEditLocationState = {
  entity?: ClientRole | undefined;
};

const isClientRoleEditLocationState = (value: unknown): value is ClientRoleEditLocationState =>
  typeof value === 'object' && value !== null && 'entity' in value;

export const useClientRoleEditPage = (id: string) => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = isClientRoleEditLocationState(location.state) ? location.state : null;
  const [entity, setEntity] = useState<ClientRole | null>(locationState?.entity ?? null);
  const [loading, setLoading] = useState(entity === null);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const form = useAppForm<ClientRoleEditFormValues>(clientRoleEditFormSchema, initialValues);
  const { permissions, loading: loadingPermissions } = usePermissionsList();

  const fetchEntity = useCallback(async () => {
    if (entity) {
      form.reset(toClientRoleEditFormValues(entity));
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage(undefined);
    try {
      const fetchedEntity = await clientRolesService.getById(id);
      setEntity(fetchedEntity);
      form.reset(toClientRoleEditFormValues(fetchedEntity));
    } catch {
      setErrorMessage('Não foi possível carregar o perfil.');
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
    permissions,
    loadingPermissions,
    submitting: form.formState.isSubmitting,
    errorMessage,
    onBack: () => {
      void navigate('/client/roles');
    },
    onSubmit: async (values: ClientRoleEditFormValues): Promise<void> => {
      await clientRolesService.update(id, toClientRoleUpdatePayload(values));
      void navigate('/client/roles');
    },
  };
};
