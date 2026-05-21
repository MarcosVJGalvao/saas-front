import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import { LocalizedStatusBadge } from '@shared/components/data-display/LocalizedStatusBadge';
import { AppText } from '@shared/components/data-display/AppText';
import { AppStack } from '@shared/components/layout/AppStack';
import { translateActiveInactiveStatus } from '@shared/i18n/pt-BR/enums';
import type { TeacherSubject } from '@features/client/academic/types/academic.types';

export interface TeacherSubjectColumnActions {
  onDelete: (item: TeacherSubject) => void;
}

const getTeacherName = (item: TeacherSubject): string =>
  item.teacher?.person?.fullName ?? item.teacher?.name ?? '-';

const getSubjectName = (item: TeacherSubject): string => item.subject?.name ?? '-';

const getSubjectCode = (item: TeacherSubject): string => item.subject?.code ?? '-';

const renderStatus = (item: TeacherSubject) =>
  item.status ? (
    <LocalizedStatusBadge
      label={translateActiveInactiveStatus(item.status)}
      tone={item.status === 'active' ? 'active' : 'neutral'}
    />
  ) : (
    '-'
  );

const renderActions = (item: TeacherSubject, actions: TeacherSubjectColumnActions) => (
  <RowActionsMenu
    triggerAriaLabel={`Abrir ações do vínculo ${getTeacherName(item)}`}
    actions={[{ key: 'delete', label: 'Remover', onClick: () => actions.onDelete(item) }]}
  />
);

export const buildTeacherSubjectColumns = (params: {
  actions: TeacherSubjectColumnActions;
}): DataTableColumn<TeacherSubject>[] => [
  { key: 'teacher', header: 'Professor', render: getTeacherName },
  { key: 'subject', header: 'Disciplina', render: getSubjectName },
  { key: 'code', header: 'Código', render: getSubjectCode },
  { key: 'status', header: 'Status', render: renderStatus },
  {
    key: 'actions',
    header: 'Ações',
    align: 'right',
    render: (item) => renderActions(item, params.actions),
  },
];

export const buildTeacherSubjectMobileConfig = (params: {
  actions: TeacherSubjectColumnActions;
}): DataListMobileConfig<TeacherSubject> => ({
  renderTitle: getTeacherName,
  renderSubtitle: getSubjectName,
  renderStatus,
  renderActions: (item) => renderActions(item, params.actions),
  renderDetails: (item) => (
    <AppStack spacing={0.5}>
      <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
        Código da disciplina
      </AppText>
      <AppText variant="body2" sx={{ fontWeight: 700 }}>
        {getSubjectCode(item)}
      </AppText>
    </AppStack>
  ),
});
