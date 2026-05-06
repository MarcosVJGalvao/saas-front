import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useAuth } from '../useAuth/useAuth';
import { CLIENT_HOME_MESSAGES } from './useClientHomeData';
import { useClientProfile } from './useClientProfile';

export const useClientHomePageViewModel = () => {
  const { authDomain, session } = useAuth();
  const { loading, profile, errorMessage } = useClientProfile({
    enabled: authDomain === 'client' && session !== null,
  });

  const content = loading ? (
    <CircularProgress size={24} />
  ) : errorMessage.length > 0 ? (
    <Stack spacing={1.2}>
      <Alert severity="warning">{errorMessage}</Alert>
    </Stack>
  ) : profile === null ? null : (
    <Stack spacing={1.2}>
      <Typography>Email: {profile.email}</Typography>
      <Typography>Tenant: {profile.tenantId}</Typography>
      <Typography>Status: {profile.status}</Typography>
      <Typography>User ID: {profile.id}</Typography>
    </Stack>
  );

  return { messages: CLIENT_HOME_MESSAGES, content };
};
