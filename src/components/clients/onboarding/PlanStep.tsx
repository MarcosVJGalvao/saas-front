import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { Plan } from '../../../models/plans';
import type { OnboardingStepProps } from './types';

interface PlanStepProps extends OnboardingStepProps {
  planOptions: Plan[];
  plansLoading: boolean;
}

const translateBillingCycle = (value: Plan['billingCycle']): string =>
  value === 'monthly' ? 'Mensal' : 'Anual';

const formatCurrency = (value: string, currency: string): string => {
  const normalized = Number(value);
  if (Number.isNaN(normalized)) return `${value} ${currency}`;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(normalized);
};

const buildPlanOptionLabel = (plan: Plan): string =>
  `${plan.name} - ${formatCurrency(plan.price, plan.currency)} - ${translateBillingCycle(plan.billingCycle)}`;

export const PlanStep = ({ value, setValue, planOptions, plansLoading }: PlanStepProps) => (
  <Stack spacing={1.5}>
    <Typography variant="h6">Plano e Assinatura</Typography>
    <TextField
      fullWidth
      select
      label="Plano"
      value={value.planId}
      onChange={(event) => setValue({ ...value, planId: event.target.value })}
      helperText={plansLoading ? 'Carregando planos...' : 'Selecione o plano para a assinatura'}
    >
      <MenuItem value="">Selecione</MenuItem>
      {planOptions.map((plan) => (
        <MenuItem key={plan.id} value={plan.id}>
          {buildPlanOptionLabel(plan)}
        </MenuItem>
      ))}
    </TextField>
  </Stack>
);
