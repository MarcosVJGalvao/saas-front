import { formatIsoDate } from '@shared/formatters';
import { translateDocumentType, translateStudentStatus } from '@shared/i18n/pt-BR/enums';
import { maskCep, maskCnpj, maskCpf, maskPhone } from '@shared/masks/inputMasks';
import { onlyDigits } from '@shared/parsers/stringParsers';
import type {
  EntityDetailsPageData,
  EntityDetailsPageContent,
} from '@shared/components/data-display/details/entityDetails.types';
import type { Student, StudentAddress, StudentContact } from '../types/student.types';

export const studentDetailsContent: EntityDetailsPageContent = {
  emptyTitle: 'Aluno não encontrado',
  emptyMessage: 'Não foi possível localizar o aluno solicitado.',
  errorFallback: 'Não foi possível carregar os detalhes do aluno.',
};

const formatDate = (value: string | undefined): string => (value ? formatIsoDate(value) : '-');

const formatStudentDocument = (student: Student): string => {
  const documentNumber = student.person?.documentNumber;
  if (!documentNumber) return '-';
  const digits = onlyDigits(documentNumber);
  if (student.person?.documentType === 'CPF' || digits.length === 11) return maskCpf(digits);
  if (student.person?.documentType === 'CNPJ' || digits.length === 14) return maskCnpj(digits);
  return documentNumber;
};

const formatStudentContact = (contact: StudentContact): string => {
  if (contact.type === 'phone' || contact.type === 'whatsapp') return maskPhone(contact.value);
  return contact.value;
};

const formatStudentAddress = (address: StudentAddress): string => {
  const street = address.street ?? '-';
  const number = address.number ?? 's/n';
  const city = address.city ?? '-';
  const state = address.state ?? '-';
  const zipCode = address.zipCode ? `CEP ${maskCep(address.zipCode)}` : 'CEP não informado';
  return `${street}, ${number} - ${city}/${state} - ${zipCode}`;
};

export const toStudentDetailsData = (
  student: Student,
  downloading: boolean,
  onDownloadEnrollmentCertificate: () => void,
  onDownloadSchoolHistory: () => void,
): EntityDetailsPageData => ({
  headerData: {
    title: student.person?.fullName ?? 'Aluno sem nome',
    subtitle: student.registrationCode ?? formatStudentDocument(student),
    avatarFallback: student.person?.fullName?.slice(0, 1).toUpperCase() ?? 'A',
    statusLabel: translateStudentStatus(student.status),
    statusColor: student.status === 'active' ? 'success' : 'default',
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
            { label: 'Nome', value: student.person?.fullName ?? '-' },
            { label: 'Código', value: student.registrationCode ?? '-' },
            { label: 'Status', value: translateStudentStatus(student.status) },
            {
              label: 'Tipo de documento',
              value: student.person?.documentType
                ? translateDocumentType(student.person.documentType)
                : '-',
            },
            { label: 'Documento', value: formatStudentDocument(student) },
            { label: 'Nascimento', value: formatDate(student.person?.dateOfBirth) },
          ],
        },
        {
          id: 'control',
          title: 'Controle',
          items: [
            { label: 'Criado em', value: formatDate(student.createdAt) },
            { label: 'Atualizado em', value: formatDate(student.updatedAt) },
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
            student.contacts && student.contacts.length > 0
              ? student.contacts.map((contact) => ({
                  label: contact.type === 'email' ? 'E-mail' : 'Contato',
                  value: formatStudentContact(contact),
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
            student.addresses && student.addresses.length > 0
              ? student.addresses.map((address) => ({
                  label: address.neighborhood ?? 'Endereço',
                  value: formatStudentAddress(address),
                }))
              : [{ label: 'Endereços', value: 'Nenhum endereço cadastrado.' }],
        },
      ],
    },
    {
      id: 'enrollments',
      label: 'Matrículas',
      sections: [
        {
          id: 'enrollments-list',
          title: 'Matrículas vinculadas',
          items:
            student.enrollments && student.enrollments.length > 0
              ? student.enrollments.map((enrollment) => ({
                  label: enrollment.enrollmentCode ?? 'Matrícula',
                  value:
                    enrollment.schoolClass?.name ??
                    enrollment.academicYear?.name ??
                    enrollment.enrollmentDate ??
                    '-',
                }))
              : [{ label: 'Matrículas', value: 'Nenhuma matrícula vinculada.' }],
        },
      ],
    },
  ],
  footerActions: [
    {
      id: 'download-enrollment-certificate',
      label: downloading ? 'Baixando atestado...' : 'Baixar atestado',
      onClick: onDownloadEnrollmentCertificate,
      disabled: downloading,
    },
    {
      id: 'download-school-history',
      label: downloading ? 'Baixando histórico...' : 'Baixar histórico',
      onClick: onDownloadSchoolHistory,
      disabled: downloading,
    },
  ],
});
