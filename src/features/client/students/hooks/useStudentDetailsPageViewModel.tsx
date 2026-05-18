import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import type {
  EntityDetailsPageContent,
  EntityDetailsPageData,
  EntityDetailsViewState,
} from '@shared/components/data-display/details/entityDetails.types';
import { formatIsoDate } from '@shared/formatters';
import { maskCep, maskCnpj, maskCpf, maskPhone } from '@shared/masks/inputMasks';
import { onlyDigits } from '@shared/parsers/stringParsers';
import { translateDocumentType, translateStudentStatus } from '@shared/i18n/pt-BR/enums';
import { studentsService } from '@features/client/students/services/studentServices';
import type {
  Student,
  StudentAddress,
  StudentContact,
} from '@features/client/students/types/student.types';

const content: EntityDetailsPageContent = {
  pageTitle: 'Detalhes do aluno',
  pageSubtitle: 'Consulte dados cadastrais, contatos, endereços e matrículas do aluno.',
  loadingLabel: 'Carregando aluno...',
  emptyTitle: 'Aluno não encontrado',
  emptyMessage: 'Não encontramos o aluno solicitado.',
  errorFallback: 'Erro ao carregar aluno.',
  unauthorizedTitle: 'Acesso não autorizado',
  unauthorizedMessage: 'Faça login novamente para consultar este aluno.',
  forbiddenTitle: 'Acesso negado',
  forbiddenMessage: 'Você não possui permissão para consultar este aluno.',
};

const formatDate = (value: string | undefined): string => (value ? formatIsoDate(value) : '-');

const formatDocument = (student: Student): string => {
  const documentNumber = student.person?.documentNumber;
  if (!documentNumber) return '-';

  const digits = onlyDigits(documentNumber);
  if (student.person?.documentType === 'CPF' || digits.length === 11) return maskCpf(digits);
  if (student.person?.documentType === 'CNPJ' || digits.length === 14) return maskCnpj(digits);
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

export const useStudentDetailsPageViewModel = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    if (!id) {
      setStudent(null);
      return;
    }
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await studentsService.getById(id);
      setStudent(response);
    } catch {
      setErrorMessage('Erro ao carregar aluno.');
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
      : student
        ? 'ready'
        : 'empty';

  const data: EntityDetailsPageData = useMemo(
    () => ({
      headerData: student
        ? {
            title: student.person?.fullName ?? 'Aluno sem nome',
            subtitle: student.registrationCode ?? formatDocument(student),
            avatarFallback: student.person?.fullName?.slice(0, 1).toUpperCase() ?? 'A',
            statusLabel: translateStudentStatus(student.status),
            statusColor: student.status === 'active' ? 'success' : 'default',
          }
        : null,
      tabs: student
        ? [
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
                    { label: 'Documento', value: formatDocument(student) },
                    { label: 'Nascimento', value: formatDate(student.person?.dateOfBirth) },
                  ],
                },
                {
                  id: 'dates',
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
                    student.addresses && student.addresses.length > 0
                      ? student.addresses.map((address) => ({
                          label: address.neighborhood ?? 'Endereço',
                          value: formatAddress(address),
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
          ]
        : [],
    }),
    [student],
  );

  return {
    content,
    data,
    viewState,
    errorMessage,
    onBack: () => void navigate('/client/students'),
    onRetry: load,
  };
};

export const StudentDetailsPageContent = () => {
  const model = useStudentDetailsPageViewModel();
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
