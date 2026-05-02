import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ClientForm } from '../../../components/clients/ClientForm';
import { useClientCreatePage } from '../../../hooks/clients/useClientCreatePage';

const ClientCreatePage = () => {
  const view = useClientCreatePage();

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Novo Cliente</Typography>
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

export default ClientCreatePage;
