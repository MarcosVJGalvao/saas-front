import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ClientForm } from '../../../components/clients/ClientForm';
import { useClientEditPage } from '../../../hooks/clients/useClientEditPage';

const ClientEditPage = () => {
  const view = useClientEditPage();

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Editar Cliente</Typography>
      <ClientForm
        value={view.value}
        onChange={view.setValue}
        loading={view.loading}
        onSubmit={() => {
          void view.handleSubmit();
        }}
      />
    </Stack>
  );
};

export default ClientEditPage;
