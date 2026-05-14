import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import { AppBox } from '@shared/components/layout/AppBox';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppLoadingIndicator } from '@shared/components/data-display/AppLoadingIndicator';
import { AppDivider } from '@shared/components/data-display/AppDivider';
import { AppLink } from '@shared/components/navigation/AppLink';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { useAppTheme } from '@theme/useAppTheme';
import type { UseFormReturn } from 'react-hook-form';
import { AppForm } from '@shared/components/form/AppForm';
import { TotpCodeBoxes } from '@shared/components/form/TotpCodeBoxes';
import type { TotpCodeSchema } from '@shared/schemas/authSchemas';
import { fontSizes } from '@theme/fontSizes';

interface PlatformMfaSetupFormProps {
  form: UseFormReturn<TotpCodeSchema>;
  loading: boolean;
  submitDisabled: boolean;
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
  submitDisabled,
  manualCode,
  qrCodeUrl,
  onSubmit,
  header,
  labels,
}: PlatformMfaSetupFormProps) => {
  const theme = useAppTheme();
  return (
    <AppPaper
      elevation={0}
      sx={{ p: { xs: 3, md: 4 }, width: '100%', maxWidth: 760, borderRadius: 2.5 }}
    >
      <AppStack sx={{ alignItems: 'center', mb: 3 }}>
        <AppBox
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
          <LockOutlinedIcon sx={{ color: theme.palette.primary.main, fontSize: 34 }} />
        </AppBox>
        <AppText
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 700,
            fontSize: { xs: '1.5rem', md: '1.75rem', lg: '2rem' },
            mb: 1,
          }}
        >
          {header.title}
        </AppText>
        <AppText
          sx={{
            color: theme.palette.text.secondary,
            fontSize: fontSizes.md,
            textAlign: 'center',
            maxWidth: 540,
          }}
        >
          {header.subtitle}
        </AppText>
      </AppStack>

      <AppDivider sx={{ mb: 2.5 }} />

      <AppStack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 2.5 }}>
        <AppBox
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
        <AppStack spacing={0.8} sx={{ flex: 1 }}>
          <AppStack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <ShieldOutlinedIcon sx={{ color: theme.palette.text.secondary }} />
            <AppText
              sx={{ fontSize: fontSizes.lg, fontWeight: 600, color: theme.palette.text.primary }}
            >
              {labels.cannotScan}
            </AppText>
          </AppStack>
          <AppText sx={{ color: theme.palette.text.secondary, fontSize: fontSizes.md }}>
            {labels.useManualCode}
          </AppText>
          <AppPaper
            variant="outlined"
            sx={{
              p: 1.5,
              borderRadius: 2,
              borderColor: theme.palette.divider,
              display: 'inline-flex',
            }}
          >
            <AppText
              sx={{
                fontSize: '1.0625rem',
                fontWeight: 600,
                letterSpacing: 0.8,
                color: theme.palette.text.primary,
              }}
            >
              {manualCode}
            </AppText>
          </AppPaper>
        </AppStack>
      </AppStack>

      <AppText
        sx={{ fontSize: '1rem', fontWeight: 600, color: theme.palette.text.primary, mb: 1.2 }}
      >
        {labels.appCode}
      </AppText>

      <AppForm form={form} onSubmit={onSubmit}>
        <TotpCodeBoxes name="totpCode" />
        <AppStack
          direction="row"
          spacing={1}
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            color: theme.palette.text.secondary,
          }}
        >
          <ShieldOutlinedIcon fontSize="small" />
          <AppText sx={{ fontSize: fontSizes.md }}>{labels.rotatingCodeHint}</AppText>
        </AppStack>
        <AppButton
          type="submit"
          variant="contained"
          disabled={submitDisabled}
          sx={{
            py: 1.6,
            borderRadius: 2,
            fontSize: fontSizes.lg,
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }}
        >
          {loading ? <AppLoadingIndicator size={20} color="inherit" /> : labels.submit}
        </AppButton>
      </AppForm>

      <AppStack sx={{ mt: 3, alignItems: 'center' }}>
        <AppLink
          href="/platform/login"
          underline="none"
          sx={{
            fontSize: fontSizes.md,
            color: theme.palette.primary.main,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.6,
          }}
        >
          <ArrowBackOutlinedIcon fontSize="small" />
          {labels.backToLogin}
        </AppLink>
      </AppStack>
    </AppPaper>
  );
};
