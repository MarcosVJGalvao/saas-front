import { Controller } from 'react-hook-form';
import { AppForm } from '@shared/components/form/AppForm';
import { AppText } from '@shared/components/data-display/AppText';
import { AppBox } from '@shared/components/layout/AppBox';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppTextField } from '@shared/components/inputs/AppTextField';
import { useResetPasswordPage } from '@features/client/auth/hooks/useResetPasswordPage';
import { PlatformAuthPageLayout } from '@shared/components/layout/PlatformAuthPageLayout';

const ResetPasswordPage = () => {
  const model = useResetPasswordPage();

  return (
    <PlatformAuthPageLayout>
      <AppBox sx={{ width: '100%', maxWidth: 420 }}>
        <AppForm form={model.form} onSubmit={model.handleSubmit}>
          <AppText variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            {model.messages.title}
          </AppText>
          <Controller
            name="newPassword"
            control={model.form.control}
            render={({ field, fieldState }) => (
              <AppTextField
                {...field}
                type="password"
                label={model.messages.fieldLabel}
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />
          <AppButton type="submit" fullWidth size="large" disabled={model.submitDisabled}>
            {model.messages.submit}
          </AppButton>
        </AppForm>
      </AppBox>
    </PlatformAuthPageLayout>
  );
};

export default ResetPasswordPage;
