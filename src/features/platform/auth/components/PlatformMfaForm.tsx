import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { AppBox } from '@shared/components/layout/AppBox';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppLoadingIndicator } from '@shared/components/data-display/AppLoadingIndicator';
import { AppDivider } from '@shared/components/data-display/AppDivider';
import { AppLink } from '@shared/components/navigation/AppLink';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { useAppTheme } from '@theme/useAppTheme';
import { AppForm } from '@shared/components/form/AppForm';
import { TotpCodeBoxes } from '@shared/components/form/TotpCodeBoxes';
import type { TotpCodeSchema } from '@shared/schemas/authSchemas';
import { fontSizes } from '@theme/fontSizes';
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
  const theme = useAppTheme();

  return (
    <AppPaper
      elevation={0}
      sx={{ p: { xs: 3, md: 4 }, width: '100%', maxWidth: 620, borderRadius: 2.5 }}
    >
      <AppBox
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mb: 3 }}
      >
        <AppBox
          sx={{
            width: 84,
            height: 84,
            borderRadius: '50%',
            bgcolor: theme.palette.action.hover,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <LockOutlinedIcon sx={{ color: theme.palette.primary.main, fontSize: 34 }} />
        </AppBox>
        <AppText
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 700,
            fontSize: { xs: '1.5rem', md: '1.75rem', lg: '2rem' },
          }}
        >
          {header.title}
        </AppText>
        <AppText
          sx={{
            color: theme.palette.text.secondary,
            fontSize: fontSizes.md,
            textAlign: 'center',
            maxWidth: 360,
          }}
        >
          {header.subtitle}
        </AppText>
      </AppBox>

      <AppForm form={form} onSubmit={onSubmit}>
        <TotpCodeBoxes name="totpCode" />
        <AppButton
          type="submit"
          variant="contained"
          disabled={!form.formState.isValid || loading}
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

      <AppStack spacing={1.6} sx={{ mt: 3, alignItems: 'center' }}>
        <AppStack direction="row" spacing={2} sx={{ width: '100%', alignItems: 'center' }}>
          <AppDivider sx={{ flex: 1 }} />
          <AppText sx={{ color: theme.palette.text.secondary, fontSize: fontSizes.md }}>
            {labels.recoveryTitle}
          </AppText>
          <AppDivider sx={{ flex: 1 }} />
        </AppStack>
        <AppLink
          href="/platform/mfa-setup"
          underline="none"
          sx={{ fontSize: fontSizes.md, color: theme.palette.primary.main }}
        >
          {labels.resetMfa}
        </AppLink>
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
