import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Controller } from 'react-hook-form';
import { AppForm } from '../../../components/common/form/AppForm';
import { useForm } from '../../../forms/useForm';
import { createClientSchema } from '../../../forms/clientsSchemas';
import { useClientEditPage } from '../../../hooks/clients/useClientEditPage';
import { maskCnpj, maskCpf } from '../../../utils/mask';
import { onlyDigits } from '../../../utils/parse';

const ClientEditPage = () => {
  const view = useClientEditPage();
  const form = useForm(createClientSchema, view.value);

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Editar Cliente</Typography>
      <AppForm form={form} onSubmit={(payload) => void view.handleSubmit(payload)}>
        <Controller
          name="tradeName"
          control={form.control}
          render={({ field }) => <TextField {...field} fullWidth label="Nome Fantasia" />}
        />
        <Controller
          name="legalName"
          control={form.control}
          render={({ field }) => <TextField {...field} fullWidth label="Razão Social" />}
        />
        <Controller
          name="documentType"
          control={form.control}
          render={({ field }) => (
            <TextField select fullWidth label="Tipo de Documento" {...field}>
              <MenuItem value="CPF">CPF</MenuItem>
              <MenuItem value="CNPJ">CNPJ</MenuItem>
              <MenuItem value="RG">RG</MenuItem>
              <MenuItem value="PASSPORT">PASSPORT</MenuItem>
              <MenuItem value="OTHER">OTHER</MenuItem>
            </TextField>
          )}
        />
        <Controller
          name="documentNumber"
          control={form.control}
          render={({ field }) => (
            <TextField
              fullWidth
              label="Documento"
              value={
                form.watch('documentType') === 'CPF' ? maskCpf(field.value) : maskCnpj(field.value)
              }
              onChange={(event) => field.onChange(onlyDigits(event.target.value))}
            />
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field }) => <TextField {...field} fullWidth label="E-mail" />}
        />
        <Controller
          name="phone"
          control={form.control}
          render={({ field }) => <TextField {...field} fullWidth label="Telefone" />}
        />
        <Controller
          name="status"
          control={form.control}
          render={({ field }) => (
            <TextField select fullWidth label="Status" {...field}>
              <MenuItem value="active">Ativo</MenuItem>
              <MenuItem value="inactive">Inativo</MenuItem>
            </TextField>
          )}
        />
        <Button type="submit" variant="contained" disabled={view.loading}>
          Salvar
        </Button>
      </AppForm>
    </Stack>
  );
};

export default ClientEditPage;
