import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import BlockOutlined from '@mui/icons-material/BlockOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import HistoryOutlined from '@mui/icons-material/HistoryOutlined';
import SchoolOutlined from '@mui/icons-material/SchoolOutlined';
import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined';
import type { Client, ClientStatus } from '@features/platform/clients/types/clients';
import type {
  DetailTab,
  DetailsFooterAction,
  DetailsHeaderData,
} from '@shared/types/detailsDrawer';

const getStatusMeta = (
  status: ClientStatus,
): { label: string; color: NonNullable<DetailsHeaderData['statusColor']> } =>
  status === 'active'
    ? { label: 'Ativo', color: 'success' }
    : { label: 'Inativo', color: 'default' };

export const buildClientDetailsHeaderData = (client: Client): DetailsHeaderData => {
  const statusMeta = getStatusMeta(client.status);
  return {
    title: client.legalName,
    subtitle: client.documentNumber,
    avatarUrl: client.logoUrl,
    avatarFallback: client.legalName.slice(0, 1).toUpperCase(),
    statusLabel: statusMeta.label,
    statusColor: statusMeta.color,
  };
};

export const buildClientDetailsTabs = (client: Client): ReadonlyArray<DetailTab> => [
  {
    id: 'summary',
    label: 'Resumo',
    icon: <ArticleOutlined fontSize="small" />,
    sections: [
      {
        id: 'client-data',
        title: 'Dados do cliente',
        icon: <ArticleOutlined fontSize="small" />,
        items: [
          { label: 'Razão social', value: client.legalName },
          { label: 'Nome fantasia', value: client.tradeName },
          { label: 'Documento', value: client.documentNumber },
          { label: 'E-mail', value: client.email },
          { label: 'Telefone', value: client.phone },
          { label: 'Status', value: getStatusMeta(client.status).label },
        ],
      },
    ],
  },
  {
    id: 'academic',
    label: 'Acadêmico',
    icon: <SchoolOutlined fontSize="small" />,
    sections: [],
  },
  {
    id: 'financial',
    label: 'Financeiro',
    icon: <AccountBalanceWalletOutlined fontSize="small" />,
    sections: [
      {
        id: 'plan-data',
        title: 'Plano e assinatura',
        icon: <AccountBalanceWalletOutlined fontSize="small" />,
        items: [
          { label: 'Plano atual', value: client.planName ?? '-' },
          { label: 'Tenant', value: client.tenant?.name ?? '-' },
        ],
      },
    ],
  },
  {
    id: 'history',
    label: 'Histórico',
    icon: <HistoryOutlined fontSize="small" />,
    sections: [],
  },
];

export const buildClientDetailsFooterActions = (
  client: Client,
  actions?: {
    onEditClient: (client: Client) => void;
    onDeactivateClient?: (client: Client) => void;
  },
): ReadonlyArray<DetailsFooterAction> => {
  const footerActions: DetailsFooterAction[] = [
    {
      id: 'edit-client',
      label: 'Editar cliente',
      icon: <EditOutlined fontSize="small" />,
      onClick: () => {
        actions?.onEditClient(client);
      },
      color: 'primary',
    },
  ];

  const onDeactivateClient = actions?.onDeactivateClient;

  if (onDeactivateClient) {
    footerActions.push({
      id: 'deactivate-client',
      label: 'Desativar cliente',
      icon: <BlockOutlined fontSize="small" />,
      onClick: () => {
        onDeactivateClient(client);
      },
      color: 'error',
      disabled: client.status === 'inactive',
    });
  }

  return footerActions;
};
