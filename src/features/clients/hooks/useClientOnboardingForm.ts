import { useEffect, useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { isClientOnboardingClientDataStepValid } from '@features/clients/schemas/clientsSchemas';
import type { CreateClientOnboardingRequest } from '@features/clients/types/clients';
import type { Plan } from '@features/plans/types/plans';
import { plansService } from '@features/plans/services/service';
import { toOnboardingPayload } from '@features/clients/normalizers/clientOnboardingNormalizer';
import { maskCnpj, maskCpf, maskPhone } from '@shared/masks/inputMasks';

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

export type UseClientOnboardingFormResult = {
  activeStep: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
  value: CreateClientOnboardingRequest;
  setValue: Dispatch<SetStateAction<CreateClientOnboardingRequest>>;
  uiExtras: ClientOnboardingUiExtras;
  setUiExtras: Dispatch<SetStateAction<ClientOnboardingUiExtras>>;
  summary: {
    client: string;
    tenant: string;
    plan: string;
    admin: string;
  };
  onboardingPayload: CreateClientOnboardingRequest;
  isClientDataStepComplete: boolean;
  planOptions: Plan[];
  plansLoading: boolean;
};

const initialValue: CreateClientOnboardingRequest = {
  legalName: '',
  tradeName: '',
  documentNumber: '',
  documentType: 'CNPJ',
  clientEmail: '',
  phone: '',
  tenantName: '',
  tenantSlug: '',
  timezone: '',
  locale: '',
  currency: '',
  planId: '',
  adminPassword: '',
  employee: {
    person: { fullName: '', documentNumber: '', documentType: 'CPF' },
    contacts: [{ type: 'email', value: '' }],
    department: '',
  },
  clientAddress: {
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  },
};

const initialUiExtras: ClientOnboardingUiExtras = {
  cep: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  country: 'Brasil',
};

const buildSummaryLine = (label: string, fieldValue: string): string =>
  fieldValue.trim().length > 0 ? `${label}: ${fieldValue}` : '';

export const useClientOnboardingForm = (): UseClientOnboardingFormResult => {
  const [activeStep, setActiveStep] = useState(0);
  const [value, setValue] = useState<CreateClientOnboardingRequest>(initialValue);
  const [uiExtras, setUiExtras] = useState<ClientOnboardingUiExtras>(initialUiExtras);
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

  const onboardingPayload = useMemo<CreateClientOnboardingRequest>(
    () => toOnboardingPayload(value, uiExtras),
    [uiExtras, value],
  );
  const isClientDataStepComplete = useMemo(
    () => isClientOnboardingClientDataStepValid(onboardingPayload),
    [onboardingPayload],
  );

  const summary = useMemo(
    () => ({
      client: [
        buildSummaryLine('Nome', value.tradeName),
        buildSummaryLine(
          'Documento',
          value.documentType === 'CPF'
            ? maskCpf(value.documentNumber)
            : maskCnpj(value.documentNumber),
        ),
        buildSummaryLine('Telefone', maskPhone(value.phone)),
        buildSummaryLine('E-mail', value.clientEmail),
      ]
        .filter(Boolean)
        .join('\n'),
      tenant: [
        buildSummaryLine('Nome', value.tenantName),
        buildSummaryLine('Slug', value.tenantSlug),
        buildSummaryLine('Timezone', value.timezone ?? ''),
        buildSummaryLine('Locale', value.locale ?? ''),
        buildSummaryLine('Moeda', value.currency ?? ''),
      ]
        .filter(Boolean)
        .join('\n'),
      plan: buildSummaryLine('Plano', value.planId),
      admin: [
        buildSummaryLine('Nome', value.employee.person.fullName),
        buildSummaryLine('E-mail', value.employee.contacts[0]?.value ?? ''),
      ]
        .filter(Boolean)
        .join('\n'),
    }),
    [value],
  );

  return {
    activeStep,
    setActiveStep,
    value,
    setValue,
    uiExtras,
    setUiExtras,
    summary,
    onboardingPayload,
    isClientDataStepComplete,
    planOptions,
    plansLoading,
  };
};
