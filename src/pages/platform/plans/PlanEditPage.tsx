import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Controller } from 'react-hook-form';
import { AppForm } from '../../../components/common/form/AppForm';
import { createPlanSchema } from '../../../forms/plansSchemas';
import { useForm } from '../../../forms/useForm';
import { usePlanEditPage } from '../../../hooks/plans/usePlanEditPage';

const PlanEditPage = () => {
  const view = usePlanEditPage();
  const form = useForm(createPlanSchema, view.defaultValues);

  return (
    <Stack spacing={2}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Editar Plano
      </Typography>
      <AppForm form={form} onSubmit={(data) => void view.handleSubmit(data)}>
        <Controller
          name="name"
          control={form.control}
          render={({ field }) => <TextField {...field} fullWidth label="Nome" />}
        />
        <Controller
          name="description"
          control={form.control}
          render={({ field }) => <TextField {...field} fullWidth label="Descri��o" />}
        />
        <Controller
          name="price"
          control={form.control}
          render={({ field }) => <TextField {...field} fullWidth label="Pre�o" />}
        />
        <Controller
          name="currency"
          control={form.control}
          render={({ field }) => <TextField {...field} fullWidth label="Moeda" />}
        />
        <Controller
          name="billingCycle"
          control={form.control}
          render={({ field }) => (
            <TextField select fullWidth label="Ciclo" {...field}>
              <MenuItem value="monthly">monthly</MenuItem>
              <MenuItem value="yearly">yearly</MenuItem>
            </TextField>
          )}
        />
        <Controller
          name="trialDays"
          control={form.control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              type="number"
              label="Trial (dias)"
              onChange={(event) => field.onChange(Number(event.target.value))}
            />
          )}
        />
        <Controller
          name="isActive"
          control={form.control}
          render={({ field }) => (
            <Stack direction="row" spacing={1}>
              <Switch
                checked={Boolean(field.value)}
                onChange={(event) => field.onChange(event.target.checked)}
              />
              Ativo
            </Stack>
          )}
        />
        <Button type="submit" variant="contained" disabled={view.loading}>
          Salvar
        </Button>
      </AppForm>
    </Stack>
  );
};

export default PlanEditPage;
