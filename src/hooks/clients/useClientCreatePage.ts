import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CreateClientRequest } from '../../models/clients';
import { useClientsMutations } from './useClientsMutations';

const initialValue: CreateClientRequest = {
  legalName: '',
  tradeName: '',
  documentNumber: '',
  documentType: 'CNPJ',
  email: '',
  phone: '',
  status: 'active',
};

export const useClientCreatePage = () => {
  const navigate = useNavigate();
  const mutations = useClientsMutations();
  const [value] = useState<CreateClientRequest>(initialValue);

  const handleSubmit = useCallback(
    async (payload: CreateClientRequest): Promise<void> => {
      const created = await mutations.create(payload);
      if (created) {
        void navigate(`/platform/clients/${created.id}`);
      }
    },
    [mutations, navigate],
  );

  return useMemo(
    () => ({ value, loading: mutations.loading, handleSubmit }),
    [handleSubmit, mutations.loading, value],
  );
};
