import { formatIsoDate } from '@shared/formatters';
import { formatCurrency } from '@shared/formatters/currencyFormatter';
import { translateBillingCycle, translateSubscriptionStatus } from '@shared/i18n/pt-BR/enums';
import type { Subscription } from '@features/platform/subscriptions/types/subscriptions';

export const toSubscriptionDetailsItems = (subscription: Subscription) => ({
  subscription: [
    { keyLabel: 'ID', value: subscription.id },
    { keyLabel: 'Status', value: translateSubscriptionStatus(subscription.status) },
    { keyLabel: 'Início', value: formatIsoDate(subscription.startDate) },
    {
      keyLabel: 'Renovação',
      value: subscription.renewalDate ? formatIsoDate(subscription.renewalDate) : '-',
    },
    {
      keyLabel: 'Trial até',
      value: subscription.trialEndsAt ? formatIsoDate(subscription.trialEndsAt) : '-',
    },
    {
      keyLabel: 'Preço contratado',
      value: formatCurrency(subscription.priceAtSubscription, subscription.plan?.currency ?? 'BRL'),
    },
    { keyLabel: 'Motivo de bloqueio', value: subscription.blockedReason ?? '-' },
  ],
  tenant: [
    { keyLabel: 'Tenant ID', value: subscription.tenantId },
    { keyLabel: 'Cliente', value: subscription.tenant?.name ?? subscription.tenantId },
  ],
  plan: [
    { keyLabel: 'Plano ID', value: subscription.planId },
    { keyLabel: 'Plano', value: subscription.plan?.name ?? subscription.planId },
    {
      keyLabel: 'Ciclo',
      value: subscription.plan?.billingCycle
        ? translateBillingCycle(subscription.plan.billingCycle)
        : '-',
    },
    {
      keyLabel: 'Valor do plano',
      value:
        subscription.plan?.price && subscription.plan?.currency
          ? formatCurrency(subscription.plan.price, subscription.plan.currency)
          : '-',
    },
  ],
});
