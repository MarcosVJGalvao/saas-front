import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import type { RowActionItem } from '@shared/components/data-display/data/RowActionsMenu';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import { LocalizedStatusBadge } from '@shared/components/data-display/LocalizedStatusBadge';
import { translateActiveInactiveStatus } from '@shared/i18n/pt-BR/enums';
import type { AcademicCatalogItem } from '@features/client/academic/types/academic.types';

type AcademicCatalogListPresentationParams = {
  buildRowActions: (row: AcademicCatalogItem) => RowActionItem[];
  showEducationLevel?: boolean | undefined;
};

const getCode = (row: AcademicCatalogItem): string => row.code ?? '-';

const getDescription = (row: AcademicCatalogItem): string => row.description ?? '-';

const getEducationLevel = (row: AcademicCatalogItem): string => row.educationLevel?.name ?? '-';

const renderStatus = (row: AcademicCatalogItem) =>
  row.status ? (
    <LocalizedStatusBadge
      label={translateActiveInactiveStatus(row.status)}
      tone={row.status === 'active' ? 'active' : 'neutral'}
    />
  ) : (
    '-'
  );

const renderActions = (
  row: AcademicCatalogItem,
  buildRowActions: (row: AcademicCatalogItem) => RowActionItem[],
) => (
  <RowActionsMenu triggerAriaLabel={`Abrir ações de ${row.name}`} actions={buildRowActions(row)} />
);

export const buildAcademicCatalogTableColumns = ({
  buildRowActions,
  showEducationLevel = false,
}: AcademicCatalogListPresentationParams): DataTableColumn<AcademicCatalogItem>[] => {
  const baseColumns: DataTableColumn<AcademicCatalogItem>[] = [
    {
      key: 'name',
      header: 'Nome',
      render: (row) => row.name,
      mobileRender: (row) => row.name,
    },
    {
      key: 'code',
      header: 'Código',
      render: getCode,
      mobileRender: getCode,
    },
  ];

  const educationLevelColumn: DataTableColumn<AcademicCatalogItem>[] = showEducationLevel
    ? [
        {
          key: 'educationLevel',
          header: 'Nível de ensino',
          render: getEducationLevel,
          mobileRender: getEducationLevel,
        },
      ]
    : [];

  return [
    ...baseColumns,
    ...educationLevelColumn,
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
};

export const buildAcademicCatalogMobileConfig = ({
  buildRowActions,
  showEducationLevel = false,
}: AcademicCatalogListPresentationParams): DataListMobileConfig<AcademicCatalogItem> => ({
  renderTitle: (row) => row.name,
  renderSubtitle: getCode,
  renderStatus,
  renderActions: (row) => renderActions(row, buildRowActions),
  renderDetails: (row) => (
    <AppStack spacing={1}>
      {showEducationLevel ? (
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Nível de ensino
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getEducationLevel(row)}
          </AppText>
        </AppStack>
      ) : null}
      <AppStack spacing={0.5}>
        <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          Descrição
        </AppText>
        <AppText variant="body2" sx={{ fontWeight: 700 }}>
          {getDescription(row)}
        </AppText>
      </AppStack>
    </AppStack>
  ),
});
