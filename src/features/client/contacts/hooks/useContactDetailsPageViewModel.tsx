import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import type {
  EntityDetailsPageContent,
  EntityDetailsPageData,
  EntityDetailsViewState,
} from '@shared/components/data-display/details/entityDetails.types';
import { formatIsoDate } from '@shared/formatters';
import { translateContactType } from '@shared/i18n/pt-BR/enums';
import { contactService } from '@features/client/contacts/services/contactServices';
import type { Contact } from '@features/client/contacts/types/contact.types';

const content: EntityDetailsPageContent = {
  pageTitle: 'Detalhes do contato',
  pageSubtitle: 'Consulte tipo, valor e vínculo do contato.',
  loadingLabel: 'Carregando contato...',
  emptyTitle: 'Contato não encontrado',
  emptyMessage: 'Não encontramos o contato solicitado.',
  errorFallback: 'Erro ao carregar contato.',
  unauthorizedTitle: 'Acesso não autorizado',
  unauthorizedMessage: 'Faça login novamente para consultar este contato.',
  forbiddenTitle: 'Acesso negado',
  forbiddenMessage: 'Você não possui permissão para consultar este contato.',
};

const formatDate = (value: string | undefined): string => (value ? formatIsoDate(value) : '-');

export const useContactDetailsPageViewModel = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    if (!id) {
      setContact(null);
      return;
    }
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await contactService.getById(id);
      setContact(response);
    } catch {
      setErrorMessage('Erro ao carregar contato.');
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
      : contact
        ? 'ready'
        : 'empty';

  const data: EntityDetailsPageData = useMemo(
    () => ({
      headerData: contact
        ? {
            title: contact.value,
            subtitle: translateContactType(contact.type),
            avatarFallback: 'C',
            statusLabel: contact.isPrimary ? 'Principal' : 'Complementar',
            statusColor: contact.isPrimary ? 'success' : 'default',
          }
        : null,
      tabs: contact
        ? [
            {
              id: 'summary',
              label: 'Resumo',
              sections: [
                {
                  id: 'main',
                  title: 'Dados principais',
                  items: [
                    { label: 'Tipo', value: translateContactType(contact.type) },
                    { label: 'Contato', value: contact.value },
                    { label: 'Rótulo', value: contact.label ?? '-' },
                    { label: 'Pessoa', value: contact.personId ?? '-' },
                    { label: 'Principal', value: contact.isPrimary ? 'Sim' : 'Não' },
                  ],
                },
                {
                  id: 'control',
                  title: 'Controle',
                  items: [
                    { label: 'Criado em', value: formatDate(contact.createdAt) },
                    { label: 'Atualizado em', value: formatDate(contact.updatedAt) },
                  ],
                },
              ],
            },
          ]
        : [],
    }),
    [contact],
  );

  return {
    content,
    data,
    viewState,
    errorMessage,
    onBack: () => void navigate('/client/contacts'),
    onRetry: load,
  };
};

export const ContactDetailsPageContent = () => {
  const model = useContactDetailsPageViewModel();
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
