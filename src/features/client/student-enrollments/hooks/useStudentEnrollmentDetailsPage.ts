import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { downloadBlob } from '@shared/utils/downloadBlob';
import type { DetailsFooterAction } from '@shared/types/detailsDrawer';
import {
  getStudentEnrollmentDetailsViewState,
  toStudentEnrollmentDetailsData,
} from '@features/client/student-enrollments/normalizers/studentEnrollmentDetails.normalizer';
import { studentEnrollmentService } from '@features/client/student-enrollments/services/service';
import type {
  EntityDetailsPageData,
  EntityDetailsViewState,
} from '@shared/components/data-display/details/entityDetails.types';
import type { StudentEnrollment } from '@features/client/student-enrollments/types/studentEnrollment.types';

const emptyDetailsData: EntityDetailsPageData = {
  headerData: null,
  tabs: [],
};

export const useStudentEnrollmentDetailsPage = (id: string) => {
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState<StudentEnrollment | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [actionLoading, setActionLoading] = useState(false);
  const [enrollmentPendingDelete, setEnrollmentPendingDelete] = useState<StudentEnrollment | null>(
    null,
  );

  const fetchEnrollment = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const fetchedEnrollment = await studentEnrollmentService.getById(id);
      setEnrollment(fetchedEnrollment);
    } catch {
      setErrorMessage('Erro ao carregar detalhes da matrícula.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchEnrollment();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchEnrollment]);

  const handleDownloadContract = useCallback(async () => {
    if (!enrollment) {
      return;
    }

    setActionLoading(true);
    setErrorMessage(undefined);
    try {
      const blob = await studentEnrollmentService.downloadEnrollmentContract(enrollment.id);
      downloadBlob(blob, `contrato-matricula-${enrollment.enrollmentCode ?? enrollment.id}.pdf`);
    } catch {
      setErrorMessage('Não foi possível baixar o contrato da matrícula.');
    } finally {
      setActionLoading(false);
    }
  }, [enrollment]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!enrollmentPendingDelete) {
      return;
    }

    setActionLoading(true);
    setErrorMessage(undefined);
    try {
      await studentEnrollmentService.remove(enrollmentPendingDelete.id);
      setEnrollmentPendingDelete(null);
      void navigate('/client/student-enrollments');
    } catch {
      setErrorMessage('Não foi possível remover a matrícula.');
    } finally {
      setActionLoading(false);
    }
  }, [enrollmentPendingDelete, navigate]);

  const footerActions: ReadonlyArray<DetailsFooterAction> = enrollment
    ? [
        {
          id: 'edit',
          label: 'Editar matrícula',
          onClick: () => {
            void navigate(`/client/student-enrollments/${enrollment.id}/edit`, {
              state: { entity: enrollment },
            });
          },
        },
        {
          id: 'contract',
          label: 'Baixar contrato',
          onClick: () => {
            void handleDownloadContract();
          },
          disabled: actionLoading,
        },
        {
          id: 'delete',
          label: 'Remover matrícula',
          onClick: () => setEnrollmentPendingDelete(enrollment),
          color: 'error',
          disabled: actionLoading,
        },
      ]
    : [];

  const viewState: EntityDetailsViewState = getStudentEnrollmentDetailsViewState(
    enrollment,
    errorMessage,
    loading,
  );

  return {
    viewState,
    data: enrollment ? toStudentEnrollmentDetailsData(enrollment, footerActions) : emptyDetailsData,
    errorMessage,
    deleteModal: {
      enrollmentPendingDelete,
      close: () => setEnrollmentPendingDelete(null),
      confirm: handleDeleteConfirm,
      isDeleting: actionLoading,
    },
    onBack: () => {
      void navigate('/client/student-enrollments');
    },
    onRetry: fetchEnrollment,
  };
};
