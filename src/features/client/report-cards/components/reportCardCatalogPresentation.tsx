import { AppText } from '@shared/components/data-display/AppText';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import type { RowActionItem } from '@shared/components/data-display/data/RowActionsMenu';
import { AppStack } from '@shared/components/layout/AppStack';
import { formatIsoDate } from '@shared/formatters';
import type {
  ReportCardAcademicPeriod,
  ReportCardCatalogEntity,
  ReportCardGradeSubject,
} from '@features/client/report-cards/types/reportCard.types';

type ReportCardCatalogMode = 'periods' | 'gradeSubjects';

type ReportCardCatalogPresentationParams = {
  mode: ReportCardCatalogMode;
  buildRowActions: (row: ReportCardCatalogEntity) => RowActionItem[];
};

const isAcademicPeriod = (row: ReportCardCatalogEntity): row is ReportCardAcademicPeriod =>
  'startDate' in row || 'endDate' in row;

const isGradeSubject = (row: ReportCardCatalogEntity): row is ReportCardGradeSubject =>
  'subject' in row || 'grade' in row;

const getName = (row: ReportCardCatalogEntity): string => {
  if (isAcademicPeriod(row)) return row.name;
  if (isGradeSubject(row)) return row.subject?.name ?? '-';
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

const getWorkload = (row: ReportCardCatalogEntity): string =>
  isGradeSubject(row) ? String(row.workload ?? '-') : '-';

const renderActions = (
  row: ReportCardCatalogEntity,
  buildRowActions: (row: ReportCardCatalogEntity) => RowActionItem[],
) => (
  <RowActionsMenu
    triggerAriaLabel={`Abrir ações de ${getName(row)}`}
    actions={buildRowActions(row)}
  />
);

export const buildReportCardCatalogColumns = ({
  mode,
  buildRowActions,
}: ReportCardCatalogPresentationParams): DataTableColumn<ReportCardCatalogEntity>[] =>
  mode === 'periods'
    ? [
        {
          key: 'name',
          header: 'Período',
          render: getName,
          mobileRender: getName,
        },
        {
          key: 'academicYear',
          header: 'Ano letivo',
          render: getAcademicYear,
          mobileRender: getAcademicYear,
        },
        {
          key: 'period',
          header: 'Vigência',
          render: getPeriod,
          mobileRender: getPeriod,
        },
        {
          key: 'actions',
          header: 'Ações',
          align: 'right',
          render: (row) => renderActions(row, buildRowActions),
        },
      ]
    : [
        {
          key: 'subject',
          header: 'Disciplina',
          render: getName,
          mobileRender: getName,
        },
        {
          key: 'grade',
          header: 'Série',
          render: getGrade,
          mobileRender: getGrade,
        },
        {
          key: 'academicYear',
          header: 'Ano letivo',
          render: getAcademicYear,
          mobileRender: getAcademicYear,
        },
        {
          key: 'workload',
          header: 'Carga horária',
          render: getWorkload,
          mobileRender: getWorkload,
        },
        {
          key: 'actions',
          header: 'Ações',
          align: 'right',
          render: (row) => renderActions(row, buildRowActions),
        },
      ];

export const buildReportCardCatalogMobileConfig = ({
  mode,
  buildRowActions,
}: ReportCardCatalogPresentationParams): DataListMobileConfig<ReportCardCatalogEntity> => ({
  renderTitle: getName,
  renderSubtitle: getAcademicYear,
  renderActions: (row) => renderActions(row, buildRowActions),
  renderDetails: (row) => (
    <AppStack spacing={1}>
      <AppStack spacing={0.5}>
        <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          {mode === 'periods' ? 'Vigência' : 'Série'}
        </AppText>
        <AppText variant="body2" sx={{ fontWeight: 700 }}>
          {mode === 'periods' ? getPeriod(row) : getGrade(row)}
        </AppText>
      </AppStack>
    </AppStack>
  ),
});
