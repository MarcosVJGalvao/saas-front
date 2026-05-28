import { useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import { toClientRoleCreatePayload } from '@features/client/admin/normalizers/clientRoleForm.normalizer';
import {
  clientRoleCreateFormSchema,
  type ClientRoleCreateFormValues,
} from '@features/client/admin/schemas/clientRoleCreateForm.schema';
import { clientRolesService } from '@features/client/admin/services/service';
import { usePermissionsList } from '@features/client/admin/hooks/usePermissionsList';

const initialValues: ClientRoleCreateFormValues = {
  name: '',
  description: '',
  permissionIds: [],
};

export const useClientRoleCreatePage = () => {
  const navigate = useNavigate();
  const form = useAppForm<ClientRoleCreateFormValues>(clientRoleCreateFormSchema, initialValues);
  const { permissions, loading: loadingPermissions } = usePermissionsList();

  return {
    form,
    permissions,
    loadingPermissions,
    submitting: form.formState.isSubmitting,
    errorMessage: undefined,
    onBack: () => {
      void navigate('/client/roles');
    },
    onSubmit: async (values: ClientRoleCreateFormValues): Promise<void> => {
      await clientRolesService.create(toClientRoleCreatePayload(values));
      void navigate('/client/roles');
    },
  };
};
