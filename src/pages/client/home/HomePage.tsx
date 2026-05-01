import { useEffect, useState, type ReactNode } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { clientAuthService } from '@/services/client/auth/service';
import type { ClientMeResponse } from '@/services/client/auth/types';

const ClientHomePage = () => {
  const { loading, profile, errorMessage } = useClientHomeData();
  const content = getHomeContent(loading, profile, errorMessage);

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography sx={{ fontSize: 32, fontWeight: 700, color: 'text.primary', mb: 1 }}>
          Home do Cliente
        </Typography>
        <Typography sx={{ fontSize: 16, color: 'text.secondary', mb: 3 }}>
          Autenticacao concluida com sucesso.
        </Typography>

        {content}
      </Paper>
    </Box>
  );
};

const useClientHomeData = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ClientMeResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    void clientAuthService
      .me()
      .then((me) => {
        setProfile(me);
      })
      .catch(() => {
        setErrorMessage('Nao foi possivel carregar os dados do usuario.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { loading, profile, errorMessage };
};

const getHomeContent = (
  loading: boolean,
  profile: ClientMeResponse | null,
  errorMessage: string,
): ReactNode => {
  if (loading) {
    return <CircularProgress size={24} />;
  }
  if (errorMessage.length > 0) {
    return <ClientHomeError errorMessage={errorMessage} />;
  }
  return <ClientHomeProfile profile={profile} />;
};

const ClientHomeError = ({ errorMessage }: { errorMessage: string }) => (
  <Stack spacing={1.2}>
    <Alert severity="warning">{errorMessage}</Alert>
  </Stack>
);

const ClientHomeProfile = ({ profile }: { profile: ClientMeResponse | null }) => {
  if (profile === null) {
    return null;
  }

  return (
    <Stack spacing={1.2}>
      <Typography>Email: {profile.email}</Typography>
      <Typography>Tenant: {profile.tenantId}</Typography>
      <Typography>Status: {profile.status}</Typography>
      <Typography>User ID: {profile.id}</Typography>
    </Stack>
  );
};

export default ClientHomePage;
