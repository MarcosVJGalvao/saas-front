import { formatIsoDate } from '@shared/formatters';
import { formatCurrency } from '@shared/formatters/currencyFormatter';
import {
  enrollmentStatusLabels,
  maritalStatusLabels,
  nationalityLabels,
  translateDocumentType,
  translateEnrollmentStatus,
  translateGuardianRelationshipType,
  translateStudentStatus,
} from '@shared/i18n/pt-BR/enums';
import { maskCep, maskCnpj, maskCpf, maskPhone } from '@shared/masks/inputMasks';
import { onlyDigits } from '@shared/parsers/stringParsers';
import type {
  EntityDetailsPageContent,
  EntityDetailsPageData,
} from '@shared/components/data-display/details/entityDetails.types';
import { createOptionalLocalizedStatusBadge } from '@shared/components/data-display/statusBadge.utils';
import type {
  Student,
  StudentAddress,
  StudentContact,
  StudentGender,
  StudentLegalGuardianLink,
  StudentMedicalInfo,
  StudentMaritalStatus,
  StudentNationality,
} from '../types/student.types';

export const studentDetailsContent: EntityDetailsPageContent = {
  emptyTitle: 'Aluno não encontrado',
  emptyMessage: 'Não foi possível localizar o aluno solicitado.',
  errorFallback: 'Não foi possível carregar os detalhes do aluno.',
};

const formatDate = (value: string | undefined): string => (value ? formatIsoDate(value) : '-');

const formatGender = (value: StudentGender | undefined): string => {
  if (value === 'male') return 'Masculino';
  if (value === 'female') return 'Feminino';
  if (value === 'other') return 'Outro';
  if (value === 'prefer_not_to_say') return 'Prefiro não informar';
  return '-';
};

const formatNationality = (value: StudentNationality | undefined): string =>
  value ? nationalityLabels[value] : '-';

const formatMaritalStatus = (value: StudentMaritalStatus | null | undefined): string =>
  value ? maritalStatusLabels[value] : '-';

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
  if (contact.type === 'phone' || contact.type === 'whatsapp') {
    return maskPhone(contact.value);
  }

  return contact.value;
};

const formatStudentAddress = (address: StudentAddress): string => {
  const addressParts: string[] = [];

  if (address.street) {
    addressParts.push(`${address.street}, ${address.number ?? 's/n'}`);
  }

  if (address.complement) {
    addressParts.push(address.complement);
  }

  if (address.neighborhood) {
    addressParts.push(address.neighborhood);
  }

  const cityAndState =
    address.city && address.state
      ? `${address.city}/${address.state}`
      : (address.city ?? address.state);

  if (cityAndState) {
    addressParts.push(cityAndState);
  }

  if (address.zipCode) {
    addressParts.push(`CEP ${maskCep(address.zipCode)}`);
  }

  if (address.country) {
    addressParts.push(address.country);
  }

  return addressParts.join(' - ') || '-';
};

const formatFinancialValue = (value: number | undefined): string =>
  value === undefined || value === null ? '-' : formatCurrency(value, 'BRL');

const formatMonthlyIncome = (value: string | null | undefined): string =>
  value ? formatCurrency(value, 'BRL') : '-';

const getStudentContacts = (student: Student): StudentContact[] =>
  student.person?.contacts ?? student.contacts ?? [];

const getStudentAddresses = (student: Student): StudentAddress[] =>
  student.person?.addresses ?? student.addresses ?? [];

const getStudentMedicalInfo = (student: Student): StudentMedicalInfo | null | undefined =>
  student.medicalInfo ?? student.person?.medicalInfo;

const buildLegalGuardianSections = (legalGuardians: StudentLegalGuardianLink[]) =>
  legalGuardians.map((studentGuardianLink) => {
    const guardian = studentGuardianLink.legalGuardian;
    const guardianName = guardian?.person?.fullName ?? 'Responsável';
    const relationshipLabel = studentGuardianLink.relationshipType
      ? translateGuardianRelationshipType(studentGuardianLink.relationshipType)
      : '-';

    const contactItems =
      guardian?.contacts && guardian.contacts.length > 0
        ? guardian.contacts.map((guardianContact) => ({
            label: guardianContact.type === 'email' ? 'E-mail' : 'Contato',
            value: formatStudentContact(guardianContact),
          }))
        : [{ label: 'Contatos', value: 'Nenhum contato cadastrado.' }];

    const addressItems =
      guardian?.addresses && guardian.addresses.length > 0
        ? guardian.addresses.map((guardianAddress) => ({
            label: guardianAddress.neighborhood ?? 'Endereço',
            value: formatStudentAddress(guardianAddress),
          }))
        : [{ label: 'Endereços', value: 'Nenhum endereço cadastrado.' }];

    return {
      id: `guardian-${studentGuardianLink.id}`,
      title: guardianName,
      items: [
        { label: 'Parentesco', value: relationshipLabel },
        { label: 'Responsável principal', value: studentGuardianLink.isPrimary ? 'Sim' : 'Não' },
        {
          label: 'Responsável financeiro',
          value: studentGuardianLink.isFinancialResponsible ? 'Sim' : 'Não',
        },
        { label: 'Pode buscar', value: studentGuardianLink.canPickUp ? 'Sim' : 'Não' },
        { label: 'Documento', value: formatPersonDocument(guardian?.person?.documentNumber) },
        {
          label: 'Nascimento',
          value: formatDate(guardian?.person?.dateOfBirth),
        },
        {
          label: 'Gênero',
          value: formatGender(guardian?.person?.gender),
        },
        {
          label: 'Nacionalidade',
          value: formatNationality(guardian?.person?.nationality),
        },
        {
          label: 'Estado civil',
          value: formatMaritalStatus(guardian?.person?.maritalStatus),
        },
        { label: 'Renda mensal', value: formatMonthlyIncome(guardian?.person?.monthlyIncome) },
        ...contactItems,
        ...addressItems,
      ],
    };
  });

const renderStudentStatus = (status: Student['status']) =>
  createOptionalLocalizedStatusBadge(
    translateStudentStatus(status),
    status === 'active' ? 'active' : 'neutral',
  );

const isEnrollmentStatusValue = (value: string): value is keyof typeof enrollmentStatusLabels =>
  value in enrollmentStatusLabels;

const renderEnrollmentStatus = (status: string | undefined) =>
  createOptionalLocalizedStatusBadge(
    status && isEnrollmentStatusValue(status) ? translateEnrollmentStatus(status) : status,
    status === 'active' ? 'active' : 'neutral',
    status ?? '-',
  );

export const toStudentDetailsData = (
  student: Student,
  downloading: boolean,
  onDownloadEnrollmentCertificate: () => void,
  onDownloadSchoolHistory: () => void,
): EntityDetailsPageData => {
  const studentMedicalInfo = getStudentMedicalInfo(student);
  const studentContacts = getStudentContacts(student);
  const studentAddresses = getStudentAddresses(student);

  return {
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
              { label: 'Status', value: renderStudentStatus(student.status) },
              {
                label: 'Tipo de documento',
                value: student.person?.documentType
                  ? translateDocumentType(student.person.documentType)
                  : '-',
              },
              { label: 'Documento', value: formatStudentDocument(student) },
              { label: 'Nascimento', value: formatDate(student.person?.dateOfBirth) },
              { label: 'Gênero', value: formatGender(student.person?.gender) },
              {
                label: 'Nacionalidade',
                value: formatNationality(student.person?.nationality),
              },
              {
                label: 'Estado civil',
                value: formatMaritalStatus(student.person?.maritalStatus),
              },
              { label: 'Renda mensal', value: formatMonthlyIncome(student.person?.monthlyIncome) },
              { label: 'Turma atual', value: student.schoolClass?.name ?? '-' },
              { label: 'Código da turma', value: student.schoolClass?.code ?? '-' },
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
              studentContacts.length > 0
                ? studentContacts.map((studentContact) => ({
                    label: studentContact.type === 'email' ? 'E-mail' : 'Contato',
                    value: formatStudentContact(studentContact),
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
              studentAddresses.length > 0
                ? studentAddresses.map((studentAddress) => ({
                    label: studentAddress.neighborhood ?? 'Endereço',
                    value: formatStudentAddress(studentAddress),
                  }))
                : [{ label: 'Endereços', value: 'Nenhum endereço cadastrado.' }],
          },
        ],
      },
      {
        id: 'medical-info',
        label: 'Saúde',
        sections: [
          {
            id: 'medical-summary',
            title: 'Informações médicas',
            items: [
              { label: 'Tipo sanguíneo', value: studentMedicalInfo?.bloodType ?? '-' },
              { label: 'Alergias', value: studentMedicalInfo?.allergies ?? '-' },
              { label: 'Doenças crônicas', value: studentMedicalInfo?.chronicDiseases ?? '-' },
              { label: 'Medicamentos', value: studentMedicalInfo?.medications ?? '-' },
              {
                label: 'Contato de emergência',
                value: studentMedicalInfo?.emergencyContactName ?? '-',
              },
              {
                label: 'Telefone de emergência',
                value: studentMedicalInfo?.emergencyContactPhone
                  ? maskPhone(studentMedicalInfo.emergencyContactPhone)
                  : '-',
              },
              { label: 'Observações', value: studentMedicalInfo?.notes ?? '-' },
            ],
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
            ? student.enrollments.map((studentEnrollment) => ({
                id: `enrollment-${studentEnrollment.id}`,
                title: studentEnrollment.enrollmentCode ?? 'Matrícula',
                items: [
                  { label: 'Status', value: renderEnrollmentStatus(studentEnrollment.status) },
                  { label: 'Turma', value: studentEnrollment.schoolClass?.name ?? '-' },
                  { label: 'Código da turma', value: studentEnrollment.schoolClass?.code ?? '-' },
                  { label: 'Ano letivo', value: studentEnrollment.academicYear?.name ?? '-' },
                  {
                    label: 'Data de matrícula',
                    value: formatDate(studentEnrollment.enrollmentDate),
                  },
                  ...(studentEnrollment.financialSummary
                    ? [
                        {
                          label: 'Total financeiro',
                          value: formatFinancialValue(studentEnrollment.financialSummary.total),
                        },
                        {
                          label: 'Recebido',
                          value: formatFinancialValue(studentEnrollment.financialSummary.received),
                        },
                        {
                          label: 'Em aberto',
                          value: formatFinancialValue(studentEnrollment.financialSummary.open),
                        },
                        {
                          label: 'Inadimplente',
                          value: formatFinancialValue(studentEnrollment.financialSummary.overdue),
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
  };
};
