import { useState } from 'react';
import { useReportCardReferenceOptions } from '@features/client/report-cards/hooks/useReportCardReferenceOptions';
import { reportCardService } from '@features/client/report-cards/services/service';

type ProcessingAction = 'load' | 'resend' | 'resend-student';
type ProcessingValues = Record<string, unknown>;

const initialValues: ProcessingValues = {
  processingId: '',
  studentEnrollmentId: '',
};

const getStringValue = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

export const useReportCardProcessingsPage = () => {
  const referenceOptions = useReportCardReferenceOptions({
    includeStudentEnrollments: true,
  });
  const [values, setValues] = useState<ProcessingValues>(initialValues);
  const [loadingAction, setLoadingAction] = useState<ProcessingAction | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);

  const onChange = (name: string, value: unknown): void => {
    setValues((currentValues) => ({ ...currentValues, [name]: value ?? '' }));
  };

  const clear = (): void => {
    setValues(initialValues);
    setErrorMessage(undefined);
    setSuccessMessage(undefined);
  };

  const loadProcessing = async (): Promise<void> => {
    const processingId = getStringValue(values.processingId);
    if (!processingId) {
      setErrorMessage('Informe o processamento para consultar.');
      return;
    }
    setLoadingAction('load');
    setErrorMessage(undefined);
    setSuccessMessage(undefined);
    try {
      await reportCardService.getProcessing(processingId);
      setSuccessMessage('Processamento carregado com sucesso.');
    } catch {
      setErrorMessage('Não foi possível carregar o processamento.');
    } finally {
      setLoadingAction(undefined);
    }
  };

  const resendFailed = async (): Promise<void> => {
    const processingId = getStringValue(values.processingId);
    if (!processingId) {
      setErrorMessage('Informe o processamento para reenviar falhas.');
      return;
    }
    setLoadingAction('resend');
    setErrorMessage(undefined);
    setSuccessMessage(undefined);
    try {
      await reportCardService.resendFailedProcessing(processingId);
      setSuccessMessage('Reenvio de falhas solicitado com sucesso.');
    } catch {
      setErrorMessage('Não foi possível solicitar reenvio de falhas.');
    } finally {
      setLoadingAction(undefined);
    }
  };

  const resendStudent = async (): Promise<void> => {
    const processingId = getStringValue(values.processingId);
    const studentEnrollmentId = getStringValue(values.studentEnrollmentId);
    if (!processingId || !studentEnrollmentId) {
      setErrorMessage('Informe o processamento e a matrícula para reenvio individual.');
      return;
    }
    setLoadingAction('resend-student');
    setErrorMessage(undefined);
    setSuccessMessage(undefined);
    try {
      await reportCardService.resendProcessingStudent(processingId, studentEnrollmentId);
      setSuccessMessage('Reenvio individual solicitado com sucesso.');
    } catch {
      setErrorMessage('Não foi possível solicitar o reenvio individual.');
    } finally {
      setLoadingAction(undefined);
    }
  };

  return {
    referenceOptions,
    values,
    loadingAction,
    errorMessage,
    successMessage,
    onChange,
    clear,
    loadProcessing,
    resendFailed,
    resendStudent,
  };
};
