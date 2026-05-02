export type BillingCycle = 'monthly' | 'yearly';

export interface Plan {
  id: string;
  name: string;
  description?: string | null;
  price: string;
  currency: string;
  billingCycle: BillingCycle;
  trialDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreatePlanRequest {
  name: string;
  description?: string;
  price: string;
  currency: string;
  billingCycle: BillingCycle;
  trialDays?: number;
  isActive?: boolean;
}

export type UpdatePlanRequest = Partial<CreatePlanRequest>;

export interface PlansQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
