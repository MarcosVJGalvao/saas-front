import { Controller } from 'react-hook-form';
import { AppForm } from '@shared/components/form/AppForm';
import { AppText } from '@shared/components/data-display/AppText';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppTextField } from '@shared/components/inputs/AppTextField';
import { useForgotPasswordPageViewModel } from '@features/client-auth/hooks/useForgotPasswordPageViewModel';
import { PlatformAuthPageLayout } from '@shared/components/layout/PlatformAuthPageLayout';

const ForgotPasswordPage = () => {
  const model = useForgotPasswordPageViewModel();

  return (
    <PlatformAuthPageLayout>
      <AppForm form={model.form} onSubmit={model.handleSubmit}>
        <AppText variant="h5" sx={{ fontWeight: 700 }}>
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
            />
          )}
        />
        <AppButton type="submit">{model.messages.submit}</AppButton>
        {model.sent ? <AppText>{model.messages.sent}</AppText> : null}
      </AppForm>
    </PlatformAuthPageLayout>
  );
};

export default ForgotPasswordPage;
