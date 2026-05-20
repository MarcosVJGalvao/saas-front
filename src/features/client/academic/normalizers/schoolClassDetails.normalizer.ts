import type { EntityDetailsPageData } from '@shared/components/data-display/details/entityDetails.types';
import { formatIsoDate } from '@shared/formatters';
import { translateSchoolClassShift, translateSchoolClassStatus } from '@shared/i18n/pt-BR/enums';
import type {
  SchoolClass,
  SchoolClassSummary,
} from '@features/client/academic/types/academic.types';

const formatDate = (value: string | undefined): string => (value ? formatIsoDate(value) : '-');

const formatShift = (value: SchoolClass['shift']): string =>
  value ? translateSchoolClassShift(value) : '-';

const formatCapacity = (schoolClass: SchoolClass): string => {
  const currentStudents = schoolClass.currentStudents ?? 0;
  const capacity = schoolClass.capacity ?? 0;
  return capacity > 0 ? `${currentStudents}/${capacity}` : String(currentStudents);
};

export const toSchoolClassDetailsData = (
  schoolClass: SchoolClass,
  summary: SchoolClassSummary | null,
): EntityDetailsPageData => ({
  headerData: {
    title: schoolClass.name,
    subtitle: schoolClass.code ?? schoolClass.academicYear?.name ?? 'Turma',
    avatarFallback: schoolClass.name.slice(0, 1).toUpperCase(),
    statusLabel: translateSchoolClassStatus(schoolClass.status),
    statusColor: schoolClass.status === 'active' ? 'success' : 'default',
  },
  tabs: [
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
          id: 'operation-summary',
          title: 'Resumo operacional',
          items: [
            { label: 'Alunos vinculados', value: summary?.studentsTotal ?? '-' },
            { label: 'Capacidade', value: summary?.capacity ?? schoolClass.capacity ?? '-' },
            { label: 'Professor-disciplina', value: summary?.teacherSubjectsTotal ?? '-' },
            { label: 'Horários de frequência', value: summary?.attendanceSchedulesTotal ?? '-' },
          ],
        },
      ],
    },
  ],
});
