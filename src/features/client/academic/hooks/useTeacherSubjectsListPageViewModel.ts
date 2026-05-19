import { useCallback, useMemo, useState } from 'react';
import type { RowActionItem } from '@shared/components/data-display/data/RowActionsMenu';
import {
  buildTeacherSubjectsMobileConfig,
  buildTeacherSubjectsTableColumns,
} from '@features/client/academic/components/teacherSubjectsListPresentation';
import { useTeacherSubjectsList } from '@features/client/academic/hooks/useTeacherSubjectsList';
import { teacherSubjectService } from '@features/client/academic/services/academicServices';
import type {
  TeacherSubject,
  TeacherSubjectQueryParams,
} from '@features/client/academic/types/academic.types';

type TeacherSubjectFilterValues = Record<string, unknown>;
type TeacherSubjectCreateValues = Record<string, unknown>;

const initialFilterValues: TeacherSubjectFilterValues = {
  teacherId: '',
  subjectId: '',
  status: '',
};

const initialCreateValues: TeacherSubjectCreateValues = {
  teacherId: '',
  subjectId: '',
};

const isActiveInactiveStatus = (value: string): value is 'active' | 'inactive' =>
  value === 'active' || value === 'inactive';

const getStringValue = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const getOptionalString = (value: unknown): string | undefined => {
  const stringValue = getStringValue(value);
  return stringValue.length > 0 ? stringValue : undefined;
};

const getOptionalStatus = (value: unknown): 'active' | 'inactive' | undefined => {
  const stringValue = getStringValue(value);
  return isActiveInactiveStatus(stringValue) ? stringValue : undefined;
};

const buildQueryFromFilters = (
  filterValues: TeacherSubjectFilterValues,
): Partial<TeacherSubjectQueryParams> => ({
  teacherId: getOptionalString(filterValues.teacherId),
  subjectId: getOptionalString(filterValues.subjectId),
  status: getOptionalStatus(filterValues.status),
  page: 1,
});

export const useTeacherSubjectsListPageViewModel = () => {
  const list = useTeacherSubjectsList();
  const [filterValues, setFilterValues] = useState<TeacherSubjectFilterValues>(initialFilterValues);
  const [createValues, setCreateValues] = useState<TeacherSubjectCreateValues>(initialCreateValues);
  const [deleteId, setDeleteId] = useState<string | undefined>(undefined);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | undefined>(undefined);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | undefined>(undefined);

  const selectedItem = useMemo(
    () => list.rows.find((row) => row.id === deleteId),
    [deleteId, list.rows],
  );

  const onFilterChange = (name: string, value: unknown): void => {
    setFilterValues((currentValues) => ({ ...currentValues, [name]: value ?? '' }));
  };

  const onCreateChange = (name: string, value: unknown): void => {
    setCreateValues((currentValues) => ({ ...currentValues, [name]: value ?? '' }));
  };

  const applyFilters = (): void => {
    list.updateQuery(buildQueryFromFilters(filterValues));
  };

  const clearFilters = (): void => {
    setFilterValues(initialFilterValues);
    list.updateQuery({ page: 1, teacherId: undefined, subjectId: undefined, status: undefined });
  };

  const createTeacherSubject = async (): Promise<void> => {
    const teacherId = getStringValue(createValues.teacherId);
    const subjectId = getStringValue(createValues.subjectId);
    if (!teacherId || !subjectId) {
      setActionErrorMessage('Informe professor e disciplina para criar o vínculo.');
      return;
    }
    setActionLoading(true);
    setActionErrorMessage(undefined);
    setActionSuccessMessage(undefined);
    try {
      await teacherSubjectService.create({ teacherId, subjectId });
      setCreateValues(initialCreateValues);
      setActionSuccessMessage('Vínculo professor-disciplina criado com sucesso.');
      await list.reload();
    } catch {
      setActionErrorMessage('Não foi possível criar o vínculo professor-disciplina.');
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async (): Promise<void> => {
    if (!deleteId) return;
    setActionLoading(true);
    setActionErrorMessage(undefined);
    setActionSuccessMessage(undefined);
    try {
      await teacherSubjectService.remove(deleteId);
      setDeleteId(undefined);
      setActionSuccessMessage('Vínculo professor-disciplina removido com sucesso.');
      await list.reload();
    } catch {
      setActionErrorMessage('Não foi possível remover o vínculo professor-disciplina.');
    } finally {
      setActionLoading(false);
    }
  };

  const buildRowActions = useCallback(
    (row: TeacherSubject): RowActionItem[] => [
      {
        key: 'delete',
        label: 'Remover',
        onClick: () => setDeleteId(row.id),
      },
    ],
    [],
  );

  const selectedLabel =
    selectedItem?.teacher?.person?.fullName ?? selectedItem?.teacher?.name ?? 'selecionado';

  return {
    list,
    query: list.query.search ?? '',
    actionLoading,
    actionErrorMessage,
    actionSuccessMessage,
    filterValues,
    createValues,
    onFilterChange,
    onCreateChange,
    applyFilters,
    clearFilters,
    createTeacherSubject,
    onQueryChange: (search: string) => list.updateQuery({ search, page: 1 }),
    onPageChange: (page: number) => list.updateQuery({ page }),
    onLimitChange: (limit: number) => list.updateQuery({ limit, page: 1 }),
    columns: buildTeacherSubjectsTableColumns({ buildRowActions }),
    mobileConfig: buildTeacherSubjectsMobileConfig({ buildRowActions }),
    deleteDialogOpen: deleteId !== undefined,
    deleteDialogTitle: 'Remover vínculo',
    deleteDialogDescription: `Confirma a remoção do vínculo ${selectedLabel}?`,
    deleteConfirmLabel: actionLoading ? 'Removendo...' : 'Remover',
    closeDeleteDialog: () => setDeleteId(undefined),
    confirmDelete,
  };
};
