import type { EntityDetailsPageData } from '@shared/components/data-display/details/entityDetails.types';
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
                { label: 'Status', value: period.status ? periodStatusLabels[period.status] : '-' },
                { label: 'Início', value: formatDate(period.startDate) },
                { label: 'Fim', value: formatDate(period.endDate) },
              ],
            },
          ],
        },
      ],
    };
  }

  if ('subject' in item || 'grade' in item) {
    const gradeSubject: ReportCardGradeSubject = item;

    return {
      headerData: {
        title: gradeSubject.subject?.name ?? 'Matriz curricular',
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
                { label: 'Disciplina', value: gradeSubject.subject?.name ?? '-' },
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
