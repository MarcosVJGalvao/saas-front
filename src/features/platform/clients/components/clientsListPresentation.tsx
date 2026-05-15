import AddIcon from '@mui/icons-material/Add';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import {
  RowActionsMenu,
  type RowActionItem,
} from '@shared/components/data-display/data/RowActionsMenu';
import { LocalizedStatusBadge } from '@shared/components/data-display/LocalizedStatusBadge';
import type { EntitySummaryCardItem } from '@shared/components/data-display/EntitySummaryCards';
import { AppAvatar } from '@shared/components/data-display/AppAvatar';
import { AppText } from '@shared/components/data-display/AppText';
import { AppStack } from '@shared/components/layout/AppStack';
import type { Client } from '@features/platform/clients/types/clients';
import { maskCnpj, maskCpf } from '@shared/masks/inputMasks';
import { onlyDigits } from '@shared/parsers/stringParsers';

interface ClientsListPresentationParams {
  buildClientActions: (row: Client) => RowActionItem[];
}

interface ClientsPageHeaderParams {
  canShowAction: boolean;
  onAction: () => void;
}

interface ClientsSummaryCardsParams {
  total: number;
  activeCount: number;
  trialCount: number;
  inactiveCount: number;
}

export const detailsDrawerContentOffset = {
  xs: 0,
  sm: 54,
  md: 57,
  lg: 60,
};

const detectDocumentType = (documentNumber: string): 'CPF' | 'CNPJ' | 'OTHER' => {
  const digitsOnly = onlyDigits(documentNumber);
  if (digitsOnly.length === 11) return 'CPF';
  if (digitsOnly.length === 14) return 'CNPJ';
  return 'OTHER';
};

const formatClientDocument = (row: Client): string => {
  const detectedType = detectDocumentType(row.documentNumber);
  const documentType = row.documentType ?? detectedType;
  if (documentType === 'CPF') return maskCpf(row.documentNumber);
  if (documentType === 'CNPJ') return maskCnpj(row.documentNumber);
  return row.documentNumber;
};

const renderClientAvatar = (row: Client) => (
  <AppAvatar sx={{ width: 32, height: 32, fontSize: 13 }}>
    {row.tradeName?.charAt(0) ?? row.legalName.charAt(0)}
  </AppAvatar>
);

const renderClientStatus = (row: Client) => (
  <LocalizedStatusBadge
    label={row.status === 'active' ? 'Ativa' : 'Inativa'}
    tone={row.status === 'active' ? 'active' : 'neutral'}
  />
);

const renderClientActions = (row: Client, buildClientActions: (row: Client) => RowActionItem[]) => (
  <RowActionsMenu
    triggerAriaLabel={`Abrir ações de ${row.legalName}`}
    actions={buildClientActions(row)}
  />
);

export const buildClientsPageHeader = ({ canShowAction, onAction }: ClientsPageHeaderParams) => ({
  title: 'Listagem de Clientes',
  subtitle: 'Gerencie todos os clientes cadastrados na plataforma.',
  actionLabel: 'Novo Cliente',
  actionIcon: <AddIcon />,
  canShowAction,
  onAction,
});

export const buildClientsSummaryCards = ({
  total,
  activeCount,
  trialCount,
  inactiveCount,
}: ClientsSummaryCardsParams): ReadonlyArray<EntitySummaryCardItem> => [
  {
    key: 'total',
    title: 'Total de Clientes',
    value: total,
    delta: '+12 este mês',
    icon: <GroupOutlinedIcon color="primary" />,
    color: 'success.main',
  },
  {
    key: 'active',
    title: 'Clientes Ativos',
    value: activeCount,
    delta: '+9 este mês',
    icon: <GroupOutlinedIcon color="success" />,
    color: 'success.main',
  },
  {
    key: 'trial',
    title: 'Em Trial',
    value: trialCount,
    delta: '0 este mês',
    icon: <ScheduleOutlinedIcon color="warning" />,
    color: 'success.main',
  },
  {
    key: 'canceled',
    title: 'Cancelados',
    value: inactiveCount,
    delta: '+3 este mês',
    icon: <HighlightOffOutlinedIcon color="error" />,
    color: 'error.main',
  },
];

export const buildClientsExportActionIcon = () => <DownloadOutlinedIcon />;

export const buildClientsTableColumns = ({
  buildClientActions,
}: ClientsListPresentationParams): DataTableColumn<Client>[] => [
  {
    key: 'client',
    header: 'Cliente',
    width: '1.35fr',
    render: (row) => (
      <AppStack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
        {renderClientAvatar(row)}
        <AppStack>
          <AppText variant="body2" sx={{ fontWeight: 500 }}>
            {row.legalName}
          </AppText>
          <AppText variant="caption" color="text.secondary">
            {row.email}
          </AppText>
        </AppStack>
      </AppStack>
    ),
  },
  {
    key: 'document',
    header: 'Documento',
    width: '1.25fr',
    render: (row) => formatClientDocument(row),
  },
  {
    key: 'tenant',
    header: 'Tenant',
    width: '1.35fr',
    render: (row) => row.tenant?.name ?? row.tenantSlug ?? '-',
  },
  {
    key: 'plan',
    header: 'Plano',
    width: '1fr',
    render: (row) => row.tenant?.subscriptions?.[0]?.plan?.name ?? row.planName ?? '-',
  },
  {
    key: 'status',
    header: 'Status',
    width: '96px',
    render: renderClientStatus,
  },
  {
    key: 'createdAt',
    header: 'Criado em',
    width: '120px',
    render: (row) => new Date(row.createdAt).toLocaleDateString('pt-BR'),
  },
  {
    key: 'actions',
    header: 'Ações',
    align: 'right',
    width: '44px',
    render: (row) => renderClientActions(row, buildClientActions),
  },
];

export const buildClientsMobileConfig = ({
  buildClientActions,
}: ClientsListPresentationParams): DataListMobileConfig<Client> => ({
  renderTitle: (row) => row.legalName,
  renderAvatar: renderClientAvatar,
  renderStatus: renderClientStatus,
  renderActions: (row) => renderClientActions(row, buildClientActions),
  renderDetails: (row) => (
    <AppStack spacing={1.5}>
      <AppStack direction="row" sx={{ justifyContent: 'space-between', gap: 2 }}>
        <AppStack spacing={0.5} sx={{ minWidth: 0 }}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Documento
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {formatClientDocument(row)}
          </AppText>
        </AppStack>
        <AppStack spacing={0.5} sx={{ minWidth: 0 }}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Plano
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {row.tenant?.subscriptions?.[0]?.plan?.name ?? row.planName ?? '-'}
          </AppText>
        </AppStack>
      </AppStack>
      <AppStack spacing={0.5}>
        <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          Criado em
        </AppText>
        <AppText variant="body2" sx={{ fontWeight: 700 }}>
          {new Date(row.createdAt).toLocaleDateString('pt-BR')}
        </AppText>
      </AppStack>
    </AppStack>
  ),
});
