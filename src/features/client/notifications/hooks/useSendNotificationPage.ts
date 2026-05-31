import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SubmitHandler } from 'react-hook-form';
import { ErrorHandler } from '@shared/errors/ErrorHandler';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  createSendNotificationInitialValues,
  toSendNotificationPayload,
} from '@features/client/notifications/normalizers/notification.normalizer';
import {
  sendNotificationFormSchema,
  type SendNotificationFormValues,
} from '@features/client/notifications/schemas/sendNotificationForm.schema';
import { notificationService } from '@features/client/notifications/services/service';
import { dispatchNotificationsUpdated } from '@features/client/notifications/hooks/useNotificationsList';

export interface UseSendNotificationPageResult {
  form: ReturnType<typeof useAppForm<SendNotificationFormValues>>;
  submitting: boolean;
  errorMessage: string | undefined;
  successMessage: string | undefined;
  onSubmit: SubmitHandler<SendNotificationFormValues>;
  onBack: () => void;
}

export const useSendNotificationPage = (): UseSendNotificationPageResult => {
  const navigate = useNavigate();
  const form = useAppForm<SendNotificationFormValues>(
    sendNotificationFormSchema,
    createSendNotificationInitialValues(),
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | undefined>();

  const handleSubmit: SubmitHandler<SendNotificationFormValues> = async (values) => {
    setSubmitting(true);
    setErrorMessage(undefined);
    setSuccessMessage(undefined);

    try {
      const response = await notificationService.sendInApp(toSendNotificationPayload(values));
      setSuccessMessage(
        `Notificação enviada com sucesso. ${response.deliveredCount} entrega(s) registradas.`,
      );
      form.reset(createSendNotificationInitialValues());
      dispatchNotificationsUpdated();
    } catch (error) {
      const normalizedError = ErrorHandler.normalize(error);
      setErrorMessage(normalizedError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    submitting,
    errorMessage,
    successMessage,
    onSubmit: handleSubmit,
    onBack: () => {
      void navigate('/client/notifications');
    },
  };
};
