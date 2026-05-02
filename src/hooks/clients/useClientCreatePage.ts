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
  const [value, setValue] = useState<CreateClientRequest>(initialValue);

  const handleSubmit = useCallback(async (): Promise<void> => {
    const created = await mutations.create(value);
    if (created) {
      void navigate(`/platform/clients/${created.id}`);
    }
  }, [mutations, navigate, value]);

  return useMemo(
    () => ({ value, setValue, loading: mutations.loading, handleSubmit }),
    [handleSubmit, mutations.loading, value],
  );
};
