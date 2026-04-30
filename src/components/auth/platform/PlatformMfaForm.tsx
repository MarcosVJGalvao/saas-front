import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { AppForm } from '@/components/common/form/AppForm';
import { TotpCodeBoxes } from '@/components/common/form/TotpCodeBoxes';
import type { TotpCodeSchema } from '@/forms/validators';
import type { UseFormReturn } from 'react-hook-form';

interface PlatformMfaFormProps {
  form: UseFormReturn<TotpCodeSchema>;
  loading: boolean;
  onSubmit: (data: TotpCodeSchema) => Promise<void>;
  header: {
    title: string;
    subtitle: string;
  };
  labels: {
    submit: string;
    recoveryTitle: string;
    resetMfa: string;
    backToLogin: string;
  };
}

export const PlatformMfaForm = ({
  form,
  loading,
  onSubmit,
  header,
  labels,
}: PlatformMfaFormProps) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 3, md: 4 }, width: '100%', maxWidth: 620, borderRadius: 2.5 }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mb: 3 }}>
        <Box
          sx={{
            width: 84,
            height: 84,
            borderRadius: '50%',
            bgcolor: theme.palette.action.hover,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <LockOutlinedIcon sx={{ color: theme.palette.primary.main, fontSize: 40 }} />
        </Box>
        <Typography
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 700,
            fontSize: { xs: 30, md: 38, lg: 44 },
          }}
        >
          {header.title}
        </Typography>
        <Typography
          sx={{
            color: theme.palette.text.secondary,
            fontSize: 15,
            textAlign: 'center',
            maxWidth: 360,
          }}
        >
          {header.subtitle}
        </Typography>
      </Box>

      <AppForm form={form} onSubmit={onSubmit}>
        <TotpCodeBoxes name="totpCode" />
        <Button
          type="submit"
          variant="contained"
          disabled={!form.formState.isValid || loading}
          sx={{
            py: 1.6,
            borderRadius: 2,
            fontSize: 18,
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : labels.submit}
        </Button>
      </AppForm>

      <Stack spacing={1.6} sx={{ mt: 3, alignItems: 'center' }}>
        <Stack direction="row" spacing={2} sx={{ width: '100%', alignItems: 'center' }}>
          <Divider sx={{ flex: 1 }} />
          <Typography sx={{ color: theme.palette.text.secondary, fontSize: 14 }}>
            {labels.recoveryTitle}
          </Typography>
          <Divider sx={{ flex: 1 }} />
        </Stack>
        <Link
          href="/platform/mfa-setup"
          underline="none"
          sx={{ fontSize: 16, color: theme.palette.primary.main }}
        >
          {labels.resetMfa}
        </Link>
        <Link
          href="/platform/login"
          underline="none"
          sx={{
            fontSize: 16,
            color: theme.palette.primary.main,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.6,
          }}
        >
          <ArrowBackOutlinedIcon fontSize="small" />
          {labels.backToLogin}
        </Link>
      </Stack>
    </Paper>
  );
};
