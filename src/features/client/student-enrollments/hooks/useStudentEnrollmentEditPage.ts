import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import { isRecord } from '@shared/utils/isRecord';
import { studentEnrollmentEditFormSchema } from '@features/client/student-enrollments/schemas/studentEnrollmentEditForm.schema';
import {
  toStudentEnrollmentEditFormValues,
  toStudentEnrollmentEditPayload,
} from '@features/client/student-enrollments/normalizers/studentEnrollmentForm.normalizer';
import { studentEnrollmentService } from '@features/client/student-enrollments/services/service';
import type { StudentEnrollment } from '@features/client/student-enrollments/types/studentEnrollment.types';
import type { StudentEnrollmentEditFormValues } from '@features/client/student-enrollments/schemas/studentEnrollmentEditForm.schema';

type StudentEnrollmentEditLocationState = {
  entity?: StudentEnrollment;
};

const isStudentEnrollment = (value: unknown): value is StudentEnrollment =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  typeof value.status === 'string' &&
  typeof value.enrollmentDate === 'string';

const getLocationState = (value: unknown): StudentEnrollmentEditLocationState | null => {
  if (!isRecord(value)) {
    return null;
  }

  const entity = value.entity;
  return isStudentEnrollment(entity) ? { entity } : null;
};

export const useStudentEnrollmentEditPage = (id: string) => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = getLocationState(location.state);
  const [enrollment, setEnrollment] = useState<StudentEnrollment | null>(
    locationState?.entity ?? null,
  );
  const [loading, setLoading] = useState(locationState?.entity ? false : true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const form = useAppForm(studentEnrollmentEditFormSchema, {
    academicYearId: '',
    schoolClassId: '',
    enrollmentDate: '',
    enrollmentCode: '',
    observations: '',
  });

  const fetchEnrollment = useCallback(async () => {
    if (locationState?.entity) {
      return;
    }

    setLoading(true);
    setErrorMessage(undefined);
    try {
      const fetchedEnrollment = await studentEnrollmentService.getById(id);
      setEnrollment(fetchedEnrollment);
    } catch {
      setErrorMessage('Não foi possível carregar a matrícula para edição.');
    } finally {
      setLoading(false);
    }
  }, [id, locationState?.entity]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchEnrollment();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchEnrollment]);

  useEffect(() => {
    if (!enrollment) {
      return;
    }

    form.reset(toStudentEnrollmentEditFormValues(enrollment));
  }, [enrollment, form]);

  const handleSubmit = async (formValues: StudentEnrollmentEditFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      await studentEnrollmentService.update(id, toStudentEnrollmentEditPayload(formValues));
      void navigate(`/client/student-enrollments/${id}`);
    } catch {
      setErrorMessage('Não foi possível atualizar a matrícula.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    enrollment,
    loading,
    submitting,
    errorMessage,
    onSubmit: handleSubmit,
    onBack: () => {
      void navigate(
        enrollment ? `/client/student-enrollments/${enrollment.id}` : '/client/student-enrollments',
      );
    },
    onRetry: fetchEnrollment,
  };
};
