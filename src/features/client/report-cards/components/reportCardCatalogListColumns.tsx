import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import { formatIsoDate } from '@shared/formatters';
import type {
  ReportCardAcademicPeriod,
  ReportCardCatalogEntity,
  ReportCardGradeSubject,
} from '@features/client/report-cards/types/reportCard.types';

type ReportCardCatalogMode = 'periods' | 'gradeSubjects';

export interface ReportCardCatalogColumnActions {
  onDetails: (row: ReportCardCatalogEntity) => void;
}

const isAcademicPeriod = (row: ReportCardCatalogEntity): row is ReportCardAcademicPeriod =>
  'startDate' in row || 'endDate' in row;

const isGradeSubject = (row: ReportCardCatalogEntity): row is ReportCardGradeSubject =>
  'subjects' in row || 'grade' in row;

const getName = (row: ReportCardCatalogEntity): string => {
  if (isAcademicPeriod(row)) return row.name;
  if (isGradeSubject(row)) {
    const subjects = row.subjects;
    if (!subjects || subjects.length === 0) return '-';
    return subjects.map((subject) => subject.name).join(', ');
  }
  return '-';
};

const getAcademicYear = (row: ReportCardCatalogEntity): string => row.academicYear?.name ?? '-';

const getGrade = (row: ReportCardCatalogEntity): string =>
  isGradeSubject(row) ? (row.grade?.name ?? '-') : '-';

const getPeriod = (row: ReportCardCatalogEntity): string => {
  if (!isAcademicPeriod(row)) return '-';
  const start = row.startDate ? formatIsoDate(row.startDate) : '-';
  const end = row.endDate ? formatIsoDate(row.endDate) : '-';
  return `${start} até ${end}`;
};

const getAcademicPeriodSequence = (row: ReportCardCatalogEntity): string => {
  if (!isAcademicPeriod(row)) {
    return '-';
  }

  return row.sequence === undefined ? '-' : `${row.sequence}ª unidade`;
};

const getWorkload = (row: ReportCardCatalogEntity): string =>
  isGradeSubject(row) ? String(row.workload ?? '-') : '-';

const renderActions = (row: ReportCardCatalogEntity, actions: ReportCardCatalogColumnActions) => (
  <RowActionsMenu
    triggerAriaLabel={`Abrir ações de ${getName(row)}`}
    actions={[{ key: 'details', label: 'Ver detalhes', onClick: () => actions.onDetails(row) }]}
  />
);

export const buildReportCardCatalogColumns = (params: {
  mode: ReportCardCatalogMode;
  actions: ReportCardCatalogColumnActions;
}): DataTableColumn<ReportCardCatalogEntity>[] =>
  params.mode === 'periods'
    ? [
        { key: 'name', header: 'Período', render: getName },
        { key: 'academicYear', header: 'Ano letivo', render: getAcademicYear },
        { key: 'sequence', header: 'Unidade', render: getAcademicPeriodSequence },
        { key: 'period', header: 'Vigência', render: getPeriod },
        {
          key: 'actions',
          header: 'Ações',
          align: 'right',
          render: (row) => renderActions(row, params.actions),
        },
      ]
    : [
        { key: 'subject', header: 'Disciplina', render: getName },
        { key: 'grade', header: 'Série', render: getGrade },
        { key: 'academicYear', header: 'Ano letivo', render: getAcademicYear },
        { key: 'workload', header: 'Carga horária', render: getWorkload },
        {
          key: 'actions',
          header: 'Ações',
          align: 'right',
          render: (row) => renderActions(row, params.actions),
        },
      ];

export const buildReportCardCatalogMobileConfig = (params: {
  mode: ReportCardCatalogMode;
  actions: ReportCardCatalogColumnActions;
}): DataListMobileConfig<ReportCardCatalogEntity> => ({
  renderTitle: getName,
  renderSubtitle: getAcademicYear,
  renderActions: (row) => renderActions(row, params.actions),
  renderDetails: (row) => (
    <AppStack spacing={1}>
      <AppStack spacing={0.5}>
        <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          {params.mode === 'periods' ? 'Unidade' : 'Série'}
        </AppText>
        <AppText variant="body2" sx={{ fontWeight: 700 }}>
          {params.mode === 'periods' ? getAcademicPeriodSequence(row) : getGrade(row)}
        </AppText>
      </AppStack>
      {params.mode === 'periods' ? (
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Vigência
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getPeriod(row)}
          </AppText>
        </AppStack>
      ) : (
        <AppText variant="body2" color="text.secondary">
          Carga horária: {getWorkload(row)}
        </AppText>
      )}
    </AppStack>
  ),
});
