import { useState } from 'react';
import { reportCardService } from '@features/client/report-cards/services/reportCardServices';

type ProcessingAction = 'load' | 'resend' | 'resend-student' | 'finalize' | 'reopen';
type ProcessingValues = Record<string, unknown>;

const initialValues: ProcessingValues = {
  processingId: '',
  studentEnrollmentId: '',
  schoolClassId: '',
  academicPeriodId: '',
};

const getStringValue = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

export const useReportCardProcessingsPageViewModel = () => {
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

  const finalizePeriod = async (): Promise<void> => {
    const schoolClassId = getStringValue(values.schoolClassId);
    const academicPeriodId = getStringValue(values.academicPeriodId);
    if (!schoolClassId || !academicPeriodId) {
      setErrorMessage('Informe turma e período para finalizar.');
      return;
    }
    setLoadingAction('finalize');
    setErrorMessage(undefined);
    setSuccessMessage(undefined);
    try {
      await reportCardService.finalizePeriod(schoolClassId, academicPeriodId);
      setSuccessMessage('Período finalizado com sucesso.');
    } catch {
      setErrorMessage('Não foi possível finalizar o período.');
    } finally {
      setLoadingAction(undefined);
    }
  };

  const reopenPeriod = async (): Promise<void> => {
    const schoolClassId = getStringValue(values.schoolClassId);
    const academicPeriodId = getStringValue(values.academicPeriodId);
    if (!schoolClassId || !academicPeriodId) {
      setErrorMessage('Informe turma e período para reabrir.');
      return;
    }
    setLoadingAction('reopen');
    setErrorMessage(undefined);
    setSuccessMessage(undefined);
    try {
      await reportCardService.reopenPeriod(schoolClassId, academicPeriodId);
      setSuccessMessage('Período reaberto com sucesso.');
    } catch {
      setErrorMessage('Não foi possível reabrir o período.');
    } finally {
      setLoadingAction(undefined);
    }
  };

  return {
    values,
    loadingAction,
    errorMessage,
    successMessage,
    onChange,
    clear,
    loadProcessing,
    resendFailed,
    resendStudent,
    finalizePeriod,
    reopenPeriod,
  };
};
