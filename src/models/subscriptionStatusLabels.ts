import type { SubscriptionStatus } from './subscriptions';

export const subscriptionStatusLabelByValue: Record<SubscriptionStatus, string> = {
  active: 'Ativa',
  canceled: 'Cancelada',
  past_due: 'Em atraso',
  trialing: 'Em trial',
  blocked: 'Bloqueada',
};
