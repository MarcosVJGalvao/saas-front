import { useMemo, useState } from 'react';
import { useFeedback } from '@shared/hooks/useFeedback';
import { useAcademicReferenceOptions } from '@features/client/academic/hooks/useAcademicReferenceOptions';
import {
  buildTeacherSubjectColumns,
  buildTeacherSubjectMobileConfig,
} from '@features/client/academic/components/teacherSubjectListColumns';
import { useTeacherSubjectsList } from '@features/client/academic/hooks/useTeacherSubjectsList';
import { teacherSubjectService } from '@features/client/academic/services/service';
import type {
  TeacherSubject,
  TeacherSubjectQueryParams,
} from '@features/client/academic/types/academic.types';

type TeacherSubjectFilterValues = {
  teacherId: string;
  subjectId: string;
  status: string;
};

type TeacherSubjectCreateValues = {
  teacherId: string;
  subjectId: string;
};

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

const getOptionalString = (value: string): string | undefined => {
  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : undefined;
};

const getOptionalStatus = (value: string): 'active' | 'inactive' | undefined =>
  isActiveInactiveStatus(value) ? value : undefined;

const buildQueryFromFilters = (
  filterValues: TeacherSubjectFilterValues,
): Partial<TeacherSubjectQueryParams> => ({
  teacherId: getOptionalString(filterValues.teacherId),
  subjectId: getOptionalString(filterValues.subjectId),
  status: getOptionalStatus(filterValues.status),
  page: 1,
});

export const useTeacherSubjectsListPage = () => {
  const teacherSubjectsList = useTeacherSubjectsList();
  const referenceOptions = useAcademicReferenceOptions({
    includeTeachers: true,
    includeSubjects: true,
  });
  const [filterValues, setFilterValues] = useState<TeacherSubjectFilterValues>(initialFilterValues);
  const [createValues, setCreateValues] = useState<TeacherSubjectCreateValues>(initialCreateValues);
  const [selectedTeacherSubjectId, setSelectedTeacherSubjectId] = useState<string | undefined>();
  const [actionLoading, setActionLoading] = useState(false);
  const feedback = useFeedback();

  const selectedTeacherSubject = useMemo(
    () => teacherSubjectsList.rows.find((row) => row.id === selectedTeacherSubjectId),
    [selectedTeacherSubjectId, teacherSubjectsList.rows],
  );

  const createTeacherSubject = async (): Promise<void> => {
    const teacherId = createValues.teacherId.trim();
    const subjectId = createValues.subjectId.trim();

    if (!teacherId || !subjectId) {
      feedback.setError('Informe professor e disciplina para criar o vínculo.');
      return;
    }

    setActionLoading(true);
    feedback.clear();

    try {
      await teacherSubjectService.create({ teacherId, subjectId });
      setCreateValues(initialCreateValues);
      feedback.setSuccess('Vínculo professor-disciplina criado com sucesso.');
      await teacherSubjectsList.reload();
    } catch {
      feedback.setError('Não foi possível criar o vínculo professor-disciplina.');
    } finally {
      setActionLoading(false);
    }
  };

  const removeTeacherSubject = async (): Promise<void> => {
    if (!selectedTeacherSubjectId) {
      return;
    }

    setActionLoading(true);
    feedback.clear();

    try {
      await teacherSubjectService.remove(selectedTeacherSubjectId);
      setSelectedTeacherSubjectId(undefined);
      feedback.setSuccess('Vínculo professor-disciplina removido com sucesso.');
      await teacherSubjectsList.reload();
    } catch {
      feedback.setError('Não foi possível remover o vínculo professor-disciplina.');
    } finally {
      setActionLoading(false);
    }
  };

  return {
    teacherSubjectsList,
    referenceOptions,
    feedback,
    filterValues,
    createValues,
    actionLoading,
    onFilterChange: (filterKey: string, filterValue: unknown) => {
      const normalizedValue = typeof filterValue === 'string' ? filterValue : '';
      if (filterKey === 'teacherId' || filterKey === 'subjectId' || filterKey === 'status') {
        setFilterValues((currentValues) => ({ ...currentValues, [filterKey]: normalizedValue }));
      }
    },
    onCreateChange: (fieldName: string, fieldValue: unknown) => {
      const normalizedValue = typeof fieldValue === 'string' ? fieldValue : '';
      if (fieldName === 'teacherId' || fieldName === 'subjectId') {
        setCreateValues((currentValues) => ({ ...currentValues, [fieldName]: normalizedValue }));
      }
    },
    applyFilters: () => {
      teacherSubjectsList.updateQuery(buildQueryFromFilters(filterValues));
    },
    clearFilters: () => {
      setFilterValues(initialFilterValues);
      teacherSubjectsList.updateQuery({
        page: 1,
        teacherId: undefined,
        subjectId: undefined,
        status: undefined,
      });
    },
    createTeacherSubject,
    tableColumns: buildTeacherSubjectColumns({
      actions: {
        onDelete: (item: TeacherSubject) => {
          setSelectedTeacherSubjectId(item.id);
        },
      },
    }),
    mobileConfig: buildTeacherSubjectMobileConfig({
      actions: {
        onDelete: (item: TeacherSubject) => {
          setSelectedTeacherSubjectId(item.id);
        },
      },
    }),
    deleteDialog: {
      open: selectedTeacherSubjectId !== undefined,
      title: 'Remover vínculo',
      description: `Confirma a remoção do vínculo ${
        selectedTeacherSubject?.teacher?.person?.fullName ??
        selectedTeacherSubject?.teacher?.name ??
        'selecionado'
      }?`,
      confirmLabel: actionLoading ? 'Removendo...' : 'Remover',
      close: () => {
        setSelectedTeacherSubjectId(undefined);
      },
      confirm: removeTeacherSubject,
    },
  };
};
