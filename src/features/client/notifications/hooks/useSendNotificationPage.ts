import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SubmitHandler } from 'react-hook-form';
import { ErrorHandler } from '@shared/errors/ErrorHandler';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  FRONT_SEND_NOTIFICATION_EVENT_KEY,
  createSendNotificationInitialValues,
  toSendNotificationPayload,
} from '@features/client/notifications/normalizers/notification.normalizer';
import {
  sendNotificationFormSchema,
  type SendNotificationFormValues,
} from '@features/client/notifications/schemas/sendNotificationForm.schema';
import { notificationService } from '@features/client/notifications/services/service';
import { dispatchNotificationsUpdated } from '@features/client/notifications/hooks/useNotificationsList';
import { useNotificationRecipientOptions } from '@features/client/notifications/hooks/useNotificationRecipientOptions';

export interface UseSendNotificationPageResult {
  form: ReturnType<typeof useAppForm<SendNotificationFormValues>>;
  recipientOptions: ReturnType<typeof useNotificationRecipientOptions>;
  submitting: boolean;
  errorMessage: string | undefined;
  successMessage: string | undefined;
  onSubmit: SubmitHandler<SendNotificationFormValues>;
  onBack: () => void;
}

const getSuccessMessage = (status: string, deliveredCount: number): string => {
  if (deliveredCount > 0) {
    return `Notificação enviada com sucesso. ${deliveredCount} entrega(s) registradas.`;
  }

  return `Notificação manual processada com status ${status} para o evento ${FRONT_SEND_NOTIFICATION_EVENT_KEY}, mas nenhuma entrega foi registrada.`;
};

export const useSendNotificationPage = (): UseSendNotificationPageResult => {
  const navigate = useNavigate();
  const recipientOptions = useNotificationRecipientOptions();
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
      setSuccessMessage(getSuccessMessage(response.status, response.deliveredCount));
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
    recipientOptions,
    submitting,
    errorMessage,
    successMessage,
    onSubmit: handleSubmit,
    onBack: () => {
      void navigate('/client/notifications');
    },
  };
};
