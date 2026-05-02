import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { Plan } from '../../models/plans';
import { subscriptionStatusLabelByValue } from '../../models/subscriptionStatusLabels';
import type { CreateSubscriptionRequest, SubscriptionStatus } from '../../models/subscriptions';

const isSubscriptionStatus = (value: string): value is SubscriptionStatus =>
  value === 'active' ||
  value === 'canceled' ||
  value === 'past_due' ||
  value === 'trialing' ||
  value === 'blocked';

const subscriptionStatuses: SubscriptionStatus[] = [
  'active',
  'canceled',
  'past_due',
  'trialing',
  'blocked',
];

export const SubscriptionForm = ({
  value,
  plans,
  onChange,
  loading,
  onSubmit,
}: {
  value: CreateSubscriptionRequest;
  plans: Plan[];
  onChange: (next: CreateSubscriptionRequest) => void;
  loading: boolean;
  onSubmit: () => void;
}) => (
  <Stack spacing={2}>
    <TextField
      label="Tenant ID"
      value={value.tenantId ?? ''}
      onChange={(event) => onChange({ ...value, tenantId: event.target.value })}
    />
    <TextField
      select
      label="Plano"
      value={value.planId}
      onChange={(event) => {
        const planId = event.target.value;
        const selectedPlan = plans.find((item) => item.id === planId);
        onChange({
          ...value,
          planId,
          priceAtSubscription: selectedPlan?.price ?? value.priceAtSubscription,
        });
      }}
    >
      {plans.map((plan) => (
        <MenuItem key={plan.id} value={plan.id}>
          {plan.name}
        </MenuItem>
      ))}
    </TextField>
    <TextField
      select
      label="Status"
      value={value.status}
      onChange={(event) => {
        const nextValue = event.target.value;
        if (isSubscriptionStatus(nextValue)) {
          onChange({ ...value, status: nextValue });
        }
      }}
    >
      {subscriptionStatuses.map((status) => (
        <MenuItem key={status} value={status}>
          {subscriptionStatusLabelByValue[status]}
        </MenuItem>
      ))}
    </TextField>
    {value.status === 'blocked' ? (
      <TextField
        label="Motivo do bloqueio"
        value={value.blockedReason ?? ''}
        onChange={(event) => onChange({ ...value, blockedReason: event.target.value })}
      />
    ) : null}
    {value.planId ? (
      <Typography variant="body2">
        Se alterar o plano, o backend registrará histórico de troca.
      </Typography>
    ) : null}
    <TextField
      label="Preço contratado"
      value={value.priceAtSubscription}
      onChange={(event) => onChange({ ...value, priceAtSubscription: event.target.value })}
    />
    <Button variant="contained" disabled={loading} onClick={onSubmit}>
      Salvar
    </Button>
  </Stack>
);
