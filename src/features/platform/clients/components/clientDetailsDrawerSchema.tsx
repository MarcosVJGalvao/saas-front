import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import HistoryOutlined from '@mui/icons-material/HistoryOutlined';
import SchoolOutlined from '@mui/icons-material/SchoolOutlined';
import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined';
import BlockOutlined from '@mui/icons-material/BlockOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import { LocalizedStatusBadge } from '@shared/components/data-display/LocalizedStatusBadge';
import type { Client } from '@features/platform/clients/types/clients';
import type {
  DetailTab,
  DetailsFooterAction,
  DetailsHeaderData,
} from '@shared/types/detailsDrawer';
import { maskCep, maskCnpj, maskCpf, maskPhone } from '@shared/masks/inputMasks';
import { formatCurrency } from '@shared/formatters/currencyFormatter';

type DrawerSchema = {
  headerData: DetailsHeaderData | null;
  tabs: ReadonlyArray<DetailTab>;
  footerActions: ReadonlyArray<DetailsFooterAction>;
};
type DrawerLabels = {
  summary: string;
  academic: string;
  financial: string;
  subscriptionHistory: string;
  history: string;
};
type DrawerActionHandlers = {
  onEditClient: (client: Client) => void;
  onDeactivateClient: (client: Client) => void;
};

const asCurrency = (value?: string | number | null) => {
  if (value === null || value === undefined || value === '') return '-';
  return formatCurrency(value, 'BRL');
};

const asDate = (value?: string | null) => {
  if (!value) return '-';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '-';
  return parsed.toLocaleDateString('pt-BR');
};
const planCycleLabelByValue: Record<string, string> = {
  monthly: 'Mensal',
  quarterly: 'Trimestral',
  yearly: 'Anual',
};
const subscriptionStatusLabelByValue: Record<string, string> = {
  trialing: 'Em trial',
  active: 'Ativa',
  canceled: 'Cancelada',
  past_due: 'Em atraso',
  paused: 'Pausada',
};
const toTone = (isPositive: boolean) => (isPositive ? 'active' : 'neutral');
const asText = (value: unknown) => (typeof value === 'string' && value.length > 0 ? value : '-');

const defaultLabels: DrawerLabels = {
  summary: 'Resumo',
  academic: 'Acadêmico',
  financial: 'Financeiro',
  subscriptionHistory: 'Histórico da assinatura',
  history: 'Histórico',
};

export const buildClientDetailsDrawerSchema = (
  client: Client | null | undefined,
  labels: DrawerLabels = defaultLabels,
  actions?: DrawerActionHandlers,
): DrawerSchema => {
  if (!client) return { headerData: null, tabs: [], footerActions: [] };

  const maskedDocument =
    client.documentType === 'CPF'
      ? maskCpf(client.documentNumber)
      : client.documentType === 'CNPJ'
        ? maskCnpj(client.documentNumber)
        : client.documentNumber;

  const headerData: DetailsHeaderData = {
    title: client.legalName,
    subtitle: maskedDocument,
    avatarUrl: client.logoUrl,
    avatarFallback: client.legalName.slice(0, 1).toUpperCase(),
    statusLabel: client.status === 'active' ? 'Ativo' : 'Inativo',
    statusColor: client.status === 'active' ? 'success' : 'default',
  };

  const address = client.addresses?.[0];
  const latestTenantSubscription = client.tenant?.subscriptions?.[0];

  const tabs: ReadonlyArray<DetailTab> = [
    {
      id: 'summary',
      label: labels.summary,
      icon: <ArticleOutlined fontSize="small" />,
      sections: [
        {
          id: 'client-core',
          title: 'Dados do cliente',
          icon: <ArticleOutlined fontSize="small" />,
          items: [
            { label: 'Razão social', value: client.legalName },
            { label: 'Nome fantasia', value: client.tradeName },
            { label: 'Documento', value: `${client.documentType} ${maskedDocument}` },
            { label: 'E-mail', value: client.email },
            { label: 'Telefone', value: maskPhone(client.phone) },
            {
              label: 'Status',
              value: (
                <LocalizedStatusBadge
                  label={client.status === 'active' ? 'Ativo' : 'Inativo'}
                  tone={toTone(client.status === 'active')}
                />
              ),
            },
          ],
        },
      ],
    },
    {
      id: 'academic',
      label: labels.academic,
      icon: <SchoolOutlined fontSize="small" />,
      sections: [
        {
          id: 'tenant-data',
          title: 'Tenant',
          icon: <SchoolOutlined fontSize="small" />,
          items: [
            { label: 'Nome', value: client.tenant?.name ?? '-' },
            { label: 'Slug', value: asText(client.tenant?.slug) },
            { label: 'Timezone', value: asText(client.tenant?.timezone) },
            { label: 'Locale', value: asText(client.tenant?.locale) },
          ],
        },
        {
          id: 'address-data',
          title: 'Endereço',
          icon: <SchoolOutlined fontSize="small" />,
          items: [
            { label: 'Rua', value: address?.street ?? '-' },
            { label: 'Número', value: address?.number ?? '-' },
            { label: 'Bairro', value: address?.neighborhood ?? '-' },
            { label: 'Cidade/UF', value: address ? `${address.city}/${address.state}` : '-' },
            { label: 'CEP', value: address?.zipCode ? maskCep(address.zipCode) : '-' },
            { label: 'País', value: address?.country ?? '-' },
          ],
        },
      ],
    },
    {
      id: 'financial',
      label: labels.financial,
      icon: <AccountBalanceWalletOutlined fontSize="small" />,
      sections: [
        {
          id: 'plan-data',
          title: 'Plano',
          icon: <AccountBalanceWalletOutlined fontSize="small" />,
          items: [
            { label: 'Nome', value: client.plan?.name ?? '-' },
            { label: 'Preço', value: asCurrency(client.plan?.price ?? null) },
            { label: 'Moeda', value: client.plan?.currency ?? '-' },
            {
              label: 'Ciclo',
              value: client.plan?.billingCycle
                ? (planCycleLabelByValue[client.plan.billingCycle] ?? client.plan.billingCycle)
                : '-',
            },
          ],
        },
        {
          id: 'subscription-data',
          title: 'Assinatura',
          icon: <AccountBalanceWalletOutlined fontSize="small" />,
          items: [
            {
              label: 'Status',
              value: (
                <LocalizedStatusBadge
                  label={
                    client.subscription?.status
                      ? (subscriptionStatusLabelByValue[client.subscription.status] ??
                        client.subscription.status)
                      : '-'
                  }
                  tone={toTone(client.subscription?.status === 'active')}
                />
              ),
            },
            { label: 'Início', value: asDate(client.subscription?.startDate) },
            { label: 'Fim trial', value: asDate(client.subscription?.trialEndsAt) },
            { label: 'Renovação', value: asDate(client.subscription?.renewalDate) },
            {
              label: 'Preço contratado',
              value: asCurrency(client.subscription?.priceAtSubscription ?? null),
            },
          ],
        },
      ],
    },
    {
      id: 'history',
      label: labels.subscriptionHistory,
      icon: <HistoryOutlined fontSize="small" />,
      sections: [
        {
          id: 'subscription-history',
          title: 'Histórico da assinatura',
          icon: <HistoryOutlined fontSize="small" />,
          items: [
            { label: 'Início', value: asDate(client.subscription?.startDate) },
            { label: 'Fim', value: asDate(client.subscription?.endDate) },
            { label: 'Fim trial', value: asDate(client.subscription?.trialEndsAt) },
            { label: 'Renovação', value: asDate(client.subscription?.renewalDate) },
            {
              label: 'Status atual',
              value: (
                <LocalizedStatusBadge
                  label={
                    client.subscription?.status
                      ? (subscriptionStatusLabelByValue[client.subscription.status] ??
                        client.subscription.status)
                      : '-'
                  }
                  tone={toTone(client.subscription?.status === 'active')}
                />
              ),
            },
            { label: 'Atualizado em', value: asDate(client.updatedAt) },
          ],
        },
        {
          id: 'tenant-subscription-history',
          title: 'Histórico de assinaturas',
          icon: <HistoryOutlined fontSize="small" />,
          items: [
            { label: 'ID da assinatura', value: latestTenantSubscription?.id ?? '-' },
            {
              label: 'Plano',
              value: latestTenantSubscription?.plan?.name ?? client.plan?.name ?? '-',
            },
            {
              label: 'Status',
              value: (
                <LocalizedStatusBadge
                  label={
                    latestTenantSubscription?.status
                      ? (subscriptionStatusLabelByValue[latestTenantSubscription.status] ??
                        latestTenantSubscription.status)
                      : '-'
                  }
                  tone={toTone(latestTenantSubscription?.status === 'active')}
                />
              ),
            },
            { label: 'Início', value: asDate(latestTenantSubscription?.startDate) },
            { label: 'Fim trial', value: asDate(latestTenantSubscription?.trialEndsAt) },
            { label: 'Renovação', value: asDate(latestTenantSubscription?.renewalDate) },
          ],
        },
      ],
    },
    {
      id: 'audit',
      label: labels.history,
      icon: <HistoryOutlined fontSize="small" />,
      sections: [
        {
          id: 'audit-data',
          title: 'Auditoria',
          icon: <HistoryOutlined fontSize="small" />,
          items: [
            { label: 'Criado em', value: asDate(client.createdAt) },
            { label: 'Atualizado em', value: asDate(client.updatedAt) },
            { label: 'Criado por', value: client.createdBy ?? '-' },
            { label: 'Atualizado por', value: client.updatedBy ?? '-' },
          ],
        },
      ],
    },
  ];

  const footerActions: ReadonlyArray<DetailsFooterAction> = [
    {
      id: 'edit-client',
      label: 'Editar cliente',
      icon: <EditOutlined fontSize="small" />,
      onClick: () => actions?.onEditClient(client),
      color: 'primary',
    },
    {
      id: 'deactivate-client',
      label: 'Desativar cliente',
      icon: <BlockOutlined fontSize="small" />,
      onClick: () => actions?.onDeactivateClient(client),
      color: 'error',
      disabled: client.status === 'inactive',
    },
  ];

  const summaryTab = tabs.find((tab) => tab.id === 'summary');
  const organizationTab = tabs.find((tab) => tab.id === 'academic');
  const mergedTabs =
    summaryTab === undefined
      ? tabs
      : [
          {
            ...summaryTab,
            sections: [...summaryTab.sections, ...(organizationTab?.sections ?? [])],
          },
          ...tabs.filter((tab) => tab.id !== 'summary' && tab.id !== 'academic'),
        ];

  return { headerData, tabs: mergedTabs, footerActions };
};
