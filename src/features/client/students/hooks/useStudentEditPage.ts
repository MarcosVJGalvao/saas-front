import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import { isRecord } from '@shared/utils/isRecord';
import {
  toStudentEditFormValues,
  toStudentEditPayload,
} from '../normalizers/studentForm.normalizer';
import {
  studentEditFormSchema,
  type StudentEditFormValues,
} from '../schemas/studentEditForm.schema';
import { studentService } from '../services/service';
import type { Student } from '../types/student.types';

const isStudentEntity = (value: unknown): value is Student =>
  isRecord(value) && typeof value.id === 'string' && typeof value.status === 'string';

const getLocationEntity = (value: unknown): Student | null => {
  if (!isRecord(value)) return null;
  const candidate = value.entity;
  return isStudentEntity(candidate) ? candidate : null;
};

export const useStudentEditPage = (id: string) => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationEntity = getLocationEntity(location.state);
  const form = useAppForm(
    studentEditFormSchema,
    toStudentEditFormValues(
      locationEntity ?? {
        id: '',
        status: 'active',
      },
    ),
  );
  const [entity, setEntity] = useState<Student | null>(locationEntity);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  useEffect(() => {
    if (locationEntity) {
      form.reset(toStudentEditFormValues(locationEntity));
    }
  }, [form, locationEntity]);

  const fetchStudent = useCallback(async () => {
    if (locationEntity) return;
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const fetchedStudent = await studentService.getById(id);
      setEntity(fetchedStudent);
      form.reset(toStudentEditFormValues(fetchedStudent));
    } catch {
      setErrorMessage('Não foi possível carregar o aluno.');
    } finally {
      setLoading(false);
    }
  }, [form, id, locationEntity]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchStudent();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchStudent]);

  const onSubmit = async (values: StudentEditFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      await studentService.update(id, toStudentEditPayload(values));
      void navigate('/client/students');
    } catch {
      setErrorMessage('Não foi possível salvar o aluno.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    entity,
    loading,
    submitting,
    errorMessage,
    onSubmit,
    onBack: () => {
      void navigate('/client/students');
    },
  };
};
