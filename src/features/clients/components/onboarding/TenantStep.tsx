import { AppGrid } from '@shared/components/layout/AppGrid';
import { AppMenuItem } from '@shared/components/inputs/AppMenuItem';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppTextField } from '@shared/components/inputs/AppTextField';
import { AppText } from '@shared/components/data-display/AppText';
import type { OnboardingStepProps } from '@features/clients/components/onboarding/types';

const timezoneOptions: string[] = [
  'America/Sao_Paulo',
  'America/Manaus',
  'America/Recife',
  'America/Fortaleza',
  'UTC',
];

const localeOptions: string[] = ['pt-BR', 'en-US', 'es-ES'];

const currencyOptions: string[] = ['BRL', 'USD', 'EUR'];

export const TenantStep = ({ value, setValue }: OnboardingStepProps) => (
  <AppStack spacing={1.5}>
    <AppText variant="h6">Configuração do Tenant</AppText>
    <AppGrid container spacing={1.5}>
      <AppGrid size={{ xs: 12, md: 6 }}>
        <AppTextField
          fullWidth
          label="Nome do Tenant"
          value={value.tenantName}
          onChange={(event) => setValue({ ...value, tenantName: event.target.value })}
        />
      </AppGrid>
      <AppGrid size={{ xs: 12, md: 6 }}>
        <AppTextField
          fullWidth
          label="Slug do Tenant"
          value={value.tenantSlug}
          onChange={(event) => setValue({ ...value, tenantSlug: event.target.value })}
        />
      </AppGrid>
      <AppGrid size={{ xs: 12, md: 4 }}>
        <AppTextField
          fullWidth
          select
          label="Fuso Horário"
          value={value.timezone ?? ''}
          onChange={(event) => setValue({ ...value, timezone: event.target.value })}
        >
          <AppMenuItem value="">Selecione</AppMenuItem>
          {timezoneOptions.map((option) => (
            <AppMenuItem key={option} value={option}>
              {option}
            </AppMenuItem>
          ))}
        </AppTextField>
      </AppGrid>
      <AppGrid size={{ xs: 12, md: 4 }}>
        <AppTextField
          fullWidth
          select
          label="Idioma e Região"
          value={value.locale ?? ''}
          onChange={(event) => setValue({ ...value, locale: event.target.value })}
        >
          <AppMenuItem value="">Selecione</AppMenuItem>
          {localeOptions.map((option) => (
            <AppMenuItem key={option} value={option}>
              {option}
            </AppMenuItem>
          ))}
        </AppTextField>
      </AppGrid>
      <AppGrid size={{ xs: 12, md: 4 }}>
        <AppTextField
          fullWidth
          select
          label="Moeda"
          value={value.currency ?? ''}
          onChange={(event) => setValue({ ...value, currency: event.target.value })}
        >
          <AppMenuItem value="">Selecione</AppMenuItem>
          {currencyOptions.map((option) => (
            <AppMenuItem key={option} value={option}>
              {option}
            </AppMenuItem>
          ))}
        </AppTextField>
      </AppGrid>
    </AppGrid>
  </AppStack>
);
