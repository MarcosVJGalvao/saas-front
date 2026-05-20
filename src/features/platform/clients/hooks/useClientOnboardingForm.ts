import { useEffect, useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { CreateClientOnboardingRequest } from '@features/platform/clients/types/clients';
import type {
  ClientOnboardingActions,
  ClientOnboardingUiExtras,
  ClientOnboardingSummaryData,
} from '@features/platform/clients/types/clientOnboarding';
import type { Plan } from '@features/platform/plans/types/plans';
import { plansService } from '@features/platform/plans/services/service';
import { toOnboardingPayload } from '@features/platform/clients/normalizers/clientOnboardingNormalizer';
import { clientOnboardingClientStepSchema } from '@features/platform/clients/schemas/clientOnboarding.schema';
import {
  initialClientOnboardingUiExtras,
  initialClientOnboardingValue,
} from '@features/platform/clients/normalizers/clientOnboardingInitialState';
import { buildClientOnboardingSummary } from '@features/platform/clients/normalizers/clientOnboardingSummary';
import { useClientOnboardingActions } from '@features/platform/clients/hooks/useClientOnboardingActions';

export type UseClientOnboardingFormResult = {
  activeStep: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
  value: CreateClientOnboardingRequest;
  uiExtras: ClientOnboardingUiExtras;
  actions: ClientOnboardingActions;
  addressLoading: boolean;
  summary: ClientOnboardingSummaryData;
  onboardingPayload: CreateClientOnboardingRequest;
  isClientDataStepComplete: boolean;
  planOptions: Plan[];
  plansLoading: boolean;
};

export const useClientOnboardingForm = (): UseClientOnboardingFormResult => {
  const [activeStep, setActiveStep] = useState(0);
  const [value, setValue] = useState<CreateClientOnboardingRequest>(initialClientOnboardingValue);
  const [uiExtras, setUiExtras] = useState<ClientOnboardingUiExtras>(
    initialClientOnboardingUiExtras,
  );
  const [planOptions, setPlanOptions] = useState<Plan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void plansService
        .list({ page: 1, limit: 100 })
        .then((response) => {
          setPlanOptions(response.data);
        })
        .finally(() => {
          setPlansLoading(false);
        });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const { actions, addressLoading } = useClientOnboardingActions({
    uiExtras,
    setValue,
    setUiExtras,
  });

  const onboardingPayload = useMemo<CreateClientOnboardingRequest>(
    () => toOnboardingPayload(value, uiExtras),
    [uiExtras, value],
  );
  const isClientDataStepComplete = useMemo(
    () => clientOnboardingClientStepSchema.safeParse(onboardingPayload).success,
    [onboardingPayload],
  );

  const summary = useMemo(() => buildClientOnboardingSummary(value), [value]);

  return {
    activeStep,
    setActiveStep,
    value,
    uiExtras,
    actions,
    addressLoading,
    summary,
    onboardingPayload,
    isClientDataStepComplete,
    planOptions,
    plansLoading,
  };
};
