import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { downloadBlob } from '@shared/utils/downloadBlob';
import type {
  EntityDetailsPageData,
  EntityDetailsViewState,
} from '@shared/components/data-display/details/entityDetails.types';
import { toStudentDetailsData } from '../normalizers/studentDetails.normalizer';
import { studentService } from '../services/service';
import type { Student } from '../types/student.types';

export const useStudentDetailsPage = (id: string) => {
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [viewState, setViewState] = useState<EntityDetailsViewState>('loading');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [downloading, setDownloading] = useState(false);

  const fetchStudent = useCallback(async () => {
    setViewState('loading');
    setErrorMessage(undefined);
    try {
      const fetchedStudent = await studentService.getById(id);
      setStudent(fetchedStudent);
      setViewState('ready');
    } catch {
      setErrorMessage('Erro ao carregar aluno.');
      setViewState('error');
    }
  }, [id]);

  const downloadEnrollmentCertificate = useCallback(() => {
    if (!student) return;
    void (async () => {
      setDownloading(true);
      try {
        const blob = await studentService.downloadEnrollmentCertificate(id);
        downloadBlob(blob, `atestado-matricula-${student.registrationCode ?? id}.pdf`);
      } catch {
        setErrorMessage('Não foi possível baixar o atestado de matrícula.');
      } finally {
        setDownloading(false);
      }
    })();
  }, [id, student]);

  const downloadSchoolHistory = useCallback(() => {
    if (!student) return;
    void (async () => {
      setDownloading(true);
      try {
        const blob = await studentService.downloadSchoolHistory(id);
        downloadBlob(blob, `historico-escolar-${student.registrationCode ?? id}.pdf`);
      } catch {
        setErrorMessage('Não foi possível baixar o histórico escolar.');
      } finally {
        setDownloading(false);
      }
    })();
  }, [id, student]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchStudent();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchStudent]);

  return {
    data: student
      ? toStudentDetailsData(
          student,
          downloading,
          downloadEnrollmentCertificate,
          downloadSchoolHistory,
        )
      : ({ headerData: null, tabs: [] } satisfies EntityDetailsPageData),
    viewState,
    errorMessage,
    onBack: () => navigate('/client/students'),
    onRetry: fetchStudent,
  };
};
