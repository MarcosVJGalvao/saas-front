import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type {
  EntityDetailsPageContent,
  EntityDetailsPageData,
  EntityDetailsViewState,
} from '@shared/components/data-display/details/entityDetails.types';
import { formatIsoDate } from '@shared/formatters';
import { maskCep, maskCnpj, maskCpf, maskPhone } from '@shared/masks/inputMasks';
import { onlyDigits } from '@shared/parsers/stringParsers';
import {
  translateContactType,
  translateDocumentType,
  translateGuardianRelationshipType,
} from '@shared/i18n/pt-BR/enums';
import { legalGuardianService } from '@features/client/students/services/studentServices';
import type {
  LegalGuardian,
  StudentAddress,
  StudentContact,
} from '@features/client/students/types/student.types';

const content: EntityDetailsPageContent = {
  pageTitle: 'Detalhes do responsável',
  pageSubtitle: 'Consulte dados pessoais, contatos, endereços e alunos vinculados.',
  loadingLabel: 'Carregando responsável...',
  emptyTitle: 'Responsável não encontrado',
  emptyMessage: 'Não encontramos o responsável solicitado.',
  errorFallback: 'Erro ao carregar responsável.',
  unauthorizedTitle: 'Acesso não autorizado',
  unauthorizedMessage: 'Faça login novamente para consultar este responsável.',
  forbiddenTitle: 'Acesso negado',
  forbiddenMessage: 'Você não possui permissão para consultar este responsável.',
};

const formatDate = (value: string | undefined): string => (value ? formatIsoDate(value) : '-');

const formatDocument = (guardian: LegalGuardian): string => {
  const documentNumber = guardian.person?.documentNumber;
  if (!documentNumber) return '-';

  const digits = onlyDigits(documentNumber);
  if (guardian.person?.documentType === 'CPF' || digits.length === 11) return maskCpf(digits);
  if (guardian.person?.documentType === 'CNPJ' || digits.length === 14) return maskCnpj(digits);
  return documentNumber;
};

const formatContact = (contact: StudentContact): string => {
  if (contact.type === 'phone' || contact.type === 'whatsapp') return maskPhone(contact.value);
  return contact.value;
};

const formatAddress = (address: StudentAddress): string => {
  const street = address.street ?? '-';
  const number = address.number ?? 's/n';
  const city = address.city ?? '-';
  const state = address.state ?? '-';
  const zipCode = address.zipCode ? `CEP ${maskCep(address.zipCode)}` : 'CEP não informado';
  return `${street}, ${number} - ${city}/${state} - ${zipCode}`;
};

export const useLegalGuardianDetailsPageViewModel = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [guardian, setGuardian] = useState<LegalGuardian | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    if (!id) {
      setGuardian(null);
      return;
    }
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await legalGuardianService.getById(id);
      setGuardian(response);
    } catch {
      setErrorMessage('Erro ao carregar responsável.');
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
      : guardian
        ? 'ready'
        : 'empty';

  const data: EntityDetailsPageData = useMemo(
    () => ({
      headerData: guardian
        ? {
            title: guardian.person?.fullName ?? 'Responsável sem nome',
            subtitle: guardian.relationshipType
              ? translateGuardianRelationshipType(guardian.relationshipType)
              : formatDocument(guardian),
            avatarFallback: guardian.person?.fullName?.slice(0, 1).toUpperCase() ?? 'R',
          }
        : null,
      tabs: guardian
        ? [
            {
              id: 'summary',
              label: 'Resumo',
              sections: [
                {
                  id: 'personal',
                  title: 'Dados pessoais',
                  items: [
                    { label: 'Nome', value: guardian.person?.fullName ?? '-' },
                    {
                      label: 'Vínculo',
                      value: guardian.relationshipType
                        ? translateGuardianRelationshipType(guardian.relationshipType)
                        : '-',
                    },
                    { label: 'Principal', value: guardian.isPrimary ? 'Sim' : 'Não' },
                    {
                      label: 'Tipo de documento',
                      value: guardian.person?.documentType
                        ? translateDocumentType(guardian.person.documentType)
                        : '-',
                    },
                    { label: 'Documento', value: formatDocument(guardian) },
                    { label: 'Nascimento', value: formatDate(guardian.person?.dateOfBirth) },
                  ],
                },
                {
                  id: 'control',
                  title: 'Controle',
                  items: [
                    { label: 'Criado em', value: formatDate(guardian.createdAt) },
                    { label: 'Atualizado em', value: formatDate(guardian.updatedAt) },
                  ],
                },
              ],
            },
            {
              id: 'contacts',
              label: 'Contatos',
              sections: [
                {
                  id: 'contacts-list',
                  title: 'Contatos cadastrados',
                  items:
                    guardian.contacts && guardian.contacts.length > 0
                      ? guardian.contacts.map((contact) => ({
                          label: translateContactType(contact.type),
                          value: formatContact(contact),
                        }))
                      : [{ label: 'Contatos', value: 'Nenhum contato cadastrado.' }],
                },
              ],
            },
            {
              id: 'addresses',
              label: 'Endereços',
              sections: [
                {
                  id: 'addresses-list',
                  title: 'Endereços cadastrados',
                  items:
                    guardian.addresses && guardian.addresses.length > 0
                      ? guardian.addresses.map((address) => ({
                          label: address.neighborhood ?? 'Endereço',
                          value: formatAddress(address),
                        }))
                      : [{ label: 'Endereços', value: 'Nenhum endereço cadastrado.' }],
                },
              ],
            },
            {
              id: 'students',
              label: 'Alunos',
              sections: [
                {
                  id: 'students-list',
                  title: 'Alunos vinculados',
                  items:
                    guardian.students && guardian.students.length > 0
                      ? guardian.students.map((student) => ({
                          label: student.person?.fullName ?? 'Aluno',
                          value: student.registrationCode ?? student.id,
                        }))
                      : [{ label: 'Alunos', value: 'Nenhum aluno vinculado.' }],
                },
              ],
            },
          ]
        : [],
    }),
    [guardian],
  );

  return {
    content,
    data,
    viewState,
    errorMessage,
    onBack: () => void navigate('/client/legal-guardians'),
    onRetry: load,
  };
};
