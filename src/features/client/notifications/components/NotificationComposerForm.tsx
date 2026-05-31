import { Controller } from 'react-hook-form';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppTextField } from '@shared/components/inputs/AppTextField';
import { AppBox } from '@shared/components/layout/AppBox';
import type { UseSendNotificationPageResult } from '@features/client/notifications/hooks/useSendNotificationPage';
import type { SendNotificationFormValues } from '@features/client/notifications/schemas/sendNotificationForm.schema';

interface NotificationComposerFormProps {
  model: UseSendNotificationPageResult;
}

export const NotificationComposerForm = ({ model }: NotificationComposerFormProps) => (
  <AppForm form={model.form} onSubmit={model.onSubmit}>
    <FormTextField<SendNotificationFormValues> name="eventKey" label="Chave do evento" />
    <Controller
      name="message"
      control={model.form.control}
      render={({ field, fieldState }) => (
        <AppTextField
          {...field}
          label="Mensagem"
          multiline
          minRows={3}
          error={fieldState.invalid}
          helperText={fieldState.error?.message}
        />
      )}
    />
    <Controller
      name="targetUserIds"
      control={model.form.control}
      render={({ field, fieldState }) => (
        <AppTextField
          {...field}
          label="IDs de usuários"
          placeholder="user-1, user-2"
          helperText={fieldState.error?.message ?? 'Opcional. Separe múltiplos IDs por vírgula.'}
          error={fieldState.invalid}
        />
      )}
    />
    <AppBox sx={{ width: '100%' }}>
      <FormActions
        secondaryAction={{
          type: 'back',
          label: 'Voltar',
          onClick: model.onBack,
        }}
        primaryAction={{
          type: 'confirm',
          label: model.submitting ? 'Enviando...' : 'Enviar notificação',
          onClick: () => {
            void model.form.handleSubmit(model.onSubmit)();
          },
          disabled: model.submitting,
        }}
      />
    </AppBox>
  </AppForm>
);
