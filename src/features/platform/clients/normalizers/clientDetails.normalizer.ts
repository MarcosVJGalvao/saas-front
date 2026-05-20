import type { EntityDetailsPageData } from '@shared/components/data-display/details/entityDetails.types';
import { formatIsoDate } from '@shared/formatters';
import { formatCurrency } from '@shared/formatters/currencyFormatter';
import {
  activeInactiveStatusLabels,
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

const formatSubscriptionStatus = (status: string | null | undefined): string => {
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

const formatBillingCycle = (billingCycle: string | null | undefined): string => {
  if (billingCycle === 'monthly') {
    return 'Mensal';
  }
  if (billingCycle === 'yearly') {
    return 'Anual';
  }
  return billingCycle ?? '-';
};

const resolveSubscriptionPrice = (client: Client): string => {
  const priceValue = client.subscription?.priceAtSubscription ?? client.plan?.price;
  const currency = client.plan?.currency ?? 'BRL';
  return priceValue ? formatCurrency(priceValue, currency) : '-';
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
            { label: 'Status', value: activeInactiveStatusLabels[client.status] },
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
            { label: 'Endereço principal', value: formatAddress(client) },
            {
              label: 'CEP',
              value: client.addresses?.[0]?.zipCode ? maskCep(client.addresses[0].zipCode) : '-',
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
          id: 'plan',
          title: 'Plano e assinatura',
          items: [
            { label: 'Plano', value: client.plan?.name ?? client.planName ?? '-' },
            { label: 'Preço vigente', value: resolveSubscriptionPrice(client) },
            {
              label: 'Ciclo',
              value: formatBillingCycle(client.plan?.billingCycle),
            },
            {
              label: 'Status da assinatura',
              value: formatSubscriptionStatus(client.subscription?.status),
            },
            { label: 'Início', value: formatDate(client.subscription?.startDate) },
            { label: 'Renovação', value: formatDate(client.subscription?.renewalDate) },
            { label: 'Trial até', value: formatDate(client.subscription?.trialEndsAt) },
          ],
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
