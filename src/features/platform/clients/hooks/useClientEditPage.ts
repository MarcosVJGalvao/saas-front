import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { CreateClientRequest } from '@features/platform/clients/types/clients';
import { clientsService } from '@features/platform/clients/services/service';
import { useClientsMutations } from '@features/platform/clients/hooks/useClientsMutations';
import { normalizeClientPayload } from '@features/platform/clients/normalizers/clientPayloadNormalizer';

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

  const handleSubmit = useCallback(
    async (payload: CreateClientRequest): Promise<void> => {
      const updated = await mutations.update(id, normalizeClientPayload(payload));
      if (updated) {
        void navigate(`/platform/clients/${updated.id}`);
      }
    },
    [id, mutations, navigate],
  );

  return useMemo(
    () => ({ value, loading: mutations.loading, handleSubmit }),
    [handleSubmit, mutations.loading, value],
  );
};
