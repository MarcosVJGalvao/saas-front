import type { CreateClientOnboardingRequest } from '../../../models/clients';
import type { ClientOnboardingUiExtras } from '../../../hooks/clients/useClientOnboardingForm';
import type { Dispatch, SetStateAction } from 'react';

export type OnboardingStepProps = {
  value: CreateClientOnboardingRequest;
  setValue: Dispatch<SetStateAction<CreateClientOnboardingRequest>>;
  uiExtras: ClientOnboardingUiExtras;
  setUiExtras: Dispatch<SetStateAction<ClientOnboardingUiExtras>>;
};

export type OnboardingSummaryData = {
  client: string;
  tenant: string;
  plan: string;
  admin: string;
};
