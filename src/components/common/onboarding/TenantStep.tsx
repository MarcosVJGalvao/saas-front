import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { OnboardingStepProps } from './types';

const timezoneOptions = [
  'America/Sao_Paulo',
  'America/Manaus',
  'America/Recife',
  'America/Fortaleza',
  'UTC',
] as const;

const localeOptions = ['pt-BR', 'en-US', 'es-ES'] as const;

const currencyOptions = ['BRL', 'USD', 'EUR'] as const;

export const TenantStep = ({ value, setValue }: OnboardingStepProps) => (
  <Stack spacing={1.5}>
    <Typography variant="h6">Configuração do Tenant</Typography>
    <Grid container spacing={1.5}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Nome do Tenant"
          value={value.tenantName}
          onChange={(event) => setValue({ ...value, tenantName: event.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Slug do Tenant"
          value={value.tenantSlug}
          onChange={(event) => setValue({ ...value, tenantSlug: event.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          select
          label="Fuso Horário"
          value={value.timezone ?? ''}
          onChange={(event) => setValue({ ...value, timezone: event.target.value })}
        >
          <MenuItem value="">Selecione</MenuItem>
          {timezoneOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          select
          label="Idioma e Região"
          value={value.locale ?? ''}
          onChange={(event) => setValue({ ...value, locale: event.target.value })}
        >
          <MenuItem value="">Selecione</MenuItem>
          {localeOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          select
          label="Moeda"
          value={value.currency ?? ''}
          onChange={(event) => setValue({ ...value, currency: event.target.value })}
        >
          <MenuItem value="">Selecione</MenuItem>
          {currencyOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  </Stack>
);
