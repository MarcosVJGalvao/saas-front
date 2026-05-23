import type { ReactNode } from 'react';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';
import PauseCircleOutlineRoundedIcon from '@mui/icons-material/PauseCircleOutlineRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import { LocalizedStatusBadge } from '@shared/components/data-display/LocalizedStatusBadge';
import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import type { EntitySummaryCardItem } from '@shared/components/data-display/EntitySummaryCards';
import { activeInactiveStatusLabels } from '@shared/i18n/pt-BR/enums';
import { maskCnpj, maskCpf } from '@shared/masks/inputMasks';
import { onlyDigits } from '@shared/parsers/stringParsers';
import type { Client } from '@features/platform/clients/types/clients';

export interface ClientListColumnActions {
  onDetails: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

export const resolveClientPlanName = (client: Client): string => {
  const subscriptionPlanName = client.tenant?.subscriptions?.[0]?.plan?.name;
  return subscriptionPlanName ?? client.plan?.name ?? client.planName ?? 'Sem plano';
};

const renderClientStatus = (client: Client) => (
  <LocalizedStatusBadge
    label={activeInactiveStatusLabels[client.status]}
    tone={client.status === 'active' ? 'active' : 'neutral'}
  />
);

const formatClientDocument = (client: Client): string => {
  const digits = onlyDigits(client.documentNumber);
  if (client.documentType === 'CPF' || digits.length === 11) {
    return maskCpf(digits);
  }
  if (client.documentType === 'CNPJ' || digits.length === 14) {
    return maskCnpj(digits);
  }
  return client.documentNumber;
};

export const buildClientSummaryCards = (params: {
  total: number;
  activeCount: number;
  inactiveCount: number;
  onboardingCount: number;
}): EntitySummaryCardItem[] => [
  {
    key: 'total',
    title: 'Clientes',
    value: params.total,
    delta: 'Base total cadastrada',
    icon: <BusinessRoundedIcon fontSize="small" />,
    color: 'primary.main',
  },
  {
    key: 'active',
    title: 'Ativos',
    value: params.activeCount,
    delta: 'Operando normalmente',
    icon: <TrendingUpRoundedIcon fontSize="small" />,
    color: 'success.main',
  },
  {
    key: 'inactive',
    title: 'Inativos',
    value: params.inactiveCount,
    delta: 'Exigem revisão',
    icon: <PauseCircleOutlineRoundedIcon fontSize="small" />,
    color: 'warning.main',
  },
  {
    key: 'onboarding',
    title: 'Sem plano',
    value: params.onboardingCount,
    delta: 'Onboarding incompleto',
    icon: <PeopleOutlineRoundedIcon fontSize="small" />,
    color: 'info.main',
  },
];

const buildActions = (client: Client, actions: ClientListColumnActions): ReactNode => (
  <RowActionsMenu
    actions={[
      { key: 'details', label: 'Ver detalhes', onClick: () => actions.onDetails(client) },
      { key: 'edit', label: 'Editar', onClick: () => actions.onEdit(client) },
      {
        key: 'delete',
        label: 'Desativar',
        onClick: () => actions.onDelete(client),
      },
    ]}
  />
);

export const buildClientListColumns = (
  actions: ClientListColumnActions,
): DataTableColumn<Client>[] => [
  { key: 'tradeName', header: 'Nome fantasia', render: (client) => client.tradeName },
  { key: 'legalName', header: 'Razão social', render: (client) => client.legalName },
  { key: 'documentNumber', header: 'Documento', render: formatClientDocument },
  { key: 'plan', header: 'Plano', render: resolveClientPlanName },
  {
    key: 'status',
    header: 'Status',
    render: renderClientStatus,
  },
  {
    key: 'actions',
    header: 'Ações',
    align: 'right',
    render: (client) => buildActions(client, actions),
  },
];

export const buildClientListMobileConfig = (
  actions: ClientListColumnActions,
): DataListMobileConfig<Client> => ({
  renderTitle: (client) => client.tradeName,
  renderSubtitle: (client) => client.legalName,
  renderStatus: renderClientStatus,
  renderDetails: formatClientDocument,
  renderActions: (client) => buildActions(client, actions),
});
