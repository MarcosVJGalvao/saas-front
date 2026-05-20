import { formatIsoDate } from '@shared/formatters';
import {
  translateContactType,
  translateDocumentType,
  translateGuardianRelationshipType,
} from '@shared/i18n/pt-BR/enums';
import { maskCep, maskCnpj, maskCpf, maskPhone } from '@shared/masks/inputMasks';
import { onlyDigits } from '@shared/parsers/stringParsers';
import type { EntityDetailsPageData } from '@shared/components/data-display/details/entityDetails.types';
import type { LegalGuardian, StudentAddress, StudentContact } from '../types/student.types';

const formatDate = (value: string | undefined): string => (value ? formatIsoDate(value) : '-');

const formatGuardianDocument = (guardian: LegalGuardian): string => {
  const documentNumber = guardian.person?.documentNumber;
  if (!documentNumber) return '-';
  const digits = onlyDigits(documentNumber);
  if (guardian.person?.documentType === 'CPF' || digits.length === 11) return maskCpf(digits);
  if (guardian.person?.documentType === 'CNPJ' || digits.length === 14) return maskCnpj(digits);
  return documentNumber;
};

const formatGuardianContact = (contact: StudentContact): string => {
  if (contact.type === 'phone' || contact.type === 'whatsapp') return maskPhone(contact.value);
  return contact.value;
};

const formatGuardianAddress = (address: StudentAddress): string => {
  const street = address.street ?? '-';
  const number = address.number ?? 's/n';
  const city = address.city ?? '-';
  const state = address.state ?? '-';
  const zipCode = address.zipCode ? `CEP ${maskCep(address.zipCode)}` : 'CEP não informado';
  return `${street}, ${number} - ${city}/${state} - ${zipCode}`;
};

export const toLegalGuardianDetailsData = (guardian: LegalGuardian): EntityDetailsPageData => ({
  headerData: {
    title: guardian.person?.fullName ?? 'Responsável sem nome',
    subtitle: guardian.relationshipType
      ? translateGuardianRelationshipType(guardian.relationshipType)
      : formatGuardianDocument(guardian),
    avatarFallback: guardian.person?.fullName?.slice(0, 1).toUpperCase() ?? 'R',
  },
  tabs: [
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
            { label: 'Documento', value: formatGuardianDocument(guardian) },
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
                  value: formatGuardianContact(contact),
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
                  value: formatGuardianAddress(address),
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
  ],
});
