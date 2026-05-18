import { useState } from 'react';
import { reportCardService } from '@features/client/report-cards/services/reportCardServices';

type ReportCardQueryMode = 'student' | 'class';
type ReportCardQueryValues = Record<string, unknown>;

const initialValues: ReportCardQueryValues = {
  studentId: '',
  schoolClassId: '',
};

const getStringValue = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

export const useReportCardQueriesPageViewModel = () => {
  const [values, setValues] = useState<ReportCardQueryValues>(initialValues);
  const [loadingMode, setLoadingMode] = useState<ReportCardQueryMode | undefined>(undefined);
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

  const loadByStudent = async (): Promise<void> => {
    const studentId = getStringValue(values.studentId);
    if (!studentId) {
      setErrorMessage('Informe o aluno para consultar o boletim.');
      return;
    }
    setLoadingMode('student');
    setErrorMessage(undefined);
    setSuccessMessage(undefined);
    try {
      await reportCardService.getStudentReportCard(studentId, { page: 1, limit: 10 });
      setSuccessMessage('Boletim do aluno carregado com sucesso.');
    } catch {
      setErrorMessage('Não foi possível carregar o boletim do aluno.');
    } finally {
      setLoadingMode(undefined);
    }
  };

  const loadByClass = async (): Promise<void> => {
    const schoolClassId = getStringValue(values.schoolClassId);
    if (!schoolClassId) {
      setErrorMessage('Informe a turma para consultar boletins.');
      return;
    }
    setLoadingMode('class');
    setErrorMessage(undefined);
    setSuccessMessage(undefined);
    try {
      await reportCardService.getClassReportCard(schoolClassId, { page: 1, limit: 10 });
      setSuccessMessage('Boletins da turma carregados com sucesso.');
    } catch {
      setErrorMessage('Não foi possível carregar boletins da turma.');
    } finally {
      setLoadingMode(undefined);
    }
  };

  return {
    values,
    loadingMode,
    errorMessage,
    successMessage,
    onChange,
    clear,
    loadByStudent,
    loadByClass,
  };
};
