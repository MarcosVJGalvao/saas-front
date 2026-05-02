import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { CreateClientRequest } from '../../models/clients';
import { clientsService } from '../../services/platform/clients/service';
import { useClientsMutations } from './useClientsMutations';

const emptyValue: CreateClientRequest = {
  legalName: '',
  tradeName: '',
  documentNumber: '',
  documentType: 'CNPJ',
  email: '',
  phone: '',
  status: 'active',
};

export const useClientEditPage = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const mutations = useClientsMutations();
  const [value, setValue] = useState<CreateClientRequest>(emptyValue);

  useEffect(() => {
    void clientsService.getById(id).then((client) => {
      setValue({
        legalName: client.legalName,
        tradeName: client.tradeName,
        documentNumber: client.documentNumber,
        documentType: client.documentType,
        email: client.email,
        phone: client.phone,
        status: client.status,
      });
    });
  }, [id]);

  const handleSubmit = useCallback(async (): Promise<void> => {
    const updated = await mutations.update(id, value);
    if (updated) {
      void navigate(`/platform/clients/${updated.id}`);
    }
  }, [id, mutations, navigate, value]);

  return useMemo(
    () => ({ value, setValue, loading: mutations.loading, handleSubmit }),
    [handleSubmit, mutations.loading, value],
  );
};
