import { AppGrid } from '@shared/components/layout/AppGrid';
import { AppMenuItem } from '@shared/components/inputs/AppMenuItem';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { OnboardingField } from '@features/platform/clients/components/onboarding/OnboardingField';
import type { OnboardingStepProps } from '@features/platform/clients/components/onboarding/types';

const timezoneOptions: string[] = [
  'America/Sao_Paulo',
  'America/Manaus',
  'America/Recife',
  'America/Fortaleza',
  'UTC',
];

const localeOptions: string[] = ['pt-BR', 'en-US', 'es-ES'];

const currencyOptions: string[] = ['BRL', 'USD', 'EUR'];

export const TenantStep = ({ value, actions }: OnboardingStepProps) => (
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
      >
        <AppMenuItem value="">Selecione</AppMenuItem>
        {timezoneOptions.map((option) => (
          <AppMenuItem key={option} value={option}>
            {option}
          </AppMenuItem>
        ))}
      </OnboardingField>
      <OnboardingField
        select
        label="Idioma e Região"
        value={value.locale ?? ''}
        onChange={actions.updateLocale}
        gridSize={{ xs: 12, md: 4 }}
      >
        <AppMenuItem value="">Selecione</AppMenuItem>
        {localeOptions.map((option) => (
          <AppMenuItem key={option} value={option}>
            {option}
          </AppMenuItem>
        ))}
      </OnboardingField>
      <OnboardingField
        select
        label="Moeda"
        value={value.currency ?? ''}
        onChange={actions.updateCurrency}
        gridSize={{ xs: 12, md: 4 }}
      >
        <AppMenuItem value="">Selecione</AppMenuItem>
        {currencyOptions.map((option) => (
          <AppMenuItem key={option} value={option}>
            {option}
          </AppMenuItem>
        ))}
      </OnboardingField>
    </AppGrid>
  </AppStack>
);
