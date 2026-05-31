import { Controller } from 'react-hook-form';
import type { AppAutocompleteOption } from '@shared/components/form/AppAutocomplete';
import { AppAutocompleteMultiple } from '@shared/components/form/AppAutocompleteMultiple';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { AppTextField } from '@shared/components/inputs/AppTextField';
import { AppBox } from '@shared/components/layout/AppBox';
import type { UseSendNotificationPageResult } from '@features/client/notifications/hooks/useSendNotificationPage';

interface NotificationComposerFormProps {
  model: UseSendNotificationPageResult;
}

const toSelectedUserOptions = (
  options: AppAutocompleteOption[],
  selectedUserIds: string[],
): AppAutocompleteOption[] => options.filter((option) => selectedUserIds.includes(option.value));

export const NotificationComposerForm = ({ model }: NotificationComposerFormProps) => (
  <AppForm form={model.form} onSubmit={model.onSubmit}>
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
        <AppAutocompleteMultiple
          label="Usuários de destino"
          placeholder="Selecione um ou mais usuários"
          options={model.recipientOptions.userOptions}
          value={toSelectedUserOptions(model.recipientOptions.userOptions, field.value)}
          onChange={(selectedOptions) => {
            field.onChange(selectedOptions.map((option) => option.value));
          }}
          helperText={
            fieldState.error?.message ??
            'Opcional. Se nada for selecionado, o backend define o alcance da notificação.'
          }
          error={fieldState.invalid}
          disabled={model.submitting || model.recipientOptions.loading}
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
