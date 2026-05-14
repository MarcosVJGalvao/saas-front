import type { PaginatedResponse } from '@models/pagination';
import type {
  CreatePlanRequest,
  Plan,
  PlansQueryParams,
  UpdatePlanRequest,
} from '@features/plans/types/plans';

export type PlansListResponse = PaginatedResponse<Plan>;
export type PlanDetailsResponse = Plan;
export type PlanCreateResponse = Plan;
export type PlanUpdateResponse = Plan;
export type PlanDeleteResponse = void;

export type PlansListParams = PlansQueryParams;
export type PlanCreatePayload = CreatePlanRequest;
export type PlanUpdatePayload = UpdatePlanRequest;
