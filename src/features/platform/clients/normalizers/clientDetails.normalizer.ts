import type { EntityDetailsPageData } from '@shared/components/data-display/details/entityDetails.types';
import {
  createLocalizedStatusBadge,
  createOptionalLocalizedStatusBadge,
} from '@shared/components/data-display/statusBadge.utils';
import { formatIsoDate } from '@shared/formatters';
import { formatCurrency } from '@shared/formatters/currencyFormatter';
import {
  activeInactiveStatusLabels,
  billingCycleLabels,
  documentTypeLabels,
  subscriptionStatusLabelByValue,
} from '@shared/i18n/pt-BR/enums';
import { maskCep, maskCnpj, maskCpf, maskPhone } from '@shared/masks/inputMasks';
import { onlyDigits } from '@shared/parsers/stringParsers';
import type { Client } from '@features/platform/clients/types/clients';

const formatDate = (value: string | null | undefined): string =>
  value ? formatIsoDate(value) : '-';

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

const formatAddress = (client: Client): string =>
  client.addresses?.[0]
    ? `${client.addresses[0].street}, ${client.addresses[0].number} - ${client.addresses[0].city}/${client.addresses[0].state}`
    : 'Endereço não informado';

const formatSubscriptionStatus = (
  status: Client['subscription'] extends infer Subscription
    ? Subscription extends { status?: infer StatusValue }
      ? StatusValue
      : never
    : never,
): string => {
  if (!status) {
    return '-';
  }
  if (status === 'active') return subscriptionStatusLabelByValue.active;
  if (status === 'canceled') return subscriptionStatusLabelByValue.canceled;
  if (status === 'past_due') return subscriptionStatusLabelByValue.past_due;
  if (status === 'trialing') return subscriptionStatusLabelByValue.trialing;
  if (status === 'blocked') return subscriptionStatusLabelByValue.blocked;
  return status;
};

const formatBillingCycle = (
  billingCycle: Client['plan'] extends infer Plan
    ? Plan extends { billingCycle?: infer BillingCycleValue }
      ? BillingCycleValue
      : never
    : never,
): string => (billingCycle ? billingCycleLabels[billingCycle] : '-');

const resolveSubscriptionPrice = (client: Client): string => {
  const priceValue = client.subscription?.priceAtSubscription ?? client.plan?.price;
  const currency = client.plan?.currency ?? client.tenant?.currency ?? 'BRL';
  return priceValue ? formatCurrency(priceValue, currency) : '-';
};

const resolveCurrentSubscription = (client: Client) =>
  client.subscription ?? client.tenant?.subscriptions?.[0] ?? null;

const resolveCurrentPlan = (client: Client) =>
  resolveCurrentSubscription(client)?.plan ?? client.plan ?? null;

const renderClientStatus = (status: Client['status']) =>
  createLocalizedStatusBadge(
    activeInactiveStatusLabels[status],
    status === 'active' ? 'active' : 'neutral',
  );

const renderSubscriptionStatus = (
  status: ReturnType<typeof resolveCurrentSubscription> extends infer Subscription
    ? Subscription extends { status?: infer StatusValue }
      ? StatusValue
      : never
    : never,
) => {
  const label = formatSubscriptionStatus(status);

  return createOptionalLocalizedStatusBadge(
    label === '-' ? undefined : label,
    status === 'active' ? 'active' : 'neutral',
  );
};

const buildSubscriptionHistoryItems = (client: Client) => {
  const historyRows = client.tenant?.subscriptionPlanHistories ?? [];

  if (historyRows.length === 0) {
    return [{ label: 'Histórico', value: 'Nenhuma mudança de plano registrada.' }];
  }

  return historyRows.map((historyRow, historyIndex) => {
    const fromPlanName = historyRow.fromPlan?.name ?? historyRow.fromPlanId ?? 'Plano inicial';
    const toPlanName = historyRow.toPlan?.name ?? historyRow.toPlanId;

    return {
      label: `${historyIndex + 1}. ${formatDate(historyRow.changedAt)}`,
      value: `${fromPlanName} -> ${toPlanName}`,
    };
  });
};

export const toClientDetailsData = (client: Client): EntityDetailsPageData => ({
  headerData: {
    title: client.tradeName,
    subtitle: client.legalName,
    avatarFallback: client.tradeName.slice(0, 2).toUpperCase(),
    statusLabel: activeInactiveStatusLabels[client.status],
    statusColor: client.status === 'active' ? 'success' : 'default',
  },
  tabs: [
    {
      id: 'summary',
      label: 'Resumo',
      sections: [
        {
          id: 'general',
          title: 'Dados gerais',
          items: [
            { label: 'Nome fantasia', value: client.tradeName },
            { label: 'Razão social', value: client.legalName },
            { label: 'Documento', value: formatClientDocument(client) },
            { label: 'Tipo de documento', value: documentTypeLabels[client.documentType] },
            { label: 'Status', value: renderClientStatus(client.status) },
            { label: 'E-mail principal', value: client.email },
            { label: 'Telefone principal', value: maskPhone(client.phone) },
          ],
        },
        {
          id: 'organization',
          title: 'Organização',
          items: [
            { label: 'Tenant', value: client.tenant?.name ?? '-' },
            { label: 'Slug do tenant', value: client.tenant?.slug ?? client.tenantSlug ?? '-' },
            { label: 'Fuso horário', value: client.tenant?.timezone ?? '-' },
            { label: 'Localidade', value: client.tenant?.locale ?? '-' },
            { label: 'Endereço principal', value: formatAddress(client) },
            {
              label: 'CEP',
              value: client.addresses?.[0]?.zipCode ? maskCep(client.addresses[0].zipCode) : '-',
            },
            {
              label: 'Bairro',
              value: client.addresses?.[0]?.neighborhood ?? '-',
            },
            {
              label: 'País',
              value: client.addresses?.[0]?.country ?? '-',
            },
          ],
        },
      ],
    },
    {
      id: 'subscription',
      label: 'Plano',
      sections: [
        {
          id: 'subscription-current',
          title: 'Assinatura atual',
          items: [
            {
              label: 'Status da assinatura',
              value: renderSubscriptionStatus(resolveCurrentSubscription(client)?.status),
            },
            { label: 'Início', value: formatDate(resolveCurrentSubscription(client)?.startDate) },
            {
              label: 'Renovação',
              value: formatDate(resolveCurrentSubscription(client)?.renewalDate),
            },
            {
              label: 'Trial até',
              value: formatDate(resolveCurrentSubscription(client)?.trialEndsAt),
            },
            {
              label: 'Encerramento',
              value: formatDate(resolveCurrentSubscription(client)?.endDate),
            },
          ],
        },
        {
          id: 'plan',
          title: 'Plano contratado',
          items: [
            { label: 'Plano', value: resolveCurrentPlan(client)?.name ?? client.planName ?? '-' },
            { label: 'Preço vigente', value: resolveSubscriptionPrice(client) },
            {
              label: 'Ciclo',
              value: formatBillingCycle(resolveCurrentPlan(client)?.billingCycle),
            },
            {
              label: 'Descrição do plano',
              value: resolveCurrentPlan(client)?.description ?? '-',
            },
          ],
        },
        {
          id: 'plan-history',
          title: 'Histórico de planos',
          items: buildSubscriptionHistoryItems(client),
        },
      ],
    },
    {
      id: 'control',
      label: 'Controle',
      sections: [
        {
          id: 'audit',
          title: 'Auditoria',
          items: [
            { label: 'Criado em', value: formatDate(client.createdAt) },
            { label: 'Atualizado em', value: formatDate(client.updatedAt) },
            { label: 'Excluído em', value: formatDate(client.deletedAt) },
          ],
        },
      ],
    },
  ],
});
