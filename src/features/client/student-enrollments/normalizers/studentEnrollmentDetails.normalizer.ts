import { translateEnrollmentStatus } from '@shared/i18n/pt-BR/enums';
import type {
  EntityDetailsPageData,
  EntityDetailsViewState,
} from '@shared/components/data-display/details/entityDetails.types';
import { createLocalizedStatusBadge } from '@shared/components/data-display/statusBadge.utils';
import type { StudentEnrollment } from '@features/client/student-enrollments/types/studentEnrollment.types';
import type { DetailsFooterAction } from '@shared/types/detailsDrawer';

export const getStudentEnrollmentDetailsViewState = (
  enrollment: StudentEnrollment | null,
  errorMessage?: string,
  loading?: boolean,
): EntityDetailsViewState => {
  if (loading) {
    return 'loading';
  }

  if (errorMessage) {
    return 'error';
  }

  return enrollment ? 'ready' : 'empty';
};

export const toStudentEnrollmentDetailsData = (
  enrollment: StudentEnrollment,
  footerActions: ReadonlyArray<DetailsFooterAction>,
): EntityDetailsPageData => {
  const studentName = enrollment.student?.person?.fullName ?? 'Matrícula';
  const enrollmentStatusBadge = createLocalizedStatusBadge(
    translateEnrollmentStatus(enrollment.status),
    enrollment.status === 'active' ? 'active' : 'neutral',
  );

  return {
    headerData: {
      title: studentName,
      subtitle: enrollment.enrollmentCode ?? enrollment.id,
      avatarFallback: studentName.slice(0, 1).toUpperCase(),
      statusLabel: translateEnrollmentStatus(enrollment.status),
      statusColor: enrollment.status === 'active' ? 'success' : 'default',
    },
    tabs: [
      {
        id: 'summary',
        label: 'Resumo',
        sections: [
          {
            id: 'main',
            title: 'Dados da matrícula',
            items: [
              { label: 'Código', value: enrollment.enrollmentCode ?? '-' },
              { label: 'Status', value: enrollmentStatusBadge },
              { label: 'Data da matrícula', value: enrollment.enrollmentDate },
              { label: 'Observações', value: enrollment.observations ?? '-' },
            ],
          },
        ],
      },
      {
        id: 'student',
        label: 'Aluno',
        sections: [
          {
            id: 'student-data',
            title: 'Dados do aluno',
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
        sections: [
          {
            id: 'academic-data',
            title: 'Dados acadêmicos',
            items: [
              { label: 'Ano letivo', value: enrollment.academicYear?.name ?? '-' },
              { label: 'Turma', value: enrollment.schoolClass?.name ?? '-' },
            ],
          },
        ],
      },
    ],
    footerActions,
  };
};
