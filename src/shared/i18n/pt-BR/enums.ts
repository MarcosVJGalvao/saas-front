export type ActiveInactiveStatus = 'active' | 'inactive';
export type BillingCycleValue = 'monthly' | 'yearly';
export type DocumentTypeValue = 'CPF' | 'CNPJ' | 'RG' | 'PASSPORT' | 'OTHER';
export type SubscriptionStatusValue = 'active' | 'canceled' | 'past_due' | 'trialing' | 'blocked';

export const activeInactiveStatusLabels: Record<ActiveInactiveStatus, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
};

export const activeInactiveStatusFemaleLabels: Record<ActiveInactiveStatus, string> = {
  active: 'Ativa',
  inactive: 'Inativa',
};

export const billingCycleLabels: Record<BillingCycleValue, string> = {
  monthly: 'Mensal',
  yearly: 'Anual',
};

export const documentTypeLabels: Record<DocumentTypeValue, string> = {
  CPF: 'CPF',
  CNPJ: 'CNPJ',
  RG: 'RG',
  PASSPORT: 'Passaporte',
  OTHER: 'Outro',
};

export const subscriptionStatusLabelByValue: Record<SubscriptionStatusValue, string> = {
  active: 'Ativa',
  canceled: 'Cancelada',
  past_due: 'Em atraso',
  trialing: 'Em trial',
  blocked: 'Bloqueada',
};

export const translateActiveInactiveStatus = (status: ActiveInactiveStatus): string =>
  activeInactiveStatusLabels[status];

export const translateActiveInactiveStatusFemale = (status: ActiveInactiveStatus): string =>
  activeInactiveStatusFemaleLabels[status];

export const translateBillingCycle = (billingCycle: BillingCycleValue): string =>
  billingCycleLabels[billingCycle];

export const translateSubscriptionStatus = (status: SubscriptionStatusValue): string =>
  subscriptionStatusLabelByValue[status];
