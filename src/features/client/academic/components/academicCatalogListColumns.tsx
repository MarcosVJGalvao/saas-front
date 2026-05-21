import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import { LocalizedStatusBadge } from '@shared/components/data-display/LocalizedStatusBadge';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { translateActiveInactiveStatus } from '@shared/i18n/pt-BR/enums';
import type { AcademicCatalogItem } from '@features/client/academic/types/academic.types';

export interface AcademicCatalogColumnActions {
  onDetails: (item: AcademicCatalogItem) => void;
  onEdit: (item: AcademicCatalogItem) => void;
}

const getDescription = (item: AcademicCatalogItem): string => item.description ?? '-';
const getEducationLevel = (item: AcademicCatalogItem): string => item.educationLevel?.name ?? '-';

const renderStatus = (item: AcademicCatalogItem) =>
  item.status ? (
    <LocalizedStatusBadge
      label={translateActiveInactiveStatus(item.status)}
      tone={item.status === 'active' ? 'active' : 'neutral'}
    />
  ) : (
    '-'
  );

const renderActions = (item: AcademicCatalogItem, actions: AcademicCatalogColumnActions) => (
  <RowActionsMenu
    triggerAriaLabel={`Abrir ações de ${item.name}`}
    actions={[
      { key: 'details', label: 'Ver detalhes', onClick: () => actions.onDetails(item) },
      { key: 'edit', label: 'Editar', onClick: () => actions.onEdit(item) },
    ]}
  />
);

export const buildAcademicCatalogColumns = (params: {
  actions: AcademicCatalogColumnActions;
  showEducationLevel?: boolean;
}): DataTableColumn<AcademicCatalogItem>[] => [
  { key: 'name', header: 'Nome', render: (item) => item.name },
  ...(params.showEducationLevel
    ? [
        {
          key: 'educationLevel',
          header: 'Nível de ensino',
          render: getEducationLevel,
        } satisfies DataTableColumn<AcademicCatalogItem>,
      ]
    : []),
  { key: 'status', header: 'Status', render: renderStatus },
  {
    key: 'actions',
    header: 'Ações',
    align: 'right',
    render: (item) => renderActions(item, params.actions),
  },
];

export const buildAcademicCatalogMobileConfig = (params: {
  actions: AcademicCatalogColumnActions;
  showEducationLevel?: boolean;
}): DataListMobileConfig<AcademicCatalogItem> => ({
  renderTitle: (item) => item.name,
  renderStatus,
  renderActions: (item) => renderActions(item, params.actions),
  renderDetails: (item) => (
    <AppStack spacing={1}>
      {params.showEducationLevel ? (
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Nível de ensino
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getEducationLevel(item)}
          </AppText>
        </AppStack>
      ) : null}
      <AppStack spacing={0.5}>
        <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          Descrição
        </AppText>
        <AppText variant="body2" sx={{ fontWeight: 700 }}>
          {getDescription(item)}
        </AppText>
      </AppStack>
    </AppStack>
  ),
});
