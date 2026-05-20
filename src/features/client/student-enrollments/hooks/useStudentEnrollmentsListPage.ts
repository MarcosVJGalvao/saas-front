import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { downloadBlob } from '@shared/utils/downloadBlob';
import {
  buildStudentEnrollmentColumns,
  buildStudentEnrollmentMobileConfig,
} from '@features/client/student-enrollments/components/studentEnrollmentListColumns';
import { studentEnrollmentService } from '@features/client/student-enrollments/services/service';
import { useStudentEnrollmentsList } from '@features/client/student-enrollments/hooks/useStudentEnrollmentsList';
import type {
  EnrollmentStatus,
  StudentEnrollment,
  StudentEnrollmentQueryParams,
} from '@features/client/student-enrollments/types/studentEnrollment.types';

type StudentEnrollmentFilterValues = {
  search: string;
  status: string;
  startDate: string;
  endDate: string;
};

const initialFilterValues: StudentEnrollmentFilterValues = {
  search: '',
  status: '',
  startDate: '',
  endDate: '',
};

const isEnrollmentStatus = (value: string): value is EnrollmentStatus =>
  value === 'active' || value === 'cancelled' || value === 'transferred';

const getOptionalText = (value: string): string | undefined => {
  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

const buildQueryFromFilters = (
  filterValues: StudentEnrollmentFilterValues,
): Partial<StudentEnrollmentQueryParams> => ({
  search: getOptionalText(filterValues.search),
  status: isEnrollmentStatus(filterValues.status) ? filterValues.status : undefined,
  startDate: getOptionalText(filterValues.startDate),
  endDate: getOptionalText(filterValues.endDate),
  page: 1,
});

export const useStudentEnrollmentsListPage = () => {
  const navigate = useNavigate();
  const studentEnrollmentsList = useStudentEnrollmentsList();
  const [filterValues, setFilterValues] =
    useState<StudentEnrollmentFilterValues>(initialFilterValues);
  const [enrollmentPendingDelete, setEnrollmentPendingDelete] = useState<StudentEnrollment | null>(
    null,
  );
  const [actionLoading, setActionLoading] = useState(false);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | undefined>();

  const handleDownloadContract = useCallback(async (enrollment: StudentEnrollment) => {
    setActionLoading(true);
    setActionErrorMessage(undefined);
    try {
      const blob = await studentEnrollmentService.downloadEnrollmentContract(enrollment.id);
      downloadBlob(blob, `contrato-matricula-${enrollment.enrollmentCode ?? enrollment.id}.pdf`);
    } catch {
      setActionErrorMessage('Não foi possível baixar o contrato da matrícula.');
    } finally {
      setActionLoading(false);
    }
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!enrollmentPendingDelete) {
      return;
    }

    setActionLoading(true);
    setActionErrorMessage(undefined);
    try {
      await studentEnrollmentService.remove(enrollmentPendingDelete.id);
      setEnrollmentPendingDelete(null);
      await studentEnrollmentsList.reload();
    } catch {
      setActionErrorMessage('Não foi possível remover a matrícula.');
    } finally {
      setActionLoading(false);
    }
  }, [enrollmentPendingDelete, studentEnrollmentsList]);

  const tableColumns = buildStudentEnrollmentColumns({
    onDetails: (enrollment) => {
      void navigate(`/client/student-enrollments/${enrollment.id}`);
    },
    onEdit: (enrollment) =>
      void navigate(`/client/student-enrollments/${enrollment.id}/edit`, {
        state: { entity: enrollment },
      }),
    onDownloadContract: (enrollment) => {
      void handleDownloadContract(enrollment);
    },
    onDelete: setEnrollmentPendingDelete,
  });

  const mobileConfig = buildStudentEnrollmentMobileConfig({
    onDetails: (enrollment) => {
      void navigate(`/client/student-enrollments/${enrollment.id}`);
    },
    onEdit: (enrollment) =>
      void navigate(`/client/student-enrollments/${enrollment.id}/edit`, {
        state: { entity: enrollment },
      }),
    onDownloadContract: (enrollment) => {
      void handleDownloadContract(enrollment);
    },
    onDelete: setEnrollmentPendingDelete,
  });

  return {
    studentEnrollmentsList,
    tableColumns,
    mobileConfig,
    actionErrorMessage,
    filterValues,
    onFilterChange: (filterKey: keyof StudentEnrollmentFilterValues, filterValue: string) =>
      setFilterValues((currentValues) => ({ ...currentValues, [filterKey]: filterValue })),
    applyFilters: () =>
      studentEnrollmentsList.updateQueryParams(buildQueryFromFilters(filterValues)),
    clearFilters: () => {
      setFilterValues(initialFilterValues);
      studentEnrollmentsList.updateQueryParams({
        page: 1,
        search: undefined,
        status: undefined,
        startDate: undefined,
        endDate: undefined,
      });
    },
    deleteModal: {
      enrollmentPendingDelete,
      close: () => setEnrollmentPendingDelete(null),
      confirm: handleDeleteConfirm,
      isDeleting: actionLoading,
    },
  };
};
