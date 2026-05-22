import { formatIsoDate } from '@shared/formatters';
import {
  translateDocumentType,
  translateGuardianRelationshipType,
  translateStudentStatus,
} from '@shared/i18n/pt-BR/enums';
import { maskCep, maskCnpj, maskCpf, maskPhone } from '@shared/masks/inputMasks';
import { onlyDigits } from '@shared/parsers/stringParsers';
import type {
  EntityDetailsPageData,
  EntityDetailsPageContent,
} from '@shared/components/data-display/details/entityDetails.types';
import type {
  Student,
  StudentAddress,
  StudentContact,
  StudentLegalGuardianLink,
} from '../types/student.types';

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

const formatPersonDocument = (documentNumber: string | undefined): string => {
  if (!documentNumber) return '-';
  const digits = onlyDigits(documentNumber);
  if (digits.length === 11) return maskCpf(digits);
  if (digits.length === 14) return maskCnpj(digits);
  return documentNumber;
};

const formatStudentContact = (contact: StudentContact): string => {
  if (contact.type === 'phone' || contact.type === 'whatsapp') return maskPhone(contact.value);
  return contact.value;
};

const formatStudentAddress = (address: StudentAddress): string => {
  const parts: string[] = [];
  if (address.street) parts.push(`${address.street}, ${address.number ?? 's/n'}`);
  if (address.complement) parts.push(address.complement);
  if (address.neighborhood) parts.push(address.neighborhood);
  const cityState =
    address.city && address.state
      ? `${address.city}/${address.state}`
      : address.city ?? address.state;
  if (cityState) parts.push(cityState);
  if (address.zipCode) parts.push(`CEP ${maskCep(address.zipCode)}`);
  return parts.join(' — ') || '-';
};

const formatCurrency = (value: number | undefined): string => {
  if (value === undefined || value === null) return '-';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const buildLegalGuardianSections = (legalGuardians: StudentLegalGuardianLink[]) =>
  legalGuardians.map((link) => {
    const guardian = link.legalGuardian;
    const name = guardian?.person?.fullName ?? 'Responsável';
    const relationshipLabel = link.relationshipType
      ? translateGuardianRelationshipType(link.relationshipType)
      : '-';

    const contactItems =
      guardian?.contacts && guardian.contacts.length > 0
        ? guardian.contacts.map((c) => ({
            label: c.type === 'email' ? 'E-mail' : 'Contato',
            value: formatStudentContact(c),
          }))
        : [{ label: 'Contatos', value: 'Nenhum contato cadastrado.' }];

    const addressItems =
      guardian?.addresses && guardian.addresses.length > 0
        ? guardian.addresses.map((a) => ({
            label: a.neighborhood ?? 'Endereço',
            value: formatStudentAddress(a),
          }))
        : [{ label: 'Endereços', value: 'Nenhum endereço cadastrado.' }];

    return {
      id: `guardian-${link.id}`,
      title: name,
      items: [
        { label: 'Parentesco', value: relationshipLabel },
        { label: 'Responsável principal', value: link.isPrimary ? 'Sim' : 'Não' },
        { label: 'Resp. financeiro', value: link.isFinancialResponsible ? 'Sim' : 'Não' },
        { label: 'Documento', value: formatPersonDocument(guardian?.person?.documentNumber) },
        ...contactItems,
        ...addressItems,
      ],
    };
  });

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
      id: 'guardians',
      label: 'Responsáveis',
      sections:
        student.legalGuardians && student.legalGuardians.length > 0
          ? buildLegalGuardianSections(student.legalGuardians)
          : [
              {
                id: 'guardians-empty',
                title: 'Responsáveis legais',
                items: [{ label: 'Responsáveis', value: 'Nenhum responsável cadastrado.' }],
              },
            ],
    },
    {
      id: 'enrollments',
      label: 'Matrículas',
      sections:
        student.enrollments && student.enrollments.length > 0
          ? student.enrollments.map((enrollment) => ({
              id: `enrollment-${enrollment.id}`,
              title: enrollment.enrollmentCode ?? 'Matrícula',
              items: [
                { label: 'Status', value: enrollment.status ?? '-' },
                { label: 'Turma', value: enrollment.schoolClass?.name ?? '-' },
                { label: 'Código da turma', value: enrollment.schoolClass?.code ?? '-' },
                { label: 'Ano letivo', value: enrollment.academicYear?.name ?? '-' },
                { label: 'Data de matrícula', value: formatDate(enrollment.enrollmentDate) },
                ...(enrollment.financialSummary
                  ? [
                      {
                        label: 'Total financeiro',
                        value: formatCurrency(enrollment.financialSummary.total),
                      },
                      {
                        label: 'Recebido',
                        value: formatCurrency(enrollment.financialSummary.received),
                      },
                      {
                        label: 'Em aberto',
                        value: formatCurrency(enrollment.financialSummary.open),
                      },
                      {
                        label: 'Inadimplente',
                        value: formatCurrency(enrollment.financialSummary.overdue),
                      },
                    ]
                  : []),
              ],
            }))
          : [
              {
                id: 'enrollments-empty',
                title: 'Matrículas vinculadas',
                items: [{ label: 'Matrículas', value: 'Nenhuma matrícula vinculada.' }],
              },
            ],
    },
    {
      id: 'documents',
      label: 'Documentos',
      sections: [
        {
          id: 'documents-emit',
          title: 'Documentos disponíveis',
          items: [
            {
              label: 'Atestado de matrícula',
              value: 'Comprova o vínculo ativo do aluno com a instituição',
            },
            {
              label: 'Histórico escolar',
              value: 'Registro completo do percurso acadêmico do aluno',
            },
          ],
        },
      ],
    },
  ],
  footerActions: [
    {
      id: 'download-enrollment-certificate',
      label: downloading ? 'Gerando...' : 'Baixar atestado',
      onClick: onDownloadEnrollmentCertificate,
      disabled: downloading,
      tabId: 'documents',
    },
    {
      id: 'download-school-history',
      label: downloading ? 'Gerando...' : 'Baixar histórico',
      onClick: onDownloadSchoolHistory,
      disabled: downloading,
      tabId: 'documents',
    },
  ],
});
