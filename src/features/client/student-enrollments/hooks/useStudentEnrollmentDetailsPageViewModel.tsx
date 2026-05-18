import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FamilyRestroomOutlinedIcon from '@mui/icons-material/FamilyRestroomOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { studentEnrollmentService } from '@features/client/student-enrollments/services/studentEnrollmentService';
import { useStudentEnrollmentDetails } from '@features/client/student-enrollments/hooks/useStudentEnrollmentDetails';
import type { StudentEnrollment } from '@features/client/student-enrollments/types/studentEnrollment.types';
import type {
  DetailTab,
  DetailsFooterAction,
  DetailsHeaderData,
} from '@shared/types/detailsDrawer';
import type {
  EntityDetailsPageData,
  EntityDetailsViewState,
} from '@shared/components/data-display/details/entityDetails.types';
import { downloadBlob } from '@shared/utils/downloadBlob';
import { translateEnrollmentStatus } from '@shared/i18n/pt-BR/enums';

const buildHeaderData = (enrollment: StudentEnrollment): DetailsHeaderData => {
  const title = enrollment.student?.person?.fullName ?? 'Matrícula';
  return {
    title,
    subtitle: enrollment.enrollmentCode ?? enrollment.id,
    avatarFallback: title.slice(0, 1).toUpperCase(),
    statusLabel: translateEnrollmentStatus(enrollment.status),
    statusColor: enrollment.status === 'active' ? 'success' : 'default',
  };
};

const buildTabs = (enrollment: StudentEnrollment): ReadonlyArray<DetailTab> => [
  {
    id: 'summary',
    label: 'Resumo',
    icon: <ArticleOutlinedIcon fontSize="small" />,
    sections: [
      {
        id: 'main',
        title: 'Dados da matrícula',
        icon: <ArticleOutlinedIcon fontSize="small" />,
        items: [
          { label: 'Código', value: enrollment.enrollmentCode ?? '-' },
          { label: 'Status', value: translateEnrollmentStatus(enrollment.status) },
          { label: 'Data da matrícula', value: enrollment.enrollmentDate },
          { label: 'Observações', value: enrollment.observations ?? '-' },
        ],
      },
    ],
  },
  {
    id: 'student',
    label: 'Aluno',
    icon: <FamilyRestroomOutlinedIcon fontSize="small" />,
    sections: [
      {
        id: 'student-data',
        title: 'Dados do aluno',
        icon: <FamilyRestroomOutlinedIcon fontSize="small" />,
        items: [
          { label: 'Nome', value: enrollment.student?.person?.fullName ?? '-' },
          { label: 'Documento', value: enrollment.student?.person?.documentNumber ?? '-' },
          { label: 'Código do aluno', value: enrollment.student?.registrationCode ?? '-' },
        ],
      },
    ],
  },
  {
    id: 'academic',
    label: 'Acadêmico',
    icon: <SchoolOutlinedIcon fontSize="small" />,
    sections: [
      {
        id: 'academic-data',
        title: 'Dados acadêmicos',
        icon: <SchoolOutlinedIcon fontSize="small" />,
        items: [
          { label: 'Ano letivo', value: enrollment.academicYear?.name ?? '-' },
          { label: 'Turma', value: enrollment.schoolClass?.name ?? '-' },
        ],
      },
    ],
  },
];

export const useStudentEnrollmentDetailsPageViewModel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const details = useStudentEnrollmentDetails(id);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | undefined>(undefined);

  const viewState: EntityDetailsViewState = details.loading
    ? 'loading'
    : details.errorMessage
      ? 'error'
      : details.data
        ? 'ready'
        : 'empty';

  const downloadContract = useCallback(async (): Promise<void> => {
    if (!details.data) return;
    setActionLoading(true);
    setActionErrorMessage(undefined);
    try {
      const blob = await studentEnrollmentService.downloadEnrollmentContract(details.data.id);
      downloadBlob(
        blob,
        `contrato-matricula-${details.data.enrollmentCode ?? details.data.id}.pdf`,
      );
    } catch {
      setActionErrorMessage('Não foi possível baixar o contrato da matrícula.');
    } finally {
      setActionLoading(false);
    }
  }, [details.data]);

  const confirmDelete = async (): Promise<void> => {
    if (!details.data) return;
    setActionLoading(true);
    setActionErrorMessage(undefined);
    try {
      await studentEnrollmentService.remove(details.data.id);
      setDeleteDialogOpen(false);
      void navigate('/client/student-enrollments');
    } catch {
      setActionErrorMessage('Não foi possível remover a matrícula.');
    } finally {
      setActionLoading(false);
    }
  };

  const footerActions = useMemo<ReadonlyArray<DetailsFooterAction>>(() => {
    const enrollment = details.data;
    if (!enrollment) return [];
    return [
      {
        id: 'edit',
        label: 'Editar matrícula',
        icon: <EditOutlinedIcon fontSize="small" />,
        color: 'primary',
        onClick: () => void navigate(`/client/student-enrollments/${enrollment.id}/edit`),
      },
      {
        id: 'contract',
        label: 'Baixar contrato',
        icon: <DownloadOutlinedIcon fontSize="small" />,
        color: 'primary',
        disabled: actionLoading,
        onClick: () => {
          void downloadContract();
        },
      },
      {
        id: 'delete',
        label: 'Remover matrícula',
        icon: <DeleteOutlineOutlinedIcon fontSize="small" />,
        color: 'error',
        disabled: actionLoading,
        onClick: () => setDeleteDialogOpen(true),
      },
    ];
  }, [actionLoading, details.data, downloadContract, navigate]);

  const data = useMemo<EntityDetailsPageData>(
    () => ({
      headerData: details.data ? buildHeaderData(details.data) : null,
      tabs: details.data ? buildTabs(details.data) : [],
      footerActions,
    }),
    [details.data, footerActions],
  );

  return {
    viewState,
    data,
    errorMessage: actionErrorMessage ?? details.errorMessage,
    deleteDialogOpen,
    actionLoading,
    deleteTitle: 'Remover matrícula',
    deleteDescription: `Confirma a remoção da matrícula ${details.data?.enrollmentCode ?? 'selecionada'}?`,
    closeDeleteDialog: () => setDeleteDialogOpen(false),
    confirmDelete,
    onBack: () => void navigate('/client/student-enrollments'),
    onRetry: details.reload,
  };
};
