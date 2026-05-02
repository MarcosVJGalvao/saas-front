import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { OnboardingStepProps } from './types';

export const PlanStep = ({ value, setValue }: OnboardingStepProps) => (
  <Stack spacing={1.5}>
    <Typography variant="h6">Plano e Assinatura</Typography>
    <TextField
      fullWidth
      select
      label="Plano"
      value={value.planId}
      onChange={(event) => setValue({ ...value, planId: event.target.value })}
    >
      <MenuItem value="">Selecione</MenuItem>
      <MenuItem value="pro">Pro</MenuItem>
      <MenuItem value="starter">Starter</MenuItem>
    </TextField>
  </Stack>
);
