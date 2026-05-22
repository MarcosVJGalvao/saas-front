import { useState } from 'react';
import { useFeedback } from '@shared/hooks/useFeedback';
import { useReportCardReferenceOptions } from '@features/client/report-cards/hooks/useReportCardReferenceOptions';
import { reportCardService } from '@features/client/report-cards/services/service';

type ProcessingAction = 'load' | 'resend' | 'resend-student';

const initialValues = {
  processingId: '',
  studentEnrollmentId: '',
};

const getStringValue = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

export const useReportCardProcessingsPage = () => {
  const referenceOptions = useReportCardReferenceOptions({
    includeStudentEnrollments: true,
  });
  const feedback = useFeedback();
  const [values, setValues] = useState(initialValues);
  const [loadingAction, setLoadingAction] = useState<ProcessingAction | undefined>(undefined);

  const onChange = (name: string, value: unknown): void => {
    setValues((cur) => ({ ...cur, [name]: value ?? '' }));
  };

  const clear = (): void => {
    setValues(initialValues);
    feedback.clear();
  };

  const loadProcessing = async (): Promise<void> => {
    const processingId = getStringValue(values.processingId);
    if (!processingId) {
      feedback.setError('Informe o processamento para consultar.');
      return;
    }
    setLoadingAction('load');
    feedback.clear();
    try {
      await reportCardService.getProcessing(processingId);
      feedback.setSuccess('Processamento carregado com sucesso.');
    } catch {
      feedback.setError('Não foi possível carregar o processamento.');
    } finally {
      setLoadingAction(undefined);
    }
  };

  const resendFailed = async (): Promise<void> => {
    const processingId = getStringValue(values.processingId);
    if (!processingId) {
      feedback.setError('Informe o processamento para reenviar falhas.');
      return;
    }
    setLoadingAction('resend');
    feedback.clear();
    try {
      await reportCardService.resendFailedProcessing(processingId);
      feedback.setSuccess('Reenvio de falhas solicitado com sucesso.');
    } catch {
      feedback.setError('Não foi possível solicitar reenvio de falhas.');
    } finally {
      setLoadingAction(undefined);
    }
  };

  const resendStudent = async (): Promise<void> => {
    const processingId = getStringValue(values.processingId);
    const studentEnrollmentId = getStringValue(values.studentEnrollmentId);
    if (!processingId || !studentEnrollmentId) {
      feedback.setError('Informe o processamento e a matrícula para reenvio individual.');
      return;
    }
    setLoadingAction('resend-student');
    feedback.clear();
    try {
      await reportCardService.resendProcessingStudent(processingId, studentEnrollmentId);
      feedback.setSuccess('Reenvio individual solicitado com sucesso.');
    } catch {
      feedback.setError('Não foi possível solicitar o reenvio individual.');
    } finally {
      setLoadingAction(undefined);
    }
  };

  return {
    referenceOptions,
    feedback,
    values,
    loadingAction,
    onChange,
    clear,
    loadProcessing,
    resendFailed,
    resendStudent,
  };
};
