import type { ReactNode } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  CLIENT_HOME_MESSAGES,
  useClientHomeData,
  type ClientHomeProfile,
} from '@/hooks/client-auth/useClientHomeData';

const ClientHomePage = () => {
  const { loading, profile, errorMessage } = useClientHomeData();
  const content = getHomeContent(loading, profile, errorMessage);

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography sx={{ fontSize: 32, fontWeight: 700, color: 'text.primary', mb: 1 }}>
          {CLIENT_HOME_MESSAGES.title}
        </Typography>
        <Typography sx={{ fontSize: 16, color: 'text.secondary', mb: 3 }}>
          {CLIENT_HOME_MESSAGES.success}
        </Typography>
        {content}
      </Paper>
    </Box>
  );
};

const getHomeContent = (
  loading: boolean,
  profile: ClientHomeProfile | null,
  errorMessage: string,
): ReactNode => {
  if (loading) return <CircularProgress size={24} />;

  const errorOrProfileContent =
    errorMessage.length > 0 ? (
      <Stack spacing={1.2}>
        <Alert severity="warning">{errorMessage}</Alert>
      </Stack>
    ) : (
      <ClientHomeProfileContent profile={profile} />
    );

  return errorOrProfileContent;
};

const ClientHomeProfileContent = ({ profile }: { profile: ClientHomeProfile | null }) => {
  if (profile === null) return null;

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
