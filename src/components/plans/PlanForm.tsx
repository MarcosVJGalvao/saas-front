import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import type { BillingCycle, CreatePlanRequest } from '../../models/plans';

interface PlanFormProps {
  value: CreatePlanRequest;
  onChange: (next: CreatePlanRequest) => void;
  loading: boolean;
  onSubmit: () => void;
}

const isBillingCycle = (value: string): value is BillingCycle =>
  value === 'monthly' || value === 'yearly';

export const PlanForm = ({ value, onChange, loading, onSubmit }: PlanFormProps) => (
  <Stack spacing={2}>
    <TextField
      label="Nome"
      value={value.name}
      onChange={(event) => onChange({ ...value, name: event.target.value })}
    />
    <TextField
      label="Descrição"
      value={value.description ?? ''}
      onChange={(event) => onChange({ ...value, description: event.target.value })}
    />
    <TextField
      label="Preço"
      value={value.price}
      onChange={(event) => onChange({ ...value, price: event.target.value })}
    />
    <TextField
      label="Moeda"
      value={value.currency}
      onChange={(event) => onChange({ ...value, currency: event.target.value })}
    />
    <TextField
      select
      label="Ciclo"
      value={value.billingCycle}
      onChange={(event) => {
        const nextValue = event.target.value;
        if (isBillingCycle(nextValue)) {
          onChange({ ...value, billingCycle: nextValue });
        }
      }}
    >
      <MenuItem value="monthly">monthly</MenuItem>
      <MenuItem value="yearly">yearly</MenuItem>
    </TextField>
    <TextField
      type="number"
      label="Trial (dias)"
      value={value.trialDays ?? 0}
      onChange={(event) => onChange({ ...value, trialDays: Number(event.target.value) })}
    />
    <Stack direction="row" spacing={1}>
      <Switch
        checked={value.isActive ?? true}
        onChange={(event) => onChange({ ...value, isActive: event.target.checked })}
      />
      Ativo
    </Stack>
    <Button variant="contained" disabled={loading} onClick={onSubmit}>
      Salvar
    </Button>
  </Stack>
);
