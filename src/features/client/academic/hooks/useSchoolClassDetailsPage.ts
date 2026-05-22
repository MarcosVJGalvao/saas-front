import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AppAutocompleteOption } from '@shared/components/form/AppAutocomplete';
import type {
  EntityDetailsPageData,
  EntityDetailsViewState,
} from '@shared/components/data-display/details/entityDetails.types';
import { toSchoolClassDetailsData } from '@features/client/academic/normalizers/schoolClassDetails.normalizer';
import { schoolClassService } from '@features/client/academic/services/service';
import type {
  SchoolClass,
  SchoolClassSummary,
} from '@features/client/academic/types/academic.types';

type SchoolClassDetailsPageState = {
  data: EntityDetailsPageData;
  viewState: EntityDetailsViewState;
  actionValues: SchoolClassActionValues;
  actionLoading: SchoolClassActionKind | undefined;
  errorMessage: string | undefined;
  actionErrorMessage: string | undefined;
  actionSuccessMessage: string | undefined;
  onBack: () => void;
  onRetry: () => Promise<void>;
  onActionValueChange: (
    fieldName: 'studentIds' | 'teacherSubjectIds',
    nextValue: AppAutocompleteOption[],
  ) => void;
  clearActionValues: () => void;
  assignStudents: () => Promise<void>;
  removeStudents: () => Promise<void>;
  assignTeacherSubjects: () => Promise<void>;
  removeTeacherSubjects: () => Promise<void>;
};

type SchoolClassActionValues = {
  studentIds: AppAutocompleteOption[];
  teacherSubjectIds: AppAutocompleteOption[];
};

type SchoolClassActionKind =
  | 'assign-students'
  | 'remove-students'
  | 'assign-teacher-subjects'
  | 'remove-teacher-subjects';

const initialActionValues: SchoolClassActionValues = {
  studentIds: [],
  teacherSubjectIds: [],
};

const emptyDetailsData: EntityDetailsPageData = {
  headerData: null,
  tabs: [],
};

export const useSchoolClassDetailsPage = (id: string): SchoolClassDetailsPageState => {
  const navigate = useNavigate();
  const [schoolClass, setSchoolClass] = useState<SchoolClass | null>(null);
  const [summary, setSummary] = useState<SchoolClassSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<SchoolClassActionKind | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [actionErrorMessage, setActionErrorMessage] = useState<string | undefined>();
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | undefined>();
  const [actionValues, setActionValues] = useState<SchoolClassActionValues>(initialActionValues);

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const [detailsResponse, summaryResponse] = await Promise.all([
        schoolClassService.getById(id),
        schoolClassService.getSummary(id),
      ]);
      setSchoolClass(detailsResponse);
      setSummary(summaryResponse);
    } catch {
      setErrorMessage('Erro ao carregar turma.');
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

  const runAction = async (
    action: SchoolClassActionKind,
    ids: string[],
    successMessage: string,
  ): Promise<void> => {
    if (ids.length === 0) {
      setActionErrorMessage('Informe ao menos um ID para executar a ação.');
      return;
    }
    setActionLoading(action);
    setActionErrorMessage(undefined);
    setActionSuccessMessage(undefined);
    try {
      if (action === 'assign-students') {
        await schoolClassService.assignStudents(id, ids);
      }
      if (action === 'remove-students') {
        await schoolClassService.removeStudents(id, ids);
      }
      if (action === 'assign-teacher-subjects') {
        await schoolClassService.assignTeacherSubjects(id, ids);
      }
      if (action === 'remove-teacher-subjects') {
        await schoolClassService.removeTeacherSubjects(id, ids);
      }
      setActionSuccessMessage(successMessage);
      await load();
    } catch {
      setActionErrorMessage('Não foi possível executar a ação da turma.');
    } finally {
      setActionLoading(undefined);
    }
  };

  const viewState: EntityDetailsViewState = loading
    ? 'loading'
    : errorMessage
      ? 'error'
      : schoolClass
        ? 'ready'
        : 'empty';

  return {
    data: schoolClass ? toSchoolClassDetailsData(schoolClass, summary) : emptyDetailsData,
    viewState,
    actionValues,
    actionLoading,
    errorMessage,
    actionErrorMessage,
    actionSuccessMessage,
    onBack: () => {
      void navigate('/client/school-classes');
    },
    onRetry: load,
    onActionValueChange: (
      fieldName: 'studentIds' | 'teacherSubjectIds',
      nextValue: AppAutocompleteOption[],
    ) => {
      setActionValues((currentValues) => ({ ...currentValues, [fieldName]: nextValue }));
    },
    clearActionValues: () => setActionValues(initialActionValues),
    assignStudents: () =>
      runAction(
        'assign-students',
        actionValues.studentIds.map((autocompleteOption) => autocompleteOption.value),
        'Alunos vinculados com sucesso.',
      ),
    removeStudents: () =>
      runAction(
        'remove-students',
        actionValues.studentIds.map((autocompleteOption) => autocompleteOption.value),
        'Alunos removidos com sucesso.',
      ),
    assignTeacherSubjects: () =>
      runAction(
        'assign-teacher-subjects',
        actionValues.teacherSubjectIds.map((autocompleteOption) => autocompleteOption.value),
        'Vínculos professor-disciplina adicionados com sucesso.',
      ),
    removeTeacherSubjects: () =>
      runAction(
        'remove-teacher-subjects',
        actionValues.teacherSubjectIds.map((autocompleteOption) => autocompleteOption.value),
        'Vínculos professor-disciplina removidos com sucesso.',
      ),
  };
};
