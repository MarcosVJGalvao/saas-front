import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  buildLegalGuardianBasicInitialValues,
  buildStudentBasicInitialValues,
  normalizeLegalGuardianBasicInitialValues,
  normalizeLegalGuardianBasicPayload,
  normalizeStudentBasicInitialValues,
  normalizeStudentBasicPayload,
} from '@features/client/students/normalizers/studentBasicFormNormalizer';
import {
  legalGuardianBasicFormSchema,
  studentBasicFormSchema,
  type LegalGuardianBasicFormValues,
  type StudentBasicFormValues,
} from '@features/client/students/schemas/studentBasicFormSchema';
import type { LegalGuardian, Student } from '@features/client/students/types/student.types';

type StudentBasicFormMode = 'student' | 'guardian';

type StudentBasicFormService = {
  getById: (id: string) => Promise<Student | LegalGuardian>;
  create: (payload: Record<string, unknown>) => Promise<Student | LegalGuardian>;
  update: (id: string, payload: Record<string, unknown>) => Promise<Student | LegalGuardian>;
};

type StudentBasicFormPageViewModelParams = {
  mode: StudentBasicFormMode;
  service: StudentBasicFormService;
  backPath: string;
  loadErrorMessage: string;
  submitErrorMessage: string;
};

const isStudent = (value: Student | LegalGuardian): value is Student => 'status' in value;

export const useStudentBasicFormPageViewModel = ({
  mode,
  service,
  backPath,
  loadErrorMessage,
  submitErrorMessage,
}: StudentBasicFormPageViewModelParams) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const studentForm = useAppForm<StudentBasicFormValues>(
    studentBasicFormSchema,
    buildStudentBasicInitialValues(),
  );
  const guardianForm = useAppForm<LegalGuardianBasicFormValues>(
    legalGuardianBasicFormSchema,
    buildLegalGuardianBasicInitialValues(),
  );
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setErrorMessage(undefined);

    try {
      const response = await service.getById(id);
      if (mode === 'student' && isStudent(response)) {
        studentForm.reset(normalizeStudentBasicInitialValues(response));
      }
      if (mode === 'guardian' && !isStudent(response)) {
        guardianForm.reset(normalizeLegalGuardianBasicInitialValues(response));
      }
    } catch {
      setErrorMessage(loadErrorMessage);
    } finally {
      setLoading(false);
    }
  }, [guardianForm, id, loadErrorMessage, mode, service, studentForm]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const submitStudent = async (values: StudentBasicFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      const payload = normalizeStudentBasicPayload(values);
      if (id) {
        await service.update(id, payload);
      } else {
        await service.create(payload);
      }
      void navigate(backPath);
    } catch {
      setErrorMessage(submitErrorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const submitGuardian = async (values: LegalGuardianBasicFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      const payload = normalizeLegalGuardianBasicPayload(values);
      if (id) {
        await service.update(id, payload);
      } else {
        await service.create(payload);
      }
      void navigate(backPath);
    } catch {
      setErrorMessage(submitErrorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    mode,
    studentForm,
    guardianForm,
    isEdit,
    loading,
    submitting,
    errorMessage,
    onBack: () => void navigate(backPath),
    submitStudent,
    submitGuardian,
  };
};
