import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import { LocalizedStatusBadge } from '@shared/components/data-display/LocalizedStatusBadge';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import {
  translateFinancialCategoryType,
  translateFinancialEntityStatus,
} from '@shared/i18n/pt-BR/enums';
import type {
  FinancialCategory,
  FinancialEntity,
} from '@features/client/financial/types/financial.types';

type FinancialEntityListActions = {
  onDetails: (entity: FinancialEntity) => void;
  onEdit: (entity: FinancialEntity) => void;
};

const hasType = (entity: FinancialEntity): entity is FinancialCategory => 'type' in entity;
const getCode = (entity: FinancialEntity): string => entity.code ?? '-';
const getDescription = (entity: FinancialEntity): string => entity.description ?? '-';
const getTypeLabel = (entity: FinancialEntity): string =>
  hasType(entity) ? translateFinancialCategoryType(entity.type) : '-';

const renderStatus = (entity: FinancialEntity) =>
  entity.status ? (
    <LocalizedStatusBadge
      label={translateFinancialEntityStatus(entity.status)}
      tone={entity.status === 'active' ? 'active' : 'neutral'}
    />
  ) : (
    '-'
  );

export const buildFinancialEntityColumns = (
  actions: FinancialEntityListActions,
  showType: boolean,
): DataTableColumn<FinancialEntity>[] => [
  {
    key: 'name',
    header: 'Nome',
    render: (entity) => entity.name,
    mobileRender: (entity) => entity.name,
  },
  {
    key: 'code',
    header: 'Código',
    render: getCode,
    mobileRender: getCode,
  },
  ...(showType
    ? [
        {
          key: 'type',
          header: 'Tipo',
          render: getTypeLabel,
          mobileRender: getTypeLabel,
        } satisfies DataTableColumn<FinancialEntity>,
      ]
    : []),
  {
    key: 'status',
    header: 'Status',
    render: renderStatus,
    mobileRender: (entity) =>
      entity.status ? translateFinancialEntityStatus(entity.status) : 'Não informado',
  },
  {
    key: 'actions',
    header: 'Ações',
    align: 'right',
    render: (entity) => (
      <RowActionsMenu
        triggerAriaLabel={`Abrir ações de ${entity.name}`}
        actions={[
          { key: 'details', label: 'Ver detalhes', onClick: () => actions.onDetails(entity) },
          { key: 'edit', label: 'Editar', onClick: () => actions.onEdit(entity) },
        ]}
      />
    ),
  },
];

export const buildFinancialEntityMobileConfig = (
  actions: FinancialEntityListActions,
  showType: boolean,
): DataListMobileConfig<FinancialEntity> => ({
  renderTitle: (entity) => entity.name,
  renderSubtitle: getCode,
  renderStatus,
  renderActions: (entity) => (
    <RowActionsMenu
      triggerAriaLabel={`Abrir ações de ${entity.name}`}
      actions={[
        { key: 'details', label: 'Ver detalhes', onClick: () => actions.onDetails(entity) },
        { key: 'edit', label: 'Editar', onClick: () => actions.onEdit(entity) },
      ]}
    />
  ),
  renderDetails: (entity) => (
    <AppStack spacing={1}>
      {showType ? (
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Tipo
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getTypeLabel(entity)}
          </AppText>
        </AppStack>
      ) : null}
      <AppStack spacing={0.5}>
        <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          Descrição
        </AppText>
        <AppText variant="body2" sx={{ fontWeight: 700 }}>
          {getDescription(entity)}
        </AppText>
      </AppStack>
    </AppStack>
  ),
});
