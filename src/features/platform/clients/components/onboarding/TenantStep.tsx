import type { AppSelectOption } from '@shared/components/inputs/AppSelect';
import { AppText } from '@shared/components/data-display/AppText';
import { AppGrid } from '@shared/components/layout/AppGrid';
import { AppStack } from '@shared/components/layout/AppStack';
import { createOptionsWithPlaceholder } from '@shared/constants/selectOptions';
import { OnboardingField } from '@features/platform/clients/components/onboarding/OnboardingField';
import type { ClientOnboardingStepProps } from '@features/platform/clients/types/clientOnboarding';

const timezoneOptions: AppSelectOption[] = createOptionsWithPlaceholder(
  ['America/Sao_Paulo', 'America/Manaus', 'America/Recife', 'America/Fortaleza', 'UTC'].map(
    (option) => ({
      value: option,
      label: option,
    }),
  ),
);

const localeOptions: AppSelectOption[] = createOptionsWithPlaceholder(
  ['pt-BR', 'en-US', 'es-ES'].map((option) => ({
    value: option,
    label: option,
  })),
);

const currencyOptions: AppSelectOption[] = createOptionsWithPlaceholder(
  ['BRL', 'USD', 'EUR'].map((option) => ({
    value: option,
    label: option,
  })),
);

export const TenantStep = ({ value, actions }: ClientOnboardingStepProps) => (
  <AppStack spacing={1.5}>
    <AppText variant="h6">Configuração do Tenant</AppText>
    <AppGrid container spacing={1.5}>
      <OnboardingField
        label="Nome do Tenant"
        value={value.tenantName}
        onChange={actions.updateTenantName}
      />
      <OnboardingField
        label="Slug do Tenant"
        value={value.tenantSlug}
        onChange={actions.updateTenantSlug}
      />
      <OnboardingField
        select
        label="Fuso Horário"
        value={value.timezone ?? ''}
        onChange={actions.updateTimezone}
        gridSize={{ xs: 12, md: 4 }}
        options={timezoneOptions}
      />
      <OnboardingField
        select
        label="Idioma e Região"
        value={value.locale ?? ''}
        onChange={actions.updateLocale}
        gridSize={{ xs: 12, md: 4 }}
        options={localeOptions}
      />
      <OnboardingField
        select
        label="Moeda"
        value={value.currency ?? ''}
        onChange={actions.updateCurrency}
        gridSize={{ xs: 12, md: 4 }}
        options={currencyOptions}
      />
    </AppGrid>
  </AppStack>
);
