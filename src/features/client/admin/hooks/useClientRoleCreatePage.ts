import { useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import { toClientRoleCreatePayload } from '@features/client/admin/normalizers/clientRoleForm.normalizer';
import {
  clientRoleCreateFormSchema,
  type ClientRoleCreateFormValues,
} from '@features/client/admin/schemas/clientRoleCreateForm.schema';
import { clientRolesService } from '@features/client/admin/services/service';

const initialValues: ClientRoleCreateFormValues = {
  name: '',
  status: 'active',
  description: '',
};

export const useClientRoleCreatePage = () => {
  const navigate = useNavigate();
  const form = useAppForm<ClientRoleCreateFormValues>(clientRoleCreateFormSchema, initialValues);

  return {
    form,
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
