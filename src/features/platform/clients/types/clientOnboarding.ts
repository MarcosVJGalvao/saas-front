import type {
  CreateClientOnboardingRequest,
  DocumentType,
  Gender,
  MaritalStatus,
} from '@features/platform/clients/types/clients';
import type { Plan } from '@features/platform/plans/types/plans';

export type ClientOnboardingUiExtras = {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
};

export type ClientOnboardingActions = {
  updateTradeName: (value: string) => void;
  updateLegalName: (value: string) => void;
  updateDocumentNumber: (value: string) => void;
  updateClientEmail: (value: string) => void;
  updatePhone: (value: string) => void;
  updateCep: (value: string) => void;
  updateStreet: (value: string) => void;
  updateNumber: (value: string) => void;
  updateComplement: (value: string) => void;
  updateNeighborhood: (value: string) => void;
  updateCity: (value: string) => void;
  updateState: (value: string) => void;
  updateCountry: (value: string) => void;
  resolveAddressByCep: () => void;
  updateTenantName: (value: string) => void;
  updateTenantSlug: (value: string) => void;
  updateTimezone: (value: string) => void;
  updateLocale: (value: string) => void;
  updateCurrency: (value: string) => void;
  updatePlanId: (value: string) => void;
  updateAdminFullName: (value: string) => void;
  updateAdminEmail: (value: string) => void;
  updateAdminDocumentType: (value: DocumentType) => void;
  updateAdminDocumentNumber: (value: string) => void;
  updateAdminDateOfBirth: (value: string) => void;
  updateAdminGender: (value: Gender | undefined) => void;
  updateAdminMaritalStatus: (value: MaritalStatus | undefined) => void;
  updateAdminMonthlyIncome: (value: string) => void;
  updateAdminPassword: (value: string) => void;
};

export type OnboardingStepData = {
  value: CreateClientOnboardingRequest;
  uiExtras: ClientOnboardingUiExtras;
  actions: ClientOnboardingActions;
  addressLoading: boolean;
};

export type ClientOnboardingSummaryData = {
  client: string;
  tenant: string;
  plan: string;
  admin: string;
};

export type ClientOnboardingStepProps = OnboardingStepData;

export type ClientOnboardingStepsProps = OnboardingStepData & {
  activeStep: number;
  planOptions: Plan[];
  plansLoading: boolean;
};
