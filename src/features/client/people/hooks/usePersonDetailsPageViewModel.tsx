import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import type {
  EntityDetailsPageContent,
  EntityDetailsPageData,
  EntityDetailsViewState,
} from '@shared/components/data-display/details/entityDetails.types';
import { formatIsoDate } from '@shared/formatters';
import { maskCnpj, maskCpf } from '@shared/masks/inputMasks';
import { onlyDigits } from '@shared/parsers/stringParsers';
import {
  genderLabels,
  maritalStatusLabels,
  nationalityLabels,
  translateDocumentType,
} from '@shared/i18n/pt-BR/enums';
import { personService } from '@features/client/people/services/personServices';
import type { Person } from '@features/client/people/types/person.types';

const content: EntityDetailsPageContent = {
  pageTitle: 'Detalhes da pessoa',
  pageSubtitle: 'Consulte dados pessoais e documentos.',
  loadingLabel: 'Carregando pessoa...',
  emptyTitle: 'Pessoa não encontrada',
  emptyMessage: 'Não encontramos a pessoa solicitada.',
  errorFallback: 'Erro ao carregar pessoa.',
  unauthorizedTitle: 'Acesso não autorizado',
  unauthorizedMessage: 'Faça login novamente para consultar esta pessoa.',
  forbiddenTitle: 'Acesso negado',
  forbiddenMessage: 'Você não possui permissão para consultar esta pessoa.',
};

const formatDate = (value: string | undefined): string => (value ? formatIsoDate(value) : '-');

const formatDocument = (person: Person): string => {
  const documentNumber = person.documentNumber;
  if (!documentNumber) return '-';
  const digits = onlyDigits(documentNumber);
  if (person.documentType === 'CPF' || digits.length === 11) return maskCpf(digits);
  if (person.documentType === 'CNPJ' || digits.length === 14) return maskCnpj(digits);
  return documentNumber;
};

export const usePersonDetailsPageViewModel = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    if (!id) {
      setPerson(null);
      return;
    }
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await personService.getById(id);
      setPerson(response);
    } catch {
      setErrorMessage('Erro ao carregar pessoa.');
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
      : person
        ? 'ready'
        : 'empty';

  const data: EntityDetailsPageData = useMemo(
    () => ({
      headerData: person
        ? {
            title: person.fullName,
            subtitle: formatDocument(person),
            avatarFallback: person.fullName.slice(0, 1).toUpperCase(),
          }
        : null,
      tabs: person
        ? [
            {
              id: 'summary',
              label: 'Resumo',
              sections: [
                {
                  id: 'main',
                  title: 'Dados pessoais',
                  items: [
                    { label: 'Nome', value: person.fullName },
                    {
                      label: 'Tipo de documento',
                      value: person.documentType ? translateDocumentType(person.documentType) : '-',
                    },
                    { label: 'Documento', value: formatDocument(person) },
                    { label: 'Nascimento', value: formatDate(person.dateOfBirth) },
                    {
                      label: 'Gênero',
                      value: person.gender ? genderLabels[person.gender] : '-',
                    },
                    {
                      label: 'Estado civil',
                      value: person.maritalStatus ? maritalStatusLabels[person.maritalStatus] : '-',
                    },
                    {
                      label: 'Nacionalidade',
                      value: person.nationality ? nationalityLabels[person.nationality] : '-',
                    },
                  ],
                },
                {
                  id: 'control',
                  title: 'Controle',
                  items: [
                    { label: 'Criado em', value: formatDate(person.createdAt) },
                    { label: 'Atualizado em', value: formatDate(person.updatedAt) },
                  ],
                },
              ],
            },
          ]
        : [],
    }),
    [person],
  );

  return {
    content,
    data,
    viewState,
    errorMessage,
    onBack: () => void navigate('/client/people'),
    onRetry: load,
  };
};

export const PersonDetailsPageContent = () => {
  const model = usePersonDetailsPageViewModel();
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
