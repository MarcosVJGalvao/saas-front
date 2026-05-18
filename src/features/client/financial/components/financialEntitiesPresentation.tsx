import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import type { RowActionItem } from '@shared/components/data-display/data/RowActionsMenu';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import { LocalizedStatusBadge } from '@shared/components/data-display/LocalizedStatusBadge';
import {
  translateFinancialCategoryType,
  translateFinancialEntityStatus,
} from '@shared/i18n/pt-BR/enums';
import type {
  FinancialCategory,
  FinancialEntity,
} from '@features/client/financial/types/financial.types';

type FinancialEntitiesPresentationParams = {
  buildRowActions: (row: FinancialEntity) => RowActionItem[];
  showType?: boolean | undefined;
};

const getCode = (row: FinancialEntity): string => row.code ?? '-';

const getDescription = (row: FinancialEntity): string => row.description ?? '-';

const hasFinancialType = (row: FinancialEntity): row is FinancialCategory => 'type' in row;

const getTypeLabel = (row: FinancialEntity): string =>
  hasFinancialType(row) ? translateFinancialCategoryType(row.type) : '-';

const renderStatus = (row: FinancialEntity) =>
  row.status ? (
    <LocalizedStatusBadge
      label={translateFinancialEntityStatus(row.status)}
      tone={row.status === 'active' ? 'active' : 'neutral'}
    />
  ) : (
    '-'
  );

const renderActions = (
  row: FinancialEntity,
  buildRowActions: (row: FinancialEntity) => RowActionItem[],
) => (
  <RowActionsMenu triggerAriaLabel={`Abrir ações de ${row.name}`} actions={buildRowActions(row)} />
);

export const buildFinancialEntitiesTableColumns = ({
  buildRowActions,
  showType = false,
}: FinancialEntitiesPresentationParams): DataTableColumn<FinancialEntity>[] => {
  const typeColumns: DataTableColumn<FinancialEntity>[] = showType
    ? [
        {
          key: 'type',
          header: 'Tipo',
          render: getTypeLabel,
          mobileRender: getTypeLabel,
        },
      ]
    : [];

  return [
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
    ...typeColumns,
    {
      key: 'status',
      header: 'Status',
      render: renderStatus,
      mobileRender: (row) =>
        row.status ? translateFinancialEntityStatus(row.status) : 'Não informado',
    },
    {
      key: 'actions',
      header: 'Ações',
      align: 'right',
      render: (row) => renderActions(row, buildRowActions),
    },
  ];
};

export const buildFinancialEntitiesMobileConfig = ({
  buildRowActions,
  showType = false,
}: FinancialEntitiesPresentationParams): DataListMobileConfig<FinancialEntity> => ({
  renderTitle: (row) => row.name,
  renderSubtitle: getCode,
  renderStatus,
  renderActions: (row) => renderActions(row, buildRowActions),
  renderDetails: (row) => (
    <AppStack spacing={1}>
      {showType ? (
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Tipo
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getTypeLabel(row)}
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
