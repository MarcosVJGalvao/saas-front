import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import type { RowActionItem } from '@shared/components/data-display/data/RowActionsMenu';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import { LocalizedStatusBadge } from '@shared/components/data-display/LocalizedStatusBadge';
import { translateActiveInactiveStatus } from '@shared/i18n/pt-BR/enums';
import type { TeacherSubject } from '@features/client/academic/types/academic.types';

type TeacherSubjectsListPresentationParams = {
  buildRowActions: (row: TeacherSubject) => RowActionItem[];
};

const getTeacherName = (row: TeacherSubject): string =>
  row.teacher?.person?.fullName ?? row.teacher?.name ?? '-';

const getSubjectName = (row: TeacherSubject): string => row.subject?.name ?? '-';

const getSubjectCode = (row: TeacherSubject): string => row.subject?.code ?? '-';

const renderStatus = (row: TeacherSubject) =>
  row.status ? (
    <LocalizedStatusBadge
      label={translateActiveInactiveStatus(row.status)}
      tone={row.status === 'active' ? 'active' : 'neutral'}
    />
  ) : (
    '-'
  );

const renderActions = (
  row: TeacherSubject,
  buildRowActions: (row: TeacherSubject) => RowActionItem[],
) => (
  <RowActionsMenu
    triggerAriaLabel={`Abrir ações do vínculo ${getTeacherName(row)}`}
    actions={buildRowActions(row)}
  />
);

export const buildTeacherSubjectsTableColumns = ({
  buildRowActions,
}: TeacherSubjectsListPresentationParams): DataTableColumn<TeacherSubject>[] => [
  {
    key: 'teacher',
    header: 'Professor',
    render: getTeacherName,
    mobileRender: getTeacherName,
  },
  {
    key: 'subject',
    header: 'Disciplina',
    render: getSubjectName,
    mobileRender: getSubjectName,
  },
  {
    key: 'code',
    header: 'Código',
    render: getSubjectCode,
    mobileRender: getSubjectCode,
  },
  {
    key: 'status',
    header: 'Status',
    render: renderStatus,
    mobileRender: (row) =>
      row.status ? translateActiveInactiveStatus(row.status) : 'Não informado',
  },
  {
    key: 'actions',
    header: 'Ações',
    align: 'right',
    render: (row) => renderActions(row, buildRowActions),
  },
];

export const buildTeacherSubjectsMobileConfig = ({
  buildRowActions,
}: TeacherSubjectsListPresentationParams): DataListMobileConfig<TeacherSubject> => ({
  renderTitle: getTeacherName,
  renderSubtitle: getSubjectName,
  renderStatus,
  renderActions: (row) => renderActions(row, buildRowActions),
  renderDetails: (row) => (
    <AppStack spacing={0.5}>
      <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
        Código da disciplina
      </AppText>
      <AppText variant="body2" sx={{ fontWeight: 700 }}>
        {getSubjectCode(row)}
      </AppText>
    </AppStack>
  ),
});
