import { useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import { toClientUserCreatePayload } from '@features/client/admin/normalizers/clientUserForm.normalizer';
import {
  clientUserCreateFormSchema,
  type ClientUserCreateFormValues,
} from '@features/client/admin/schemas/clientUserCreateForm.schema';
import { useAdminReferenceOptions } from '@features/client/admin/hooks/useAdminReferenceOptions';
import { clientUsersService } from '@features/client/admin/services/service';

const initialValues: ClientUserCreateFormValues = {
  name: '',
  email: '',
  roleId: '',
  status: 'active',
};

export const useClientUserCreatePage = () => {
  const navigate = useNavigate();
  const referenceOptions = useAdminReferenceOptions();
  const form = useAppForm<ClientUserCreateFormValues>(clientUserCreateFormSchema, initialValues);

  return {
    form,
    referenceOptions,
    submitting: form.formState.isSubmitting,
    errorMessage: undefined,
    onBack: () => {
      void navigate('/client/users');
    },
    onSubmit: async (values: ClientUserCreateFormValues): Promise<void> => {
      await clientUsersService.create(toClientUserCreatePayload(values));
      void navigate('/client/users');
    },
  };
};
