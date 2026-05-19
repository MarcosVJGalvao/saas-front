import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type {
  EntityDetailsPageContent,
  EntityDetailsPageData,
  EntityDetailsViewState,
} from '@shared/components/data-display/details/entityDetails.types';
import { formatIsoDate } from '@shared/formatters';
import { translateSchoolClassShift, translateSchoolClassStatus } from '@shared/i18n/pt-BR/enums';
import { schoolClassService } from '@features/client/academic/services/academicServices';
import type {
  SchoolClass,
  SchoolClassSummary,
} from '@features/client/academic/types/academic.types';

type SchoolClassActionValues = Record<string, unknown>;
type SchoolClassActionKind =
  | 'assign-students'
  | 'remove-students'
  | 'assign-teacher-subjects'
  | 'remove-teacher-subjects';

const content: EntityDetailsPageContent = {
  pageTitle: 'Detalhes da turma',
  pageSubtitle: 'Consulte dados acadêmicos, capacidade e resumo operacional da turma.',
  loadingLabel: 'Carregando turma...',
  emptyTitle: 'Turma não encontrada',
  emptyMessage: 'Não encontramos a turma solicitada.',
  errorFallback: 'Erro ao carregar turma.',
  unauthorizedTitle: 'Acesso não autorizado',
  unauthorizedMessage: 'Faça login novamente para consultar esta turma.',
  forbiddenTitle: 'Acesso negado',
  forbiddenMessage: 'Você não possui permissão para consultar esta turma.',
};

const initialActionValues: SchoolClassActionValues = {
  studentIds: '',
  teacherSubjectIds: '',
};

const formatDate = (value: string | undefined): string => (value ? formatIsoDate(value) : '-');

const formatShift = (value: SchoolClass['shift']): string =>
  value ? translateSchoolClassShift(value) : '-';

const formatCapacity = (schoolClass: SchoolClass): string => {
  const current = schoolClass.currentStudents ?? 0;
  const capacity = schoolClass.capacity ?? 0;
  return capacity > 0 ? `${current}/${capacity}` : String(current);
};

const getStringValue = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const parseIds = (value: unknown): string[] =>
  getStringValue(value)
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

export const useSchoolClassDetailsPageViewModel = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [schoolClass, setSchoolClass] = useState<SchoolClass | null>(null);
  const [summary, setSummary] = useState<SchoolClassSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<SchoolClassActionKind | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | undefined>(undefined);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | undefined>(undefined);
  const [actionValues, setActionValues] = useState<SchoolClassActionValues>(initialActionValues);

  const load = useCallback(async () => {
    if (!id) {
      setSchoolClass(null);
      setSummary(null);
      return;
    }
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
    if (!id || ids.length === 0) {
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

  const data: EntityDetailsPageData = useMemo(
    () => ({
      headerData: schoolClass
        ? {
            title: schoolClass.name,
            subtitle: schoolClass.code ?? schoolClass.academicYear?.name ?? 'Turma',
            avatarFallback: schoolClass.name.slice(0, 1).toUpperCase(),
            statusLabel: translateSchoolClassStatus(schoolClass.status),
            statusColor: schoolClass.status === 'active' ? 'success' : 'default',
          }
        : null,
      tabs: schoolClass
        ? [
            {
              id: 'summary',
              label: 'Resumo',
              sections: [
                {
                  id: 'main',
                  title: 'Dados da turma',
                  items: [
                    { label: 'Nome', value: schoolClass.name },
                    { label: 'Código', value: schoolClass.code ?? '-' },
                    { label: 'Status', value: translateSchoolClassStatus(schoolClass.status) },
                    { label: 'Turno', value: formatShift(schoolClass.shift) },
                    { label: 'Capacidade', value: formatCapacity(schoolClass) },
                    { label: 'Ano letivo', value: schoolClass.academicYear?.name ?? '-' },
                    { label: 'Série', value: schoolClass.grade?.name ?? '-' },
                    { label: 'Nível de ensino', value: schoolClass.educationLevel?.name ?? '-' },
                  ],
                },
                {
                  id: 'control',
                  title: 'Controle',
                  items: [
                    { label: 'Criado em', value: formatDate(schoolClass.createdAt) },
                    { label: 'Atualizado em', value: formatDate(schoolClass.updatedAt) },
                  ],
                },
              ],
            },
            {
              id: 'operations',
              label: 'Operação',
              sections: [
                {
                  id: 'summary',
                  title: 'Resumo operacional',
                  items: [
                    { label: 'Alunos vinculados', value: summary?.studentsTotal ?? '-' },
                    {
                      label: 'Capacidade',
                      value: summary?.capacity ?? schoolClass.capacity ?? '-',
                    },
                    {
                      label: 'Professor-disciplina',
                      value: summary?.teacherSubjectsTotal ?? '-',
                    },
                    {
                      label: 'Horários de frequência',
                      value: summary?.attendanceSchedulesTotal ?? '-',
                    },
                  ],
                },
              ],
            },
          ]
        : [],
    }),
    [schoolClass, summary],
  );

  return {
    content,
    data,
    viewState,
    actionValues,
    actionLoading,
    errorMessage,
    actionErrorMessage,
    actionSuccessMessage,
    onBack: () => void navigate('/client/school-classes'),
    onRetry: load,
    onActionValueChange: (name: string, value: unknown): void => {
      setActionValues((currentValues) => ({ ...currentValues, [name]: value ?? '' }));
    },
    clearActionValues: (): void => setActionValues(initialActionValues),
    assignStudents: () =>
      runAction(
        'assign-students',
        parseIds(actionValues.studentIds),
        'Alunos vinculados com sucesso.',
      ),
    removeStudents: () =>
      runAction(
        'remove-students',
        parseIds(actionValues.studentIds),
        'Alunos removidos com sucesso.',
      ),
    assignTeacherSubjects: () =>
      runAction(
        'assign-teacher-subjects',
        parseIds(actionValues.teacherSubjectIds),
        'Vínculos professor-disciplina adicionados com sucesso.',
      ),
    removeTeacherSubjects: () =>
      runAction(
        'remove-teacher-subjects',
        parseIds(actionValues.teacherSubjectIds),
        'Vínculos professor-disciplina removidos com sucesso.',
      ),
  };
};
