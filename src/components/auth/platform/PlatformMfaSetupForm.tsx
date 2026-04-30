import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import type { UseFormReturn } from 'react-hook-form';
import { AppForm } from '@/components/common/form/AppForm';
import { TotpCodeBoxes } from '@/components/common/form/TotpCodeBoxes';
import type { TotpCodeSchema } from '@/forms/validators';

interface PlatformMfaSetupFormProps {
  form: UseFormReturn<TotpCodeSchema>;
  loading: boolean;
  manualCode: string;
  qrCodeUrl: string;
  onSubmit: (data: TotpCodeSchema) => Promise<void>;
  header: {
    title: string;
    subtitle: string;
  };
  labels: {
    cannotScan: string;
    useManualCode: string;
    appCode: string;
    rotatingCodeHint: string;
    submit: string;
    backToLogin: string;
  };
}

export const PlatformMfaSetupForm = ({
  form,
  loading,
  manualCode,
  qrCodeUrl,
  onSubmit,
  header,
  labels,
}: PlatformMfaSetupFormProps) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 3, md: 4 }, width: '100%', maxWidth: 760, borderRadius: 2.5 }}
    >
      <Stack sx={{ alignItems: 'center', mb: 3 }}>
        <Box
          sx={{
            width: 84,
            height: 84,
            borderRadius: '50%',
            bgcolor: theme.palette.action.hover,
            display: 'grid',
            placeItems: 'center',
            mb: 1,
          }}
        >
          <LockOutlinedIcon sx={{ color: theme.palette.primary.main, fontSize: 40 }} />
        </Box>
        <Typography
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 700,
            fontSize: { xs: 30, md: 38, lg: 44 },
            mb: 1,
          }}
        >
          {header.title}
        </Typography>
        <Typography
          sx={{
            color: theme.palette.text.secondary,
            fontSize: 15,
            textAlign: 'center',
            maxWidth: 540,
          }}
        >
          {header.subtitle}
        </Typography>
      </Stack>

      <Divider sx={{ mb: 2.5 }} />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 2.5 }}>
        <Box
          component="img"
          src={qrCodeUrl}
          alt="QR Code MFA"
          sx={{
            width: 150,
            height: 150,
            borderRadius: 1.5,
            border: '1px solid',
            borderColor: theme.palette.divider,
            p: 1,
            bgcolor: theme.palette.background.paper,
          }}
        />
        <Stack spacing={0.8} sx={{ flex: 1 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <ShieldOutlinedIcon sx={{ color: theme.palette.text.secondary }} />
            <Typography sx={{ fontSize: 18, fontWeight: 600, color: theme.palette.text.primary }}>
              {labels.cannotScan}
            </Typography>
          </Stack>
          <Typography sx={{ color: theme.palette.text.secondary, fontSize: 14 }}>
            {labels.useManualCode}
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              p: 1.5,
              borderRadius: 2,
              borderColor: theme.palette.divider,
              display: 'inline-flex',
            }}
          >
            <Typography
              sx={{
                fontSize: 24,
                fontWeight: 600,
                letterSpacing: 0.8,
                color: theme.palette.text.primary,
              }}
            >
              {manualCode}
            </Typography>
          </Paper>
        </Stack>
      </Stack>

      <Typography
        sx={{ fontSize: 20, fontWeight: 600, color: theme.palette.text.primary, mb: 1.2 }}
      >
        {labels.appCode}
      </Typography>

      <AppForm form={form} onSubmit={onSubmit}>
        <TotpCodeBoxes name="totpCode" />
        <Stack
          direction="row"
          spacing={1}
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            color: theme.palette.text.secondary,
          }}
        >
          <ShieldOutlinedIcon fontSize="small" />
          <Typography sx={{ fontSize: 14 }}>{labels.rotatingCodeHint}</Typography>
        </Stack>
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

      <Stack sx={{ mt: 3, alignItems: 'center' }}>
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
