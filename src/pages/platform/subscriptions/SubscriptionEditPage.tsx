import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Controller } from 'react-hook-form';
import { AppForm } from '../../../components/common/form/AppForm';
import { createSubscriptionSchema } from '../../../forms/subscriptionsSchemas';
import { useForm } from '../../../forms/useForm';
import { subscriptionStatusLabelByValue } from '../../../models/subscriptionStatusLabels';
import { useSubscriptionEditPage } from '../../../hooks/subscriptions/useSubscriptionEditPage';

const SubscriptionEditPage = () => {
  const view = useSubscriptionEditPage();
  const form = useForm(createSubscriptionSchema, view.defaultValues);

  if (!view.tenantId) {
    return (
      <Stack spacing={2}>
        <Typography variant="h4">Editar Assinatura</Typography>
        <Typography>tenantId � obrigat�rio.</Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Editar Assinatura</Typography>
      <AppForm form={form} onSubmit={(data) => void view.handleSubmit(data)}>
        <Controller
          name="tenantId"
          control={form.control}
          render={({ field }) => <TextField {...field} fullWidth label="Tenant ID" />}
        />
        <Controller
          name="planId"
          control={form.control}
          render={({ field }) => (
            <TextField select fullWidth label="Plano" {...field}>
              {view.plans.map((plan) => (
                <MenuItem key={plan.id} value={plan.id}>
                  {plan.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          name="status"
          control={form.control}
          render={({ field }) => (
            <TextField select fullWidth label="Status" {...field}>
              {Object.entries(subscriptionStatusLabelByValue).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          name="priceAtSubscription"
          control={form.control}
          render={({ field }) => <TextField {...field} fullWidth label="Pre�o contratado" />}
        />
        <Button type="submit" variant="contained" disabled={view.loading}>
          Salvar
        </Button>
      </AppForm>
    </Stack>
  );
};

export default SubscriptionEditPage;
