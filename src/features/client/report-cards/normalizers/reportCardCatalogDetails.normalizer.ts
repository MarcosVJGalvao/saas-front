import type { EntityDetailsPageData } from '@shared/components/data-display/details/entityDetails.types';
import { createOptionalLocalizedStatusBadge } from '@shared/components/data-display/statusBadge.utils';
import { formatIsoDate } from '@shared/formatters';
import type {
  ReportCardAcademicPeriod,
  ReportCardCatalogEntity,
  ReportCardGradeSubject,
} from '@features/client/report-cards/types/reportCard.types';

type ReportCardCatalogDetailsMode = 'periods' | 'gradeSubjects';

const periodStatusLabels: Record<'open' | 'closed' | 'active' | 'inactive', string> = {
  open: 'Aberto',
  closed: 'Fechado',
  active: 'Ativo',
  inactive: 'Inativo',
};

const formatDate = (value: string | undefined): string => (value ? formatIsoDate(value) : '-');

const formatFinalPeriod = (value: boolean | number | undefined): string => {
  if (value === undefined) {
    return '-';
  }

  return value === true || value === 1 ? 'Sim' : 'Não';
};

const renderPeriodStatus = (status: ReportCardAcademicPeriod['status'] | undefined) =>
  createOptionalLocalizedStatusBadge(
    status ? periodStatusLabels[status] : undefined,
    status === 'active' ? 'active' : 'neutral',
  );

export const toReportCardCatalogDetailsData = (
  mode: ReportCardCatalogDetailsMode,
  item: ReportCardCatalogEntity,
): EntityDetailsPageData => {
  if (mode === 'periods' && ('startDate' in item || 'endDate' in item)) {
    const period: ReportCardAcademicPeriod = item;
    return {
      headerData: {
        title: period.name,
        subtitle: period.academicYear?.name ?? 'Período do boletim',
        avatarFallback: 'P',
        statusLabel: period.status ? periodStatusLabels[period.status] : undefined,
        statusColor: period.status === 'active' ? 'success' : 'default',
      },
      tabs: [
        {
          id: 'summary',
          label: 'Resumo',
          sections: [
            {
              id: 'main',
              title: 'Dados do período',
              items: [
                { label: 'Nome', value: period.name },
                { label: 'Código', value: period.code ?? '-' },
                { label: 'Ano letivo', value: period.academicYear?.name ?? '-' },
                { label: 'Status', value: renderPeriodStatus(period.status) },
                {
                  label: 'Unidade',
                  value: period.sequence === undefined ? '-' : `${period.sequence}ª unidade`,
                },
                { label: 'Peso', value: period.weight ?? '-' },
                { label: 'Período final', value: formatFinalPeriod(period.isFinalPeriod) },
                { label: 'Início', value: formatDate(period.startDate) },
                { label: 'Fim', value: formatDate(period.endDate) },
              ],
            },
            {
              id: 'academic-year',
              title: 'Ano letivo vinculado',
              items: [
                { label: 'Ano letivo', value: period.academicYear?.name ?? '-' },
                {
                  label: 'Início do ano letivo',
                  value: formatDate(period.academicYear?.startDate),
                },
                { label: 'Fim do ano letivo', value: formatDate(period.academicYear?.endDate) },
                {
                  label: 'Situação do ano letivo',
                  value: period.academicYear?.status
                    ? periodStatusLabels[period.academicYear.status]
                    : '-',
                },
                {
                  label: 'Ano letivo encerrado',
                  value: formatFinalPeriod(period.academicYear?.isClosed),
                },
              ],
            },
          ],
        },
      ],
    };
  }

  if ('subjects' in item || 'grade' in item) {
    const gradeSubject: ReportCardGradeSubject = item;
    const subjectNames =
      gradeSubject.subjects && gradeSubject.subjects.length > 0
        ? gradeSubject.subjects.map((subject) => subject.name).join(', ')
        : '-';

    return {
      headerData: {
        title: subjectNames !== '-' ? subjectNames : 'Matriz curricular',
        subtitle: gradeSubject.academicYear?.name ?? 'Matriz curricular',
        avatarFallback: 'M',
      },
      tabs: [
        {
          id: 'summary',
          label: 'Resumo',
          sections: [
            {
              id: 'main',
              title: 'Dados da matriz',
              items: [
                { label: 'Disciplinas', value: subjectNames },
                { label: 'Série', value: gradeSubject.grade?.name ?? '-' },
                { label: 'Ano letivo', value: gradeSubject.academicYear?.name ?? '-' },
                {
                  label: 'Carga horária',
                  value: gradeSubject.workload === undefined ? '-' : gradeSubject.workload,
                },
                {
                  label: 'Ordem',
                  value: gradeSubject.order === undefined ? '-' : gradeSubject.order,
                },
                { label: 'Obrigatória', value: gradeSubject.required ? 'Sim' : 'Não' },
              ],
            },
          ],
        },
      ],
    };
  }

  return {
    headerData: null,
    tabs: [],
  };
};
