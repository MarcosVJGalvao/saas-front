import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import type {
  EntityDetailsPageContent,
  EntityDetailsPageData,
  EntityDetailsViewState,
} from '@shared/components/data-display/details/entityDetails.types';
import { formatIsoDate } from '@shared/formatters';
import { maskCep } from '@shared/masks/inputMasks';
import { addressService } from '@features/client/addresses/services/addressServices';
import type { Address } from '@features/client/addresses/types/address.types';

const content: EntityDetailsPageContent = {
  pageTitle: 'Detalhes do endereço',
  pageSubtitle: 'Consulte logradouro, cidade, estado e CEP.',
  loadingLabel: 'Carregando endereço...',
  emptyTitle: 'Endereço não encontrado',
  emptyMessage: 'Não encontramos o endereço solicitado.',
  errorFallback: 'Erro ao carregar endereço.',
  unauthorizedTitle: 'Acesso não autorizado',
  unauthorizedMessage: 'Faça login novamente para consultar este endereço.',
  forbiddenTitle: 'Acesso negado',
  forbiddenMessage: 'Você não possui permissão para consultar este endereço.',
};

const formatDate = (value: string | undefined): string => (value ? formatIsoDate(value) : '-');
const formatAddress = (address: Address): string =>
  [address.street, address.number].filter(Boolean).join(', ') || 'Endereço';

export const useAddressDetailsPageViewModel = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [address, setAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    if (!id) {
      setAddress(null);
      return;
    }
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await addressService.getById(id);
      setAddress(response);
    } catch {
      setErrorMessage('Erro ao carregar endereço.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const viewState: EntityDetailsViewState = loading
    ? 'loading'
    : errorMessage
      ? 'error'
      : address
        ? 'ready'
        : 'empty';

  const data: EntityDetailsPageData = useMemo(
    () => ({
      headerData: address
        ? {
            title: formatAddress(address),
            subtitle: `${address.city ?? '-'} / ${address.state ?? '-'}`,
            avatarFallback: 'E',
          }
        : null,
      tabs: address
        ? [
            {
              id: 'summary',
              label: 'Resumo',
              sections: [
                {
                  id: 'main',
                  title: 'Dados principais',
                  items: [
                    { label: 'Logradouro', value: address.street ?? '-' },
                    { label: 'Número', value: address.number ?? '-' },
                    { label: 'Complemento', value: address.complement ?? '-' },
                    { label: 'Bairro', value: address.neighborhood ?? '-' },
                    { label: 'Cidade', value: address.city ?? '-' },
                    { label: 'Estado', value: address.state ?? '-' },
                    { label: 'CEP', value: address.zipCode ? maskCep(address.zipCode) : '-' },
                    { label: 'País', value: address.country ?? '-' },
                    { label: 'Pessoa', value: address.personId ?? '-' },
                  ],
                },
                {
                  id: 'control',
                  title: 'Controle',
                  items: [
                    { label: 'Criado em', value: formatDate(address.createdAt) },
                    { label: 'Atualizado em', value: formatDate(address.updatedAt) },
                  ],
                },
              ],
            },
          ]
        : [],
    }),
    [address],
  );

  return {
    content,
    data,
    viewState,
    errorMessage,
    onBack: () => void navigate('/client/addresses'),
    onRetry: load,
  };
};

export const AddressDetailsPageContent = () => {
  const model = useAddressDetailsPageViewModel();
  return (
    <EntityDetailsPage
      viewState={model.viewState}
      content={model.content}
      data={model.data}
      errorMessage={model.errorMessage}
      onBack={model.onBack}
      onRetry={() => {
        void model.onRetry();
      }}
    />
  );
};
