import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  createStudentInitialValues,
  toStudentCreatePayload,
} from '../normalizers/studentForm.normalizer';
import {
  studentCreateFormSchema,
  type StudentCreateFormValues,
} from '../schemas/studentCreateForm.schema';
import { studentService } from '../services/service';

export const useStudentCreatePage = () => {
  const navigate = useNavigate();
  const form = useAppForm(studentCreateFormSchema, createStudentInitialValues());
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleSubmit = async (values: StudentCreateFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      await studentService.create(toStudentCreatePayload(values));
      void navigate('/client/students');
    } catch {
      setErrorMessage('Não foi possível salvar o aluno.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    submitting,
    errorMessage,
    onSubmit: handleSubmit,
    onBack: () => {
      void navigate('/client/students');
    },
  };
};
