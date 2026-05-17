export type BillingCycle = 'monthly' | 'yearly';

export interface Plan {
  id: string;
  name: string;
  description?: string | null | undefined;
  price: string;
  currency: string;
  billingCycle: BillingCycle;
  trialDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null | undefined;
}

export interface CreatePlanRequest {
  name: string;
  description?: string | undefined;
  price: string;
  currency: string;
  billingCycle: BillingCycle;
  trialDays?: number | undefined;
  isActive?: boolean | undefined;
}

export type UpdatePlanRequest = {
  [Key in keyof CreatePlanRequest]?: CreatePlanRequest[Key] | undefined;
};

export interface PlansQueryParams {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
  sortBy?: string | undefined;
  sortOrder?: 'ASC' | 'DESC' | undefined;
}
