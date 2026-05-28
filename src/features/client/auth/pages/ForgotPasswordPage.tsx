import { Controller } from 'react-hook-form';
import { AppForm } from '@shared/components/form/AppForm';
import { AppText } from '@shared/components/data-display/AppText';
import { AppBox } from '@shared/components/layout/AppBox';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppTextField } from '@shared/components/inputs/AppTextField';
import { useForgotPasswordPage } from '@features/client/auth/hooks/useForgotPasswordPage';
import { PlatformAuthPageLayout } from '@shared/components/layout/PlatformAuthPageLayout';

const ForgotPasswordPage = () => {
  const model = useForgotPasswordPage();

  return (
    <PlatformAuthPageLayout>
      <AppBox sx={{ width: '100%', maxWidth: 420 }}>
        <AppForm form={model.form} onSubmit={model.handleSubmit}>
          <AppText variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            {model.messages.title}
          </AppText>
          <Controller
            name="email"
            control={model.form.control}
            render={({ field, fieldState }) => (
              <AppTextField
                {...field}
                label={model.messages.emailLabel}
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />
          <AppButton type="submit" fullWidth size="large">
            {model.messages.submit}
          </AppButton>
          {model.sent ? <AppText color="success.main">{model.messages.sent}</AppText> : null}
        </AppForm>
      </AppBox>
    </PlatformAuthPageLayout>
  );
};

export default ForgotPasswordPage;
