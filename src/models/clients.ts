export type UUID = string;

export type AuditFields = {
  id: UUID;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  createdBy?: UUID | null;
  updatedBy?: UUID | null;
  deletedBy?: UUID | null;
};

export type ClientStatus = 'active' | 'inactive';

export type DocumentType = 'CPF' | 'CNPJ' | 'RG' | 'PASSPORT' | 'OTHER';

export type ContactType = 'email' | 'phone' | 'whatsapp' | 'linkedin' | 'other';

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed' | 'other';

export type Client = AuditFields & {
  legalName: string;
  tradeName: string;
  documentNumber: string;
  documentType: DocumentType;
  email: string;
  phone: string;
  status: ClientStatus;
  logoUrl?: string | null;
  website?: string | null;
  industry?: string | null;
  notes?: string | null;
  tenantSlug?: string | null;
  planName?: string | null;
  planId?: string | null;
  subscriptionId?: string | null;
  plan?: {
    id: string;
    name: string;
    description?: string | null;
    price?: string | null;
    currency?: string | null;
    billingCycle?: string | null;
    trialDays?: number | null;
    isActive?: boolean;
  } | null;
  subscription?: {
    id: string;
    status?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    trialEndsAt?: string | null;
    renewalDate?: string | null;
    priceAtSubscription?: string | null;
  } | null;
  addresses?: Array<{
    id: string;
    street: string;
    number: string;
    complement?: string | null;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }>;
  tenant?: {
    id: string;
    name: string;
    slug?: string | null;
    timezone?: string | null;
    locale?: string | null;
    subscriptions?: Array<{
      id: string;
      status: string;
      startDate?: string | null;
      trialEndsAt?: string | null;
      renewalDate?: string | null;
      plan?: { id: string; name: string } | null;
    }>;
  } | null;
};

export type CreateClientRequest = {
  legalName: string;
  tradeName: string;
  documentNumber: string;
  documentType: DocumentType;
  email: string;
  phone: string;
  status?: ClientStatus;
  logoUrl?: string;
  website?: string;
  industry?: string;
  notes?: string;
};

export type UpdateClientRequest = Partial<CreateClientRequest>;

export type ClientsQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  status?: ClientStatus;
  plan?: string;
  segment?: string;
};

export type OnboardingContact = { type: ContactType; value: string };

export type OnboardingPerson = {
  fullName: string;
  documentNumber: string;
  documentType: DocumentType;
  dateOfBirth?: string;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  monthlyIncome?: string;
};

export type OnboardingEmployee = {
  person: OnboardingPerson;
  contacts: OnboardingContact[];
  department?: string;
};

export type ClientAddress = {
  street: string;
  number: string;
  complement?: string;
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
  timezone?: string;
  locale?: string;
  currency?: string;
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
