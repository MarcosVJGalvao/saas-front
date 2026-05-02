import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { ClientOnboardingForm } from '../../../components/clients/ClientOnboardingForm';
import { useClientsMutations } from '../../../hooks/clients/useClientsMutations';

const ClientOnboardingPage = () => {
  const mutations = useClientsMutations();
  const navigate = useNavigate();

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Onboarding de Novo Cliente</Typography>
      <Typography color="text.secondary">
        Crie um novo cliente, configure o tenant e o usuário administrador.
      </Typography>
      <ClientOnboardingForm
        loading={mutations.loading}
        onCancel={() => {
          void navigate('/platform/clients');
        }}
        onSubmit={(payload) => {
          void mutations.onboard(payload);
        }}
      />
    </Stack>
  );
};

export default ClientOnboardingPage;
