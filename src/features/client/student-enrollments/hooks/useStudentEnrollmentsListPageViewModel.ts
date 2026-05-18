import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RowActionItem } from '@shared/components/data-display/data/RowActionsMenu';
import {
  buildStudentEnrollmentsMobileConfig,
  buildStudentEnrollmentsTableColumns,
} from '@features/client/student-enrollments/components/studentEnrollmentsListPresentation';
import { downloadBlob } from '@shared/utils/downloadBlob';
import { studentEnrollmentService } from '@features/client/student-enrollments/services/studentEnrollmentService';
import { useStudentEnrollmentsList } from '@features/client/student-enrollments/hooks/useStudentEnrollmentsList';
import type {
  EnrollmentStatus,
  StudentEnrollment,
  StudentEnrollmentQueryParams,
} from '@features/client/student-enrollments/types/studentEnrollment.types';

type StudentEnrollmentFilterValues = Record<string, unknown>;

const initialFilterValues: StudentEnrollmentFilterValues = {
  query: '',
  status: '',
  enrollmentCode: '',
  startDate: '',
  endDate: '',
};

const isEnrollmentStatus = (value: string): value is EnrollmentStatus =>
  value === 'active' || value === 'cancelled' || value === 'transferred';

const getStringValue = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const getOptionalString = (value: unknown): string | undefined => {
  const stringValue = getStringValue(value);
  return stringValue.length > 0 ? stringValue : undefined;
};

const getOptionalStatus = (value: unknown): EnrollmentStatus | undefined => {
  const stringValue = getStringValue(value);
  return isEnrollmentStatus(stringValue) ? stringValue : undefined;
};

const buildQueryFromFilters = (
  filterValues: StudentEnrollmentFilterValues,
): Partial<StudentEnrollmentQueryParams> => ({
  search: getOptionalString(filterValues.query),
  status: getOptionalStatus(filterValues.status),
  enrollmentCode: getOptionalString(filterValues.enrollmentCode),
  startDate: getOptionalString(filterValues.startDate),
  endDate: getOptionalString(filterValues.endDate),
  page: 1,
});

export const useStudentEnrollmentsListPageViewModel = () => {
  const navigate = useNavigate();
  const list = useStudentEnrollmentsList();
  const [filterValues, setFilterValues] =
    useState<StudentEnrollmentFilterValues>(initialFilterValues);
  const [deleteEnrollmentId, setDeleteEnrollmentId] = useState<string | undefined>(undefined);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | undefined>(undefined);

  const selectedEnrollment = useMemo(
    () => list.rows.find((row) => row.id === deleteEnrollmentId),
    [deleteEnrollmentId, list.rows],
  );

  const onFilterChange = (name: string, value: unknown): void => {
    setFilterValues((currentValues) => ({ ...currentValues, [name]: value ?? '' }));
  };

  const applyFilters = (): void => {
    list.updateQuery(buildQueryFromFilters(filterValues));
  };

  const clearFilters = (): void => {
    setFilterValues(initialFilterValues);
    list.updateQuery({ page: 1, search: undefined, status: undefined, enrollmentCode: undefined });
  };

  const downloadContract = useCallback(async (row: StudentEnrollment): Promise<void> => {
    setActionLoading(true);
    setActionErrorMessage(undefined);
    try {
      const blob = await studentEnrollmentService.downloadEnrollmentContract(row.id);
      downloadBlob(blob, `contrato-matricula-${row.enrollmentCode ?? row.id}.pdf`);
    } catch {
      setActionErrorMessage('Não foi possível baixar o contrato da matrícula.');
    } finally {
      setActionLoading(false);
    }
  }, []);

  const confirmDelete = async (): Promise<void> => {
    if (!deleteEnrollmentId) return;
    setActionLoading(true);
    setActionErrorMessage(undefined);
    try {
      await studentEnrollmentService.remove(deleteEnrollmentId);
      setDeleteEnrollmentId(undefined);
      await list.reload();
    } catch {
      setActionErrorMessage('Não foi possível remover a matrícula.');
    } finally {
      setActionLoading(false);
    }
  };

  const buildRowActions = useCallback(
    (row: StudentEnrollment): RowActionItem[] => [
      {
        key: 'details',
        label: 'Ver detalhes',
        onClick: () => void navigate(`/client/student-enrollments/${row.id}`),
      },
      {
        key: 'edit',
        label: 'Editar',
        onClick: () => void navigate(`/client/student-enrollments/${row.id}/edit`),
      },
      {
        key: 'contract',
        label: 'Baixar contrato',
        onClick: () => {
          void downloadContract(row);
        },
      },
      {
        key: 'delete',
        label: 'Remover',
        onClick: () => setDeleteEnrollmentId(row.id),
      },
    ],
    [downloadContract, navigate],
  );

  return {
    list,
    query: list.query.search ?? '',
    actionLoading,
    actionErrorMessage,
    filterValues,
    onFilterChange,
    applyFilters,
    clearFilters,
    onQueryChange: (search: string) => list.updateQuery({ search, page: 1 }),
    onPageChange: (page: number) => list.updateQuery({ page }),
    onLimitChange: (limit: number) => list.updateQuery({ limit, page: 1 }),
    onCreate: () => void navigate('/client/student-enrollments/new'),
    columns: buildStudentEnrollmentsTableColumns({ buildRowActions }),
    mobileConfig: buildStudentEnrollmentsMobileConfig({ buildRowActions }),
    deleteDialogOpen: deleteEnrollmentId !== undefined,
    deleteDialogTitle: 'Remover matrícula',
    deleteDialogDescription: `Confirma a remoção da matrícula ${selectedEnrollment?.enrollmentCode ?? 'selecionada'}?`,
    closeDeleteDialog: () => setDeleteEnrollmentId(undefined),
    confirmDelete,
  };
};
