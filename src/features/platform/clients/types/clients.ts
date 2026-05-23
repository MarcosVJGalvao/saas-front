export type UUID = string;

export type AuditFields = {
  id: UUID;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null | undefined;
  createdBy?: UUID | null | undefined;
  updatedBy?: UUID | null | undefined;
  deletedBy?: UUID | null | undefined;
};

export type ClientStatus = 'active' | 'inactive';

export type DocumentType = 'CPF' | 'CNPJ' | 'RG' | 'PASSPORT' | 'OTHER';

export type BillingCycle = 'monthly' | 'yearly';

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'blocked';

export type ContactType = 'email' | 'phone' | 'whatsapp' | 'linkedin' | 'other';

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed' | 'other';

export type ClientPlan = AuditFields & {
  name: string;
  description?: string | null | undefined;
  price?: string | null | undefined;
  currency?: string | null | undefined;
  billingCycle?: BillingCycle | null | undefined;
  trialDays?: number | null | undefined;
  isActive?: boolean | undefined;
};

export type ClientSubscription = AuditFields & {
  tenantId: UUID;
  planId: UUID;
  status?: SubscriptionStatus | null | undefined;
  startDate?: string | null | undefined;
  endDate?: string | null | undefined;
  trialEndsAt?: string | null | undefined;
  canceledAt?: string | null | undefined;
  cancelsAtPeriodEnd?: boolean | undefined;
  cancelRequestedAt?: string | null | undefined;
  renewalDate?: string | null | undefined;
  priceAtSubscription?: string | null | undefined;
  blockedAt?: string | null | undefined;
  blockedReason?: string | null | undefined;
  plan?: ClientPlan | null | undefined;
};

export type ClientAddressRecord = AuditFields & {
  clientId: UUID;
  street: string;
  number: string;
  complement?: string | null | undefined;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

export type ClientTenant = AuditFields & {
  clientId: UUID;
  name: string;
  slug?: string | null | undefined;
  status: ClientStatus;
  timezone?: string | null | undefined;
  locale?: string | null | undefined;
  currency?: string | null | undefined;
  subscriptions?: ClientSubscription[] | undefined;
  subscriptionPlanHistories?: ClientSubscriptionPlanHistory[] | undefined;
};

export type ClientSubscriptionPlanHistory = AuditFields & {
  tenantId: UUID;
  subscriptionId: UUID;
  fromPlanId?: UUID | null | undefined;
  toPlanId: UUID;
  changedAt: string;
  fromPlan?: Pick<ClientPlan, 'id' | 'name'> | null | undefined;
  toPlan?: Pick<ClientPlan, 'id' | 'name'> | null | undefined;
};

export type Client = AuditFields & {
  legalName: string;
  tradeName: string;
  documentNumber: string;
  documentType: DocumentType;
  email: string;
  phone: string;
  status: ClientStatus;
  logoUrl?: string | null | undefined;
  website?: string | null | undefined;
  industry?: string | null | undefined;
  notes?: string | null | undefined;
  tenantSlug?: string | null | undefined;
  planName?: string | null | undefined;
  planId?: string | null | undefined;
  subscriptionId?: string | null | undefined;
  plan?: ClientPlan | null;
  subscription?: ClientSubscription | null;
  addresses?: ClientAddressRecord[] | undefined;
  tenant?: ClientTenant | null;
};

export type CreateClientRequest = {
  legalName: string;
  tradeName: string;
  documentNumber: string;
  documentType: DocumentType;
  email: string;
  phone: string;
  status?: ClientStatus | undefined;
  logoUrl?: string | undefined;
  website?: string | undefined;
  industry?: string | undefined;
  notes?: string | undefined;
};

export type UpdateClientRequest = {
  [Key in keyof CreateClientRequest]?: CreateClientRequest[Key] | undefined;
};

export type ClientsQueryParams = {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
  sortBy?: string | undefined;
  sortOrder?: 'ASC' | 'DESC' | undefined;
  status?: ClientStatus | undefined;
  plan?: string | undefined;
  segment?: string | undefined;
};

export type OnboardingContact = { type: ContactType; value: string };

export type OnboardingPerson = {
  fullName: string;
  documentNumber: string;
  documentType: DocumentType;
  dateOfBirth?: string | undefined;
  gender?: Gender | undefined;
  maritalStatus?: MaritalStatus | undefined;
  monthlyIncome?: string | undefined;
};

export type OnboardingEmployee = {
  person: OnboardingPerson;
  contacts: OnboardingContact[];
  department?: string | undefined;
};

export type ClientAddress = {
  street: string;
  number: string;
  complement?: string | undefined;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

export type CreateClientOnboardingRequest = {
  legalName: string;
  tradeName: string;
  documentNumber: string;
  documentType: DocumentType;
  clientEmail: string;
  phone: string;
  tenantName: string;
  tenantSlug: string;
  timezone?: string | undefined;
  locale?: string | undefined;
  currency?: string | undefined;
  planId: string;
  adminPassword: string;
  employee: OnboardingEmployee;
  clientAddress: ClientAddress;
};

export type ClientOnboardingResponse = {
  client: Client;
  tenant: unknown;
  subscription: unknown;
  adminUser: { id: string; email: string; tenantId: string };
};

export type ApiErrorResponse = {
  statusCode: number;
  message: string | string[];
  error?: string;
  code?: string;
};
